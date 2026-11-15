
/* ==========================================
   CHUMBAK ART - ADMIN DASHBOARD
   FRONTEND + BACKEND INTEGRATION
========================================== */

const API_BASE_URL = "https://kiyshil-arts-1.onrender.com";

const API = API_BASE_URL + "/api";
const UPLOAD_URL = API_BASE_URL + "/uploads/";
const API_URL = API_BASE_URL + "/api/auth/admin-login";

// ==========================================
// API HELPER
// ==========================================

async function apiRequest(endpoint, options = {}) {
    const response = await fetch(API + endpoint, options);

    let result;

    try {
        result = await response.json();
    } catch {
        throw new Error("Server returned invalid response");
    }

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "API request failed");
    }

    return result;
}

function getArray(result) {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result.products)) return result.products;
    return [];
}

// ==========================================
// HTML SAFETY
// ==========================================

function safe(value) {
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

function productImage(product) {
    const image = product.image ||
        product.image_url ||
        product.product_image ||
        "";

    if (!image) return "";

    if (image.startsWith("http")) return image;

return UPLOAD_URL + String(image).replace(/^\/+/, "");
}

// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadAdminProducts() {
    const container = document.getElementById("admin-products");

    try {
        container.innerHTML = "Loading products...";

        const result = await apiRequest("/products");

        products = getArray(result);

        displayAdminProducts();

        const count = document.getElementById(
            "admin-product-count"
        );

        if (count) {
            count.textContent = products.length;
        }

    } catch (error) {
        console.error(error);

        container.innerHTML =
            `<p>Products load nahi hue: ${safe(error.message)}</p>`;
    }
}

let products = [];

// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayAdminProducts() {
    const container = document.getElementById("admin-products");

    if (!products.length) {
        container.innerHTML = "<p>No artwork added yet.</p>";
        return;
    }

    container.innerHTML = products.map(product => {
        const id = Number(product.id);
        const image = productImage(product);

        return `
            <div class="admin-product-item"
                 style="display:flex;align-items:center;gap:15px;
                 padding:15px;border-bottom:1px solid #ddd;
                 flex-wrap:wrap;">

                ${image ? `
                    <img src="${safe(image)}"
                         alt="${safe(product.name)}"
                         style="width:80px;height:80px;
                         object-fit:cover;border-radius:8px;"
                         onerror="this.style.display='none'">
                ` : ""}

                <div style="flex:1;min-width:150px;">
                    <h3>${safe(product.name)}</h3>

                    <p>Price: ₹${safe(product.price)}</p>

                    <p>Category:
                        ${safe(product.category_name ||
                            product.category || "")}
                    </p>

                    <p>Stock: ${safe(product.stock ?? 0)}</p>
                </div>

                <button class="btn btn-outline"
                        onclick="editAdminProduct(${id})">
                    Edit
                </button>

                <button class="btn btn-pink"
                        onclick="deleteAdminProduct(${id})">
                    Delete
                </button>
            </div>
        `;
    }).join("");
}

// ==========================================
// ADD PRODUCT
// ==========================================

async function addAdminProduct(event) {
    event.preventDefault();

    const form = document.getElementById("add-product-form");

    const name = document.getElementById("art-name").value.trim();
    const price = document.getElementById("art-price").value;
    const category = document.getElementById("art-category").value;
    const image = document.getElementById("art-image").files[0];
    const description = document.getElementById("art-description").value.trim();
    const stock = document.getElementById("art-stock").value;

    if (!name || !price || !category || !image) {
        alert("Please fill all required fields!");
        return;
    }

    if (!image.type.startsWith("image/")) {
        alert("Please select a valid image!");
        return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("image", image);

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Adding...";

        const result = await apiRequest("/products/add", {
            method: "POST",
            body: formData
        });

        alert(result.message || "Artwork added successfully!");

        form.reset();

        await loadAdminProducts();

    } catch (error) {
        console.error("Add Product Error:", error);
        alert("Product add failed: " + error.message);

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "＋ Add Artwork";
    }
}

// ==========================================
// EDIT PRODUCT
// ==========================================

async function editAdminProduct(id) {
    const product = products.find(
        item => Number(item.id) === Number(id)
    );

    if (!product) return;

    const name = prompt("Artwork Name:", product.name || "");
    if (name === null) return;

    const price = prompt("Price:", product.price || "");
    if (price === null) return;

    const description = prompt(
        "Description:",
        product.description || ""
    );
    if (description === null) return;

    const stock = prompt("Available Stock:", product.stock ?? 0);
    if (stock === null) return;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);

    try {
        await apiRequest(`/products/update/${id}`, {
            method: "PUT",
            body: formData
        });

        alert("Artwork updated successfully!");

        await loadAdminProducts();

    } catch (error) {
        alert("Update failed: " + error.message);
    }
}

// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteAdminProduct(id) {
    if (!confirm("Are you sure you want to delete this artwork?")) {
        return;
    }

    try {
        await apiRequest(`/products/delete/${id}`, {
            method: "DELETE"
        });

        alert("Artwork deleted successfully!");

        await loadAdminProducts();

    } catch (error) {
        alert("Delete failed: " + error.message);
    }
}

// ==========================================
// INITIALIZE ADMIN DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("add-product-form");

    if (form) {
        form.addEventListener("submit", addAdminProduct);
    }

    loadAdminProducts();

    console.log("Chumbak Art Admin Dashboard Initialized!");
});
