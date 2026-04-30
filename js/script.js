// UrbanSprout main JavaScript.
// Beginner note:
// - This project uses ONE external JavaScript file (this file).
// - We avoid inline/internal JavaScript inside HTML pages.
// - Code is split into small sections so new learners can follow easily.
// - We added simple comments to explain every section for beginners!

// -----------------------------
// 1) Small helper functions
// -----------------------------

// This function gets an HTML element by its ID name to save us from typing document.getElementById every time.
function getById(id) {
  return document.getElementById(id);
}

// This function shows a simple popup alert in the browser.
function showPopup(message) {
  window.alert(message);
}

// This function shows a nice alert bar on the top right when we add an item to the cart.
function showAlertBar(message) {
  var bar = getById("cartAlertBar");

  // If the alert bar doesn't exist yet, we create it.
  if (!bar) {
    bar = document.createElement("div"); // Create a new div element
    bar.id = "cartAlertBar"; // Give it an ID
    
    // Style the alert bar so it looks nice
    bar.style.position = "fixed";
    bar.style.top = "16px";
    bar.style.right = "16px";
    bar.style.background = "#1b5e20";
    bar.style.color = "#fff";
    bar.style.padding = "10px 14px";
    bar.style.borderRadius = "8px";
    bar.style.boxShadow = "0 10px 18px rgba(0,0,0,0.2)";
    bar.style.zIndex = "2000"; // Make sure it stays on top of everything
    bar.style.fontSize = "0.9rem";
    
    // Add it to the body of our webpage
    document.body.appendChild(bar);
  }

  // Set the message inside the bar
  bar.textContent = message;
  // Make it visible
  bar.style.display = "block";

  // Hide the alert bar after 1.8 seconds (1800 milliseconds)
  window.setTimeout(function () {
    bar.style.display = "none";
  }, 1800);
}

// Function to open a modal (a popup window on our page)
function openModal(modalElement) {
  if (!modalElement) return; // If there is no modal, do nothing
  modalElement.classList.remove("hidden"); // Remove the 'hidden' class to show it
  modalElement.setAttribute("aria-hidden", "false"); // Accessibility update
}

// Function to close a modal
function closeModal(modalElement) {
  if (!modalElement) return; // If there is no modal, do nothing
  modalElement.classList.add("hidden"); // Add the 'hidden' class to hide it
  modalElement.setAttribute("aria-hidden", "true"); // Accessibility update
}

// -----------------------------
// 2) Product modal
// -----------------------------

// Opens the details popup for a product when clicked
function openProductModal(card) {
  var modal = getById("productModal");
  var modalImage = getById("modalProductImage");
  var modalName = getById("modalProductName");
  var modalPrice = getById("modalProductPrice");
  var modalDescription = getById("modalProductDescription");

  // Make sure all these elements exist on the page
  if (!modal || !modalImage || !modalName || !modalPrice || !modalDescription) return;

  // Get info from the clicked product card
  var cardImage = card.querySelector("img");
  var cardTitle = card.querySelector("h3");
  var cardPrice = card.querySelector("strong");
  var paragraphs = card.querySelectorAll("p");
  var cardDescription = "";

  // The description is usually the second paragraph
  if (paragraphs.length > 1) {
    cardDescription = paragraphs[1].textContent.trim();
  }

  // Get the price as a number (remove the NPR text)
  var rawPrice = "";
  if (cardPrice) {
    rawPrice = cardPrice.textContent.replace(/[^0-9.]/g, "");
  }

  // Update the modal with the product info
  modalImage.src = cardImage ? cardImage.src : "";
  modalImage.alt = cardImage ? cardImage.alt : "Product image";
  modalName.textContent = cardTitle ? cardTitle.textContent : "Product details";
  modalPrice.textContent = cardPrice ? "Price: " + cardPrice.textContent : "";
  modalDescription.textContent = cardDescription;

  // Save product info in the modal so the "Add to Cart" button knows what to add
  modal.dataset.productName = cardTitle ? cardTitle.textContent : "";
  modal.dataset.productPrice = rawPrice;

  // Finally, show the modal
  openModal(modal);
}

