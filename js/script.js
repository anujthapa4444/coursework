// DOM helper
function get(id) {
  return document.getElementById(id);
}

// Browser alert
function popup(msg) {
  alert(msg);
}

// Toggle visibility
function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
}

// Hide element
function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
}


// ===== PRODUCT POPUP =====

// Product details popup
function showProduct(card) {
  let modal = get("productModal");
  let img = get("modalProductImage");
  let name = get("modalProductName");
  let price = get("modalProductPrice");
  let desc = get("modalProductDescription");

  if (!modal || !img || !name || !price || !desc) return;

  let cardImg = card.querySelector("img");
  let cardName = card.querySelector("h3");
  let cardPrice = card.querySelector("strong");
  let cardDesc = card.querySelectorAll("p");

  // Extract description
  let descText = "";
  if (cardDesc.length > 1) {
    descText = cardDesc[1].textContent.trim();
  }

  // Remove price symbols
  let priceNum = "";
  if (cardPrice) {
    priceNum = cardPrice.textContent.replace(/[^0-9.]/g, "");
  }

  // Populate modal fields
  img.src = cardImg ? cardImg.src : "";
  img.alt = cardImg ? cardImg.alt : "Product";
  name.textContent = cardName ? cardName.textContent : "";
  price.textContent = cardPrice ? "Price: " + cardPrice.textContent : "";
  desc.textContent = descText;

  // Store for cart
  modal.dataset.productName = cardName ? cardName.textContent : "";
  modal.dataset.productPrice = priceNum;

  show(modal);
}

// Close product modal
function hideProduct() {
  hide(get("productModal"));
}

// Attach modal listeners
function attachProductPopups() {
  let cards = document.querySelectorAll(".product-card");
  let modal = get("productModal");
  let closeBtn = get("productModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (e) {
      let btn = e.target.closest(".btn");
      if (btn) return;
      showProduct(this);
    });
  }

  closeBtn.addEventListener("click", hideProduct);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideProduct();
  });
}

// Modal add button
function attachProductCartBtn() {
  let btn = get("modalAddToCartBtn");
  let modal = get("productModal");

  if (!btn || !modal) return;

  btn.addEventListener("click", function () {
    let name = modal.dataset.productName;
    let price = modal.dataset.productPrice;
    if (name && price) {
      addCart(name, price);
    }
  });
}


// ===== BLOG POPUP =====

// Blog modal popup
function showBlog(card) {
  let modal = get("blogModal");
  let img = get("modalBlogImage");
  let topic = get("modalBlogTopic");
  let title = get("modalBlogTitle");
  let summary = get("modalBlogSummary");
  let detail = get("modalBlogDetail");
  let tip = get("modalBlogTip");

  if (!modal || !img || !topic || !title || !summary || !detail || !tip) return;

  let cardImg = card.querySelector("img");
  let cardTopic = card.querySelector(".badge");
  let cardTitle = card.querySelector("h3");
  let cardSummary = card.querySelector("p");

  img.src = cardImg ? cardImg.src : "";
  img.alt = cardImg ? cardImg.alt : "Blog";
  topic.textContent = cardTopic ? cardTopic.textContent : "";
  title.textContent = cardTitle ? cardTitle.textContent : "";
  summary.textContent = cardSummary ? cardSummary.textContent : "";
  detail.textContent = card.getAttribute("data-detail") || "";
  tip.textContent = card.getAttribute("data-tip") || "";

  show(modal);
}

// Close blog modal
function hideBlog() {
  hide(get("blogModal"));
}

// Attach blog listeners
function attachBlogPopups() {
  let cards = document.querySelectorAll(".blog-topic");
  let modal = get("blogModal");
  let closeBtn = get("blogModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      showBlog(this);
    });
  }

  closeBtn.addEventListener("click", hideBlog);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideBlog();
  });
}

// Close all modals
function attachEscape() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideProduct();
      hideBlog();
      hideTeam();
    }
  });
}


// Shopping cart storage
let cart = [];

// Retrieve cart
function getCart() {
  return cart;
}

// Update cart
function saveCart(items) {
  cart = items;
}

// Empty cart
function clearCart() {
  saveCart([]);
}

// Find item index
function findItem(name) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) return i;
  }
  return -1;
}

// Calculate totals
function getTotal(items) {
  let total = { price: 0, qty: 0 };
  for (let i = 0; i < items.length; i++) {
    total.price = total.price + (items[i].price * items[i].qty);
    total.qty = total.qty + items[i].qty;
  }
  return total;
}

// Add item
function addCart(name, price) {
  let c = getCart();
  let idx = findItem(name);

  if (idx === -1) {
    c.push({ name: name, price: Number(price), qty: 1 });
  } else {
    c[idx].qty = c[idx].qty + 1;
  }

  saveCart(c);
  alertMsg(name + " added!");
  drawCart();
  drawSidebar();
  drawDrawer();
}

