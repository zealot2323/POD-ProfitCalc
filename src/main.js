import './style.css'
import { Store } from './calculator.js';
import  getPrintifyProducts  from './apiService.js';
import { formatToDollars } from './helpers'

  // Test: Create store, add products, calculate profits

const apiData = await getPrintifyProducts();
console.log(apiData[0].orders);
console.log(apiData[0].products);
const store = new Store("BBhell");
store.loadFromApi(apiData[0].products);

const container = document.querySelector("#app-content");

store.products.forEach(product => {
  let row = document.createElement("tr");
  const rowData = [product.name, formatToDollars(product.etsyPrice), formatToDollars(product.printifyCost), formatToDollars(product.profitPerItem), `${product.profitMargin.toFixed(0)}%`];
  
  const productImg = document.createElement('td');
  productImg.innerHTML = `<img src="${product.image}" class="table"/>`
  row.appendChild(productImg);

  rowData.forEach(data => {
    const cell = document.createElement('td');
    cell.textContent = data;
    row.appendChild(cell);
  });

  container.appendChild(row);
});
