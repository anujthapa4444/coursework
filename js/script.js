/**
 * UrbanSprout — site behaviour (modals, cart, filters, etc.)
 * One file is easier for coursework: every page loads this script.
 */

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Returns the element with the given id, or null. */
function get(id) {
  return document.getElementById(id);
}

/** Browser alert dialog. */
function popup(msg) {
  alert(msg);
}

/** Shows a modal or panel (removes .hidden, updates aria). */
function show(el) {
  if (!el) {
    return;
  }
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
}

/** Hides a modal or panel. */
function hide(el) {
  if (!el) {
    return;
  }
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
}

// ---------------------------------------------------------------------------
// Product modal (Products page)
// ---------------------------------------------------------------------------

function showProduct(card) {
  var modal = get("productModal");
  var img = get("modalProductImage");
  var name = get("modalProductName");
  var price = get("modalProductPrice");
  var desc = get("modalProductDescription");

  if (!modal || !img || !name || !price || !desc) {
    return;
  }

  var cardImg = card.querySelector("img");
  var cardName = card.querySelector("h3");
  var cardPrice = card.querySelector("strong");
  var cardParagraphs = card.querySelectorAll("p");

  // Second <p> on the card is treated as the long description.
  var descText = "";
  if (cardParagraphs.length > 1) {
    descText = cardParagraphs[1].textContent.trim();
  }

  // Strip currency text so we can store a numeric price for the cart.
  var priceNum = "";
  if (cardPrice) {
    priceNum = cardPrice.textContent.replace(/[^0-9.]/g, "");
  }

  img.src = cardImg ? cardImg.src : "";
  img.alt = cardImg ? cardImg.alt : "Product";
  name.textContent = cardName ? cardName.textContent : "";
  price.textContent = cardPrice ? "Price: " + cardPrice.textContent : "";
  desc.textContent = descText;

  modal.dataset.productName = cardName ? cardName.textContent : "";
  modal.dataset.productPrice = priceNum;

  show(modal);
}

function hideProduct() {
  hide(get("productModal"));
}

function attachProductPopups() {
  var cards = document.querySelectorAll(".product-card");
  var modal = get("productModal");
  var closeBtn = get("productModalClose");

  if (!cards.length || !modal || !closeBtn) {
    return;
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function (e) {
      // Do not open the modal when the user clicked “Add to cart”.
      var btn = e.target.closest(".btn");
      if (btn) {
        return;
      }
      showProduct(this);
    });
  }

  closeBtn.addEventListener("click", hideProduct);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      hideProduct();
    }
  });
}

function attachProductCartBtn() {
  var btn = get("modalAddToCartBtn");
  var modal = get("productModal");

  if (!btn || !modal) {
    return;
  }

  btn.addEventListener("click", function () {
    var name = modal.dataset.productName;
    var price = modal.dataset.productPrice;
    if (name && price) {
      addCart(name, price);
    }
  });
}

// ---------------------------------------------------------------------------
// Blog modal (Blog page)
// ---------------------------------------------------------------------------

function showBlog(card) {
  var modal = get("blogModal");
  var img = get("modalBlogImage");
  var topic = get("modalBlogTopic");
  var title = get("modalBlogTitle");
  var summary = get("modalBlogSummary");
  var detail = get("modalBlogDetail");
  var tip = get("modalBlogTip");

  if (!modal || !img || !topic || !title || !summary || !detail || !tip) {
    return;
  }

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

function hideBlog() {
  hide(get("blogModal"));
}

function attachBlogPopups() {
  var cards = document.querySelectorAll(".blog-topic");
  var modal = get("blogModal");
  var closeBtn = get("blogModalClose");

  if (!cards.length || !modal || !closeBtn) {
    return;
  }

  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", function () {
      showBlog(this);
    });
  }

  closeBtn.addEventListener("click", hideBlog);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      hideBlog();
    }
  });
}

/** Escape key closes any open modal (safe if a modal is missing from the page). */
function attachEscape() {
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideProduct();
      hideBlog();
    }
  });
}

// ---------------------------------------------------------------------------
// Shopping cart — data
// ---------------------------------------------------------------------------

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

/** Returns index of line with this product name, or -1. */
function findItem(name) {
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      return i;
    }
  }
  return -1;
}

/** Sums price × quantity and counts total units. */
function getTotal(items) {
  var total = { price: 0, qty: 0 };
  for (var i = 0; i < items.length; i++) {
    total.price += items[i].price * items[i].qty;
    total.qty += items[i].qty;
  }
  return total;
}

function addCart(name, price) {
  var c = getCart();
  var idx = findItem(name);

  if (idx === -1) {
    c.push({ name: name, price: Number(price), qty: 1 });
  } else {
    c[idx].qty += 1;
  }

  saveCart(c);
  alertMsg(name + " added!");
  drawDrawer();
}

function changeQty(name, change) {
  var c = getCart();
  var idx = findItem(name);

  if (idx === -1) {
    return;
  }

  c[idx].qty += change;

  if (c[idx].qty <= 0) {
    c.splice(idx, 1);
  }

  saveCart(c);
  drawDrawer();
}

// ---------------------------------------------------------------------------
// Shopping cart — update tables on the page
// ---------------------------------------------------------------------------



