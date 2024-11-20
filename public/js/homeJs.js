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

async function fetchPopularGames() {
    const apiKey = "784fcaf5773e4e3eb57d6a78e9e6191b";
    const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-rating&dates=2023-01-01,2023-12-31&page_size=9`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching games data");

        const data = await response.json();

        displayGames(data.results);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("gamesDisplay").innerText = "Failed to load games data";
    }
}

function displayGames(games) {
    const gamesDisplay = document.getElementById("gamesDisplay");
    gamesDisplay.innerHTML = games.map(game => `
        <div class="game">
            <img src="${game.background_image}" alt="${game.name}" class="game-image">
            <h3>${game.name}</h3>
            <p>Released: ${game.released}</p>
            <p>Rating: ${game.rating}</p>
            <p>Platforms: ${game.platforms.map(platform => platform.platform.name).join(', ')}</p>
        </div>
    `).join('');
}

fetchPopularGames();

      // Function to fetch branch data from the server
      async function fetchBranches() {
          try {
              const response = await fetch('/api/branches'); // Assumes the server route is '/api/branches'
              const branches = await response.json();
              return branches;
          } catch (error) {
              console.error('Error fetching branch data:', error);
              return [];
          }
      }
  
      function initMap() {
          // Default location to center the map initially
          const defaultCenter = { lat: 40.730610, lng: -73.935242 }; 
          const map = new google.maps.Map(document.getElementById('map'), {
              center: defaultCenter,
              zoom: 10,
          });
  
          // Fetch branch locations and place markers
          fetchBranches().then(branches => {
              if (branches.length > 0) {
                  // Center map based on the first branch location if available
                  map.setCenter({ lat: branches[0].coordinates.lat, lng: branches[0].coordinates.lng });
              }
  
              branches.forEach(branch => {
                  const marker = new google.maps.Marker({
                      position: { lat: branch.coordinates.lat, lng: branch.coordinates.lng },
                      map: map,
                      title: branch.name,
                  });
              });
          });
      }
  
      // Initialize map when the page loads
      window.onload = initMap;