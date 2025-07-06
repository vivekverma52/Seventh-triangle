const apiEndpoint = "https://interveiw-mock-api.vercel.app/api/getProducts";
const fetchButton = document.getElementById("fetchProducts");
const productsContainer = document.getElementById("productsContainer");
const sortBySelect = document.getElementById("sortBy");

let products = []; // Store fetched products

// Fetch products from API
async function fetchProducts() {
  try {
    fetchButton.textContent = "Loading...";
    const response = await fetch(apiEndpoint);
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();

    // Debugging API response
    console.log("API Response:", data);

    // Validate response
    if (!data || !Array.isArray(data.data)) {
      throw new Error("Invalid API response: 'data' key missing or not an array");
    }

    products = data.data.map(item => item.product);
    renderProducts(products);
    fetchButton.style.display = "none"; // Hide the button after loading products
  } catch (error) {
    productsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    console.error(error);
  } finally {
    fetchButton.textContent = "Load Products";
  }
}

// Render products with animation
function renderProducts(products) {
  productsContainer.innerHTML = ""; // Clear previous content

  // Add staggered animation
  productsContainer.style.opacity = 1;
  productsContainer.style.transform = "translateY(0)";

  products.forEach((product, index) => {
    const variant = product.variants[0];
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.style.transitionDelay = `${index * 100}ms`; // Staggered effect
    productCard.innerHTML = `
      <img src="${product.image.src}" alt="${product.title}">
      <h2>${product.title}</h2>
      <span>Rs. ${variant.price}</span>
      <button>
        <i class="fas fa-shopping-cart"></i> ADD TO CART
      </button>
    `;
    productsContainer.appendChild(productCard);
    setTimeout(() => {
      productCard.style.opacity = 1;
      productCard.style.transform = "translateY(0)";
    }, index * 100);
  });
}

// Sort and re-render products
function sortProducts(order) {
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseFloat(a.variants[0].price);
    const priceB = parseFloat(b.variants[0].price);
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
  renderProducts(sortedProducts);
}

// Event listeners
fetchButton.addEventListener("click", fetchProducts);
sortBySelect.addEventListener("change", (e) => {
  const order = e.target.value;
  if (order) sortProducts(order);
});
