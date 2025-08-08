import { returnActiveProducts, returnFulfilledOrders } from './helpers'

export default async function getPrintifyProducts() {
    const shops = await getShop();

    if (Array.isArray(shops)) {
        const productData = await Promise.all(
            shops.map(async (shop) => {
                const products = await getProductsForShop(shop.id);
                let activeProducts = [];
                const orders = await getOrdersForShop(shop.id);
                let fulfulledOrders = [];
                //check if Products are active, remove if not.
                if (Array.isArray(products) && Array.isArray(orders)) {
                    activeProducts = returnActiveProducts(products);
                    fulfulledOrders = returnFulfilledOrders(orders);
                } else {
                    console.warn('Unexpected data format:', result);
                }
                return {
                    shopId: shop.id,
                    shopName: shop.title,
                    products: activeProducts,
                    orders: fulfulledOrders
                };
            })
        );
        return productData;
    } else {
        console.error("Unexpected response format or error:", shops);
        return [];
    }
}

async function getShop() {
    try {
        const response = await fetch('/api/printify/shops.json');     
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result
    } catch (error) {
        return error
    }
}

async function getProductsForShop(shopId) {
    const allProducts = [];
    let nextPageUrl = `/api/printify/shops/${shopId}/products.json`;

    try {
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
            if (!response.ok) {
                throw new Error(`Product fetch failed: ${response.status}`);
            }

            const result = await response.json();
            
            if (Array.isArray(result.data)) {
                allProducts.push(...result.data);
            } else {
                console.warn('Unexpected data format:', result);
                break;
            }

              if (result.next_page_url) {
                    const next = result.next_page_url
                    nextPageUrl = `/api/printify/shops/${shopId}/products.json${next}`;
                } else {
                    nextPageUrl = null;
                }
        }

        return allProducts;
    } catch (error) {
        console.error(`Error fetching products for shop ${shopId}:`, error);
        return [];
    }
}

async function getOrdersForShop(shopId) {
    const allOrders = [];
    let nextPageUrl = `/api/printify/shops/${shopId}/orders.json`;

    try {
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl);
            if (!response.ok) {
                throw new Error(`Product fetch failed: ${response.status}`);
            }

            const result = await response.json();
            
            if (Array.isArray(result.data)) {
                allOrders.push(...result.data);
            } else {
                console.warn('Unexpected data format:', result);
                break;
            }

              if (result.next_page_url) {
                    const next = result.next_page_url
                    nextPageUrl = `/api/printify/shops/${shopId}/orders.json${next}`;
                } else {
                    nextPageUrl = null;
                }
        }

        return allOrders;
    } catch (error) {
        console.error(`Error fetching orders for shop ${shopId}:`, error);
        return [];
    }
}