// Closes the product details popup
function closeProductModal() {
  closeModal(getById("productModal"));
}

// Connects the click event to each product card so the popup opens
function bindProductCardPopups() {
  var cards = document.querySelectorAll(".product-card");
  var modal = getById("productModal");
  var closeBtn = getById("productModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  // Go through every product card and add a click listener
  for (var i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener("click", function (event) {
      // If the user clicked the "Add to Cart" button, don't open the popup
      var clickedInsideButton = event.target.closest(".btn");
      if (clickedInsideButton) return;
      openProductModal(this);
    });
  }

  // Close the popup when the close button is clicked
  closeBtn.addEventListener("click", closeProductModal);

  // Close the popup if the user clicks outside of the modal box
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeProductModal();
    }
  });
}

// Connects the "Add to Cart" button inside the product popup
function bindProductModalAddToCart() {
  var addBtn = getById("modalAddToCartBtn");
  var modal = getById("productModal");

  if (!addBtn || !modal) return;

  addBtn.addEventListener("click", function () {
    // Read the product details we saved earlier
    var productName = modal.dataset.productName || "";
    var productPrice = modal.dataset.productPrice || "";

    if (productName && productPrice) {
      // Add the item to our simple cart
      addToCart(productName, productPrice);
    }
  });
}

// -----------------------------
// 3) Blog modal
// -----------------------------

// Opens the details popup for a blog post
function openBlogModal(card) {
  var modal = getById("blogModal");
  var modalImage = getById("modalBlogImage");
  var modalTopic = getById("modalBlogTopic");
  var modalTitle = getById("modalBlogTitle");
  var modalSummary = getById("modalBlogSummary");
  var modalDetail = getById("modalBlogDetail");
  var modalTip = getById("modalBlogTip");

  // Stop if any part of the modal is missing
  if (!modal || !modalImage || !modalTopic || !modalTitle || !modalSummary || !modalDetail || !modalTip) {
    return;
  }

  // Get info from the clicked blog card
  var cardImage = card.querySelector("img");
  var cardTopic = card.querySelector(".badge");
  var cardTitle = card.querySelector("h3");
  var cardSummary = card.querySelector("p");
  var cardDetail = card.getAttribute("data-detail") || "";
  var cardTip = card.getAttribute("data-tip") || "";

  // Set the info in the modal
  modalImage.src = cardImage ? cardImage.src : "";
  modalImage.alt = cardImage ? cardImage.alt : "Blog topic image";
  modalTopic.textContent = cardTopic ? cardTopic.textContent : "Blog";
  modalTitle.textContent = cardTitle ? cardTitle.textContent : "Blog details";
  modalSummary.textContent = cardSummary ? cardSummary.textContent : "";
  modalDetail.textContent = cardDetail;
  modalTip.textContent = cardTip;

  // Show the blog modal
  openModal(modal);
}

// Closes the blog modal
function closeBlogModal() {
  closeModal(getById("blogModal"));
}

// Connects the click event to each blog card
function bindBlogCardPopups() {
  var cards = document.querySelectorAll(".blog-topic");
  var modal = getById("blogModal");
  var closeBtn = getById("blogModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  // Add click listener to all blog cards
  for (var i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener("click", function () {
      openBlogModal(this);
    });
  }

  // Close when X is clicked
  closeBtn.addEventListener("click", closeBlogModal);

  // Close when clicking outside
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeBlogModal();
    }
  });
}

// Allows the user to close any open modal by pressing the 'Escape' key on keyboard
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
// 4) Cart data (Simplified for beginners)
// -----------------------------

// This simple array holds all the items you add to the cart.
// Since we don't use localStorage, it resets if you refresh the page.
var mySimpleCart = [];

// Gets the list of items currently in the cart
function getCart() {
  return mySimpleCart;
}

// Saves the updated list of items to our cart variable
function saveCart(cartArray) {
  mySimpleCart = cartArray;
}

