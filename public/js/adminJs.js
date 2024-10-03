// Tab Navigation Buttons
const usersBtn = document.getElementById('usersBtn');
const productsBtn = document.getElementById('productsBtn');
const ordersBtn = document.getElementById('ordersBtn');
const chatBtn = document.getElementById('messagesBtn');
const homeBtn = document.getElementById('homeBtn');
// Sections
const usersSection = document.getElementById('usersSection');
const productsSection = document.getElementById('productsSection');
const ordersSection = document.getElementById('ordersSection');
const chatSection = document.getElementById('chatSection');

// Tables
const usersTableBody = document.getElementById('usersTableBody');
const productsTableBody = document.getElementById('productsTableBody');
const ordersTableBody = document.getElementById('ordersTableBody');

// Modals
const productModal = document.getElementById('productModal');
const updateProductModal = document.getElementById('updateProductModal');
const deleteProductModal = document.getElementById('deleteProductModal');

// Modal Close Buttons
const closeProductModalBtn = document.getElementById('closeModal');
const closeUpdateModalBtn = document.getElementById('closeUpdateModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');

// Product Form Buttons
const createProductBtn = document.getElementById('createProductBtn');
const updateProductBtn = document.getElementById('updateProductBtn');
const deleteProductBtn = document.getElementById('deleteProductBtn');

// Modal Action Buttons
const addProductBtn = document.getElementById('AddProduct');
const updateProductFormBtn = document.getElementById('UpdateProductBtnComplete');
const deleteOkBtn = document.getElementById('deleteOk');
const deleteCancelBtn = document.getElementById('deleteCancel');

//chat Actions
const chatContainer = document.getElementById('chatSection');
const usersContainer = document.getElementsByClassName('user-list');
const currentChat = document.getElementsByClassName('current-user');
const messageContainer = document.querySelector('.messages'); 
let chatWith = null;

// Other Elements
const logoutBtn = document.getElementById('logoutBtn');
const deleteMessage = document.getElementById('deleteMessage');

// Selected Product Variable
let selectedProduct = null;

// Format Date Function
function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('en-GB', options).replace(',', ' -');
}

// Clear Tables Function
function clearTables() {
    usersTableBody.innerHTML = '';
    productsTableBody.innerHTML = '';
    ordersTableBody.innerHTML = '';

}

// Show Section Function
function showSection(section) {
    usersSection.classList.add('hidden');
    productsSection.classList.add('hidden');
    ordersSection.classList.add('hidden');

    if (section === 'users') {
        usersSection.classList.remove('hidden');
    } else if (section === 'products') {
        productsSection.classList.remove('hidden');
    } else if (section === 'orders') {
        ordersSection.classList.remove('hidden');
    } else if(section === 'chat'){
        chatSection.classList.remove('hidden');
    }
}

