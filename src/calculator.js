const DEFAULT_ETSY_FEE_RATE = 0.065;

export class Store {
    constructor(name, etsyFeeRate = DEFAULT_ETSY_FEE_RATE) {
      this.name = name,
      this.etsyFeeRate = etsyFeeRate,
      this.products = [],
      this.orders = []
    }
    
    loadFromApi(apiData) {
      this.products = apiData.map(data => {
        const { etsyPrice, printifyCost } = this.extractEtsyPriceAndCost(data.variants);
        return new Product({
          id: data.id,
          name: data.title,
          etsyPrice,
          printifyCost,
          sales: 1,
          image: data.images?.[0]?.src,
          shipping: 0
        });
      });
    }

    extractEtsyPriceAndCost(data) {
      const active = data.filter(a => a.is_enabled);
      const averagePrice = active.length
        ? active.reduce((sum, a) => sum + a.price, 0) / active.length
        : 0;
      const averageCost = active.length
        ? active.reduce((sum, a) => sum + a.cost, 0) / active.length
        : 0;
      return {
        etsyPrice: averagePrice,
        printifyCost: averageCost
      };
    }
    
    get totalRevenue() {
      return this.products.reduce((sum, p) => sum + p.sales * p.etsyPrice, 0);
    }

    get totalProfit() {
      return this.products.reduce((sum, p) => sum + p.sales * (p.etsyPrice * (1 - DEFAULT_ETSY_FEE_RATE) - p.printifyCost), 0);
    }

    get totalExpenses() {
      return this.products.reduce((sum, p) => sum + p.sales * (p.etsyPrice *  DEFAULT_ETSY_FEE_RATE + p.printifyCost), 0);
    }
    
    getTopPerformers(count = 5) {
      // Return top performing products by profit
      let profits = [];
      for(let i = 0; i < this.products.length; i++) {
        profits.push(this.products[i].calculateProfit());
        }
        profits.sort(function(a, b){return b - a});
        let top = profits.slice(0,4);
        return top
    }
  }
  
  // Create a Product class
  export class Product {
    constructor({id, name, etsyPrice, printifyCost, sales, image, shipping}) {
      this.id = id,
      this.name = name,
      this.etsyPrice = etsyPrice,
      this.printifyCost = printifyCost,
      this.sales = sales || 0,
      this.image = image,
      this.shipping = shipping
    }
    
    get profitPerItem() {
      // Calculate profit after Etsy fees
      const trueEtsyPrice = this.etsyPrice * (1 - DEFAULT_ETSY_FEE_RATE)
      return trueEtsyPrice - this.printifyCost;
    }

    get profitMargin() {
      return (this.profitPerItem / this.etsyPrice) * 100;
    }

    get totalProfit() {
      return this.profitPerItem * this.sales;
    }
    
    updateSales(quantity) {
      this.sales = quantity
      return this.sales;
    }
  }
  
