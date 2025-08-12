const DEFAULT_ETSY_FEE_RATE = 0.065;

export class Store {
    constructor({name, etsyFeeRate = DEFAULT_ETSY_FEE_RATE, products, orders}) {
      this.name = name,
      this.etsyFeeRate = etsyFeeRate,
      this.products = products || [],
      this.orders = orders || []
    }
    
    get totalRevenue() {
      return this.products.reduce((sum, p) => sum + p.sales * p.etsyPrice, 0);
    }

    get totalProfit() {
      return this.products.reduce((sum, p) => sum + p.sales * (p.etsyPrice * (1 - DEFAULT_ETSY_FEE_RATE) - p.cost), 0);
    }

    get totalExpenses() {
      return this.products.reduce((sum, p) => sum + p.sales * (p.etsyPrice *  DEFAULT_ETSY_FEE_RATE + p.cost), 0);
    }
    
    getTopPerformers(count = 5) {
      // Return top performing products by profit
      let profits = [];
      count = count - 1;
      for(let i = 0; i < this.products.length; i++) {
        profits.push(this.products[i].totalProfit);
        }
        profits.sort(function(a, b){return b - a});
        let top = profits.slice(0, count);
        return top
    }
  }
  
  // Create a Product class
  export class Product {
    constructor({id, name, etsyPrice, etsyId, cost, sales, image, shipping}) {
      this.id = id,
      this.name = name,
      this.etsyPrice = etsyPrice,
      this.etsyId = etsyId
      this.cost = cost,
      this.sales = sales || 0,
      this.image = image,
      this.shipping = shipping || 0
    }
    
    get profitPerItem() {
      // Calculate profit after Etsy fees
      const trueEtsyPrice = this.etsyPrice * (1 - DEFAULT_ETSY_FEE_RATE)
      return trueEtsyPrice - this.cost;
    }

    get profitMargin() {
      return (this.profitPerItem / this.etsyPrice) * 100;
    }

    get totalProfit() {
      return this.profitPerItem * this.sales;
    }
  }
  
