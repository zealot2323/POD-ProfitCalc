import { Store, Product } from '../calculator'

export default async function getPrintifyData() {
    const shops = await getShop();

    if (Array.isArray(shops)) {
        const productData = await Promise.all(
            shops.map(async (shop) => {
                const products = await getProductsForShop(shop.id);
                let activeProducts = [];
                let normalizedProducts = [];
                const orders = await getOrdersForShop();
                if (Array.isArray(products) && Array.isArray(orders)) {
                    //normalize products and orders
                    activeProducts = returnActiveProducts(products);
                    //make product objects
                    normalizedProducts = activeProducts.map(data => {
                            const { etsyPrice, cost } = extractEtsyPriceAndCost(data.variants);
                            return new Product({
                            id: data.id,
                            name: data.title,
                            etsyPrice,
                            etsyId: data.external.id,
                            cost,
                            sales: 0,
                            image: data.images?.[0]?.src,
                            shipping: 0
                            });
                        });
                    const productByEtsyId = new Map();
                    normalizedProducts.forEach(product => {
                        productByEtsyId.set(product.etsyId, product);
                    });

                    orders.forEach(order => {
                        const etsyId = order['Listing ID'];
                        const quantity = Number(order.Quantity);

                        if (productByEtsyId.has(etsyId)) {
                            const product = productByEtsyId.get(etsyId);
                            product.sales += quantity;
                        }
                    });
                } else {
                    console.warn('Unexpected data format:', {products, orders});
                }
                return new Store({
                    name: shop.title,
                    products: normalizedProducts,
                    orders: orders
                });
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

async function getOrdersForShop() {
    //Printify doesn't return more than a year or two of results so this should be the Etsy API once available
    //Since it's not available, add it in as a csv
    try {
        return await fetch('/api/orders').then(res => res.json());
    } catch (error) {
        console.error(`Error fetching orders from CSV`, error);
        return [];
    }
}

function returnActiveProducts(products) {
    return products.filter(product =>
    product.external && product.external.id && product.visible
    );
}
 
function extractEtsyPriceAndCost(data) {
      const active = data.filter(a => a.is_enabled);
      const averagePrice = active.length
        ? active.reduce((sum, a) => sum + a.price, 0) / active.length
        : 0;
      const averageCost = active.length
        ? active.reduce((sum, a) => sum + a.cost, 0) / active.length
        : 0;
      return {
        etsyPrice: averagePrice,
        cost: averageCost
      };
}