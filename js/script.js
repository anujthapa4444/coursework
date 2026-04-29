// UrbanSprout main JavaScript.
// Beginner note:
// - This project uses ONE external JavaScript file (this file).
// - We avoid inline/internal JavaScript inside HTML pages.
// - Code is split into small sections so new learners can follow easily.

// -----------------------------
// 1) Small helper functions
// -----------------------------

function getById(id) {
  return document.getElementById(id);
}

function showPopup(message) {
  window.alert(message);
}

function showAlertBar(message) {
  var bar = getById("cartAlertBar");

  if (!bar) {
    bar = document.createElement("div");
    bar.id = "cartAlertBar";
    bar.style.position = "fixed";
    bar.style.top = "16px";
    bar.style.right = "16px";
    bar.style.background = "#1b5e20";
    bar.style.color = "#fff";
    bar.style.padding = "10px 14px";
    bar.style.borderRadius = "8px";
    bar.style.boxShadow = "0 10px 18px rgba(0,0,0,0.2)";
    bar.style.zIndex = "2000";
    bar.style.fontSize = "0.9rem";
    document.body.appendChild(bar);
  }

  bar.textContent = message;
  bar.style.display = "block";

  window.setTimeout(function () {
    bar.style.display = "none";
  }, 1800);
}

function openModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.remove("hidden");
  modalElement.setAttribute("aria-hidden", "false");
}

function closeModal(modalElement) {
  if (!modalElement) return;
  modalElement.classList.add("hidden");
  modalElement.setAttribute("aria-hidden", "true");
}

// -----------------------------
// 2) Product modal
// -----------------------------

function openProductModal(card) {
  var modal = getById("productModal");
  var modalImage = getById("modalProductImage");
  var modalName = getById("modalProductName");
  var modalPrice = getById("modalProductPrice");
  var modalDescription = getById("modalProductDescription");

  if (!modal || !modalImage || !modalName || !modalPrice || !modalDescription) return;

  var cardImage = card.querySelector("img");
  var cardTitle = card.querySelector("h3");
  var cardPrice = card.querySelector("strong");
  var paragraphs = card.querySelectorAll("p");
  var cardDescription = "";

  if (paragraphs.length > 1) {
    cardDescription = paragraphs[1].textContent.trim();
  }

  var rawPrice = "";
  if (cardPrice) {
    rawPrice = cardPrice.textContent.replace(/[^0-9.]/g, "");
  }

  modalImage.src = cardImage ? cardImage.src : "";
  modalImage.alt = cardImage ? cardImage.alt : "Product image";
  modalName.textContent = cardTitle ? cardTitle.textContent : "Product details";
  modalPrice.textContent = cardPrice ? "Price: " + cardPrice.textContent : "";
  modalDescription.textContent = cardDescription;

  // Save product info in modal for "Add to Cart" button.
  modal.dataset.productName = cardTitle ? cardTitle.textContent : "";
  modal.dataset.productPrice = rawPrice;

  openModal(modal);
}

function closeProductModal() {
  closeModal(getById("productModal"));
}

function bindProductCardPopups() {
  var cards = document.querySelectorAll(".product-card");
  var modal = getById("productModal");
  var closeBtn = getById("productModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  for (var i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener("click", function (event) {
      // If click happened on button area, do not open popup.
      var clickedInsideButton = event.target.closest(".btn");
      if (clickedInsideButton) return;
      openProductModal(this);
    });
  }

  closeBtn.addEventListener("click", closeProductModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeProductModal();
    }
  });
}

function bindProductModalAddToCart() {
  var addBtn = getById("modalAddToCartBtn");
  var modal = getById("productModal");

  if (!addBtn || !modal) return;

  addBtn.addEventListener("click", function () {
    var productName = modal.dataset.productName || "";
    var productPrice = modal.dataset.productPrice || "";

    if (productName && productPrice) {
      addToCart(productName, productPrice);
    }
  });
}

// -----------------------------
// 3) Blog modal
// -----------------------------

