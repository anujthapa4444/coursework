// Main JavaScript file.
// Handles popups, cart, forms, and UI.

// Show popup message.
function showPopup(message) {
  window.alert(message);
}

// Show small alert bar.
function showAlertBar(message) {
  var bar = document.getElementById("cartAlertBar");
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

// Open product popup.
function openProductModal(card) {
  var modal = document.getElementById("productModal");
  var image = card.querySelector("img");
  var title = card.querySelector("h3");
  var price = card.querySelector("strong");
  var paragraphs = card.querySelectorAll("p");
  var description = paragraphs.length > 1 ? paragraphs[1].textContent.trim() : "";

  var modalImage = document.getElementById("modalProductImage");
  var modalName = document.getElementById("modalProductName");
  var modalPrice = document.getElementById("modalProductPrice");
  var modalDescription = document.getElementById("modalProductDescription");

  if (!modal || !modalImage || !modalName || !modalPrice || !modalDescription) return;

  modalImage.src = image ? image.src : "";
  modalImage.alt = image ? image.alt : "Product image";
  modalName.textContent = title ? title.textContent : "Product details";
  modalPrice.textContent = price ? "Price: " + price.textContent : "";
  modalDescription.textContent = description;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

// Close product popup.
function closeProductModal() {
  var modal = document.getElementById("productModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

// Add product popup events.
function bindProductCardPopups() {
  var cards = document.querySelectorAll(".product-card");
  var modal = document.getElementById("productModal");
  var closeBtn = document.getElementById("productModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  cards.forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.target.closest(".btn")) {
        return;
      }
      openProductModal(card);
    });
  });

  closeBtn.addEventListener("click", closeProductModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeProductModal();
    }
  });
}

// Read cart from browser.
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("urbansproutCart") || "[]");
  } catch (error) {
    return [];
  }
}

// Save cart in browser.
function saveCart(cart) {
  localStorage.setItem("urbansproutCart", JSON.stringify(cart));
}

// Add item to cart.
function addToCart(name, price) {
  var cart = getCart();
  var existing = cart.find(function (item) {
    return item.name === name;
  });

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: Number(price), qty: 1 });
  }

  saveCart(cart);
  showAlertBar(name + " added to cart.");
  renderCartSidebar();
  renderCartDrawer();
}

// Connect add-to-cart buttons.
function bindAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-to-cart-btn");
  if (!buttons.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var name = button.getAttribute("data-name");
      var price = button.getAttribute("data-price");
      addToCart(name, price);
    });
  });
}

// Show cart table on old pages.
function renderCartPage() {
  var body =
    document.getElementById("cartBody") ||
    document.getElementById("estimateBody");
  var totalTarget =
    document.getElementById("cartTotal") ||
    document.getElementById("estimateTotal");
  var countTarget =
    document.getElementById("cartItems") ||
    document.getElementById("estimateItems");
  var clearBtn =
    document.getElementById("clearCartBtn") ||
    document.getElementById("clearEstimateBtn");

  if (!body || !totalTarget || !countTarget) return;

  function render() {
    var cart = getCart();
    body.innerHTML = "";

    if (!cart.length) {
      body.innerHTML =
        '<tr><td colspan="4">Cart is empty. <a href="products.html">Go Shopping</a></td></tr>';
      totalTarget.textContent = "NPR 0";
      countTarget.textContent = "0";
      return;
    }

    var total = 0;
    var totalQty = 0;
    cart.forEach(function (item) {
      var lineTotal = item.price * item.qty;
      total += lineTotal;
      totalQty += item.qty;
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
    });

    totalTarget.textContent = "NPR " + total;
    countTarget.textContent = String(totalQty);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      saveCart([]);
      render();
      showAlertBar("Cart cleared.");
    });
  }

  render();
}