/** Sliding cart drawer (all pages). */
function drawDrawer() {
  var body = get("drawerCartBody");
  var totalEl = get("drawerCartTotal");
  var countEl = get("drawerCartItems");
  var shopBtn = get("shopNowBtn");
  var clearBtn = get("clearDrawerCartBtn");

  if (!body || !totalEl || !countEl) {
    return;
  }

  var c = getCart();
  body.innerHTML = "";

  if (c.length === 0) {
    body.innerHTML = '<tr><td colspan="2">Empty cart.</td></tr>';
    totalEl.textContent = "NPR 0";
    countEl.textContent = "0";
    if (shopBtn) {
      shopBtn.style.display = "block";
    }
    if (clearBtn) {
      clearBtn.style.display = "none";
    }
    return;
  }

  if (shopBtn) {
    shopBtn.style.display = "none";
  }
  if (clearBtn) {
    clearBtn.style.display = "block";
  }

  for (var i = 0; i < c.length; i++) {
    var item = c[i];
    body.innerHTML +=
      "<tr><td>" +
      item.name +
      "</td><td style='text-align: center;'>" +
      "<button type='button' class='qty-btn qty-minus' data-item='" +
      item.name +
      "'>−</button> " +
      item.qty +
      " <button type='button' class='qty-btn qty-plus' data-item='" +
      item.name +
      "'>+</button></td></tr>";
  }

  var t = getTotal(c);
  totalEl.textContent = "NPR " + t.price;
  countEl.textContent = String(t.qty);

  attachQtyBtns();
}

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

// ---------------------------------------------------------------------------
// Shopping cart — open / close drawer and “Shop now”
// ---------------------------------------------------------------------------

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

function closeDrawer() {
  var drawer = get("cartDrawer");
  var backdrop = get("cartDrawerBackdrop");
  if (!drawer || !backdrop) {
    return;
  }

  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
}

/**
 * From empty cart: go to Products. Path depends on whether we are under /pages/.
 */
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

function attachCartBtns() {
  var openBtn = get("openCartBtn");
  var closeBtn = get("closeCartDrawer");
  var backdrop = get("cartDrawerBackdrop");
  var clearBtn = get("clearDrawerCartBtn");
  var shopBtn = get("shopNowBtn");

  // Cart link uses href="#" so it matches other nav links; prevent jumping to top.
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
      drawDrawer();
      alertMsg("Cart cleared!");
    });
  }

  if (shopBtn) {
    shopBtn.addEventListener("click", goShop);
  }
}

function attachAddBtns() {
  var btns = document.querySelectorAll(".add-to-cart-btn");
  if (!btns.length) {
    return;
  }

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var name = this.getAttribute("data-name");
      var price = this.getAttribute("data-price");
      addCart(name, price);
    });
  }
}



// ---------------------------------------------------------------------------
// Footer date, product filter, team, hero, research “read more”
// ---------------------------------------------------------------------------

function showDate() {
  var el = get("todayDate");
  if (!el) {
    return;
  }
  el.textContent = new Date().toDateString();
}

function attachFilter() {
  var filter = get("productFilter");
  if (!filter) {
    return;
  }

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

  filter.dispatchEvent(new Event("change"));
}

function attachTeamToggle() {
  var btn = get("teamToggleBtn");
  var section = get("teamMembersSection");

  if (!btn || !section) {
    return;
  }

  btn.addEventListener("click", function () {
    var hidden = section.hasAttribute("hidden");

    if (hidden) {
      section.removeAttribute("hidden");
      btn.textContent = "Hide Team Members";
      btn.setAttribute("aria-expanded", "true");
    } else {
      section.setAttribute("hidden", "");
      btn.textContent = "Show Team Members";
      btn.setAttribute("aria-expanded", "false");
    }
  });
}



function startSlider() {
  var hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  var pics = [
    "images/hero-bg.png",
    "images/home-bg-2.png",
    "images/home-bg-3.png",
    "images/home-bg-4.png"
  ];

  var idx = 0;

  setInterval(function () {
    idx += 1;
    if (idx >= pics.length) {
      idx = 0;
    }
    hero.style.backgroundImage = 'url("' + pics[idx] + '")';
    hero.style.backgroundPosition = "center";
    hero.style.backgroundSize = "cover";
  }, 2000);
}

function attachReadMore() {
  var readBtn = get("researchReadMoreBtn");
  var lessBtn = get("researchShowLessBtn");
  var section = get("researchSummarySection");

  if (!readBtn || !lessBtn || !section) {
    return;
  }

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

/** Logs feedback messages (used after add to cart / clear). */
function alertMsg(msg) {
  console.log(msg);
}

// ---------------------------------------------------------------------------
// Start — runs once the HTML is parsed
// ---------------------------------------------------------------------------

function start() {
  showDate();

  attachAddBtns();
  attachProductCartBtn();
  attachCartBtns();

  drawDrawer();

  attachProductPopups();
  attachBlogPopups();
  attachEscape();

  attachFilter();

  var welcomeBtn = get("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      popup("Welcome!");
    });
  }

  var feedbackForm = get("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      popup("thanks for feedback");
    });
  }

  attachTeamToggle();
  startSlider();
  attachReadMore();
}

document.addEventListener("DOMContentLoaded", start);
