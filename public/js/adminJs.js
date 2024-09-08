//shows the users, products and orders tables
const usersBtn = document.getElementById('usersBtn');
const productsBtn = document.getElementById('productsBtn');
const ordersBtn = document.getElementById('ordersBtn');

//read the tables
const usersTable = document.getElementById('usersTableBody');
const productsTable = document.getElementById('productsTableBody');
const ordersTable = document.getElementById('ordersTableBody');
const usersSection = document.getElementById('usersSection');
const productsSection = document.getElementById('productsSection');
const ordersSection = document.getElementById('ordersSection');

//create product modal
const createProductBtn = document.getElementById('createProductBtn');
const productModal = document.getElementById('productModal');
const closeModalBtn = document.getElementById('closeModal');
const AddproductBtn = document.getElementById('AddProduct');

//update product modal
const updateProductBtn = document.getElementById('updateProductBtn');
const updateProductForm = document.getElementById('UpdateProductBtnComplete');
const closeUpdateModalBtn = document.getElementById('closeUpdateModal');

//delete modal
const deleteProductBtn = document.getElementById('deleteProductBtn');
const deleteOkBtn = document.getElementById('deleteOk');
const deleteCancelBtn = document.getElementById('deleteCancel');
const deleteMessage = document.getElementById('deleteMessage');
const deleteModal = document.getElementById('DeleteProdactModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');

//select row
let selectedProduct = null;

//loguot button
const logoutBtn = document.getElementById('logoutBtn');

//format date
function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
//fetch all users and insert to table
function fetchAllUsersAndInsertToTable() {
    fetch('/api/users/getUsers')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((user) => {
                const tr = document.createElement('tr');
                console.log(user);
                tr.innerHTML = `<td>${user.username}</td><td>${user.email}</td><td>${user.roleLevel}</td><td>${formatDate(user.createdAt)}</td>`;
                usersTable.appendChild(tr);
            });
            
        });
}
//fetch all products and insert to table
function fetchAllProductsAndInsertToTable() {
    fetch('/api/products/getProducts')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((product) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${product.name}</td><td>${product.price}</td><td>${product.category}</td><td>${product.description}</td><td>${formatDate(product.createdAt)}</td>`;

                // Add click event listener to each row
                tr.addEventListener('click', () => {
                    selectedProduct = product;
                    console.log(selectedProduct);
                    highlightSelectedRow(tr);
                });

                productsTable.appendChild(tr);
            });
        });
}
//fetch all orders and insert to table
function fetchAllOrdersAndInsertToTable() {
    fetch('/api/orders/getOrders')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((order) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${order.userId}</td><td>${order.products}</td><td>${order.totalPrice}</td><td>${formatDate(order.createdAt)}</td>`;
                ordersTable.appendChild(tr);
            });
        });
}
//clear tables
function clearTables() {
    usersTable.innerHTML = '';
    productsTable.innerHTML = '';
    ordersTable.innerHTML = '';
}
//show the users table
usersBtn.addEventListener('click', () => {
    clearTables();
    showSection('users');
    fetchAllUsersAndInsertToTable();
});
//show the products table
productsBtn.addEventListener('click', () => {
    clearTables();
    showSection('products');
    fetchAllProductsAndInsertToTable();
});
//show the orders table
ordersBtn.addEventListener('click', () => {
    clearTables();
    showSection('orders');
    fetchAllOrdersAndInsertToTable();
});
//disabling duplicate table
function showSection(section) {
    usersSection.classList.remove('active');
    productsSection.classList.remove('active');
    ordersSection.classList.remove('active');

    if (section === 'users') {
        usersSection.classList.add('active');
    } else if (section === 'products') {
        productsSection.classList.add('active');
    } else if (section === 'orders') {
        ordersSection.classList.add('active');
    }
}
//show the product modal
createProductBtn.addEventListener('click', () => {
    productModal.classList.add('active');
});

//add product
AddproductBtn.addEventListener('click', async () => {
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productCategory = document.getElementById('productCategory').value;
    const productDescription = document.getElementById('productDescription').value;

    try {
        const response = await fetch('/api/products/createProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: productName,
                price: productPrice,
                category: productCategory,
                description: productDescription,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Product created:', data);
        } else {
            console.log('Error creating product:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//close the product modal
closeModalBtn.addEventListener('click', () => {
    productModal.classList.remove('active');
});
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
//select row
function highlightSelectedRow(row) {
    // Remove highlight from any previously selected row
    document.querySelectorAll('tbody tr').forEach(tr => {
        tr.classList.remove('selected');
        tr.style.backgroundColor = ''; // Reset background color
    });

    // Add highlight to the clicked row
    row.classList.add('selected');
}
//show the update product modal
updateProductBtn.addEventListener('click', () => {
    if (!selectedProduct) {
        alert('Please select a product from the table first.');
        return;
    }

    const productNameInput = document.getElementById('productNameUpdate');
    productNameInput.setAttribute('value', selectedProduct.name);
    updateProdactModal.classList.add('active');
});

//update product
updateProductForm.addEventListener('click', () => {

    const updatedPrice = document.getElementById('productPriceUpdate').value; 
    const productId = selectedProduct._id; 
    

    try {
        const response = fetch(`/api/products/updateProduct`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: productId,          
                price: updatedPrice      
            }),
        });

        const data = response.json();

        if (response.ok) {
            console.log('Product updated:', data);
            updateProdactModal.classList.remove('active');
            productsBtn.click();
        } else {
            console.log('Error updating product:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

//close the update product modal
closeUpdateModalBtn.addEventListener('click', () => {
    updateProdactModal.classList.remove('active');
});  
//open the delete product modal
deleteProductBtn.addEventListener('click', () => {
    if (!selectedProduct) {
        alert('Please select a product from the table first.');
        return;
    }

    deleteMessage.innerText = `Are you sure you want to delete ${selectedProduct.name}?`;
    deleteModal.classList.add('active');
});
//delete product
deleteOkBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`/api/products/deleteProduct`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedProduct._id,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Product deleted:', data);
            deleteModal.classList.remove('active');
            productsBtn.click();
        } else {
            console.log('Error deleting product:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
//close the delete product modal
closeDeleteModalBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});
//delete cancel button
deleteCancelBtn.addEventListener('click', () => {
    deleteModal.classList.remove('active');
});