// Show sidebar cart summary.
function renderCartSidebar() {
  var body = document.getElementById("sidebarCartBody");
  var totalTarget = document.getElementById("sidebarCartTotal");
  var countTarget = document.getElementById("sidebarCartItems");
  var clearBtn = document.getElementById("clearSidebarCartBtn");

  if (!body || !totalTarget || !countTarget) return;

  function render() {
    var cart = getCart();
    body.innerHTML = "";

    if (!cart.length) {
      body.innerHTML = '<tr><td colspan="2">Cart is empty.</td></tr>';
      totalTarget.textContent = "NPR 0";
      countTarget.textContent = "0";
      return;
    }

    var total = 0;
    var totalQty = 0;
    cart.forEach(function (item) {
      var lineTotal = item.price * item.qty;
      total += lineTotal;
      totalQty += item.qty;
      body.innerHTML +=
        "<tr><td>" + item.name + "</td><td>" + item.qty + "</td></tr>";
    });

    totalTarget.textContent = "NPR " + total;
    countTarget.textContent = String(totalQty);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      saveCart([]);
      render();
      showAlertBar("Cart cleared.");
    });
  }

  render();
}

// Change item quantity.
function updateItemQuantity(itemName, change) {
  var cart = getCart();
  var item = cart.find(function (i) {
    return i.name === itemName;
  });

  if (item) {
    item.qty += change;
    if (item.qty <= 0) {
      cart = cart.filter(function (i) {
        return i.name !== itemName;
      });
    }
    saveCart(cart);
    renderCartSidebar();
    renderCartDrawer();
  }
}

// Show cart in drawer.
function renderCartDrawer() {
  var body = document.getElementById("drawerCartBody");
  var totalTarget = document.getElementById("drawerCartTotal");
  var countTarget = document.getElementById("drawerCartItems");
  var shopNowBtn = document.getElementById("shopNowBtn");
  var clearBtn = document.getElementById("clearDrawerCartBtn");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = "";

  if (!cart.length) {
    body.innerHTML = '<tr><td colspan="2">Cart is empty.</td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";
    if (shopNowBtn) {
      shopNowBtn.style.display = "block";
    }
    if (clearBtn) {
      clearBtn.style.display = "none";
    }
    return;
  }

  if (shopNowBtn) {
    shopNowBtn.style.display = "none";
  }
  if (clearBtn) {
    clearBtn.style.display = "block";
  }

  var total = 0;
  var totalQty = 0;
  cart.forEach(function (item) {
    var lineTotal = item.price * item.qty;
    total += lineTotal;
    totalQty += item.qty;
    body.innerHTML +=
      "<tr><td>" + item.name + "</td><td style=\"text-align: center;\">" +
      "<button class=\"qty-btn qty-minus\" data-item=\"" + item.name + "\">−</button> " +
      item.qty +
      " <button class=\"qty-btn qty-plus\" data-item=\"" + item.name + "\">+</button>" +
      "</td></tr>";
  });

  totalTarget.textContent = "NPR " + total;
  countTarget.textContent = String(totalQty);

  var plusBtns = document.querySelectorAll(".qty-plus");
  var minusBtns = document.querySelectorAll(".qty-minus");

  plusBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var itemName = btn.getAttribute("data-item");
      updateItemQuantity(itemName, 1);
    });
  });

  minusBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var itemName = btn.getAttribute("data-item");
      updateItemQuantity(itemName, -1);
    });
  });
}

// Open cart drawer.
function openCartDrawer() {
  var drawer = document.getElementById("cartDrawer");
  var backdrop = document.getElementById("cartDrawerBackdrop");
  if (!drawer || !backdrop) return;
  renderCartDrawer();
  drawer.classList.add("open");
  backdrop.classList.add("visible");
  drawer.setAttribute("aria-hidden", "false");
}

// Close cart drawer.
function closeCartDrawer() {
  var drawer = document.getElementById("cartDrawer");
  var backdrop = document.getElementById("cartDrawerBackdrop");
  if (!drawer || !backdrop) return;
  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
}

// Connect cart drawer buttons.
function bindCartDrawerButtons() {
  var openBtn = document.getElementById("openCartBtn");
  var closeBtn = document.getElementById("closeCartDrawer");
  var backdrop = document.getElementById("cartDrawerBackdrop");
  var clearBtn = document.getElementById("clearDrawerCartBtn");
  var shopNowBtn = document.getElementById("shopNowBtn");

  if (openBtn) {
    openBtn.addEventListener("click", openCartDrawer);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeCartDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeCartDrawer);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      saveCart([]);
      renderCartSidebar();
      renderCartDrawer();
      showAlertBar("Cart cleared.");
    });
  }

  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", function () {
      var currentPage = window.location.pathname;
      if (currentPage.includes("products.html")) {
        closeCartDrawer();
      } else {
        window.location.href = "pages/products.html";
      }
    });
  }
}