// Empties the cart completely by saving an empty list
function clearCart() {
  saveCart([]);
}

// Finds if an item is already in the cart. 
// Returns its position (index) if found, or -1 if not found.
function findItemIndex(cartArray, itemName) {
  for (var i = 0; i < cartArray.length; i += 1) {
    if (cartArray[i].name === itemName) {
      return i; // Found it!
    }
  }
  return -1; // Not found
}

// Calculates the total price and total quantity of everything in the cart
function calculateCartTotals(cartArray) {
  var totals = { totalPrice: 0, totalQty: 0 }; // Start with 0

  for (var i = 0; i < cartArray.length; i += 1) {
    // Total price = current price + (item price * item quantity)
    totals.totalPrice = totals.totalPrice + cartArray[i].price * cartArray[i].qty;
    // Total items = current items + item quantity
    totals.totalQty = totals.totalQty + cartArray[i].qty;
  }

  return totals;
}

// Adds a new product to the cart or increases its quantity if it's already there
function addToCart(name, price) {
  var cart = getCart(); // Get current items
  var index = findItemIndex(cart, name); // Check if we already have this product

  if (index === -1) {
    // If not found, add a new item to our cart
    cart.push({
      name: name,
      price: Number(price), // Convert price to a number just in case
      qty: 1 // Start with quantity 1
    });
  } else {
    // If it is found, just increase the quantity by 1
    cart[index].qty = cart[index].qty + 1;
  }

  saveCart(cart); // Update our cart
  showAlertBar(name + " added to cart."); // Show success message
  
  // Update all the visual cart sections on the screen
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();
}

// Increases or decreases the quantity of a specific item
function updateItemQuantity(itemName, change) {
  var cart = getCart();
  var index = findItemIndex(cart, itemName);

  if (index === -1) return; // If item is not in cart, do nothing

  // Change the quantity (+1 or -1)
  cart[index].qty = cart[index].qty + change;

  // If quantity drops to 0 or below, remove the item from the cart
  if (cart[index].qty <= 0) {
    cart.splice(index, 1); // remove 1 item at 'index'
  }

  saveCart(cart); // Update our cart
  
  // Refresh the screen views
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();
}

// -----------------------------
// 5) Cart UI rendering (Updating the screen)
// -----------------------------

// Updates the main Cart page (if we are on it)
function renderCartPage() {
  var body = getById("cartBody") || getById("estimateBody");
  var totalTarget = getById("cartTotal") || getById("estimateTotal");
  var countTarget = getById("cartItems") || getById("estimateItems");

  if (!body || !totalTarget || !countTarget) return; // If elements don't exist, skip

  var cart = getCart();
  body.innerHTML = ""; // Clear out the old HTML

  // If cart is empty, show a message
  if (!cart.length) {
    body.innerHTML = '<tr><td colspan="4">Cart is empty. <a href="products.html">Go Shopping</a></td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";
    return;
  }

  // Loop through cart items and add them as table rows
  for (var i = 0; i < cart.length; i += 1) {
    var item = cart[i];
    var lineTotal = item.price * item.qty; // Cost for this specific item

    // Create a row for the item
    body.innerHTML +=
      "<tr><td>" + item.name + "</td>" +
      "<td>NPR " + item.price + "</td>" +
      "<td>" + item.qty + "</td>" +
      "<td>NPR " + lineTotal + "</td></tr>";
  }

  // Calculate and update the overall totals
  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);
}

// Updates the side cart (usually on a sidebar if it exists)
function renderCartSidebar() {
  var body = getById("sidebarCartBody");
  var totalTarget = getById("sidebarCartTotal");
  var countTarget = getById("sidebarCartItems");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = ""; // Clear existing rows

  if (!cart.length) {
    body.innerHTML = '<tr><td colspan="2">Cart is empty.</td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";
    return;
  }

  // Add each item to the sidebar
  for (var i = 0; i < cart.length; i += 1) {
    body.innerHTML += "<tr><td>" + cart[i].name + "</td><td>" + cart[i].qty + "</td></tr>";
  }

  // Update sidebar totals
  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);
}