// Adjust quantity
function changeQty(name, change) {
  let c = getCart();
  let idx = findItem(name);

  if (idx === -1) return;

  c[idx].qty = c[idx].qty + change;

  if (c[idx].qty <= 0) {
    c.splice(idx, 1);
  }

  saveCart(c);
  drawCart();
  drawSidebar();
  drawDrawer();
}


// ===== DRAW CART ON PAGE =====

// Render main table
function drawCart() {
  let body = get("cartBody") || get("estimateBody");
  let totalEl = get("cartTotal") || get("estimateTotal");
  let countEl = get("cartItems") || get("estimateItems");

  if (!body || !totalEl || !countEl) return;

  let c = getCart();
  body.innerHTML = "";

  if (c.length === 0) {
    body.innerHTML = '<tr><td colspan="4">Cart is empty.</td></tr>';
    totalEl.textContent = "NPR 0";
    countEl.textContent = "0";
    return;
  }

  for (let i = 0; i < c.length; i++) {
    let item = c[i];
    let lineTotal = item.price * item.qty;
    body.innerHTML += "<tr><td>" + item.name + "</td><td>NPR " + item.price + "</td><td>" + item.qty + "</td><td>NPR " + lineTotal + "</td></tr>";
  }

  let t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);
}

// Render sidebar
function drawSidebar() {
  let body = get("sidebarCartBody");
  let totalEl = get("sidebarCartTotal");
  let countEl = get("sidebarCartItems");

  if (!body || !totalEl || !countEl) return;

  let c = getCart();
  body.innerHTML = "";

  if (c.length === 0) {
    body.innerHTML = '<tr><td colspan="2">Cart empty</td></tr>';
    totalEl.textContent = "NPR 0";
    countEl.textContent = "0";
    return;
  }

  for (let i = 0; i < c.length; i++) {
    body.innerHTML += "<tr><td>" + c[i].name + "</td><td>" + c[i].qty + "</td></tr>";
  }

  let t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);
}

// Render drawer panel
function drawDrawer() {
  let body = get("drawerCartBody");
  let totalEl = get("drawerCartTotal");
  let countEl = get("drawerCartItems");
  let shopBtn = get("shopNowBtn");
  let clearBtn = get("clearDrawerCartBtn");

  if (!body || !totalEl || !countEl) return;

  let c = getCart();
  body.innerHTML = "";

  if (c.length === 0) {
    body.innerHTML = '<tr><td colspan="2">Empty cart.</td></tr>';
    totalEl.textContent = "NPR 0";
    countEl.textContent = "0";
    if (shopBtn) shopBtn.style.display = "block";
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  if (shopBtn) shopBtn.style.display = "none";
  if (clearBtn) clearBtn.style.display = "block";

  for (let i = 0; i < c.length; i++) {
    let item = c[i];
    body.innerHTML += "<tr><td>" + item.name + "</td><td style='text-align: center;'><button class='qty-btn qty-minus' data-item='" + item.name + "'>−</button> " + item.qty + " <button class='qty-btn qty-plus' data-item='" + item.name + "'>+</button></td></tr>";
  }

  let t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);

  attachQtyBtns();
}

// Qty +/- listeners
function attachQtyBtns() {
  let plus = document.querySelectorAll(".qty-plus");
  let minus = document.querySelectorAll(".qty-minus");

  for (let i = 0; i < plus.length; i++) {
    plus[i].addEventListener("click", function () {
      let name = this.getAttribute("data-item");
      changeQty(name, 1);
    });
  }

  for (let i = 0; i < minus.length; i++) {
    minus[i].addEventListener("click", function () {
      let name = this.getAttribute("data-item");
      changeQty(name, -1);
    });
  }
}


// ===== CART BUTTONS =====

// Slide drawer in
function openDrawer() {
  let drawer = get("cartDrawer");
  let backdrop = get("cartDrawerBackdrop");
  if (!drawer || !backdrop) return;

  drawDrawer();
  drawer.classList.add("open");
  backdrop.classList.add("visible");
}

// Slide drawer out
function closeDrawer() {
  let drawer = get("cartDrawer");
  let backdrop = get("cartDrawerBackdrop");
  if (!drawer || !backdrop) return;

  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
}

// Navigate to products
function goShop() {
  let path = window.location.pathname;
  if (path.indexOf("products.html") !== -1) {
    closeDrawer();
    return;
  }
  if (path.includes('/pages/')) {
    window.location.href = 'products.html';
  } else {
    window.location.href = 'pages/products.html';
  }
}

// Cart UI listeners
function attachCartBtns() {
  let openBtn = get("openCartBtn");
  let closeBtn = get("closeCartDrawer");
  let backdrop = get("cartDrawerBackdrop");
  let clearBtn = get("clearDrawerCartBtn");
  let shopBtn = get("shopNowBtn");

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart();
      drawCart();
      drawSidebar();
      drawDrawer();
      alertMsg("Cart cleared!");
    });
  }

  if (shopBtn) shopBtn.addEventListener("click", goShop);
}

