const CART_STORAGE_KEY = 'abcFitnessCart';

const CART_SVG_MARKUP =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" ' +
    'class="cart-svg-icon" aria-hidden="true">' +
    '<!--!Font Awesome Free v7.3.1 by @fontawesome - ' +
    'https://fontawesome.com License - https://fontawesome.com/license/free ' +
    'Copyright 2026 Fonticons, Inc.-->' +
    '<path fill="#155ebc" d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 ' +
    '24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 ' +
    '165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 ' +
    '469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 ' +
    '352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 ' +
    '114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 ' +
    '48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 ' +
    '208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 ' +
    '576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 ' +
    '480 384 501.5 384 528C384 554.5 405.5 576 432 576z"/></svg>';

const ITEM_NAME_MAP = {
    'Client2_GroupKickboxing.png': 'Group Kickboxing Session',
    'Client2_GroupPilates.png': 'Group Pilates Session',
    'Client2_GroupYoga.png': 'Group Yoga Session',
    'Client2_IndividualKickboxing.png': 'Individual Kickboxing Session',
    'Client2_IndividualPilates.png': 'Individual Pilates Session',
    'Client2_IndividualYoga.png': 'Individual Yoga Session',
    'Client2_TeeShirt.png': 'ABC Fitness Studio T-Shirt',
    'Client2_WaterBottle.png': 'ABC Fitness Studio Water Bottle',
    'Client2_YogaMat.png': 'ABC Fitness Studio Yoga Mat'
};

const buttonAlerts = [
    {
        selector: '#subscribe',
        message: 'Thank you for subscribing.'
    },
    {
        selector: '#requestBtn',
        message: 'We will reach back to you on your request.'
    },
    {
        selector: '#feedbackBtn',
        message: 'Thank you for your message.'
    }
];

let cartItems = loadCartFromStorage();

// Load saved cart items from sessionStorage if available
function loadCartFromStorage() {
    try {
        const stored = sessionStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Persist current cart items to sessionStorage
function saveCartToStorage() {
    try {
        sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
        // Ignores storage errors if in a restricted environment
    }
}

// Calculate total item quantity across the cart
function getTotalCartCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

// Check whether the current page is the Gallery & Shop page
function isGalleryShopPage() {
    const path = window.location.pathname.toLowerCase();
    return path.includes('gallery-shop') || Boolean(
        document.querySelector('.gallery-grid')
    );
}

// Update the cart counter badge in the header
function updateCartCountDisplay() {
    const cartDisplay = document.getElementById('cart-count');
    if (cartDisplay) {
        cartDisplay.textContent = getTotalCartCount();
    }
}

// Replace Reserve a Session button with SVG cart when the cart has over 0 products
function syncHeaderCartButton() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) {
        return;
    }

    const totalCount = getTotalCartCount();
    const onShopPage = isGalleryShopPage();

    if (onShopPage || totalCount > 0) {
        let cartBtn = document.getElementById('view-cart-btn');
        if (!cartBtn) {
            navActions.innerHTML =
                '<button type="button" id="view-cart-btn" ' +
                'class="cart-icon-btn" onclick="openCartModal()" ' +
                'aria-label="View shopping cart">' +
                CART_SVG_MARKUP +
                '<span id="cart-count" class="cart-badge">' +
                totalCount +
                '</span></button>';
        } else {
            updateCartCountDisplay();
        }
        ensureCartModalExists();
    } else {
        navActions.innerHTML =
            '<a href="gallery-shop.html" class="btn btn-primary">' +
            'Reserve a Session</a>';
    }
}

// Ensure the cart modal exists in the DOM so it can open on any page
function ensureCartModalExists() {
    if (document.getElementById('cart-modal')) {
        return;
    }

    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'cart-modal';
    modalWrapper.className = 'modal-overlay';
    modalWrapper.setAttribute('role', 'dialog');
    modalWrapper.setAttribute('aria-modal', 'true');
    modalWrapper.setAttribute('aria-labelledby', 'cart-modal-title');
    modalWrapper.setAttribute('aria-hidden', 'true');

    modalWrapper.innerHTML =
        '<div class="modal-content card">' +
        '<div class="modal-header">' +
        '<h2 id="cart-modal-title">Your Shopping Cart</h2>' +
        '<button type="button" class="modal-close" ' +
        'onclick="closeCartModal()" aria-label="Close cart modal">' +
        '&times;</button>' +
        '</div>' +
        '<div id="cart-items-container" class="modal-body">' +
        '<p class="empty-cart-msg">Your cart is empty.</p>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-secondary" ' +
        'onclick="clearCart()">Clear Cart</button>' +
        '<button type="button" class="btn btn-primary" ' +
        'onclick="processOrder()">Process Order</button>' +
        '</div>' +
        '</div>';

    modalWrapper.addEventListener('click', (event) => {
        if (event.target === modalWrapper) {
            closeCartModal();
        }
    });

    document.body.appendChild(modalWrapper);
}

