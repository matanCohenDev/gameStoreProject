const sendMessageBtn = document.getElementById('sendMessageBtn');
const SuccessfulSentMessage = document.getElementById('sendSuccecfulMessage');
let productsNames = [];

// Function to get products and display them
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

// Send a message to the admin
async function sendMessage() {
    const message = document.getElementById('message').value;
    const sender = document.getElementById('sender').value;
    const receiver = 'admin';
    try {
        sendMessageBtn.disabled = true;
        
        const response = await fetch('/api/messages/createMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message, sender: sender, receiver: receiver })
        });
        if (response.ok) {
            openMessageSentPopup(); 
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again.');
    } finally {
        sendMessageBtn.disabled = false;
    }
}

function openMessageSentPopup() {
    SuccessfulSentMessage.style.display = 'flex';
    setTimeout(() => {
        closeMessageSentPopup();
        closeContactPopup(); 
    }, 2000); 
}

function closeMessageSentPopup() {
    SuccessfulSentMessage.style.display = 'none';
}

//send message when the admin clicks the send button
document.getElementById('sendMessageBtn').addEventListener('click', function(event) {
    event.preventDefault(); 
    sendMessage();         
});

getProducts();

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".carousel-image");
    const angle = 360 / images.length;
    const radius = 700; 

    images.forEach((img, index) => {
        const rotation = angle * index / 0.5;
        img.style.transform = `rotateY(${rotation}deg) translateZ(${radius}px)`;
    });
});



