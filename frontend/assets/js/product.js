
// ==========================================
// CHUMBAK ART - PRODUCTS UTILITIES
// ==========================================

const WHATSAPP_NUMBER = "918263089641";

// Add product to cart utility
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
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Product added to cart!");
}


// Update cart count
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


// WhatsApp order
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

Product: ${product.name}
Price: ₹${product.price}

Please share more details.`;

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}


// Initialize cart count
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});