// Updates the slide-out cart drawer (the one that pops from the side)
function renderCartDrawer() {
  var body = getById("drawerCartBody");
  var totalTarget = getById("drawerCartTotal");
  var countTarget = getById("drawerCartItems");
  var shopNowBtn = getById("shopNowBtn");
  var clearBtn = getById("clearDrawerCartBtn");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = ""; // Clear old drawer contents

  if (!cart.length) {
    body.innerHTML = '<tr><td colspan="2">Cart is empty.</td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";

    // Show "Shop Now" button if cart is empty
    if (shopNowBtn) shopNowBtn.style.display = "block";
    // Hide "Clear Cart" button if already empty
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  // Hide "Shop Now" and show "Clear Cart" if we have items
  if (shopNowBtn) shopNowBtn.style.display = "none";
  if (clearBtn) clearBtn.style.display = "block";

  // Add items with + and - buttons to adjust quantity
  for (var i = 0; i < cart.length; i += 1) {
    var item = cart[i];

    body.innerHTML +=
      "<tr><td>" + item.name + "</td>" +
      "<td style=\"text-align: center;\">" +
      "<button class=\"qty-btn qty-minus\" data-item=\"" + item.name + "\">−</button> " +
      item.qty +
      " <button class=\"qty-btn qty-plus\" data-item=\"" + item.name + "\">+</button>" +
      "</td></tr>";
  }

  // Update totals in the drawer
  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);

  // Bind the plus and minus buttons we just created
  bindDrawerQuantityButtons();
}

// Connects the + and - buttons in the cart drawer
function bindDrawerQuantityButtons() {
  var plusButtons = document.querySelectorAll(".qty-plus");
  var minusButtons = document.querySelectorAll(".qty-minus");

  // When a plus button is clicked, add 1 to the quantity
  for (var i = 0; i < plusButtons.length; i += 1) {
    plusButtons[i].addEventListener("click", function () {
      var itemName = this.getAttribute("data-item"); // Which item?
      updateItemQuantity(itemName, 1); // Add 1
    });
  }

  // When a minus button is clicked, subtract 1 from the quantity
  for (var j = 0; j < minusButtons.length; j += 1) {
    minusButtons[j].addEventListener("click", function () {
      var itemName = this.getAttribute("data-item"); // Which item?
      updateItemQuantity(itemName, -1); // Subtract 1
    });
  }
}

// -----------------------------
// 6) Cart UI actions (Clicks and gestures)
// -----------------------------

// Opens the slide-out cart drawer
function openCartDrawer() {
  var drawer = getById("cartDrawer");
  var backdrop = getById("cartDrawerBackdrop"); // The dark background behind the drawer

  if (!drawer || !backdrop) return;

  renderCartDrawer(); // Make sure the drawer is updated with latest items
  
  // Show the drawer and backdrop
  drawer.classList.add("open");
  backdrop.classList.add("visible");
  drawer.setAttribute("aria-hidden", "false");
}

// Closes the slide-out cart drawer
function closeCartDrawer() {
  var drawer = getById("cartDrawer");
  var backdrop = getById("cartDrawerBackdrop");

  if (!drawer || !backdrop) return;

  // Hide the drawer and backdrop
  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
}

// What happens when the user clicks the "Shop Now" button inside an empty cart
function handleShopNowClick() {
  var currentPath = window.location.pathname;

  // If user is already on products page, just close the drawer.
  if (currentPath.indexOf("products.html") !== -1) {
    closeCartDrawer();
    return;
  }

  // Otherwise, move them to the products page.
  if (currentPath.includes('/pages/')) {
    window.location.href = 'products.html';
  } else {
    window.location.href = 'pages/products.html';
  }
}

