export function returnActiveProducts(products) {
    return products.filter(product =>
    product.external && product.external.id && product.visible
    );
}

export function returnFulfilledOrders(orders) {
    return orders.filter(order =>
    order.status === 'fulfilled'
    );
}

export function formatToDollars(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}