// Resolve a item name from a card or button element
function resolveItemName(button, card) {
    if (button && button.dataset && button.dataset.item) {
        return button.dataset.item;
    }

    if (card) {
        const heading = card.querySelector('h2, h3');
        if (heading && heading.textContent.trim()) {
            return heading.textContent.trim();
        }

        const img = card.querySelector('img');
        if (img) {
            const src = img.getAttribute('src') || '';
            for (const [fileName, label] of Object.entries(ITEM_NAME_MAP)) {
                if (src.includes(fileName)) {
                    return label;
                }
            }
            if (img.alt) {
                return img.alt;
            }
        }
    }

    return 'Fitness Studio Item';
}

// Adjust the quantity selector value on a product/session card
function adjustQty(button, amount) {
    const container = button.parentElement;
    if (!container) {
        return;
    }

    const qtySpan = container.querySelector('.qty-val');
    if (!qtySpan) {
        return;
    }

    let currentQty = parseInt(qtySpan.textContent, 10) || 1;
    currentQty += amount;
    if (currentQty < 1) {
        currentQty = 1;
    }

    qtySpan.textContent = currentQty;
}

// Increase or decrease the quantity of an item inside the cart modal
function changeCartItemQty(index, amount) {
    if (index < 0 || index >= cartItems.length) {
        return;
    }

    cartItems[index].quantity += amount;
    if (cartItems[index].quantity <= 0) {
        cartItems.splice(index, 1);
    }

    saveCartToStorage();
    syncHeaderCartButton();
    updateCartCountDisplay();
    renderCartItems();
}

// Add the selected card item to the shopping cart and notify the user
function addToCart(button) {
    const card = button.closest('.card') || button.parentElement;
    const qtySpan = card ? card.querySelector('.qty-val') : null;
    const qtyToAdd = qtySpan ? parseInt(qtySpan.textContent, 10) || 1 : 1;
    const itemName = resolveItemName(button, card);

    const existingItem = cartItems.find((item) => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += qtyToAdd;
    } else {
        cartItems.push({
            name: itemName,
            quantity: qtyToAdd
        });
    }

    if (qtySpan) {
        qtySpan.textContent = 1;
    }

    saveCartToStorage();
    syncHeaderCartButton();
    updateCartCountDisplay();
    renderCartItems();

    alert('Item added to the cart.');
}

// Render the current cart items inside the View Cart modal window
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (cartItems.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-cart-msg';
        emptyMsg.textContent = 'Your cart is empty.';
        container.appendChild(emptyMsg);
        return;
    }

    const list = document.createElement('ul');
    list.className = 'cart-item-list';

    cartItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'cart-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'cart-item-name';
        nameSpan.textContent = item.name;

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'qty-controls cart-modal-qty';

        const minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.className = 'qty-btn';
        minusBtn.textContent = '-';
        minusBtn.setAttribute(
            'aria-label',
            `Decrease quantity for ${item.name}`
        );
        minusBtn.addEventListener('click', () => {
            changeCartItemQty(index, -1);
        });

        const qtySpan = document.createElement('span');
        qtySpan.className = 'qty-val';
        qtySpan.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'qty-btn';
        plusBtn.textContent = '+';
        plusBtn.setAttribute(
            'aria-label',
            `Increase quantity for ${item.name}`
        );
        plusBtn.addEventListener('click', () => {
            changeCartItemQty(index, 1);
        });

        controlsDiv.appendChild(minusBtn);
        controlsDiv.appendChild(qtySpan);
        controlsDiv.appendChild(plusBtn);

        listItem.appendChild(nameSpan);
        listItem.appendChild(controlsDiv);
        list.appendChild(listItem);
    });

    container.appendChild(list);
}

// Open the View Cart modal window
function openCartModal() {
    ensureCartModalExists();
    const modal = document.getElementById('cart-modal');
    if (!modal) {
        return;
    }

    renderCartItems();
    modal.classList.add('modal-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
}

// Close the View Cart modal window
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) {
        return;
    }

    modal.classList.remove('modal-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
}

// Clear all items currently in the cart
function clearCart() {
    cartItems = [];
    saveCartToStorage();
    syncHeaderCartButton();
    updateCartCountDisplay();
    renderCartItems();
    alert('Cart cleared.');
}

// Process the current order, alert the user, and clear the cart
function processOrder() {
    alert('Thank you for your order.');
    clearCart();
    closeCartModal();
}

// Initialize navigation and modal event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    syncHeaderCartButton();
    updateCartCountDisplay();
    renderCartItems();

    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.getElementById('primary-navigation');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded =
                navToggle.getAttribute('aria-expanded') === 'true';

            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('nav-active');
            document.body.classList.toggle('nav-open');
        });
    }

    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (mainNav && mainNav.classList.contains('nav-active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('nav-active');
                document.body.classList.remove('nav-open');
                navToggle.focus();
            }

            const activeModal = document.getElementById('cart-modal');
            if (activeModal && activeModal.classList.contains('modal-active')) {
                closeCartModal();
            }
        }
    });
});

buttonAlerts.forEach(({ selector, message }) => {
    const btn = document.querySelector(selector);
    if (btn) {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            alert(message);
        });
    }
});