// Product add buttons
function attachAddBtns() {
  let btns = document.querySelectorAll(".add-to-cart-btn");
  if (!btns.length) return;

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      let name = this.getAttribute("data-name");
      let price = this.getAttribute("data-price");
      addCart(name, price);
    });
  }
}

// Clear page buttons
function attachClearBtns() {
  let btn1 = get("clearCartBtn") || get("clearEstimateBtn");
  let btn2 = get("clearSidebarCartBtn");

  if (btn1) {
    btn1.addEventListener("click", function () {
      clearCart();
      drawCart();
      alertMsg("Cart cleared!");
    });
  }

  if (btn2) {
    btn2.addEventListener("click", function () {
      clearCart();
      drawSidebar();
      alertMsg("Cart cleared!");
    });
  }
}


// ===== OTHER STUFF =====

// Display current date
function showDate() {
  let el = get("todayDate");
  if (!el) return;
  el.textContent = new Date().toDateString();
}

// Product category filter
function attachFilter() {
  let filter = get("productFilter");
  if (!filter) return;

  filter.addEventListener("change", function () {
    let selected = filter.value;
    let cards = document.querySelectorAll(".product-card");

    for (let i = 0; i < cards.length; i++) {
      let cat = cards[i].getAttribute("data-category");
      if (selected === "all" || cat === selected) {
        cards[i].style.display = "block";
      } else {
        cards[i].style.display = "none";
      }
    }
  });

  // run filter once
  filter.dispatchEvent(new Event("change"));
}

// Team collapse toggle
function attachTeamToggle() {
  let btn = get("teamToggleBtn");
  let section = get("teamMembersSection");

  if (!btn || !section) return;

  btn.addEventListener("click", function () {
    let hidden = section.hasAttribute("hidden");

    if (hidden) {
      section.removeAttribute("hidden");
      btn.textContent = "Hide Team";
      btn.setAttribute("aria-expanded", "true");
    } else {
      section.setAttribute("hidden", "");
      btn.textContent = "Show Team";
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

// Close team modal
function hideTeam() {
  hide(get("teamMemberModal"));
}

// Member profile modal
function attachTeamPopups() {
  let btns = document.querySelectorAll(".team-member-name-btn");
  let modal = get("teamMemberModal");
  let closeBtn = get("teamMemberModalClose");
  let img = get("teamMemberModalImage");
  let name = get("teamMemberModalName");
  let about = get("teamMemberModalAbout");

  if (!btns.length || !modal || !closeBtn || !img || !name || !about) return;

  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      let memberName = this.getAttribute("data-name") || "";
      let memberAbout = this.getAttribute("data-about") || "";
      let memberPhoto = this.getAttribute("data-photo") || "";

      name.textContent = memberName;
      let skills = memberAbout.split(' Interest:')[0];
      about.textContent = skills;
      img.src = memberPhoto;
      img.alt = memberName;

      show(modal);
    });
  }

  closeBtn.addEventListener("click", hideTeam);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideTeam();
  });
}

// Auto-rotate hero
function startSlider() {
  let hero = document.querySelector(".hero");
  if (!hero) return;

  let pics = [
    "images/hero-bg.png",
    "images/home-bg-2.png",
    "images/home-bg-3.png",
    "images/home-bg-4.png"
  ];

  let idx = 0;

  setInterval(function () {
    idx = idx + 1;
    if (idx >= pics.length) idx = 0;
    hero.style.backgroundImage = 'url("' + pics[idx] + '")';
    hero.style.backgroundPosition = "center";
    hero.style.backgroundSize = "cover";
  }, 2000);
}

// Expand/collapse text
function attachReadMore() {
  let readBtn = get("researchReadMoreBtn");
  let lessBtn = get("researchShowLessBtn");
  let section = get("researchSummarySection");

  if (!readBtn || !lessBtn || !section) return;

  readBtn.addEventListener("click", function () {
    section.removeAttribute("hidden");
    readBtn.style.display = "none";
    lessBtn.style.display = "inline-block";
  });

  lessBtn.addEventListener("click", function () {
    section.setAttribute("hidden", "");
    lessBtn.style.display = "none";
    readBtn.style.display = "inline-block";
  });
}

// Console output
function alertMsg(msg) {
  console.log(msg);
}


// ===== START =====

// Initialize page
function start() {
  showDate();

  // Cart setup
  attachAddBtns();
  attachProductCartBtn();
  attachCartBtns();
  attachClearBtns();

  drawCart();
  drawSidebar();
  drawDrawer();

  // Modals
  attachProductPopups();
  attachBlogPopups();
  attachTeamPopups();
  attachEscape();

  // Features
  attachFilter();

  let welcomeBtn = get("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      popup("Welcome!");
    });
  }
  let submitBtn = get("submit");
  if(submitBtn) {
    submitBtn.addEventListener("click", function () {
      popup("Form submitted!");
    });
  }

  attachTeamToggle();
  startSlider();
  attachReadMore();
}

document.addEventListener("DOMContentLoaded", start);