// Connects all buttons related to opening/closing the cart
function bindCartDrawerButtons() {
  var openBtn = getById("openCartBtn");
  var closeBtn = getById("closeCartDrawer");
  var backdrop = getById("cartDrawerBackdrop");
  var clearBtn = getById("clearDrawerCartBtn");
  var shopNowBtn = getById("shopNowBtn");

  // Listeners to open and close
  if (openBtn) openBtn.addEventListener("click", openCartDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

  // Action for "Clear Cart" button
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart(); // Empty the array
      // Update all views
      renderCartPage();
      renderCartSidebar();
      renderCartDrawer();
      showAlertBar("Cart cleared.");
    });
  }

  // Action for "Shop Now" button
  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", handleShopNowClick);
  }
}

// Connects the "Add to Cart" buttons found on the products list
function bindAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-to-cart-btn");
  if (!buttons.length) return; // If no buttons found, stop

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function () {
      var name = this.getAttribute("data-name"); // Get item name
      var price = this.getAttribute("data-price"); // Get item price
      addToCart(name, price); // Add to cart
    });
  }
}

// Extra clear buttons on older pages
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

// Puts today's date on the page
function updateCurrentDate() {
  var target = getById("todayDate");
  if (!target) return;
  target.textContent = new Date().toDateString(); // E.g., "Wed Apr 29 2026"
}

// Hides or shows products based on the category filter
function filterProducts() {
  var filter = getById("productFilter"); // The dropdown select element
  if (!filter) return;

  var selected = filter.value; // What category did user choose?
  var cards = document.querySelectorAll(".product-card");

  for (var i = 0; i < cards.length; i += 1) {
    var category = cards[i].getAttribute("data-category");

    // If 'all' is selected or the card matches the category, show it
    if (selected === "all" || category === selected) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none"; // Hide otherwise
    }
  }
}

// Checks if the feedback form is filled out correctly before sending
function validateFeedbackForm(event) {
  var form = getById("feedbackForm");
  if (!form) return true;

  var nameInput = getById("name");
  var emailInput = getById("email");
  var messageInput = getById("message");
  var errorBox = getById("formError");
  
  // A simple pattern to check if email looks like "text@text.text"
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameInput || !emailInput || !messageInput || !errorBox) return true;

  var name = nameInput.value.trim();
  var email = emailInput.value.trim();
  var message = messageInput.value.trim();

  errorBox.textContent = ""; // Clear any old error messages

  // Name must be at least 3 characters
  if (name.length < 3) {
    event.preventDefault(); // Stop form from sending
    errorBox.textContent = "Name should be at least 3 characters.";
    return false;
  }

  // Email must be valid
  if (!emailPattern.test(email)) {
    event.preventDefault(); // Stop form from sending
    errorBox.textContent = "Please enter a valid email address.";
    return false;
  }

  // If everything is okay, show success popup!
  event.preventDefault(); // We stop it just to show popup, normally it would send to server
  showPopup("Thank you! Your feedback was submitted successfully.");
  form.reset(); // Clear the form inputs
  return true;
}

// Toggles the team members section visibility
function bindTeamToggleButton() {
  var toggleBtn = getById("teamToggleBtn");
  var teamSection = getById("teamMembersSection");

  if (!toggleBtn || !teamSection) return;

  toggleBtn.addEventListener("click", function () {
    var isHidden = teamSection.hasAttribute("hidden"); // Check if hidden

    if (isHidden) {
      teamSection.removeAttribute("hidden"); // Show it
      toggleBtn.textContent = "Hide Team Members"; // Change button text
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      teamSection.setAttribute("hidden", ""); // Hide it
      toggleBtn.textContent = "Show Our Team Members"; // Change button text
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Closes the team member details popup
function closeTeamMemberModal() {
  closeModal(getById("teamMemberModal"));
}

// Opens popup for team members when clicked
function bindTeamMemberPopups() {
  var buttons = document.querySelectorAll(".team-member-name-btn");
  var modal = getById("teamMemberModal");
  var closeBtn = getById("teamMemberModalClose");
  var modalImage = getById("teamMemberModalImage");
  var modalName = getById("teamMemberModalName");
  var modalAbout = getById("teamMemberModalAbout");

  // Make sure all parts exist
  if (!buttons.length || !modal || !closeBtn || !modalImage || !modalName || !modalAbout) {
    return;
  }

  // Add click to each team member button
  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function () {
      // Get info from button attributes
      var name = this.getAttribute("data-name") || "Team Member";
      var about = this.getAttribute("data-about") || "";
      var photo = this.getAttribute("data-photo") || "";

      // Fill in the popup
      modalName.textContent = name;
      // modalRole.textContent = "Role: " + role; // Removed role display
      var skillsOnly = about.split(' Interest:')[0];
      modalAbout.textContent = skillsOnly;
      modalImage.src = photo;
      modalImage.alt = "Photo of " + name;

      // Show popup
      openModal(modal);
    });
  }

  // Close when X is clicked
  closeBtn.addEventListener("click", closeTeamMemberModal);

  // Close when clicking outside box
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeTeamMemberModal();
    }
  });
}

