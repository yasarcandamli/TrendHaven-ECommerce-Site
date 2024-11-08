// Import render function for products and data retrieval
import { renderProducts } from './products.js';
import { getData } from './main.js';

// Utility function to capitalize each word in a string
export const capitalize = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Function to apply filters based on category, title, and price range
export const applyFilters = () => {
    const category = document.querySelector('#category').value;
    const title = document.querySelector('#product-title').value;
    const minPrice = parseFloat(document.querySelector('#min-price').value) || 0;
    const maxPrice = parseFloat(document.querySelector('#max-price').value) || Infinity;

    // Filter products based on selected criteria
    const filteredData = getData().filter(product => {
        const categoryMatch = category === 'all' || product.category === category;
        const titleMatch = product.title.toLowerCase().includes(title.toLowerCase())
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        return categoryMatch && titleMatch && priceMatch;
    });

    // Update products title based on selected category
    const productsTitle = document.querySelector('.products-title');
    if (category === 'all') {
        productsTitle.textContent = 'All Products';
    } else {
        productsTitle.textContent = `${capitalize(category)} Products`;
    }

    renderProducts(filteredData)
}