function openBlogModal(card) {
  var modal = getById("blogModal");
  var modalImage = getById("modalBlogImage");
  var modalTopic = getById("modalBlogTopic");
  var modalTitle = getById("modalBlogTitle");
  var modalSummary = getById("modalBlogSummary");
  var modalDetail = getById("modalBlogDetail");
  var modalTip = getById("modalBlogTip");

  if (
    !modal ||
    !modalImage ||
    !modalTopic ||
    !modalTitle ||
    !modalSummary ||
    !modalDetail ||
    !modalTip
  ) {
    return;
  }

  var cardImage = card.querySelector("img");
  var cardTopic = card.querySelector(".badge");
  var cardTitle = card.querySelector("h3");
  var cardSummary = card.querySelector("p");
  var cardDetail = card.getAttribute("data-detail") || "";
  var cardTip = card.getAttribute("data-tip") || "";

  modalImage.src = cardImage ? cardImage.src : "";
  modalImage.alt = cardImage ? cardImage.alt : "Blog topic image";
  modalTopic.textContent = cardTopic ? cardTopic.textContent : "Blog";
  modalTitle.textContent = cardTitle ? cardTitle.textContent : "Blog details";
  modalSummary.textContent = cardSummary ? cardSummary.textContent : "";
  modalDetail.textContent = cardDetail;
  modalTip.textContent = cardTip;

  openModal(modal);
}

function closeBlogModal() {
  closeModal(getById("blogModal"));
}

function bindBlogCardPopups() {
  var cards = document.querySelectorAll(".blog-topic");
  var modal = getById("blogModal");
  var closeBtn = getById("blogModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  for (var i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener("click", function () {
      openBlogModal(this);
    });
  }

  closeBtn.addEventListener("click", closeBlogModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeBlogModal();
    }
  });
}

function bindEscapeToCloseModals() {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeProductModal();
      closeBlogModal();
      closeTeamMemberModal();
    }
  });
}

// -----------------------------
// 4) Cart data
// -----------------------------

function getCart() {
  try {
    var rawText = localStorage.getItem("urbansproutCart");

    if (!rawText) {
      return [];
    }

    var parsed = JSON.parse(rawText);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    return [];
  }
}

function saveCart(cartArray) {
  localStorage.setItem("urbansproutCart", JSON.stringify(cartArray));
}

function clearCart() {
  saveCart([]);
}

function findItemIndex(cartArray, itemName) {
  for (var i = 0; i < cartArray.length; i += 1) {
    if (cartArray[i].name === itemName) {
      return i;
    }
  }
  return -1;
}

function calculateCartTotals(cartArray) {
  var totals = { totalPrice: 0, totalQty: 0 };

  for (var i = 0; i < cartArray.length; i += 1) {
    totals.totalPrice = totals.totalPrice + cartArray[i].price * cartArray[i].qty;
    totals.totalQty = totals.totalQty + cartArray[i].qty;
  }

  return totals;
}

function addToCart(name, price) {
  var cart = getCart();
  var index = findItemIndex(cart, name);

  if (index === -1) {
    cart.push({
      name: name,
      price: Number(price),
      qty: 1
    });
  } else {
    cart[index].qty = cart[index].qty + 1;
  }

  saveCart(cart);
  showAlertBar(name + " added to cart.");
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();
}

function updateItemQuantity(itemName, change) {
  var cart = getCart();
  var index = findItemIndex(cart, itemName);

  if (index === -1) return;

  cart[index].qty = cart[index].qty + change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();
}

// -----------------------------
// 5) Cart UI rendering
// -----------------------------

function renderCartPage() {
  var body = getById("cartBody") || getById("estimateBody");
  var totalTarget = getById("cartTotal") || getById("estimateTotal");
  var countTarget = getById("cartItems") || getById("estimateItems");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = "";

  if (!cart.length) {
    body.innerHTML =
      '<tr><td colspan="4">Cart is empty. <a href="products.html">Go Shopping</a></td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";
    return;
  }

  for (var i = 0; i < cart.length; i += 1) {
    var item = cart[i];
    var lineTotal = item.price * item.qty;

    body.innerHTML +=
      "<tr><td>" +
      item.name +
      "</td><td>NPR " +
      item.price +
      "</td><td>" +
      item.qty +
      "</td><td>NPR " +
      lineTotal +
      "</td></tr>";
  }

  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);
}

function renderCartSidebar() {
  var body = getById("sidebarCartBody");
  var totalTarget = getById("sidebarCartTotal");
  var countTarget = getById("sidebarCartItems");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = "";

  if (!cart.length) {
    body.innerHTML = '<tr><td colspan="2">Cart is empty.</td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";
    return;
  }

  for (var i = 0; i < cart.length; i += 1) {
    body.innerHTML += "<tr><td>" + cart[i].name + "</td><td>" + cart[i].qty + "</td></tr>";
  }

  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);
}