// Automatically changes the background picture on the hero section (home page top banner)
function startHeroBackgroundSlider() {
  var hero = document.querySelector(".hero");
  if (!hero) return; // If not on home page, do nothing

  // List of images to slide through
  var heroImages = [
    "../images/hero-bg.png",
    "../images/hero-bg-2.png",
    "../images/hero-bg-3.png",
    "../images/hero-bg-4.png  "
  ];

  var currentIndex = 0; // Start with first image

  // Change image every 2 seconds (2000 milliseconds)
  window.setInterval(function () {
    currentIndex = currentIndex + 1; // Move to next image
    if (currentIndex >= heroImages.length) {
      currentIndex = 0; // Restart from the beginning
    }

    // Apply the new background image to the hero section
    hero.style.backgroundImage = 'url("' + heroImages[currentIndex] + '")';
    hero.style.backgroundPosition = "center";
    hero.style.backgroundSize = "cover";
    hero.style.backgroundRepeat = "no-repeat";
  }, 2000);
}

// Controls the "Read More" and "Show Less" text in the research section
function bindResearchReadMoreButton() {
  var readMoreBtn = getById("researchReadMoreBtn");
  var showLessBtn = getById("researchShowLessBtn");
  var summarySection = getById("researchSummarySection");

  if (!readMoreBtn || !showLessBtn || !summarySection) return;

  // Show text when "Read More" is clicked
  readMoreBtn.addEventListener("click", function () {
    summarySection.removeAttribute("hidden");
    readMoreBtn.style.display = "none";
    showLessBtn.style.display = "inline-block";
  });

  // Hide text when "Show Less" is clicked
  showLessBtn.addEventListener("click", function () {
    summarySection.setAttribute("hidden", "");
    showLessBtn.style.display = "none";
    readMoreBtn.style.display = "inline-block";
  });
}

// -----------------------------
// 8) Site initialization (Starts everything)
// -----------------------------

// This is the main function that runs when the web page loads
function initSite() {
  updateCurrentDate(); // Show today's date

  // Setup everything related to the Cart
  bindAddToCartButtons();
  bindProductModalAddToCart();
  bindCartDrawerButtons();
  bindClearButtonsOnOldPages();
  
  // Refresh what the cart shows on screen initially
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();

  // Setup all Popups (Modals)
  bindProductCardPopups();
  bindBlogCardPopups();
  bindTeamMemberPopups();
  bindEscapeToCloseModals();

  // Setup the Product category filter (if on products page)
  var filter = getById("productFilter");
  if (filter) {
    filter.addEventListener("change", filterProducts);
    filterProducts(); // Filter immediately based on current selection
  }

  // Setup the Feedback form validation
  var form = getById("feedbackForm");
  if (form) {
    form.addEventListener("submit", validateFeedbackForm);
  }

  // Setup the Welcome button on the home page
  var welcomeBtn = getById("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      showPopup("Namaste from Pokhara! Welcome to UrbanSprout Nepal.");
    });
  }

  // Start remaining features
  bindTeamToggleButton();
  startHeroBackgroundSlider();
  bindResearchReadMoreButton();
}

// The browser waits for the HTML document to fully load before running initSite
document.addEventListener("DOMContentLoaded", initSite);
