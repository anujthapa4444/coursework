// helper so i dont type document.getElementById every time
function get(id) {
  return document.getElementById(id);
}

// Show browser alert
function popup(msg) {
  alert(msg);
}

// Show element on the page
function show(el) {
  if (!el) return;
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
}

// Hide element from the page
function hide(el) {
  if (!el) return;
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
}
// ===== PRODUCT POPUP =====

// Show product details popup
function showProduct(card) {
  var modal = get("productModal");
  var img = get("modalProductImage");
  var name = get("modalProductName");
  var price = get("modalProductPrice");
  var desc = get("modalProductDescription");

  if (!modal || !img || !name || !price || !desc) return;

  var cardImg = card.querySelector("img");
  var cardName = card.querySelector("h3");
  var cardPrice = card.querySelector("strong");
  var cardParagraphs = card.querySelectorAll("p");

  // Get description text from the card
  var descText = "";
  if (cardParagraphs.length > 1) {
    descText = cardParagraphs[1].textContent.trim();
  }

  // Keep only numbers for the price
  var priceNum = "";
  if (cardPrice) {
    priceNum = cardPrice.textContent.replace(/[^0-9.]/g, "");
  }

  // Show data in the popup
  img.src = cardImg ? cardImg.src : "";
  img.alt = cardImg ? cardImg.alt : "Product";
  name.textContent = cardName ? cardName.textContent : "";
  price.textContent = cardPrice ? "Price: " + cardPrice.textContent : "";
  desc.textContent = descText;

  // Save product info for cart
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
  var cards = document.querySelectorAll(".product-card");
  var modal = get("productModal");
  var closeBtn = get("productModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (e) {
      var btn = e.target.closest(".btn");
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
  var btn = get("modalAddToCartBtn");
  var modal = get("productModal");

  if (!btn || !modal) return;

  btn.addEventListener("click", function () {
    var name = modal.dataset.productName;
    var price = modal.dataset.productPrice;
    if (name && price) {
      addCart(name, price);
    }
  });
}


// ===== BLOG POPUP =====

// Blog modal popup
function showBlog(card) {
  var modal = get("blogModal");
  var img = get("modalBlogImage");
  var topic = get("modalBlogTopic");
  var title = get("modalBlogTitle");
  var summary = get("modalBlogSummary");
  var detail = get("modalBlogDetail");
  var tip = get("modalBlogTip");

  if (!modal || !img || !topic || !title || !summary || !detail || !tip) return;

  var cardImg = card.querySelector("img");
  var cardTopic = card.querySelector(".badge");
  var cardTitle = card.querySelector("h3");
  var cardSummary = card.querySelector("p");

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
  var cards = document.querySelectorAll(".blog-topic");
  var modal = get("blogModal");
  var closeBtn = get("blogModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      showBlog(this);
    });
  }

  closeBtn.addEventListener("click", hideBlog);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) hideBlog();
  });
}

// Close popups when the user presses Escape
function attachEscape() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideProduct();
      hideBlog();
      hideTeam();
    }
  });
}

// my shopping cart list (i use var because we learned it in class)
var cart = [];

function getCart() {
  return cart;
}

function saveCart(items) {
  cart = items;
}

function clearCart() {
  saveCart([]);
}

// loop to find if we already have this plant name
function findItem(name) {
  var i;
  for (i = 0; i < cart.length; i = i + 1) {
    if (cart[i].name === name) {
      return i;
    }
  }
  return -1;
}

// Calculate cart totals
function getTotal(items) {
  var total = { price: 0, qty: 0 };
  for (var i = 0; i < items.length; i++) {
    total.price = total.price + (items[i].price * items[i].qty);
    total.qty = total.qty + items[i].qty;
  }
  return total;
}

function addCart(name, price) {
  var c = getCart();
  var idx = findItem(name);

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

function changeQty(name, change) {
  var c = getCart();
  var idx = findItem(name);

  if (idx === -1) {
    return;
  }

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
  var body = get("cartBody") || get("estimateBody");
  var totalEl = get("cartTotal") || get("estimateTotal");
  var countEl = get("cartItems") || get("estimateItems");

  if (!body || !totalEl || !countEl) return;

  var c = getCart();
  body.innerHTML = "";

  if (c.length === 0) {
    body.innerHTML = '<tr><td colspan="4">Cart is empty.</td></tr>';
    totalEl.textContent = "NPR 0";
    countEl.textContent = "0";
    return;
  }

  for (var i = 0; i < c.length; i++) {
    var item = c[i];
    var lineTotal = item.price * item.qty;
    body.innerHTML += "<tr><td>" + item.name + "</td><td>NPR " + item.price + "</td><td>" + item.qty + "</td><td>NPR " + lineTotal + "</td></tr>";
  }

  var t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);
}

// Render sidebar
function drawSidebar() {
  var body = get("sidebarCartBody");
  var totalEl = get("sidebarCartTotal");
  var countEl = get("sidebarCartItems");

  if (!body || !totalEl || !countEl) return;

  var c = getCart();
  body.innerHTML = "";

  if (c.length === 0) {
    body.innerHTML = '<tr><td colspan="2">Cart empty</td></tr>';
    totalEl.textContent = "NPR 0";
    countEl.textContent = "0";
    return;
  }

  for (var i = 0; i < c.length; i++) {
    body.innerHTML += "<tr><td>" + c[i].name + "</td><td>" + c[i].qty + "</td></tr>";
  }

  var t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);
}