function renderCartDrawer() {
  var body = getById("drawerCartBody");
  var totalTarget = getById("drawerCartTotal");
  var countTarget = getById("drawerCartItems");
  var shopNowBtn = getById("shopNowBtn");
  var clearBtn = getById("clearDrawerCartBtn");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = "";

  if (!cart.length) {
    body.innerHTML = '<tr><td colspan="2">Cart is empty.</td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";

    if (shopNowBtn) shopNowBtn.style.display = "block";
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  if (shopNowBtn) shopNowBtn.style.display = "none";
  if (clearBtn) clearBtn.style.display = "block";

  for (var i = 0; i < cart.length; i += 1) {
    var item = cart[i];

    body.innerHTML +=
      "<tr><td>" +
      item.name +
      "</td><td style=\"text-align: center;\">" +
      "<button class=\"qty-btn qty-minus\" data-item=\"" +
      item.name +
      "\">−</button> " +
      item.qty +
      " <button class=\"qty-btn qty-plus\" data-item=\"" +
      item.name +
      "\">+</button></td></tr>";
  }

  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);

  bindDrawerQuantityButtons();
}

function bindDrawerQuantityButtons() {
  var plusButtons = document.querySelectorAll(".qty-plus");
  var minusButtons = document.querySelectorAll(".qty-minus");

  for (var i = 0; i < plusButtons.length; i += 1) {
    plusButtons[i].addEventListener("click", function () {
      var itemName = this.getAttribute("data-item");
      updateItemQuantity(itemName, 1);
    });
  }

  for (var j = 0; j < minusButtons.length; j += 1) {
    minusButtons[j].addEventListener("click", function () {
      var itemName = this.getAttribute("data-item");
      updateItemQuantity(itemName, -1);
    });
  }
}

// -----------------------------
// 6) Cart UI actions
// -----------------------------

function openCartDrawer() {
  var drawer = getById("cartDrawer");
  var backdrop = getById("cartDrawerBackdrop");

  if (!drawer || !backdrop) return;

  renderCartDrawer();
  drawer.classList.add("open");
  backdrop.classList.add("visible");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  var drawer = getById("cartDrawer");
  var backdrop = getById("cartDrawerBackdrop");

  if (!drawer || !backdrop) return;

  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
}

function handleShopNowClick() {
  var currentPath = window.location.pathname;

  // If user is already on products page, just close drawer.
  if (currentPath.indexOf("products.html") !== -1) {
    closeCartDrawer();
    return;
  }

  // Move to products page from other pages.
  window.location.href = "pages/products.html";
}

function bindCartDrawerButtons() {
  var openBtn = getById("openCartBtn");
  var closeBtn = getById("closeCartDrawer");
  var backdrop = getById("cartDrawerBackdrop");
  var clearBtn = getById("clearDrawerCartBtn");
  var shopNowBtn = getById("shopNowBtn");

  if (openBtn) openBtn.addEventListener("click", openCartDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart();
      renderCartPage();
      renderCartSidebar();
      renderCartDrawer();
      showAlertBar("Cart cleared.");
    });
  }

  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", handleShopNowClick);
  }
}

function bindAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-to-cart-btn");
  if (!buttons.length) return;

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function () {
      var name = this.getAttribute("data-name");
      var price = this.getAttribute("data-price");
      addToCart(name, price);
    });
  }
}

function bindClearButtonsOnOldPages() {
  var clearBtn = getById("clearCartBtn") || getById("clearEstimateBtn");
  var clearSidebarBtn = getById("clearSidebarCartBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart();
      renderCartPage();
      showAlertBar("Cart cleared.");
    });
  }

  if (clearSidebarBtn) {
    clearSidebarBtn.addEventListener("click", function () {
      clearCart();
      renderCartSidebar();
      showAlertBar("Cart cleared.");
    });
  }
}

// -----------------------------
// 7) Other page features
// -----------------------------

function updateCurrentDate() {
  var target = getById("todayDate");
  if (!target) return;
  target.textContent = new Date().toDateString();
}

