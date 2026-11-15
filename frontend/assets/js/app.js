
// ==========================================
// CHUMBAK ART - COMPLETE FRONTEND INTEGRATION
// HOME + SHOP + ADMIN
// ==========================================
const API_BASE_URL = "https://kiyshil-arts-1.onrender.com";

const API_URL = API_BASE_URL + "/api/products";
const CATEGORY_API_URL = API_BASE_URL + "/api/categories";
const IMAGE_URL = API_BASE_URL + "/uploads/";
const WHATSAPP_NUMBER = "918263089641";

let productsCache = [];
let categoriesCache = [];
let selectedCategory = "all";

// ==========================================
// API REQUEST
// ==========================================

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("Invalid server response");
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message || data.error || "API Request Failed"
        );
    }

    return data;
}

// ==========================================
// GET ARRAY
// ==========================================

function getArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.categories)) return data.categories;
    if (Array.isArray(data.data)) return data.data;

    return [];
}

// ==========================================
// HTML ESCAPE
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// ==========================================
// IMAGE URL
// ==========================================

function getImage(image) {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
        return image;
    }

    return IMAGE_URL + String(image).replace(/^\/+/, "");
}

// ==========================================
// CATEGORY NAME
// ==========================================

function getCategoryName(product) {
    return product.category_name ||
           product.category ||
           "";
}

// ==========================================
// LOAD CATEGORIES
// ==========================================

async function loadCategories() {
    try {
        const data = await apiRequest(CATEGORY_API_URL);

        categoriesCache = getArray(data);

        renderCategories();

        console.log("Categories Loaded:", categoriesCache);

    } catch (error) {
        console.error("Category Error:", error);
    }
}

// ==========================================
// RENDER CATEGORIES
// ==========================================

function renderCategories() {

    const adminSelect = document.getElementById("art-category");

    if (adminSelect) {
        adminSelect.innerHTML = `
            <option value="">Select Category</option>

            ${categoriesCache.map(category => `
                <option value="${category.id}">
                    ${escapeHTML(category.category_name)}
                </option>
            `).join("")}
        `;
    }

    const categoryContainer = document.querySelector(
        "#categories, #category-list, .category-list"
    );

    if (categoryContainer) {
        categoryContainer.innerHTML = `
            <button type="button"
                class="category-btn active"
                data-category="all">
                All
            </button>

            ${categoriesCache.map(category => `
                <button type="button"
                    class="category-btn"
                    data-category="${escapeHTML(category.category_name)}">
                    ${escapeHTML(category.category_name)}
                </button>
            `).join("")}
        `;

        categoryContainer.querySelectorAll(".category-btn")
            .forEach(button => {
                button.addEventListener("click", () => {
                    selectedCategory = button.dataset.category;

                    categoryContainer.querySelectorAll(".category-btn")
                        .forEach(btn => btn.classList.remove("active"));

                    button.classList.add("active");

                    renderProducts();
                });
            });
    }

    const filter = document.querySelector(
        "#category-filter, #categoryFilter"
    );

    if (filter) {
        filter.innerHTML = `
            <option value="all">All Categories</option>

            ${categoriesCache.map(category => `
                <option value="${escapeHTML(category.category_name)}">
                    ${escapeHTML(category.category_name)}
                </option>
            `).join("")}
        `;

        filter.value = selectedCategory;

        filter.onchange = function () {
            selectedCategory = this.value;
            renderProducts();
        };
    }

    // SHOP SIDEBAR CATEGORY FILTERS

    const sidebar = document.querySelector(".filters");

    if (sidebar) {
        const heading = sidebar.querySelector("h3");

        if (heading) {
            const oldContainer = document.getElementById(
                "dynamic-category-filters"
            );

            if (oldContainer) {
                oldContainer.remove();
            }

            const checkboxContainer = document.createElement("div");

            checkboxContainer.id = "dynamic-category-filters";

            checkboxContainer.innerHTML = categoriesCache.map(category => `
                <label>
                    <input type="checkbox"
                        value="${escapeHTML(category.category_name)}"
                        onchange="filterProducts()">
                    ${escapeHTML(category.category_name)}
                </label>
            `).join("");

            heading.after(checkboxContainer);

            sidebar.querySelectorAll(
                'label:has(input[type="checkbox"])'
            ).forEach(label => {
                if (label.parentElement !== checkboxContainer) {
                    label.remove();
                }
            });
        }
    }
}

// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {
    try {
        const data = await apiRequest(API_URL);

        productsCache = getArray(data);

        console.log("Products Loaded:", productsCache);

        renderProducts();
        renderAdminProducts();

    } catch (error) {
        console.error("Product Error:", error);

        document.querySelectorAll(
            "#featured-products, #all-products, #products, #product-list, #products-grid, .products-grid, #admin-products"
        ).forEach(container => {
            container.innerHTML =
                "<p>Products could not be loaded.</p>";
        });
    }
}

// ==========================================
// PRODUCT CARD HTML
// ==========================================

function createProductCard(product) {

    const name = product.title || product.name || "Art Product";
    const image = getImage(product.image);
    const category = getCategoryName(product);
    const description = product.description || "Beautiful artwork for your home.";
    const price = product.price || 0;

    const stock = Number(product.stock);

    const stockText = product.stock !== undefined && product.stock !== null
        ? (stock > 0 ? "In Stock" : "Out of Stock")
        : "";

    return `
        <div class="product-card">

            <div class="product-image">

                <span class="product-image-label">
                    CHUMBAK ART
                </span>

                <button
                    type="button"
                    class="heart"
                    aria-label="Favorite product">
                    ♡
                </button>

                ${
                    image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(name)}"
                            loading="lazy"
                            onerror="this.style.display='none'; this.parentElement.classList.add('image-missing');">
                    `
                    : `
                        <div class="image-placeholder">
                            ✿
                        </div>
                    `
                }

            </div>

            <div class="product-info">

                <div class="product-category">
                    ${escapeHTML(category || "ART COLLECTION")}
                </div>

                <h3>${escapeHTML(name)}</h3>

                <p class="product-description">
                    ${escapeHTML(description)}
                </p>

                <div class="product-price-row">
                    <span class="price">
                        ₹${escapeHTML(price)}
                    </span>
                </div>

                ${
                    stockText
                    ? `
                        <div class="product-stock">
                            <span class="${stock > 0 ? "in-stock" : "out-stock"}">
                                ● ${escapeHTML(stockText)}
                            </span>
                        </div>
                    `
                    : ""
                }

                <div class="product-actions">

                    <button
                        type="button"
                        class="small-btn product-order-btn"
                        onclick="orderProduct('${encodeURIComponent(name)}')">
                        Order on WhatsApp
                    </button>

                </div>

            </div>

        </div>
    `;
}

// ==========================================
// RENDER CUSTOMER PRODUCTS
// ==========================================

function renderProducts() {

    const container = document.querySelector(
        "#featured-products, #all-products, #products, #product-list, #products-grid, .products-grid"
    );

    if (!container) return;

    const searchInput = document.querySelector(
        "#search, #searchInput, #product-search"
    );

    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const checkedCategories = [
        ...document.querySelectorAll(
            '.filters input[type="checkbox"]:checked'
        )
    ].map(input => input.value.toLowerCase());

    const priceFilter = document.getElementById("price-filter");

    const maxPrice = priceFilter && priceFilter.value !== "all"
        ? Number(priceFilter.value)
        : Infinity;

    let filteredProducts = productsCache.filter(product => {

        const category = getCategoryName(product).toLowerCase();

        const categoryMatch =
            selectedCategory === "all" ||
            category === selectedCategory.toLowerCase();

        const checkboxMatch =
            checkedCategories.length === 0 ||
            checkedCategories.includes(category);

        const name = product.title || product.name || "";

        const searchMatch =
            String(name).toLowerCase().includes(search);

        const priceMatch =
            Number(product.price) <= maxPrice;

        return categoryMatch &&
               checkboxMatch &&
               searchMatch &&
               priceMatch;
    });

    const sortFilter = document.getElementById("sort-filter");

    if (sortFilter) {
        if (sortFilter.value === "low") {
            filteredProducts.sort(
                (a, b) => Number(a.price) - Number(b.price)
            );
        }

        if (sortFilter.value === "high") {
            filteredProducts.sort(
                (a, b) => Number(b.price) - Number(a.price)
            );
        }
    }

    const resultCount = document.getElementById("result-count");

    if (resultCount) {
        resultCount.textContent =
            `${filteredProducts.length} Products Found`;
    }

    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Products Found</h3>
                <p>Try another category or search.</p>
            </div>
        `;
        return;
    }

    const displayProducts =
        container.id === "featured-products"
            ? filteredProducts.slice(0, 4)
            : filteredProducts;

    container.innerHTML = displayProducts
        .map(product => createProductCard(product))
        .join("");
}

