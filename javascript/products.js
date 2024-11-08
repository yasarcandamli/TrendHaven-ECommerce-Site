// Importing necessary functions for modals and cart functionalities
import { showProductDetailsModal, openEditModal, openDeleteModal } from "./modals.js"
import { addToCart } from "./cart.js"
import { getData, setData } from "./main.js";

// Function to render product cards in the products container
export const renderProducts = (data) => {
    const productContainer = document.querySelector(".products-container")
    let htmlContent = "";

    // Loop through each product and create HTML structure for each product card
    data.forEach((product) => {
        htmlContent += `
        <div class="product-card" data-id="${product.id}">
            <img 
            class="product-img" 
            src="${product.image}" 
            alt="${product.title}">
           
            <h3 class="product-title">
            ${product.title}
            </h3>

            <p class="product-description">
            ${product.description}
            </p>
            
            <p class="product-rating">
            Rating: 
            <span>${product.rating.rate}/5</span> 
            <span>(${product.rating.count})</span>
            </p>
           
            <p class="product-price">
            $ ${product.price}</p>
            
            <div class="product-btns">
                <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="btn-edit" data-id="${product.id}">
                    Edit
                </button>
                <button class="btn-delete" data-id="${product.id}">
                    Delete
                </button>
            </div>
        </div>
        `
    });
    // Updating the container with product cards
    productContainer.innerHTML = htmlContent

    // Event listener to show product details when a product card is clicked
    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            const productId = e.currentTarget.getAttribute("data-id");
            showProductDetailsModal(productId);
        });
    });

    // Event listener for "Add to Cart" button
    document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();    // Prevents card click event
            addToCart(e.target.getAttribute("data-id"));
        });
    });

    // Event listeners for edit and delete buttons
    document.querySelectorAll(".btn-edit").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();    // Prevents card click event
            openEditModal(e.target.getAttribute("data-id"));
        });
    });

    document.querySelectorAll(".btn-delete").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();    // Prevents card click event
            openDeleteModal(e.target.getAttribute("data-id"));
        });
    });
}

// Function to show loading spinner
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Function to hide loading spinner
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Function to fetch product data from API and render products
export const fetchProducts = async () => {
    showLoading();
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setData(response.data);
        hideLoading();
        renderProducts(getData());
    } catch (error) {
        console.log('Error fetching products data: ', error);
        hideLoading();
        return [];
    }
}