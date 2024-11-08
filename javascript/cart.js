// Import necessary modules for handling cart functionality
import { getCart, setCart, getData } from './main.js';
import { createModal, closeModal } from "./modals.js";

// Function to add a product to the cart by product ID
export const addToCart = (productId) => {
    const data = getData();
    const cart = getCart();
    const product = data.find(item => item.id === parseInt(productId));
    if (!product) return;

    // Check if product is already in the cart; if not, add it
    if (!cart.some(item => item.id === product.id)) {
        cart.push(product);
        setCart(cart);
        alert(`${product.title} added to cart.`);
    } else {
        alert(`${product.title} is already in the cart.`);
    }
};

// Function to open cart modal and display cart contents
export const openCartModal = () => {
    const cart = getCart();
    let content = `
        <h2 class="modal-title">Shopping Cart</h2>
        <div class="modal-info">
    `;

    // Display message if cart is empty
    if (cart.length === 0) {
        content += `<p>Your cart is empty.</p>`;
    } else {
        // Iterate through cart items and add them to modal content
        cart.forEach(product => {
            content += `
                <div class="cart-item">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <button class="remove-from-cart" data-id="${product.id}">Remove from Cart</button>
                </div>
            `;
        });
    }
    content += `
            <button data-close-modal="cart-modal">Close</button>
        </div>
    `;
    createModal('cart-modal', content);

    // Add event listener for each remove button in cart items
    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            removeFromCart(productId);
            openCartModal(); // Reopen cart modal to update view
        });
    });
};

// Function to remove product from the cart by ID
export const removeFromCart = (productId) => {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === parseInt(productId));
    if (index !== -1) {
        cart.splice(index, 1); // Remove the specified product from the cart
        setCart(cart);
        alert("Item removed from cart.");
    }
};