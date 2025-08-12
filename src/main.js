import './style.css'
import  router  from './apiRouter';
import { formatToDollars } from './helpers'


const printifyData = await router("printify");
console.log(printifyData);
console.log(printifyData[0]);
console.log(printifyData[0].products);

const container = document.querySelector("#app-content");

printifyData[0].products.forEach(product => {
  let row = document.createElement("tr");
  const rowData = [product.name, formatToDollars(product.etsyPrice), formatToDollars(product.cost), formatToDollars(product.profitPerItem), `${product.profitMargin.toFixed(0)}%`, product.sales, formatToDollars(product.totalProfit)];
  
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

const totalProfit = document.querySelector("#totalProfit");

totalProfit.textContent = `Total Profit for Active Items: ${formatToDollars(printifyData[0].totalProfit)}`;