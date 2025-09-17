
let productsData = [];
let cart = [];
const container = document.getElementById("products-container");
const pagination = document.getElementById("pagination");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// ---------------- عرض المنتجات ----------------
function displayProducts(products) {
    container.innerHTML = "";  

    products.forEach(product => {
        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3 mb-4"; 
        col.innerHTML = `
        <div class="card product-card position-relative">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body text-center">
                <h6 class="card-title">${product.name}</h6>
                <p>₹ ${product.price}</p>
            </div>
            <div class="add-to-cart position-absolute top-0 end-0 m-2 p-2 bg-dark text-white rounded-circle" 
                 title="Add to Cart" style="cursor:pointer;">
                <i class="fa-solid fa-cart-plus"></i>
            </div>
        </div>
        `;

        // 📌 زرار إضافة للسلة
        col.querySelector(".add-to-cart").addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(product);
        });

        container.appendChild(col);
    });
}

// ---------------- تحميل المنتجات ----------------
fetch("../data/products.json")
    .then(response => response.json())
    .then(data => {
        productsData = data;  
        displayProducts(productsData); // عرض أولي للمنتجات
    })
    .catch(error => console.error("Error loading products:", error));

// ---------------- فلترة حسب الفلتر ----------------
document.querySelectorAll(".filter-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const selectedCategories = Array.from(
            document.querySelectorAll(".filter-checkbox[data-type='category']:checked")
        ).map(cb => cb.value);

        const selectedCloths = Array.from(
            document.querySelectorAll(".filter-checkbox[data-type='cloth']:checked")
        ).map(cb => cb.value);

        let filtered = productsData;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        if (selectedCloths.length > 0) {
            filtered = filtered.filter(p => selectedCloths.includes(p.cloth));
        }

        displayProducts(filtered);
    });
});

// ---------------- إضافة للسلة ----------------
function addToCart(product) {
    let existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    renderCart();
}

// ---------------- عرض السلة ----------------
function renderCart() {
    cartItems.innerHTML = ""; 
    let total = 0;
    let totalQty = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        totalQty += item.qty;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div>
              ${item.name} (x${item.qty})
            </div>
            <div>
              <span class="me-3">₹ ${item.price * item.qty}</span>
              <button class="btn btn-sm btn-danger remove-item">X</button>
            </div>
        `;

        // 📌 زرار حذف منتج
        li.querySelector(".remove-item").addEventListener("click", () => {
            removeFromCart(item.id);
        });

        cartItems.appendChild(li);
    });

    cartTotal.textContent = total; 
    cartCount.textContent = totalQty;
}

// ---------------- حذف منتج من السلة ----------------
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
}