function filterProducts() {
  var filter = getById("productFilter");
  if (!filter) return;

  var selected = filter.value;
  var cards = document.querySelectorAll(".product-card");

  for (var i = 0; i < cards.length; i += 1) {
    var category = cards[i].getAttribute("data-category");

    if (selected === "all" || category === selected) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function validateFeedbackForm(event) {
  var form = getById("feedbackForm");
  if (!form) return true;

  var nameInput = getById("name");
  var emailInput = getById("email");
  var messageInput = getById("message");
  var errorBox = getById("formError");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameInput || !emailInput || !messageInput || !errorBox) return true;

  var name = nameInput.value.trim();
  var email = emailInput.value.trim();
  var message = messageInput.value.trim();

  errorBox.textContent = "";

  if (name.length < 3) {
    event.preventDefault();
    errorBox.textContent = "Name should be at least 3 characters.";
    return false;
  }

  if (!emailPattern.test(email)) {
    event.preventDefault();
    errorBox.textContent = "Please enter a valid email address.";
    return false;
  }

  if (message.length < 10) {
    event.preventDefault();
    errorBox.textContent = "Message should be at least 10 characters.";
    return false;
  }

  event.preventDefault();
  showPopup("Thank you! Your feedback was submitted successfully.");
  form.reset();
  return true;
}

function bindTeamToggleButton() {
  var toggleBtn = getById("teamToggleBtn");
  var teamSection = getById("teamMembersSection");

  if (!toggleBtn || !teamSection) return;

  toggleBtn.addEventListener("click", function () {
    var isHidden = teamSection.hasAttribute("hidden");

    if (isHidden) {
      teamSection.removeAttribute("hidden");
      toggleBtn.textContent = "Hide Team Members";
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      teamSection.setAttribute("hidden", "");
      toggleBtn.textContent = "Show Our Team Members";
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function closeTeamMemberModal() {
  closeModal(getById("teamMemberModal"));
}

function bindTeamMemberPopups() {
  var buttons = document.querySelectorAll(".team-member-name-btn");
  var modal = getById("teamMemberModal");
  var closeBtn = getById("teamMemberModalClose");
  var modalImage = getById("teamMemberModalImage");
  var modalName = getById("teamMemberModalName");
  var modalRole = getById("teamMemberModalRole");
  var modalAbout = getById("teamMemberModalAbout");

  if (
    !buttons.length ||
    !modal ||
    !closeBtn ||
    !modalImage ||
    !modalName ||
    !modalRole ||
    !modalAbout
  ) {
    return;
  }

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function () {
      var name = this.getAttribute("data-name") || "Team Member";
      var role = this.getAttribute("data-role") || "";
      var about = this.getAttribute("data-about") || "";
      var photo = this.getAttribute("data-photo") || "";

      modalName.textContent = name;
      modalRole.textContent = "Role: " + role;
      modalAbout.textContent = about;
      modalImage.src = photo;
      modalImage.alt = "Photo of " + name;

      openModal(modal);
    });
  }

  closeBtn.addEventListener("click", closeTeamMemberModal);

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeTeamMemberModal();
    }
  });
}

function startHeroBackgroundSlider() {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var heroImages = [
    "../images/hero-bg.png",
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80"
  ];

  var currentIndex = 0;

  window.setInterval(function () {
    currentIndex = currentIndex + 1;
    if (currentIndex >= heroImages.length) {
      currentIndex = 0;
    }

    hero.style.backgroundImage = 'url("' + heroImages[currentIndex] + '")';
    hero.style.backgroundPosition = "center";
    hero.style.backgroundSize = "cover";
    hero.style.backgroundRepeat = "no-repeat";
  }, 2000);
}

function bindResearchReadMoreButton() {
  var readMoreBtn = getById("researchReadMoreBtn");
  var showLessBtn = getById("researchShowLessBtn");
  var summarySection = getById("researchSummarySection");

  if (!readMoreBtn || !showLessBtn || !summarySection) return;

  readMoreBtn.addEventListener("click", function () {
    summarySection.removeAttribute("hidden");
    readMoreBtn.style.display = "none";
    showLessBtn.style.display = "inline-block";
  });

  showLessBtn.addEventListener("click", function () {
    summarySection.setAttribute("hidden", "");
    showLessBtn.style.display = "none";
    readMoreBtn.style.display = "inline-block";
  });
}

// -----------------------------
// 8) Site initialization
// -----------------------------

function initSite() {
  updateCurrentDate();

  // Cart setup
  bindAddToCartButtons();
  bindProductModalAddToCart();
  bindCartDrawerButtons();
  bindClearButtonsOnOldPages();
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();

  // Popups
  bindProductCardPopups();
  bindBlogCardPopups();
  bindTeamMemberPopups();
  bindEscapeToCloseModals();

  // Product filter
  var filter = getById("productFilter");
  if (filter) {
    filter.addEventListener("change", filterProducts);
    filterProducts();
  }

  // Feedback form
  var form = getById("feedbackForm");
  if (form) {
    form.addEventListener("submit", validateFeedbackForm);
  }

  // Welcome button on home
  var welcomeBtn = getById("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      showPopup("Namaste from Pokhara! Welcome to UrbanSprout Nepal.");
    });
  }

  bindTeamToggleButton();
  startHeroBackgroundSlider();
  bindResearchReadMoreButton();
}

document.addEventListener("DOMContentLoaded", initSite);
