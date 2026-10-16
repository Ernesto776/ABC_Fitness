document.addEventListener('DOMContentLoaded', () => {
  // Navigation Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.getElementById('primary-navigation');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';

      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('nav-active');
      document.body.classList.toggle('nav-open');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('nav-active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('nav-active');
        document.body.classList.remove('nav-open');
        navToggle.focus();
      }
    });
  }
});

// Cart and Quantity Management
let totalCartItems = 0;

function adjustQty(button, amount) {
  const container = button.parentElement;
  const qtySpan = container.querySelector('.qty-val');
  let currentQty = parseInt(qtySpan.textContent, 10);
  
  currentQty += amount;
  if (currentQty < 1) currentQty = 1;
  
  qtySpan.textContent = currentQty;
}

function addToCart(button) {
  const card = button.parentElement;
  const qtySpan = card.querySelector('.qty-val');
  const qtyToAdd = parseInt(qtySpan.textContent, 10);
  
  totalCartItems += qtyToAdd;
  const cartDisplay = document.getElementById('cart-count');
  if (cartDisplay) {
    cartDisplay.textContent = totalCartItems;
  }
  
  alert(`Added ${qtyToAdd} item(s) to your cart.`);
}