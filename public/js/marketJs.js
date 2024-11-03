const productList = document.getElementsByClassName("product-list")[0];
const homeBtn = document.getElementById("home");
const cartBtn = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const logoutBtn = document.getElementById("logoutBtn");
const cartModal = document.getElementById("cart-popup");
const checkoutModal = document.getElementById("checkoutPopup");
const chatBtn = document.getElementById("chat-btn");
const chatWindow = document.getElementById("chat-window");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const closeChatBtn = document.getElementById("closeChatBtn");

const CardholderName = document.getElementById("displayCardholderName");
const cardNumber = document.getElementById("displayCardNumber");
const CardexpiryDate = document.getElementById("displayExpiryDate");
const Cardcvv = document.getElementById("displayCVV");
const cardDisplay = document.getElementById("credit-card");
let productsHaveAddedList = [];

let productsNames = [];
let productsPrices = [];
let productDescription = [];
let productCategory = [];
let currentUser = "";
let productsIds = [];
let countProductsInCart = 0;
let pollingInterval;
let myGames = []; //each user's games

// Update the cart display
function updateCartDisplay() {
  cartItems.innerHTML = "";
  let total = 0;

  productsHaveAddedList.forEach((product, index) => {
    total += product.price;
    let productItem = document.createElement("li");
    productItem.innerHTML = `
            ${product.name} - ${product.price}$
            <button class="delete-btn" data-index="${index}" data-product-name="${product.name}">X</button>
        `;
    cartItems.appendChild(productItem);
  });
  cartItems.innerHTML += `<li>Total: ${total}$</li>`;

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const productIndex = event.target.getAttribute("data-index");
      const productName = event.target.getAttribute("data-product-name");

      productsHaveAddedList.splice(productIndex, 1);

      const addToCartBtn = document.querySelector(
        `.btn[data-product-name='${productName}']`
      );
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.removeEventListener("click", addToCartBtn.handler);
        addToCartBtn.handler = () => {
          addProductToCart(productName);
          addToCartBtn.disabled = true;
        };
        addToCartBtn.addEventListener("click", addToCartBtn.handler);
      }
      updateCartDisplay();
      if (productsHaveAddedList.length === 0) {
        const cartDisplayBtn = document.getElementById("cart");
        if (cartDisplayBtn.children[2]) {
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
    price: productsPrices[productIndex],
  });
  updateCartQuantity();
}

// Display products
// Function to display products on the page
function displayProducts() {
  if (!currentUser || !Array.isArray(currentUser.products)) {
    console.error(
      "currentUser or currentUser.products is not defined or not an array."
    );
    return; // Exit the function if `currentUser` is not valid
  }

  for (let i = 0; i < productsNames.length; i++) {
    let product = document.createElement("div");
    product.className = "product-card";
    productList.appendChild(product);

    let productImage = document.createElement("img");
    productImage.className = "product-image";
    productImage.src = "/pics/" + productsNames[i] + ".webp";
    productImage.alt = productsNames[i];
    product.appendChild(productImage);

    let productInfo = document.createElement("div");
    productInfo.className = "product-info";
    productInfo.innerHTML =
      "<h2>" +
      productsNames[i] +
      "</h2>" +
      "<p>" +
      productDescription[i] +
      "</p>" +
      "<p>" +
      productsPrices[i] +
      "$</p>" +
      "<p>" +
      productCategory[i] +
      "</p>";
    product.appendChild(productInfo);

    // Check if the product is in the user's purchased list
    const isProductInCart = currentUser.products.some(
      (product) => product.productId === productsIds[i]
    );

    if (!isProductInCart) {
      let addToCart = document.createElement("button");
      addToCart.className = "btn add-to-cart";
      addToCart.setAttribute("data-product-name", productsNames[i]);
      addToCart.innerHTML = "Add to cart";
      product.appendChild(addToCart);

      addToCart.handler = () => {
        addProductToCart(productsNames[i]);
        addToCart.disabled = true;
      };

      addToCart.addEventListener("click", addToCart.handler);
    } else {
      let owned = document.createElement("button");
      owned.className = "btn owned";
      owned.innerHTML = "Owned";
      product.appendChild(owned);
    }
  }
}

