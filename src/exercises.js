// Create a Product constructor for your Etsy/Printify calculator
// function Product({name, etsyPrice, printifyCost}) {
//     this.name = name;
//     this.etsyPrice = etsyPrice;
//     this.printifyCost = printifyCost;
//   }

// Product.prototype.calculateProfit = function() {
//     return this.etsyPrice - this.printifyCost;
// };


// Product.prototype.getProfitMargin = function() {
//     return this.calculateProfit() / this.etsyPrice;
// };
  
// Create a profit calculator module using IIFE
// const profitCalculator = (function() {
//     // Private data
//     let products = [];
//     let etsyFeeRate = 0.065; // 6.5% transaction fee

//     function addProduct(item) {
//         return products.push(item)
//     }

//     function changeRate(rate) {
//         etsyFeeRate = rate;
//         console.log(etsyFeeRate);
//         return etsyFeeRate
//     }

//     function totalProfit() {
//         let sum = 0;
//         for(let i = 0; i < products.length; i++) {
//             sum += products[i].calculateProfit();
//         }
//         console.log(`Total profit: ${sum}`)
//         return sum
//     }

//     function printReport() {
//         return console.log(products)
//     }
    
//     return {
//         addProduct,
//         printReport,
//         calculateTotalProfit: totalProfit,
//         setEtsyFeeRate: changeRate
//     }
//     // Create private helper functions and public interface
//     // Methods: addProduct, calculateTotalProfit, setEtsyFeeRate, getReport
//   })();

//   profitCalculator.addProduct(new Product({name: "Tshirt", etsyPrice: 25, printifyCost: 15}));
//   profitCalculator.printReport();
//   profitCalculator.calculateTotalProfit();
//   profitCalculator.setEtsyFeeRate(.007);

// Create a Store class that manages multiple products

// Create mock API functions that return promises
function mockEtsyAPI(shopId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shopId === "invalid") {
        reject(new Error("Shop not found"));
      } else {
        resolve({
          shop: { name: "Etsy Shop" },
          products: [
            { id: 1, name: "T-Shirt", price: 25.00, sales: 10 }
          ]
        });
      }
    }, 1500); // Simulate network delay
  });
}

// Create similar mockPrintifyAPI
function mockPrintifyAPI(shopId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shopId === "invalid") {
        reject(new Error("Shop not found"));
      } else {
        resolve({
          shop: { name: "Printify Shop" },
          products: [
            { id: 1, name: "T-Shirt", cost: 15.00, sales: 10 }
          ]
        });
      }
    }, 1500); // Simulate network delay
  });
}

// mockPrintifyAPI('1234')
//   .then(response => console.log(response))
//   .catch(error => console.log(error));
// // Practice chaining promises to get complete data
// mockEtsyAPI('453')
//   .then(response => console.log(response))
//   .catch(error => console.log(error));


  // Use JSONPlaceholder for practice
const API_BASE = 'https://jsonplaceholder.typicode.com';

// Tasks:

// 2. Fetch specific user data
function fetchUser(id) {
 fetch(`${API_BASE}/users/${id}`)
    .then(response => response.json())
    .then(json => console.log(json)); 
}
// 3. Create a new post
fetch(`${API_BASE}/posts`, 
  {
  method: 'POST',
  body: JSON.stringify({
    title: 'foo',
    body: 'bar',
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
    .then(response => response.json())
    .then(json => console.log(json)); 

// 4. Handle network errors
// 5. Add loading states to your UI

// Create your main profit calculator using async/await
class ProfitCalculator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.etsyFeeRate = 0.065;
  }
  
  async calculateStoreProfit(shopId) {
    try {
      // 1. Fetch Etsy shop data
      const etsy = await mockEtsyAPI('1234');
      // 2. Fetch Printify costs for each product
      const printify = await mockPrintifyAPI('12345')
      // 3. Calculate profits
      // 4. Return comprehensive report
      console.log(etsy);
      console.log(printify);
    } catch (error) {
      // Handle different types of errors
      console.log(error);
    }
  }
  
  async getProductCosts(productIds) {
    // Fetch costs for multiple products in parallel
  }
  
  calculateProfit(etsyPrice, printifyCost, quantity) {
    // Calculate profit after fees
  }
}

// Usage:
const calculator = new ProfitCalculator('your-api-key');
const profit = await calculator.calculateStoreProfit('shop123');