// Fetch and Display Users
function fetchAllUsersAndInsertToTable() {
    fetch('/api/users/getUsers')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                const tr = document.createElement('tr');
                if(user.roleLevel == 1)
                    var role = "User";
                else if(user.roleLevel == 2)
                    var role = "Creator";
                else if(user.roleLevel == 3)
                    var role = "Admin";
                tr.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${role}</td>
                    <td>${formatDate(user.createdAt)}</td>
                `;
                usersTableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
}

// Fetch and Display Products
function fetchAllProductsAndInsertToTable() {
    fetch('/api/products/getProducts')
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.description}</td>
                    <td>${product.category}</td>
                    <td>${formatDate(product.createdAt)}</td>
                `;

                tr.addEventListener('click', () => {
                    selectedProduct = product;
                    highlightSelectedRow(tr);
                });

                productsTableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Fetch and Display Orders
function fetchAllOrdersAndInsertToTable() {
    fetch('/api/orders/getOrders')
        .then(response => response.json())
        .then(data => {
            data.forEach(order => {
                const tr = document.createElement('tr');
                const productNames = order.products.map(product => product.name).join(', ');
                const productQuantity = order.products.map(product => product.quantity).join(', ');
                tr.innerHTML = `
                    <td>${order.user}</td>
                    <td>${productNames}</td>
                    <td>${productQuantity}</td>
                    <td>${formatDate(order.createdAt)}</td>
                `;
                console.log(order.user);
                ordersTableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

// Highlight Selected Row
function highlightSelectedRow(row) {
    document.querySelectorAll('tbody tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    row.classList.add('selected');
}

// Event Listeners for Tab Buttons
usersBtn.addEventListener('click', () => {
    chatSection.classList.add('hidden');
    clearTables();
    showSection('users');
    fetchAllUsersAndInsertToTable();
});

productsBtn.addEventListener('click', () => {
    chatSection.classList.add('hidden');
    clearTables();
    showSection('products');
    fetchAllProductsAndInsertToTable();
});

ordersBtn.addEventListener('click', () => {
    chatSection.classList.add('hidden');
    clearTables();
    showSection('orders');
    fetchAllOrdersAndInsertToTable();
});

// Show Create Product Modal
createProductBtn.addEventListener('click', () => {
    productModal.classList.add('active');
});

// Close Create Product Modal
closeProductModalBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
});

// Add New Product
addProductBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const productName = document.getElementById('productName').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productDescription = document.getElementById('productDescription').value.trim();
    const productCategory = document.getElementById('productCategory').value.trim();

    if (!productName || isNaN(productPrice) || !productDescription || !productCategory) {
        alert('Please fill in all fields correctly.');
        return;
    }

    try {
        const response = await fetch('/api/products/createProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: productName,
                price: productPrice,
                description: productDescription,
                category: productCategory
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Product created:', data);
            productModal.classList.remove('active');
            productsBtn.click(); 
        } else {
            const errorData = await response.json();
            console.error('Error creating product:', errorData);
            alert('Error creating product. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Show Update Product Modal
updateProductBtn.addEventListener('click', () => {
    if (!selectedProduct) {
        alert('Please select a product from the table first.');
        return;
    }
    document.getElementById('productNameUpdate').value = selectedProduct.name;
    document.getElementById('productPriceUpdate').value = selectedProduct.price;
    updateProductModal.classList.add('active');
});

// Close Update Product Modal
closeUpdateModalBtn.addEventListener('click', () => {
    updateProductModal.classList.remove('active');
});

// Update Product
updateProductFormBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const updatedPrice = parseFloat(document.getElementById('productPriceUpdate').value);

    if (isNaN(updatedPrice)) {
        alert('Please enter a valid price.');
        return;
    }

    try {
        const response = await fetch('/api/products/updateProduct', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedProduct._id,
                price: updatedPrice
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Product updated:', data);
            updateProductModal.classList.remove('active');
            productsBtn.click(); 
        } else {
            const errorData = await response.json();
            console.error('Error updating product:', errorData);
            alert('Error updating product. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Show Delete Product Modal
deleteProductBtn.addEventListener('click', () => {
    if (!selectedProduct) {
        alert('Please select a product from the table first.');
        return;
    }
    deleteMessage.textContent = `Are you sure you want to delete "${selectedProduct.name}"?`;
    deleteProductModal.classList.add('active');
});

// Close Delete Product Modal
closeDeleteModalBtn.addEventListener('click', () => {
    deleteProductModal.classList.remove('active');
});

// Cancel Delete Product
deleteCancelBtn.addEventListener('click', () => {
    deleteProductModal.classList.remove('active');
});

// Confirm Delete Product
deleteOkBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/products/deleteProduct', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedProduct._id }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Product deleted:', data);
            deleteProductModal.classList.remove('active');
            productsBtn.click();
        } else {
            const errorData = await response.json();
            console.error('Error deleting product:', errorData);
            alert('Error deleting product. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Logout Functionality
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            window.location.href = '/';
        } else {
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('An error occurred during logout:', error);
        alert('An error occurred. Please try again later.');
    }
});

// Chat Functionality
chatBtn.addEventListener('click', () => {
    usersSection.classList.add('hidden');
    productsSection.classList.add('hidden');
    ordersSection.classList.add('hidden');
    if (chatContainer.classList.contains('hidden')) {
        chatContainer.classList.remove('hidden');
    } else {
        chatContainer.classList.add('hidden');
    }
});

async function fetchAllUsers() {
    try {
        const response = await fetch('/api/users/getUsers');
        const data = await response.json();
        usersContainer[0].innerHTML = ''; 

        for (const user of data) {
            if (user.username !== 'admin') {
                let count = await countUnreadMessages(user.username);  
                let userDiv = document.createElement('div');
                userDiv.classList.add('user');
                userDiv.innerHTML = `<p>${user.username}</p>`;

                if (count > 0) {
                    let unreadDiv = document.createElement('div');
                    unreadDiv.classList.add('unread');
                    unreadDiv.innerHTML = `<p>${count}</p>`;
                    userDiv.appendChild(unreadDiv);
                }

                userDiv.addEventListener('click', () => {
                    if (chatWith !== null) 
                        chatWith.classList.remove('currentUser'); 
                
                    const cleanUsername = userDiv.textContent.replace(/\d+/g, '');
                    userDiv.textContent = cleanUsername;
                    chatWith = userDiv;  
                    chatWith.classList.add('currentUser');   
                    currentChat[0].textContent = "Chat with " + cleanUsername; 
                    changeInDbToReadWhenClicker(cleanUsername);
                    fetchMessages(cleanUsername); 
                });
                usersContainer[0].appendChild(userDiv); 
            }
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

fetchAllUsers(); 

function fetchMessages(user) {
    fetch('/api/messages/getMessages')
        .then(response => response.json())
        .then(data => {
            messageContainer.innerHTML = ''; 
            data.forEach(msg => {
                if(msg.sender === user && msg.receiver === "admin") {
                    let messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', 'received');
                    messageDiv.innerHTML = `<p>${msg.message}</p>`;
                    messageContainer.appendChild(messageDiv); 

                }
                if(msg.sender === "admin" && msg.receiver === user) {
                    let messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', 'sent');
                    messageDiv.innerHTML = `<p>${msg.message}</p>`;
                    messageContainer.appendChild(messageDiv); 
                }
            });
        })
        .catch(error => console.error('Error fetching messages:', error));
        setTimeout(() => {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }, 100);
}

function sendMessage() {
    let message = document.getElementById('message').value; 
    if (message === "") {
        return; 
    }
    fetch('/api/messages/createMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sender: "admin",
            receiver: chatWith.textContent,
            message: message
        }),
    })
    .then(response => response.json())
    .then(data => {
        fetchMessages(chatWith.textContent);
        document.getElementById('message').value = "";
    })
    .catch(error => console.error('Error sending message:', error));
}

document.getElementById('send').addEventListener('click', sendMessage);
document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') 
        sendMessage();
    
});

function filterUsers() {
    let input = document.getElementById('searchUsers').value.toUpperCase();
    let users = document.getElementsByClassName('user');
    for (let i = 0; i < users.length; i++) {
        let user = users[i].getElementsByTagName('p')[0];
        if (user.innerHTML.toUpperCase().indexOf(input) > -1) {
            users[i].style.display = "";
        } else {
            users[i].style.display = "none";
        }
    }
}
document.getElementById('searchUsers').addEventListener('keyup', filterUsers);

async function countUnreadMessages(username) {
    try {
        const response = await fetch('/api/messages/getMessages');
        const data = await response.json();
        let count = 0;
        data.forEach(msg => {
            if (msg.sender === username && msg.receiver === "admin" && !msg.read) 
                count++;
        });
        return count;
    } catch (error) {
        console.error('Error counting unread messages:', error);
        return 0; 
    }
}

function changeInDbToReadWhenClicker(username){
    fetch('/api/messages/getMessages')
        .then(response => response.json())
        .then(data => {
            data.forEach(msg => {
                if(msg.sender === chatWith.textContent && msg.receiver === "admin"){
                    fetch('/api/messages/updateMessage', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: msg._id })
                    })
                    .catch(error => console.error('Error updating post:', error));
                }
            });
        })
        .catch(error => console.error('Error fetching messages:', error));
}

homeBtn.addEventListener('click', () => {
    window.location.href = '/';
});

usersBtn.click(); // Default tab

//filter
document.getElementById('searchBtn').addEventListener('click', function () {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const dateFilter = document.getElementById('searchDate').value;  // Get the date from input field (YYYY-MM-DD)

    console.log("Search value:", searchValue);
    console.log("Date filter:", dateFilter);

    const table = document.getElementById('usersTableBody');
    const rows = table.getElementsByTagName('tr');

    // Split the date filter into year, month, and day
    let dateFilterYear = "";
    let dateFilterMonth = "";
    let dateFilterDay = "";

    if (dateFilter) {
        const dateParts = dateFilter.split("-");
        dateFilterYear = dateParts[0];
        dateFilterMonth = dateParts[1];
        dateFilterDay = dateParts[2];

        console.log("Date filter year:", dateFilterYear);
        console.log("Date filter month:", dateFilterMonth);
        console.log("Date filter day:", dateFilterDay);
    }

    for (let i = 0; i < rows.length; i++) {
        let username = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        let email = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();
        let createdAt = rows[i].getElementsByTagName('td')[3].textContent.trim();

        console.log(`Row ${i + 1} - Username:`, username);
        console.log(`Row ${i + 1} - Email:`, email);
        console.log(`Row ${i + 1} - Created At (raw):`, createdAt);

        // Extract the year part from createdAt by taking the first 4 characters
        let createdAtYear = "";
        let createdAtMonth = "";
        let createdAtDay = "";

        if (createdAt) {
            const createdAtParts = createdAt.split('/');  // Split by '/' in case the format is DD/MM/YYYY
            createdAtDay = createdAtParts[0];    // Day part
            createdAtMonth = createdAtParts[1];  // Month part
            createdAtYear = createdAtParts[2].substring(0, 4);   // Take only the first 4 characters of the year

            console.log(`Row ${i + 1} - Created At day:`, createdAtDay);
            console.log(`Row ${i + 1} - Created At month:`, createdAtMonth);
            console.log(`Row ${i + 1} - Created At year (only):`, createdAtYear);
        }

        // Check if the search matches username or email
        let matchSearch = (
            username.indexOf(searchValue) > -1 || 
            email.indexOf(searchValue) > -1
        );

        console.log(`Row ${i + 1} - Match search:`, matchSearch);

        // Check if the year, month, and day match the date filter
        let matchDate = (
            (createdAtYear === dateFilterYear || dateFilterYear === "") &&
            (createdAtMonth === dateFilterMonth || dateFilterMonth === "") &&
            (createdAtDay === dateFilterDay || dateFilterDay === "")
        );

        console.log(`Row ${i + 1} - Match date:`, matchDate);

        // Show the row if both match the search criteria
        if ((matchSearch || searchValue === "") && matchDate) {
            rows[i].style.display = "";
            console.log(`Row ${i + 1} - Displaying row.`);
        } else {
            rows[i].style.display = "none";
            console.log(`Row ${i + 1} - Hiding row.`);
        }
    }
});
