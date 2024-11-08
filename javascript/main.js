// Importing necessary functions and variables from other modules
import { fetchProducts } from './products.js';
import { openCartModal } from './cart.js';
import { applyFilters } from './filters.js';

// Adding event listener to the "Apply Filters" button
document.querySelector('#apply-filters').addEventListener('click', applyFilters);

// Creating and appending a "View Cart" button to the site title section
const cartButton = document.createElement("button");
cartButton.textContent = "View Cart";
cartButton.addEventListener("click", openCartModal);
document.querySelector(".site-title").appendChild(cartButton);

// Initializing data array to store fetched product data
let data = [];
export const getData = () => {
    return data;
};
export const setData = (newData) => {
    data = newData;
};

// Initializing cart array to store cart items
let cart = [];
export const getCart = () => {
    return cart;
};
export const setCart = (newCart) => {
    cart = newCart;
};

// Fetching products when the page loads
fetchProducts();