// ==========================================
// SHOP FILTER FUNCTION
// ==========================================

function filterProducts() {
    renderProducts();
}

// ==========================================
// ADMIN ADD PRODUCT
// ==========================================

function setupAddProduct() {

    const form = document.getElementById("add-product-form");

    if (!form) return;

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("art-name").value.trim();
        const price = document.getElementById("art-price").value;
        const category = document.getElementById("art-category").value;
        const description = document.getElementById("art-description").value;
        const stock = document.getElementById("art-stock").value;
        const image = document.getElementById("art-image").files[0];

        if (!name || !price || !category || !image) {
            alert("Please fill all required fields.");
            return;
        }

        const formData = new FormData();

        formData.append("title", name);
        formData.append("price", price);
        formData.append("category_id", category);
        formData.append("description", description);
        formData.append("stock", stock || 0);
        formData.append("image", image);

        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Adding Product...";
        }

        try {
            const data = await apiRequest(API_URL + "/add", {
                method: "POST",
                body: formData
            });

            alert(data.message || "Product Added Successfully!");

            form.reset();

            await loadProducts();

        } catch (error) {
            console.error("Add Product Error:", error);
            alert("Product Add Failed: " + error.message);

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "＋ Add Artwork";
            }
        }
    });
}

// ==========================================
// ADMIN RENDER PRODUCTS
// ==========================================

function renderAdminProducts() {

    const container = document.getElementById("admin-products");

    if (!container) return;

    const count = document.getElementById("admin-product-count");

    if (count) {
        count.textContent = productsCache.length;
    }

    if (productsCache.length === 0) {
        container.innerHTML = "<p>No artwork added yet.</p>";
        return;
    }

    container.innerHTML = productsCache.map(product => {

        const name = product.title || product.name || "Art Product";
        const image = getImage(product.image);

        return `
            <div class="admin-product-card">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(name)}"
                    style="width:90px;height:90px;object-fit:cover;">

                <div class="admin-product-info">

                    <h3>${escapeHTML(name)}</h3>

                    <p>Category: ${escapeHTML(getCategoryName(product))}</p>

                    <p>Price: ₹${escapeHTML(product.price)}</p>

                    <p>Stock: ${escapeHTML(product.stock)}</p>

                    <button
                        type="button"
                        class="btn btn-pink"
                        onclick="deleteProduct(${Number(product.id)})">
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}

// ==========================================
// ADMIN DELETE PRODUCT
// ==========================================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
        const data = await apiRequest(
            API_URL + "/delete/" + id,
            {
                method: "DELETE"
            }
        );

        alert(data.message || "Product Deleted Successfully!");

        await loadProducts();

    } catch (error) {
        console.error("Delete Error:", error);
        alert("Delete Failed: " + error.message);
    }
}

// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    const searchInput = document.querySelector(
        "#search, #searchInput, #product-search"
    );

    if (searchInput) {
        searchInput.addEventListener("input", renderProducts);
    }
}

// ==========================================
// WHATSAPP ORDER
// ==========================================

function orderProduct(encodedName) {

    const name = decodeURIComponent(encodedName);

    const message =
        `Hello! I want to order ${name} from Chumbak Art.`;

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// ==========================================
// INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    setupAddProduct();

    setupSearch();

    await loadCategories();

    await loadProducts();

    console.log("Chumbak Art Website Loaded Successfully!");

});
