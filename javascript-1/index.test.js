import { expect } from 'chai';
import { maxItemAssociation } from '.';

it('maxItemAssociation correctly works', () => {
    const orders = [
        ['blanket', 'ketchup', 'toothbrush'],
        ['candies', 'oatmeal', 'onion'],
        ['tea', 'sauce'],
        ['comb', 'toothbrush'],
        ['potato'],
        ['towel', 'shaving foam'],
        ['garlic', 'tea'],
        ['onion', 'apple'],
        ['chicken'],
        ['icecream'],
    ];

    const expected = ['apple', 'candies', 'oatmeal', 'onion'];

    expect(maxItemAssociation(orders)).to.eql(expected);
});
