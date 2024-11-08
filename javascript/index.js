const capitalize = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const applyFilters = () => {
    const category = document.querySelector('#category').value;
    const title = document.querySelector('#product-title').value;
    const minPrice = parseFloat(document.querySelector('#min-price').value) || 0;
    const maxPrice = parseFloat(document.querySelector('#max-price').value) || Infinity;

    const filteredData = data.filter(product => {
        const categoryMatch = category === 'all' || product.category === category;
        const titleMatch = product.title.toLowerCase().includes(title.toLowerCase())
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        return categoryMatch && titleMatch && priceMatch;
    });

    const productsTitle = document.querySelector('.products-title');
    if (category === 'all') {
        productsTitle.textContent = 'All Products';
    } else {
        productsTitle.textContent = `${capitalize(category)} Products`;
    }

    renderProducts(filteredData)
}

document.querySelector('#apply-filters').addEventListener('click', applyFilters);

const createModal = (id, content) => {
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

    // Kapatma butonuna event listener ekleme
    modal.querySelector('.close-btn').addEventListener('click', () => closeModal(id));

    modal.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.getAttribute('data-close-modal');
            closeModal(modalId);
        });
    });
};

const openEditModal = (id) => {
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

    // Save button için event listener
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

// Delete modal açma fonksiyonu
const openDeleteModal = (id) => {
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

    // Confirm delete button için event listener
    document.getElementById("confirm-delete").addEventListener("click", () => {
        data = data.filter(item => item.id !== parseInt(id));
        renderProducts(data);
        closeModal("delete-modal");
    });
};

// Modal kapatma fonksiyonu
const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
};

// Ürün detayları modali
const showProductDetailsModal = (productId) => {
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

    document.getElementById("add-to-cart-modal").addEventListener("click", (e) => {
        addToCart(productId);
        closeModal("product-details-modal");
    });
};

// Sepete ekle fonksiyonu
const addToCart = (productId) => {
    const product = data.find(item => item.id === parseInt(productId));
    if (!product) return;

    // Ürün daha önce sepette değilse ekle
    if (!cart.some(item => item.id === product.id)) {
        cart.push(product);
        alert(`${product.title} added to cart.`);
    } else {
        alert(`${product.title} is already in the cart.`);
    }
};

// Sepet modalını açma fonksiyonu
const openCartModal = () => {
    let content = `
        <h2 class="modal-title">Shopping Cart</h2>
        <div class="modal-info">
    `;

    if (cart.length === 0) {
        content += `<p>Your cart is empty.</p>`;
    } else {
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

    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            removeFromCart(productId);
            openCartModal(); // Sepeti tekrar açarak güncelleme
        });
    });
};

// Sepetten çıkar fonksiyonu
const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== parseInt(productId));
    alert("Item removed from cart.");
};

// "Sepeti Göster" butonu oluşturma
const cartButton = document.createElement("button");
cartButton.textContent = "View Cart";
cartButton.addEventListener("click", openCartModal);
document.querySelector(".site-title").appendChild(cartButton);

let cart = [];
let data = [];
const renderProducts = (data) => {
    const productContainer = document.querySelector(".products-container")
    let htmlContent = "";
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
    productContainer.innerHTML = htmlContent

    // Ürün Kartı Tıklama - Detayları Gösterme
    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            const productId = e.currentTarget.getAttribute("data-id");
            showProductDetailsModal(productId);
        });
    });

    // Sepete Ekle butonu için event listener
    document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();// Tıklama olayının kartta açılmasını engeller
            addToCart(e.target.getAttribute("data-id"));
        });
    });

    // Düzenleme ve silme butonları için event listener
    document.querySelectorAll(".btn-edit").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation(); // Tıklama olayının kartta açılmasını engeller
            openEditModal(e.target.getAttribute("data-id"));
        });
    });

    document.querySelectorAll(".btn-delete").forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation(); // Tıklama olayının kartta açılmasını engeller
            openDeleteModal(e.target.getAttribute("data-id"));
        });
    });
}

const fetchProducts = async () => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        data = response.data
        renderProducts(data);
    } catch (error) {
        console.log('Error fetching products data: ', error);
    }
}

fetchProducts();