// Fetch products
async function getProducts() {
  try {
    // Wait for currentUser to be fetched before proceeding
    await getCurrentUser();

    const response = await fetch("/api/products/getProducts");
    const data = await response.json();

    // Populate product arrays
    data.forEach((product) => {
      productsNames.push(product.name);
      productsPrices.push(product.price);
      productDescription.push(product.description);
      productCategory.push(product.category);
      productsIds.push(product._id);
    });

    // Call displayProducts to show products on the page
    displayProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

document.addEventListener("DOMContentLoaded", getProducts);
//show cart modal
cartBtn.addEventListener("click", () => {
  cartModal.style.display = "block";
  updateCartDisplay();
});
//close cart modal
window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});
document.getElementById("closeCartPopup").addEventListener("click", () => {
  cartModal.style.display = "none";
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cartModal.style.display = "none";
  }
});
document.getElementById("home").addEventListener("click", () => {
  window.location.href = "/";
});
// Open the Contact Us popup
function openContactPopup() {
  document.getElementById("contactPopup").style.display = "flex";
}
// Close the Contact Us popup
function closeContactPopup() {
  document.getElementById("contactPopup").style.display = "none";
}
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (productsHaveAddedList.length !== 0) {
    cartModal.style.display = "none";
    checkoutModal.style.display = "flex";
  } else {
    alert("Cart is empty");
  }
});
function closeCheckoutPopup() {
  checkoutModal.style.display = "none";
}
document.getElementById("closeCheckoutPopup").addEventListener("click", () => {
  closeCheckoutPopup();
});
document.getElementById("cancelCheckoutBtn").addEventListener("click", () => {
  closeCheckoutPopup();
});
//check for card expiry date
function validateExpiryDate(expiry) {
  if (expiry.length !== 4) return false;

  const monthStr = expiry.slice(0, 2);
  const yearStr = expiry.slice(2);

  if (!monthStr || !yearStr || monthStr.length !== 2 || yearStr.length !== 2)
    return false;

  const month = parseInt(monthStr, 10);
  let year = parseInt(yearStr, 10);

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

  year += 2000;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth))
    return false;

  return true;
}

//check for valid checkout
function validCheckout() {
  const CardholderName = document.getElementById("CardholderName").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expiryDate = document.getElementById("expiryDate").value;
  const cvv = document.getElementById("cvv").value;
  const billingAddress = document.getElementById("billingAddress").value;
  const city = document.getElementById("city").value;
  const postalCode = document.getElementById("postalCode").value;

  if (!CardholderName || !billingAddress || !city) {
    alert("Please fill in all fields.");
    return false;
  }
  if (cardNumber.length !== 16) {
    alert("Card number must be 16 digits.");
    return false;
  }
  if (cvv.length !== 3) {
    alert("CVV must be 3 digits.");
    return false;
  }
  if (postalCode.length !== 6) {
    alert("Postal code must be 6 digits.");
    return false;
  }
  if (!validateExpiryDate(expiryDate)) {
    alert("Expiry date is invalid or has already passed.");
    return false;
  }

  return true;
}

//give current user
async function getCurrentUser() {
  try {
    const response = await fetch("/api/users/getCurrentUser", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      currentUser = await response.json();
    } else {
      console.error(
        "Failed to fetch current user. Response status:",
        response.status
      );
      currentUser = null; // Set to null if the user is not authenticated
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    currentUser = null;
  }
}

getCurrentUser();
// Handle the checkout form submission
document
  .getElementById("checkoutForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    if (validCheckout()) {
      try {
        const response = await fetch("/api/orders/createOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.userId,
            productIds: productsHaveAddedList.map((product) => product.id),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to add order");
        }
      } catch (error) {
        console.error("An error occurred during checkout:", error);
        alert("An error occurred. Please try again later.");
        return;
      }
      
      await getCurrentUser(); 
      displayProductsOfUser();
      alert("Payment processed successfully!");
      closeCheckoutPopup();
      addProductToUser();
      changeButtons();
      productsHaveAddedList = [];
      productsHaveAddedList.length = 0;

      updateCartDisplay();
      document.getElementById("checkoutForm").reset();
      document.getElementById("cart").children[2].remove();
    }
  });

