const productList = document.getElementsByClassName('product-list')[0];
const homeBtn = document.getElementById('home');
const cartBtn = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const logoutBtn = document.getElementById('logoutBtn');
const cartModal = document.getElementById('cart-popup');
const productsHaveAddedList = [];
let productsNames = [];
let productsPrices = [];
let productDescription = [];
let productCategory = [];

// Update the cart display
function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;

    productsHaveAddedList.forEach((product, index) => {
        total += product.price;
        let productItem = document.createElement('li');
        productItem.innerHTML = `
            ${product.name} - ${product.price}$
            <button class="delete-btn" data-index="${index}" data-product-name="${product.name}">X</button>
        `;
        cartItems.appendChild(productItem);
    });
    cartItems.innerHTML += `<li>Total: ${total}$</li>`;

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const productIndex = event.target.getAttribute('data-index');
            const productName = event.target.getAttribute('data-product-name');

            productsHaveAddedList.splice(productIndex, 1);

            const addToCartBtn = document.querySelector(`.btn[data-product-name='${productName}']`);
            if (addToCartBtn) {
                addToCartBtn.disabled = false;
                addToCartBtn.removeEventListener('click', addToCartBtn.handler);
                addToCartBtn.handler = () => {
                    addProductToCart(productName);
                    addToCartBtn.disabled = true;
                };
                addToCartBtn.addEventListener('click', addToCartBtn.handler);
            }
            updateCartDisplay();
        });
    });
}

// Add product to cart
function addProductToCart(productName) {
    const productIndex = productsNames.indexOf(productName);
    productsHaveAddedList.push({ name: productsNames[productIndex], price: productsPrices[productIndex] });
    alert(productName + ' added to cart.');
}

// Display products
function displayProducts() {
    for (let i = 0; i < productsNames.length; i++) {
        let product = document.createElement('div');
        product.className = 'product-card';
        productList.appendChild(product);

        let productImage = document.createElement('img');
        productImage.className = 'product-image';
        productImage.src = '/pics/' + productsNames[i] + '.webp';
        productImage.alt = productsNames[i];
        product.appendChild(productImage);

        let productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        productInfo.innerHTML = '<h2>' + productsNames[i] + '</h2>' +
            '<p>' + productDescription[i] + '</p>' +
            '<p>' + productsPrices[i] + '$</p>' +
            '<p>' + productCategory[i] + '</p>';
        product.appendChild(productInfo);

        let addToCart = document.createElement('button');
        addToCart.className = 'btn add-to-cart';
        addToCart.setAttribute('data-product-name', productsNames[i]);
        addToCart.innerHTML = 'Add to cart';
        product.appendChild(addToCart);

        addToCart.handler = () => {
            addProductToCart(productsNames[i]);
            addToCart.disabled = true;
        };

        addToCart.addEventListener('click', addToCart.handler);
    }
}
// Fetch products
async function getProducts() {
    try {
        const response = await fetch('/api/products/getProducts');
        const data = await response.json();

        data.forEach(product => {
            productsNames.push(product.name);
            productsPrices.push(product.price);
            productDescription.push(product.description);
            productCategory.push(product.category);
        });

        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
document.addEventListener('DOMContentLoaded', getProducts);
//show cart modal
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});
//close cart modal
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});
document.getElementById('closeCartPopup').addEventListener('click', () => {
    cartModal.style.display = 'none';
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        cartModal.style.display = 'none';
    }
});
document.getElementById('home').addEventListener('click', () => {
    window.location.href = '/';
});
// Open the Contact Us popup
function openContactPopup() {
    document.getElementById('contactPopup').style.display = 'flex';
}
// Close the Contact Us popup
function closeContactPopup() {
    document.getElementById('contactPopup').style.display = 'none';
}
//logout
async function Logout() {
    try {
        const res = await fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            window.location.href = '/';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (err) {
        console.error('An error occurred during logout:', err);
        alert('An error occurred. Please try again later.');
    }
}
logoutBtn.addEventListener('click', Logout);