// Put today's date in footer.
function updateCurrentDate() {
  var dateTarget = document.getElementById("todayDate");
  if (dateTarget) {
    var now = new Date();
    dateTarget.textContent = now.toDateString();
  }
}

// Filter products by category.
function filterProducts() {
  var filter = document.getElementById("productFilter");
  if (!filter) return;

  var selected = filter.value;
  var cards = document.querySelectorAll(".product-card");

  cards.forEach(function (card) {
    var category = card.getAttribute("data-category");
    if (selected === "all" || category === selected) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Validate feedback form.
function validateFeedbackForm(event) {
  var form = document.getElementById("feedbackForm");
  if (!form) return true;

  var name = document.getElementById("name").value.trim();
  var email = document.getElementById("email").value.trim();
  var message = document.getElementById("message").value.trim();
  var errorBox = document.getElementById("formError");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// Show/hide team names.
function bindTeamToggleButton() {
  var toggleBtn = document.getElementById("teamToggleBtn");
  var teamSection = document.getElementById("teamMembersSection");

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

// Open team member popup.
function bindTeamMemberPopups() {
  var memberButtons = document.querySelectorAll(".team-member-name-btn");
  var modal = document.getElementById("teamMemberModal");
  var closeBtn = document.getElementById("teamMemberModalClose");
  var modalImage = document.getElementById("teamMemberModalImage");
  var modalName = document.getElementById("teamMemberModalName");
  var modalRole = document.getElementById("teamMemberModalRole");
  var modalAbout = document.getElementById("teamMemberModalAbout");

  if (
    !memberButtons.length ||
    !modal ||
    !closeBtn ||
    !modalImage ||
    !modalName ||
    !modalRole ||
    !modalAbout
  ) {
    return;
  }

  function closeTeamMemberModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  memberButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      modalName.textContent = button.getAttribute("data-name") || "Team Member";
      modalRole.textContent = "Role: " + (button.getAttribute("data-role") || "");
      modalAbout.textContent = button.getAttribute("data-about") || "";
      modalImage.src = button.getAttribute("data-photo") || "";
      modalImage.alt = "Photo of " + (button.getAttribute("data-name") || "team member");
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  closeBtn.addEventListener("click", closeTeamMemberModal);
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeTeamMemberModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeTeamMemberModal();
    }
  });
}

// Change hero image every 2 seconds.
function startHeroBackgroundSlider() {
  var heroSection = document.querySelector(".hero");
  if (!heroSection) return;

  var heroImages = [
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80"
  ];
  var currentIndex = 0;

  window.setInterval(function () {
    currentIndex = (currentIndex + 1) % heroImages.length;
    heroSection.style.backgroundImage = 'url("' + heroImages[currentIndex] + '")';
    heroSection.style.backgroundPosition = "center";
    heroSection.style.backgroundSize = "cover";
    heroSection.style.backgroundRepeat = "no-repeat";
  }, 2000);
}

// Run setup when page loads.
function initSite() {
  updateCurrentDate();
  bindAddToCartButtons();
  bindProductCardPopups();
  bindCartDrawerButtons();
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();

  var filter = document.getElementById("productFilter");
  if (filter) {
    filter.addEventListener("change", filterProducts);
    filterProducts();
  }

  var form = document.getElementById("feedbackForm");
  if (form) {
    form.addEventListener("submit", validateFeedbackForm);
  }

  var welcomeBtn = document.getElementById("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      showPopup("Namaste from Pokhara! Welcome to UrbanSprout Nepal.");
    });
  }

  bindTeamToggleButton();
  bindTeamMemberPopups();
  startHeroBackgroundSlider();
}

document.addEventListener("DOMContentLoaded", initSite);