// Add products that the user buy to user's Products Array
async function addProductToUser() {
  try {
    const response = await fetch("/api/users/addProducts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser.userId,
        newproducts: productsHaveAddedList.map((product) => product.id), // שינוי ל-newproducts כדי להתאים לשרת
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding products:", errorData.message);
      return {
        success: false,
        message: errorData.message || "Failed to add products to user.",
      };
    }

    const updatedUser = await response.json();
    console.log("Products added successfully: ", updatedUser);

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}

//change buttons from "add to cart" to "owned"
function changeButtons() {
  console.log("productsHaveAddedList len: ", productsHaveAddedList.length);
  productsHaveAddedList.forEach((product) => {
    console.log("product: ", product.name);

    const button = document.querySelector(
      `.add-to-cart[data-product-name="${product.name}"]`
    );
    console.log("addToCartButton: ", button);

    button.className = "btn owned"; // משנה את הכיתה ל-owned
    button.innerHTML = "Owned"; // משנה את הטקסט ל-Owned
    button.disabled = true; // מבטלת את אפשרות הלחיצה
  });
}

//update cart quantity
function updateCartQuantity() {
  if (productsHaveAddedList.length > 0) {
    const cartDisplayBtn = document.getElementById("cart");
    if (cartDisplayBtn.children[2]) {
      cartDisplayBtn.children[2].remove();
    }
    let cartItems = document.createElement("div");
    cartItems.className = "cart-items";

    cartItems.innerHTML = productsHaveAddedList.length;
    cartDisplayBtn.appendChild(cartItems);
  }
}

//logout
async function Logout() {
  try {
    const res = await fetch("/api/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Logout failed. Please try again.");
    }
  } catch (err) {
    console.error("An error occurred during logout:", err);
    alert("An error occurred. Please try again later.");
  }
}
logoutBtn.addEventListener("click", Logout);

// Global variables to store min and max values
let savedMinVal = 0;
let savedMaxVal = 100;