// Render drawer panel
function drawDrawer() {
  var body = get("drawerCartBody");
  var totalEl = get("drawerCartTotal");
  var countEl = get("drawerCartItems");
  var shopBtn = get("shopNowBtn");
  var clearBtn = get("clearDrawerCartBtn");

  if (!body || !totalEl || !countEl) return;

  var c = getCart();
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

  for (var i = 0; i < c.length; i++) {
    var item = c[i];
    body.innerHTML += "<tr><td>" + item.name + "</td><td style='text-align: center;'><button class='qty-btn qty-minus' data-item='" + item.name + "'>−</button> " + item.qty + " <button class='qty-btn qty-plus' data-item='" + item.name + "'>+</button></td></tr>";
  }

  var t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);

  attachQtyBtns();
}

// Qty +/- listeners
function attachQtyBtns() {
  var plus = document.querySelectorAll(".qty-plus");
  var minus = document.querySelectorAll(".qty-minus");

  for (var i = 0; i < plus.length; i++) {
    plus[i].addEventListener("click", function () {
      var name = this.getAttribute("data-item");
      changeQty(name, 1);
    });
  }

  for (var i = 0; i < minus.length; i++) {
    minus[i].addEventListener("click", function () {
      var name = this.getAttribute("data-item");
      changeQty(name, -1);
    });
  }
}


// ===== CART BUTTONS =====

// show the cart panel from the right
function openDrawer() {
  var drawer = get("cartDrawer");
  var backdrop = get("cartDrawerBackdrop");
  if (!drawer || !backdrop) {
    return;
  }

  drawDrawer();
  drawer.classList.add("open");
  backdrop.classList.add("visible");
}

// hide cart panel
function closeDrawer() {
  var drawer = get("cartDrawer");
  var backdrop = get("cartDrawerBackdrop");
  if (!drawer || !backdrop) {
    return;
  }

  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
}

// go shop if empty cart
function goShop() {
  var path = window.location.pathname;
  if (path.indexOf("products.html") !== -1) {
    closeDrawer();
    return;
  }
  if (path.indexOf("/pages/") !== -1) {
    window.location.href = "products.html";
  } else {
    window.location.href = "pages/products.html";
  }
}

// click events for cart drawer (i learned this in week 5)
function attachCartBtns() {
  var openBtn = get("openCartBtn");
  var closeBtn = get("closeCartDrawer");
  var backdrop = get("cartDrawerBackdrop");
  var clearBtn = get("clearDrawerCartBtn");
  var shopBtn = get("shopNowBtn");

  // cart is a <a href="#"> now so it looks like other nav links
  if (openBtn) {
    openBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDrawer);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart();
      drawCart();
      drawSidebar();
      drawDrawer();
      alertMsg("Cart cleared!");
    });
  }

  if (shopBtn) {
    shopBtn.addEventListener("click", goShop);
  }
}

// Product add buttons
function attachAddBtns() {
  var btns = document.querySelectorAll(".add-to-cart-btn");
  if (!btns.length) return;

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var name = this.getAttribute("data-name");
      var price = this.getAttribute("data-price");
      addCart(name, price);
    });
  }
}

// Clear page buttons
function attachClearBtns() {
  var btn1 = get("clearCartBtn") || get("clearEstimateBtn");
  var btn2 = get("clearSidebarCartBtn");

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
  var el = get("todayDate");
  if (!el) return;
  el.textContent = new Date().toDateString();
}

// Product category filter
function attachFilter() {
  var filter = get("productFilter");
  if (!filter) return;

  filter.addEventListener("change", function () {
    var selected = filter.value;
    var cards = document.querySelectorAll(".product-card");

    for (var i = 0; i < cards.length; i++) {
      var cat = cards[i].getAttribute("data-category");
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
  var btn = get("teamToggleBtn");
  var section = get("teamMembersSection");

  if (!btn || !section) return;

  btn.addEventListener("click", function () {
    var hidden = section.hasAttribute("hidden");

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
  var btns = document.querySelectorAll(".team-member-name-btn");
  var modal = get("teamMemberModal");
  var closeBtn = get("teamMemberModalClose");
  var img = get("teamMemberModalImage");
  var name = get("teamMemberModalName");
  var about = get("teamMemberModalAbout");

  if (!btns.length || !modal || !closeBtn || !img || !name || !about) return;

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var memberName = this.getAttribute("data-name") || "";
      var memberAbout = this.getAttribute("data-about") || "";
      var memberPhoto = this.getAttribute("data-photo") || "";

      name.textContent = memberName;
      var skills = memberAbout.split(' Interest:')[0];
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
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var pics = [
    "images/hero-bg.png",
    "images/home-bg-2.png",
    "images/home-bg-3.png",
    "images/home-bg-4.png"
  ];

  var idx = 0;

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
  var readBtn = get("researchReadMoreBtn");
  var lessBtn = get("researchShowLessBtn");
  var section = get("researchSummarySection");

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

// Print messages in the browser console
function alertMsg(msg) {
  console.log(msg);
}


// ===== START =====

// Start the page
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

  var welcomeBtn = get("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      popup("Welcome!");
    });
  }
  var submitBtn = get("submit");
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
