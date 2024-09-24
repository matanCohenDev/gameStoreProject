let productsNames = [];
async function getProducts() {
    try {
        const response = await fetch('/api/products/getProducts');
        const data = await response.json();

        data.forEach(product => {
            productsNames.push(product.name);
        });

        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts() {
    const productList = document.getElementById('productList');
    productsNames.forEach(productNameText => {
        let product = document.createElement('div');
        product.className = 'game-item';
        productList.appendChild(product);

        let productImage = document.createElement('img');
        productImage.className = 'game-image';
        productImage.src = '/pics/' + productNameText + '.webp';
        productImage.alt = productNameText;
        product.appendChild(productImage);

        let productName = document.createElement('div');
        productName.className = 'game-name';
        productName.innerHTML = '<h2>' + productNameText + '</h2>';
        product.appendChild(productName);

        let buyNowBtn = document.createElement('a');
        buyNowBtn.className = 'btn';
        buyNowBtn.href = '/login';
        buyNowBtn.innerText = 'Buy Now';
        product.appendChild(buyNowBtn);
    });
}
// Open the Contact Us popup
function openContactPopup() {
    document.getElementById('contactPopup').style.display = 'flex';
}

// Close the Contact Us popup
function closeContactPopup() {
    document.getElementById('contactPopup').style.display = 'none';
}

getProducts();
