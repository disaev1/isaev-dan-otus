function maxItemAssociation(orders) {
    const assocs = [];

    for (const order of orders) {
        if (!assocs.length) {
            assocs.push(new Set(order));
        } else {
            let included = false;

            for (const r of assocs) {
                for (const el of order) {
                    if (r.has(el)) {
                        included = true;
                        order.forEach(el => { r.add(el); });
                        break;
                    }
                }
            }

            if (!included) {
                assocs.push(new Set(order));
            }
        }
    }

    const sortedAssocs = assocs.map(el => [...el].sort());
    sortedAssocs.sort();

    let maxALength = 0;
    let maxAPos;

    sortedAssocs.forEach((v, i) => {
        if (sortedAssocs[i].length > maxALength) {
            maxALength = sortedAssocs[i].length;
            maxAPos = i;
        }
    });

    return sortedAssocs[maxAPos];
}

module.exports = { maxItemAssociation };
