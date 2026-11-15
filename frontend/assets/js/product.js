
// ==========================================
// CHUMBAK ART - PRODUCTS UTILITIES
// ==========================================

const WHATSAPP_NUMBER = "918263089641";

// ==========================================
// GET PRODUCT NAME
// ==========================================

function getProductTitle(product) {
    return product.title || product.name || "Art Product";
}

// ==========================================
// ADD PRODUCT TO CART
// ==========================================

function addToCart(productId) {

    const product = productsCache.find(
        p => String(p.id) === String(productId)
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    const existing = cart.find(
        item => String(item.id) === String(productId)
    );

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: getProductTitle(product),
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Product added to cart!");
}

// ==========================================
// UPDATE CART COUNT
// ==========================================

function updateCartCount() {

    const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    const count = cart.reduce(
        (total, item) => total + (Number(item.quantity) || 1),
        0
    );

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = count;
    }
}

// ==========================================
// WHATSAPP ORDER
// ==========================================

function orderOnWhatsApp(productId) {

    const product = productsCache.find(
        p => String(p.id) === String(productId)
    );

    if (!product) {
        alert("Product not found!");
        return;
    }

    const message = `Hello Chumbak Art!

I want to order:

Product: ${getProductTitle(product)}
Price: ₹${product.price}

Please share more details.`;

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

// ==========================================
// INITIALIZE CART
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});
