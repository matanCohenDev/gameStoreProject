const productList = document.getElementsByClassName('product-list')[0];
const homeBtn = document.getElementById('home');
const cartBtn = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const logoutBtn = document.getElementById('logoutBtn');
const cartModal = document.getElementById('cart-popup');
const checkoutModal = document.getElementById('checkoutPopup');

const productsHaveAddedList = [];
let productsNames = [];
let productsPrices = [];
let productDescription = [];
let productCategory = [];
let currentUser = '';
let productsIds = []; 
let countProductsInCart = 0;

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
            if(productsHaveAddedList.length === 0){
                const cartDisplayBtn = document.getElementById('cart');
                if(cartDisplayBtn.children[2]){
                    cartDisplayBtn.children[2].remove();
                }
            }
            updateCartQuantity();
        });
    });
}
// Add product to cart
function addProductToCart(productName) {
    const productIndex = productsNames.indexOf(productName);
    productsHaveAddedList.push({
        id: productsIds[productIndex],
        name: productsNames[productIndex], 
        price: productsPrices[productIndex] });
    updateCartQuantity();
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
            productsIds.push(product._id);
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
document.getElementById('checkout-btn').addEventListener('click', () => {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
});
function closeCheckoutPopup() {
    checkoutModal.style.display = 'none';
}
document.getElementById('closeCheckoutPopup').addEventListener('click', () => {
    closeCheckoutPopup();
});
document.getElementById('cancelCheckoutBtn').addEventListener('click', () => {
    closeCheckoutPopup();
});
//check for card expiry date
function validateExpiryDate(expiry) {
    const [monthStr, yearStr] = expiry.split('/');
    if (!monthStr || !yearStr || monthStr.length !== 2 || yearStr.length !== 2) {
        return false;
    }

    const month = parseInt(monthStr, 10);
    let year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return false;
    }

    year += 2000;

    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false; 
    }

    return true;
}
//check for valid checkout
function validCheckout() {
    const CardholderName = document.getElementById('CardholderName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const billingAddress = document.getElementById('billingAddress').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;

    if(!CardholderName || !billingAddress || !city){
        alert('Please fill in all fields.');
        return false;
    }
    if (cardNumber.length !== 16) {
        alert('Card number must be 16 digits.');
        return false;
    }
    if (cvv.length !== 3) {
        alert('CVV must be 3 digits.');
        return false;
    }
    if (postalCode.length !== 6) {
        alert('Postal code must be 6 digits.');
        return false;
    }
    if (!validateExpiryDate(expiryDate)) {
        alert('Expiry date is invalid or has already passed.');
        return false;
    }

    return true;
} 
//give current user
function getCurrentUser() {
    fetch('/api/users/getCurrentUser', {
        method: 'GET',
        credentials: 'include' 
    })
    .then(response => response.json())
    .then(data => {
        currentUser = data;
    })
    .catch(error => {
        console.error('Error fetching current user:', error);
    });
} 

getCurrentUser(); 
// Handle the checkout form submission
document.getElementById('checkoutForm').addEventListener('submit',async function(event) {
    event.preventDefault(); 
    //if (validCheckout()) {
        try{
            const response = await fetch('/api/orders/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: currentUser.userId, 
                    productIds: productsHaveAddedList.map(product => product.id)
                })
            });
            if (!response.ok) {
                throw new Error('Failed to add order');
            }
        }
        catch (error) {
            console.error('An error occurred during checkout:', error);
            alert('An error occurred. Please try again later.');
            return;
        }

        alert('Payment processed successfully!');
        closeCheckoutPopup();
        productsHaveAddedList.length = 0; 
        updateCartDisplay(); 
        document.getElementById('checkoutForm').reset();
    //} //else {
       
    //}
});
//update cart quantity
function updateCartQuantity() {
    if(productsHaveAddedList.length > 0){
       const cartDisplayBtn = document.getElementById('cart');
       if(cartDisplayBtn.children[2]){
           cartDisplayBtn.children[2].remove();
       }
       let cartItems = document.createElement('div');
       cartItems.className = 'cart-items';
       cartItems.innerHTML = productsHaveAddedList.length;
       cartDisplayBtn.appendChild(cartItems);
   
    }
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
