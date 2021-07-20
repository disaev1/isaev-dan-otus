const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const _ = require('lodash');
 
const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
    login: String!
    name: String
    surname: String
    avatarUrl: String
    level: Int!
  }

  input MutableUserData {
    name: String
    surname: String
  }
  
  type Query {
    products(search: String, categories: [String!]): [Product!]!
    product(id: ID!): Product
    categories: [Category]!
    users: [User!]
    user(id: Int, name: String): User
    orders: [Order!]
  }

  type Mutation {
    user(type: String!, id: ID, login: String, email: String, mutableData: MutableUserData): User
    order(action: String!, id: String, skuId: String, firstSkuId: String): Order
  }

  type Category {
    name: String!
    subcategories: [String!]!
  }

  type Dimensions {
    w: Float!
    l: Float!
    h: Float!
  }

  type Product implements ProductEssentials {
    id: ID!
    name: String!
    price: Int!
    category: [String!]!
    dimensions: Dimensions!
    weight: Float!
    skuLeft: Int!
  }

  interface ProductEssentials {
    name: String!
    price: Int!
  }

  enum PaymentMethod {
    CARD_TO_COURIER
    CASH_TO_COURIER
    CARD_ONLINE
    OTHER
  }

  enum OrderState {
    IN_CART
    READY_TO_PAY
    PAID
  }

  type Order {
    id: ID!
    userId: String!
    paymentMethod: PaymentMethod!
    state: OrderState!
    items: [OrderItem!]
  }

  type OrderItem implements ProductEssentials {
    name: String!
    price: Int!
    skuId: String!
    count: Int!
  }
`);
 
const root = {
  _orders: [
    {
      id: '1',
      userId: '1',
      paymentMethod: 'CARD_ONLINE',
      state: 'IN_CART',
      items: [
        {
          skuId: '2',
          count: 3,
        },
      ],
    }
  ],

  _ordersNextId: 2,

  _products: [
    {
      id: '1',
      name: 'Rover',
      price: 160000,
      category: ['vehicles', 'rovers'],
      dimensions: { l: 3, w: 2.5, h: 0.4 },
      weight: 110,
      skuLeft: 5,
    },
    {
      id: '2',
      name: 'Bicycle',
      price: 40000,
      category: ['vehicles', 'bicycles'],
      dimensions: { l: 2.5, w: 0.3, h: 0.7 },
      weight: 10,
      skuLeft: 99,
    },
    {
      id: '3',
      name: 'OK T-shirt',
      price: 1400,
      category: ['clothes', 't-shirts'],
      dimensions: { l: 0.2, w: 0.3, h: 0.6 },
      weight: 0.2,
      skuLeft: 1441,
    },
  ],

  _categories: [
    {
      name: 'vehicles',
      subcategories: ['rovers', 'bicycles'],
    },
    {
      name: 'clothes',
      subcategories: ['t-shirts'],
    }
  ],

  _users: [
    {
      id: '1',
      login: 'bear103',
      name: 'Bear',
      surname: 'Honey',
      email: 'bear103@testmail.ru',
      avatarUrl: 'http://localhost:4000/static/polar_bear.jpg',
      level: 1,
    },
    {
      id: '2',
      login: 'squirrel45',
      name: 'Squirrel',
      email: 'robocop7@gmail.com',
      avatarUrl: 'http://localhost:4000/static/rovers.png',
      level: 3,
    },
    {
      id: '3',
      login: 'totem7070',
      name: 'Montesuma',
      email: 'test@testmail.com',
      level: 2,
    },
  ],

  _usersIdNextId: 4,

  products({ search, categories }) {
    let filteredProducts = this._products;

    if (search) {
      filteredProducts = filteredProducts.filter(item => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (categories) {
      filteredProducts = filteredProducts.filter(item => {
        const itemCategoryString = item.category.join('.');

        return categories.some(category => itemCategoryString.startsWith(category));
      });
    }

    return filteredProducts;
  },

  product({ id }) {
    return this._products.find(product => product.id === id);
  },

  categories() {
    return this._categories;
  },

  users() {
    return this._users;
  },

  user({ type, id, login, mutableData, email }) {
    if (type === 'create') {
      if (!login || !email) {
        return;
      }

      const newUser = { id: String(this._usersIdNextId++), login, email };
      this._users.push(newUser);
      
      return newUser;
    }

    if (type === 'change') {
      if (!id || !mutableData) {
        return;
      }
    
      let changedUser;

      this._users = this._users.map(user => {
        if (user.id === id) {
          changedUser = { ...user, ...mutableData };
          
          if (email) {
            changedUser.email = email;
          }
           
          return changedUser;
        }

        return user;
      });

      if (changedUser) {
        return changedUser;
      }
    }

    if (type === 'delete') {
      if (!id) {
        return;
      }

      let userToDelete = this._users.find(user => user.id === id);

      if (!userToDelete) {
        return;
      }

      this._users = this._users.filter(user => user.id !== id);

      return { id: userToDelete.id };
    }
  },

  orders() {
    return this._orders.map(this._joinProductsToOrder.bind(this));
  },

  order({ firstSkuId, id, action, skuId }) {
    if (action === 'create') {
      if (!firstSkuId) {
        return;
      }

      const newOrder = {
        id: this._ordersNextId++,
        userId: '1',
        state: 'inBasket',
        items: [{ skuId: firstSkuId, count: 1 }],
      };
  
      this._orders.push(newOrder);
  
      return this._joinProductsToOrder(newOrder);
    }
    
    if (action === 'addProduct') {
      if (!id) {
        return;
      }

      const targetOrder = this._orders.find(order => order.id === id);

      if (!targetOrder) {
        return;
      }

      const newOrder = _.cloneDeep(targetOrder);

      const targetItem = newOrder.items.find(item => item.skuId === skuId);

      if (targetItem) {
        targetItem.count++;
      } else {
        newOrder.items.push({ skuId, count: 1 });
      }

      this._orders = this._orders.map(order => {
        if (order.id === id) {
          return newOrder;
        }

        return order;
      });

      return this._joinProductsToOrder(newOrder);
    }

    if (action === 'cancel') {
      if (!id) {
        return;
      }

      const orderToDelete = this._orders.find(order => order.id === id);
      this._orders = this._orders.filter(order => order.id !== id);

      return orderToDelete;
    }
  },

  _joinProductsToOrder(order) {
    return {
      ...order,
      items: order.items.map(item => {
        const targetProduct = this._products.find(product => product.id === item.skuId);

        return { ...item, name: targetProduct.name, price: targetProduct.price };
      })
    };
  }
};


const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
