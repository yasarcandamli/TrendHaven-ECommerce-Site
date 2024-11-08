// Import necessary functions and data handling modules
import { addToCart } from './cart.js';
import { getData, setData } from './main.js';
import { renderProducts } from './products.js';

// Function to create a modal with given ID and content
export const createModal = (id, content) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = id;
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" data-close-modal="${id}">&times;</span>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listener to close button
    modal.querySelector('.close-btn').addEventListener('click', () => closeModal(id));

    // Add event listeners to elements with data-close-modal attribute
    modal.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.getAttribute('data-close-modal');
            closeModal(modalId);
        });
    });
};

// Function to open edit modal with populated fields for a given product ID
export const openEditModal = (id) => {
    const data = getData();
    const product = data.find(item => item.id === parseInt(id));
    if (!product) return;

    const content = `
        <h2 class="modal-title">Edit Product</h2>
        <div class="modal-info">
            <label>Title:</label>
            <input type="text" id="edit-title" value="${product.title}" placeholder="Product Title" />
            <label>Description:</label>
            <textarea id="edit-description" placeholder="Product Description">${product.description}</textarea>
            <label>Price:</label>
            <input type="number" id="edit-price" value="${product.price}" placeholder="Price" />
            <button id="save-edit">Save Changes</button>
        </div>
        
    `;
    createModal('edit-modal', content);

    // Save button event listener to update product data and re-render products
    document.getElementById("save-edit").addEventListener("click", () => {
        const title = document.getElementById("edit-title").value;
        const description = document.getElementById("edit-description").value;
        const price = document.getElementById("edit-price").value;

        product.title = title;
        product.description = description;
        product.price = price;

        renderProducts(data);
        closeModal("edit-modal");
    });
};

// Function to open delete confirmation modal for a given product ID
export const openDeleteModal = (id) => {
    const content = `
        <h2 class="modal-title">Confirm Delete</h2>
        <div class="modal-info">
            <p>Are you sure you want to delete this product?</p>
            <div class="modal-btns">
                <button id="confirm-delete">Yes, Delete</button>
                <button 
                id="delete-modal"
                data-close-modal="delete-modal">Cancel</button>
            </div>
        </div>
    `;
    createModal('delete-modal', content);

    // Event listener for the delete confirmation button
    document.getElementById("confirm-delete").addEventListener("click", () => {
        const data = getData();
        setData(data.filter(item => item.id !== parseInt(id)));
        renderProducts(data);
        closeModal("delete-modal");
    });
};

// Function to show details of a selected product in a modal
export const showProductDetailsModal = (productId) => {
    const data = getData();
    const product = data.find(item => item.id === parseInt(productId));
    if (!product) return;

    const content = `
        <h2 class="modal-title">${product.title}</h2>
        <div class="modal-info-container">
            <div class="modal-info">
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <p class="product-description">${product.description}</p>
                <p class="product-rating">Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
                <p class="product-price">Price: $${product.price}</p>
                <button id="add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    createModal('product-details-modal', content);

    // Event listener to add the product to the cart and close modal
    document.getElementById("add-to-cart-modal").addEventListener("click", (e) => {
        addToCart(productId);
        closeModal("product-details-modal");
    });
};

// Function to close and remove modal from the DOM
export const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
};