// Price filter bar
function updateRangeSlider() {
  const minSlider = document.getElementById("price-min");
  const maxSlider = document.getElementById("price-max");
  const minVal = parseInt(minSlider.value);
  const maxVal = parseInt(maxSlider.value);

  // Ensure the min slider doesn't exceed the max slider
  if (minVal >= maxVal) {
    minSlider.value = maxVal - 1;
  }

  // Ensure the max slider doesn't go below the min slider
  if (maxVal <= minVal) {
    maxSlider.value = minVal + 1;
  }

  // Update the price range values
  document.getElementById("price-min-val").textContent = `$${minSlider.value}`;
  document.getElementById("price-max-val").textContent = `$${maxSlider.value}`;

  // Save the values to the global variables
  savedMinVal = minSlider.value;
  savedMaxVal = maxSlider.value;

  // Update the highlighted range
  const rangeTrack = minSlider.parentElement;
  const minPercent =
    ((minSlider.value - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
  const maxPercent =
    ((maxSlider.value - maxSlider.min) / (maxSlider.max - maxSlider.min)) * 100;
  rangeTrack.style.setProperty("--min-percent", `${minPercent}%`);
  rangeTrack.style.setProperty("--max-percent", `${maxPercent}%`);
}

// Set initial state
updateRangeSlider();

// Search bar+category filter+price filter
function filterByNameAndCategory() {
  const searchValue = document
    .getElementById("search-game")
    .value.toLowerCase();
  const selectedCategory = document
    .getElementById("category")
    .value.toLowerCase();
  const productCards = document.getElementsByClassName("product-card");

  for (let i = 0; i < productCards.length; i++) {
    const productName = productCards[i]
      .querySelector(".product-info h2")
      .textContent.toLowerCase(); //get the h2 tag
    const productCategory = productCards[i]
      .querySelector(".product-info p:last-of-type")
      .textContent.toLowerCase(); //get the last p tag
    const productPrice = parseInt(
      productCards[i]
        .querySelector(".product-info p:nth-last-of-type(2)")
        .textContent.replace("$", "") //remove dollar sign
    );

    // Check if the product matches the search term, category, and price range
    const matchesName = productName.includes(searchValue);
    const matchesCategory =
      selectedCategory === "" || productCategory === selectedCategory; //check if the category is selected
    const matchesPrice =
      productPrice >= savedMinVal && productPrice <= savedMaxVal; //check if the price is in the range

    // Show or hide the product based on whether it matches name, category, and price
    if (matchesName && matchesCategory && matchesPrice) {
      productCards[i].style.display = "flex"; // Show matching products
    } else {
      productCards[i].style.display = "none"; // Hide non-matching products
    }
  }
}

document.getElementById("apply-filters").addEventListener("click", function () {
  filterByNameAndCategory();
});

//get all the current-user messages
async function fetchMessages() {
  try {
    const response = await fetch(
      `/api/messages/getMessages?user=${encodeURIComponent(
        currentUser.username
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const data = await response.json();
      displayMessages(data);
    } else {
      console.error("Failed to fetch messages");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}
//display chat history
function displayMessages(messages) {
  chatMessages.innerHTML = "";

  messages.forEach((msg) => {
    if (
      (msg.sender === currentUser.username && msg.receiver === "admin") ||
      (msg.sender === "admin" && msg.receiver === currentUser.username)
    ) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");

      if (msg.sender === currentUser.username) {
        messageElement.classList.add("sent");
      } else {
        messageElement.classList.add("received");
      }

      const messageBubble = document.createElement("div");
      messageBubble.classList.add("message-bubble");
      messageBubble.textContent = msg.message;

      const messageMeta = document.createElement("div");
      messageMeta.classList.add("message-meta");

      messageElement.appendChild(messageBubble);
      messageElement.appendChild(messageMeta);
      chatMessages.appendChild(messageElement);
    }
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Messages
async function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    try {
      const response = await fetch("/api/messages/createMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUser.username,
          receiver: "admin",
          message,
        }),
      });

      if (response.ok) {
        chatInput.value = "";
        fetchMessages(); // Refresh messages
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

// allow user to realtime chat
function startPolling() {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(fetchMessages, 5000); // Fetch messages every 5 seconds
}
//stop the realtime chat
function stopPolling() {
  if (pollingInterval) clearInterval(pollingInterval);
}

// open chat window
chatBtn.addEventListener("click", () => {
  chatWindow.style.display = "flex";
  fetchMessages();
  startPolling();
});
//close chat window
closeChatBtn.addEventListener("click", () => {
  chatWindow.style.display = "none";
  stopPolling();
});
//send message
document.getElementById("sendChatBtn").addEventListener("click", sendMessage);
//send message by pressing enter
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function countUnreadMessages(messages) {
  let count = 0;
  messages.forEach((msg) => {
    if (
      msg.sender === "admin" &&
      msg.receiver === currentUser.username &&
      !msg.read
    )
      count++;
  });
  return count;
}

function createElementShowsUnreadMessages(count) {
  const unreadMessages = document.createElement("div");
  unreadMessages.classList.add("unread-messages");
  unreadMessages.textContent = count;
  return unreadMessages;
}

async function showUnreadMessagesElement() {
  await fetch("/api/messages/getMessages", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      const count = countUnreadMessages(data);
      if (count > 0) {
        const chatDisplayBtn = document.getElementById("chat-btn");
        chatDisplayBtn.appendChild(createElementShowsUnreadMessages(count));
      }
    });
}
window.addEventListener("load", showUnreadMessagesElement);

function changeInDbToReadWhenClicker(user) {
  fetch("/api/messages/getMessages")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((msg) => {
        if (msg.sender === "admin" && msg.receiver === user) {
          fetch("/api/messages/updateMessage", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: msg._id }),
          }).catch((error) => console.error("Error updating post:", error));
        }
      });
    })
    .catch((error) => console.error("Error fetching messages:", error));
}

chatBtn.addEventListener("click", () => {
  changeInDbToReadWhenClicker(currentUser.username);
  const unreadMessages = document.querySelector(".unread-messages");
  if (unreadMessages) unreadMessages.remove();
});

document.getElementById("CardholderName").addEventListener("input", () => {
  CardholderName.textContent = document.getElementById("CardholderName").value;
});
document.getElementById("cardNumber").addEventListener("input", () => {
  const cardInput = document.getElementById("cardNumber");
  const count = cardInput.value.length;
  cardNumber.textContent = "";
  for (let i = 0; i < count; i++) {
    if (i % 4 === 0 && i !== 0) cardNumber.textContent += " ";
    cardNumber.textContent += cardInput.value[i];
  }
  for (let i = count; i < 16; i++) {
    if (i % 4 === 0) cardNumber.textContent += " ";
    cardNumber.textContent += "0";
  }
});

document.getElementById("expiryDate").addEventListener("input", () => {
  const CardexpiryDateInput = document.getElementById("expiryDate");
  const count = CardexpiryDateInput.value.length;
  CardexpiryDate.textContent = "";
  for (let i = 0; i < count; i++) {
    if (i === 2) CardexpiryDate.textContent += "/";
    CardexpiryDate.textContent += CardexpiryDateInput.value[i];
  }
  for (let i = count; i <= 5; i++) {
    if (i === 2) CardexpiryDate.textContent += "/";
    if (i == 2 || i == 3) CardexpiryDate.textContent += "Y";
    if (i == 0 || i == 1) CardexpiryDate.textContent += "M";
  }
});

document.getElementById("cvv").addEventListener("focus", () => {
  const card = document.querySelector(".credit-card");
  card.classList.add("flipped");
});

document.getElementById("cvv").addEventListener("input", () => {
  const CardcvvInput = document.getElementById("cvv");
  const count = CardcvvInput.value.length;
  Cardcvv.textContent = "";
  for (let i = 0; i < count; i++) Cardcvv.textContent += CardcvvInput.value[i];
  for (let i = count; i < 3; i++) Cardcvv.textContent += "#";
});

document.getElementById("cvv").addEventListener("blur", () => {
  const card = document.querySelector(".credit-card");
  card.classList.remove("flipped");
});

function OpenVirtualShop() {
  const virtualProducts = document.querySelector(".virtual-products-shop");
  const landingPage = document.querySelector(".landing-page");
  const myGamesList = document.querySelector(".my-play-games");

  // Check if elements exist before attempting to modify them
  if (virtualProducts && landingPage) {
    virtualProducts.classList.remove("hidden");
    myGamesList.classList.add("hidden");
    landingPage.classList.add("hidden");
  } else {
    console.error("Elements not found: Please check your HTML structure.");
  }
}

document.getElementById("shop").addEventListener("click", OpenVirtualShop);

function displayProductsOfUser() {
  const virtualProducts = document.querySelector(".virtual-products-shop");
  const landingPage = document.querySelector(".landing-page");
  const myGamesList = document.querySelector(".my-play-games");
  const gameList = document.querySelector(".game-list");
  virtualProducts.classList.add("hidden");
  landingPage.classList.add("hidden");
  myGamesList.classList.remove("hidden");
  gameList.innerHTML = "";

  const containerMyGames = document.querySelector(".game-list");

  myGames = currentUser.products.map((product) => product.name);
  console.log("myGames: ", myGames);

  for(let i = 0; i < myGames.length; i++) {
    let product = document.createElement("div");
    product.className = "product-card";
    myGamesList.appendChild(product);

    let name = document.createElement("h2");
    name.innerHTML = myGames[i];
    product.appendChild(name); 

    let productImage = document.createElement("img");
    productImage.className = "product-image";
    productImage.src = "/pics/" + myGames[i] + ".webp";
    productImage.alt = myGames[i];
    product.appendChild(productImage);

    let productBtn = document.createElement("button");
    productBtn.className = "btn-play";
    productBtn.id = myGames[i] + " btn-play";
    productBtn.innerHTML = "Play Game";

    product.appendChild(productBtn);
    containerMyGames.appendChild(product);
  }
}

document.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("btn-play")) {
    const parts = event.target.id.split(" ");
    gameName = parts.slice(0, parts.indexOf("btn-play")).join(" ");
    gameNameLowerCase = gameName.toLowerCase().replace(/ /g, "-");
    console.log("gameName: ", gameNameLowerCase);
    window.location.href = `/game/${gameNameLowerCase}`;
  }
});

document.getElementById("my-games").addEventListener("click", () => {
  displayProductsOfUser();
});
