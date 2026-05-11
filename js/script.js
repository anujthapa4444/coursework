// you have to type: document.getElementById("my-id"). That's so long!
// Let's create a shortcut function called 'getById' to save our fingers.
function getById(id) {
  return document.getElementById(id);
}

// This function shows a simple alert box on your screen.
function showPopup(message) {
  window.alert(message); // window.alert is a built-in browser tool
}

// A "Modal" is just a fancy word for a popup window that overlays your page.
function openModal(modalElement) {
  if (!modalElement) return; // If we couldn't find the modal, stop right here.

  // We remove the "hidden" class from the modal's HTML, which makes it appear!
  modalElement.classList.remove("hidden");
  modalElement.setAttribute("aria-hidden", "false");
}

function closeModal(modalElement) {
  if (!modalElement) return; // Stop if no modal is found

  // We add the "hidden" class back, which makes it disappear!
  modalElement.classList.add("hidden");
  modalElement.setAttribute("aria-hidden", "true");
}


// ==========================================
//     SECTION 2: Product Modals (Popups)
// ==========================================
// These functions handle what happens when you click on products.

// This opens the popup and fills it with the right product info
function openProductModal(card) {
  // It takes all the empty pieces of our popup window
  var modal = getById("productModal");
  var modalImage = getById("modalProductImage");
  var modalName = getById("modalProductName");
  var modalPrice = getById("modalProductPrice");
  var modalDescription = getById("modalProductDescription");

  // If any piece is missing, stop the code so it doesn't crash!
  if (!modal || !modalImage || !modalName || !modalPrice || !modalDescription) return;

  // Now, grab the info from the specific card you just clicked on!
  // querySelector looks inside the card for the first image, first h3, etc.
  var cardImage = card.querySelector("img");
  var cardTitle = card.querySelector("h3");
  var cardPrice = card.querySelector("strong");
  var paragraphs = card.querySelectorAll("p");
  var cardDescription = "";

  if (paragraphs.length > 1) {
    cardDescription = paragraphs[1].textContent.trim();
  }

  // We want just the number from the price, so we strip away letters like "NPR"
  var rawPrice = "";
  if (cardPrice) {
    rawPrice = cardPrice.textContent.replace(/[^0-9.]/g, "");
  }

  // Time to put the card's info INTO the popup window!
  modalImage.src = cardImage ? cardImage.src : "";
  modalImage.alt = cardImage ? cardImage.alt : "Product image";
  modalName.textContent = cardTitle ? cardTitle.textContent : "Product details";
  modalPrice.textContent = cardPrice ? "Price: " + cardPrice.textContent : "";
  modalDescription.textContent = cardDescription;

  // We secretly save the product name and price into the popup itself.
  // Why? So when you click "Add to Cart" inside the popup, it knows WHAT to add!
  modal.dataset.productName = cardTitle ? cardTitle.textContent : "";
  modal.dataset.productPrice = rawPrice;

  // Show the popup!
  openModal(modal);
}

// A simple shortcut to close the product popup
function closeProductModal() {
  closeModal(getById("productModal"));
}

// This function goes through all your products and makes them clickable
function bindProductCardPopups() {
  var cards = document.querySelectorAll(".product-card"); // Finds ALL product cards
  var modal = getById("productModal");
  var closeBtn = getById("productModalClose");

  if (!cards.length || !modal || !closeBtn) return;

  // A "for loop" is like a machine that repeats an action.
  // Here, it goes to every single card and adds an "event listener".
  // An event listener waits for something to happen, like a "click".
  for (var i = 0; i < cards.length; i += 1) {
    cards[i].addEventListener("click", function (event) {
      // If you accidentally clicked the "Add to Cart" button ON the card,
      // we don't want to open the popup. So we check for that and stop if true.
      var clickedInsideButton = event.target.closest(".btn");
      if (clickedInsideButton) return;

      // 'this' refers to the specific card you clicked. 
      openProductModal(this);
    });
  }

  // Listen for a click on the little 'X' button to close the popup
  closeBtn.addEventListener("click", closeProductModal);

  // If you click in the dark background outside the popup, close it too!
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeProductModal();
    }
  });
}

// Connects the "Add to Cart" button that lives INSIDE the product popup
function bindProductModalAddToCart() {
  var addBtn = getById("modalAddToCartBtn");
  var modal = getById("productModal");

  if (!addBtn || !modal) return;

  // When you click it...
  addBtn.addEventListener("click", function () {
    // We read those secret details we saved earlier
    var productName = modal.dataset.productName || "";
    var productPrice = modal.dataset.productPrice || "";

    if (productName && productPrice) {
      // Send them to our cart!
      addToCart(productName, productPrice);
    }
  });
}


// ==========================================
// SECTION 3: Blog Modals (Popups)
// ==========================================
// This section is almost exactly like the product popups, but for blog posts!

function openBlogModal(card) {
  var modal = getById("blogModal");
  var modalImage = getById("modalBlogImage");
  var modalTopic = getById("modalBlogTopic");
  var modalTitle = getById("modalBlogTitle");
  var modalSummary = getById("modalBlogSummary");
  var modalDetail = getById("modalBlogDetail");
  var modalTip = getById("modalBlogTip");

  if (!modal || !modalImage || !modalTopic || !modalTitle || !modalSummary || !modalDetail || !modalTip) {
    return;
  }

  // Grab info from the clicked blog card
  var cardImage = card.querySelector("img");
  var cardTopic = card.querySelector(".badge");
  var cardTitle = card.querySelector("h3");
  var cardSummary = card.querySelector("p");
  // 'getAttribute' gets custom data we hid in the HTML, like 'data-detail'
  var cardDetail = card.getAttribute("data-detail") || "";
  var cardTip = card.getAttribute("data-tip") || "";

  // Fill the popup with that info
  modalImage.src = cardImage ? cardImage.src : "";
  modalImage.alt = cardImage ? cardImage.alt : "Blog topic image";
  modalTopic.textContent = cardTopic ? cardTopic.textContent : "Blog";
  modalTitle.textContent = cardTitle ? cardTitle.textContent : "Blog details";
  modalSummary.textContent = cardSummary ? cardSummary.textContent : "";
  modalDetail.textContent = cardDetail;
  modalTip.textContent = cardTip;

  // Ta-da! Open it.
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

  // Add click listeners to every blog card
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

// The "Escape Key" Trick
// Most professional websites let you close popups by hitting 'Escape' on your keyboard.
// Let's add that cool feature!
function bindEscapeToCloseModals() {
  // Listen to the whole document for any key being pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // If it's the Escape key, close ALL possible popups just to be safe
      closeProductModal();
      closeBlogModal();
      closeTeamMemberModal();
    }
  });
}


// ==========================================
// SECTION 4: Cart Data (The Brains of the Cart)
// ==========================================

// This is an "Array" (a list). We use it to hold all the items you buy.
// Note: This is a "simple" cart. If you refresh the page, the browser forgets it.
// To make it remember forever, you'd use something called "localStorage", but 
// let's keep it simple for now!
var mySimpleCart = [];

// A quick way to see what's inside our cart
function getCart() {
  return mySimpleCart;
}

// A way to save new changes to our cart
function saveCart(cartArray) {
  mySimpleCart = cartArray;
}

// Emptying the cart is as simple as saving an empty list! [] means empty list.
function clearCart() {
  saveCart([]);
}

// The "Find Item" Detective
// If you add a "Tomato Plant" to the cart, we need to check if you ALREADY 
// have a Tomato Plant in there. If you do, we just add +1 to the quantity!
function findItemIndex(cartArray, itemName) {
  for (var i = 0; i < cartArray.length; i += 1) {
    if (cartArray[i].name === itemName) {
      return i; // We found it! We return its position number (index)
    }
  }
  return -1; // -1 is a programmer's way of saying "I didn't find it anywhere"
}

// The "Math Calculator" for the Cart
function calculateCartTotals(cartArray) {
  var totals = { totalPrice: 0, totalQty: 0 }; // Start with a zero

  for (var i = 0; i < cartArray.length; i += 1) {
    // To get the total price, we do: current total + (price of item * how many you bought)
    totals.totalPrice = totals.totalPrice + (cartArray[i].price * cartArray[i].qty);

    // To get the total count, we just add the quantities together
    totals.totalQty = totals.totalQty + cartArray[i].qty;
  }

  return totals;
}

// The "Add It To Cart" Action
function addToCart(name, price) {
  var cart = getCart(); // Grab our current cart list
  var index = findItemIndex(cart, name); // Detective checks if it's already there

  if (index === -1) {
    // -1 means NOT found! So we push a brand new item into our list
    cart.push({
      name: name,
      price: Number(price), // 'Number()' makes sure it's treated as math, not text
      qty: 1 // Start with 1 of these
    });
  } else {
    // We found it! Just increase the quantity by 1
    cart[index].qty = cart[index].qty + 1;
  }

  saveCart(cart); // Save our changes
  showAlertBar(name + " added to cart!"); // Show a cool toast notification

  // Now we must update the screen so the user sees the changes!
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();
}

// The "Change Quantity" Action (Used by the + and - buttons)
function updateItemQuantity(itemName, change) {
  var cart = getCart();
  var index = findItemIndex(cart, itemName);

  if (index === -1) return; // If item isn't in the cart, ignore it

  // Apply the change. 'change' could be +1 or -1
  cart[index].qty = cart[index].qty + change;

  // If you subtract too many and hit 0, we should delete the item completely!
  if (cart[index].qty <= 0) {
    cart.splice(index, 1); // 'splice' is a magic word that removes an item from a list
  }

  saveCart(cart); // Save changes

  // Update the screen!
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();
}


// ==========================================
// SECTION 5: Cart UI (Updating what you see)
// ==========================================
// These functions take the data from our `mySimpleCart` list and draw it
// on the webpage using HTML.

// Draws the cart on the main Cart Page
function renderCartPage() {
  // Grab the table body and the spots where we show totals
  var body = getById("cartBody") || getById("estimateBody");
  var totalTarget = getById("cartTotal") || getById("estimateTotal");
  var countTarget = getById("cartItems") || getById("estimateItems");

  if (!body || !totalTarget || !countTarget) return; // Skip if we aren't on the cart page

  var cart = getCart();
  body.innerHTML = ""; // Clear out the old HTML drawing so we can redraw fresh

  // If cart is empty, show a sad empty message
  if (cart.length === 0) { // cart.length tells us how many items are inside
    body.innerHTML = '<tr><td colspan="4">Your cart is feeling a bit empty. <a href="products.html">Go Shopping!</a></td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";
    return;
  }

  // Draw a row for every item in the cart!
  for (var i = 0; i < cart.length; i += 1) {
    var item = cart[i];
    var lineTotal = item.price * item.qty; // Cost for just this group of items

    // We build a piece of HTML code and shove it inside the table body!
    body.innerHTML +=
      "<tr><td>" + item.name + "</td>" +
      "<td>NPR " + item.price + "</td>" +
      "<td>" + item.qty + "</td>" +
      "<td>NPR " + lineTotal + "</td></tr>";
  }

  // Calculate overall totals and show them
  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);
}

// Draws the mini cart that sits on the sidebar
function renderCartSidebar() {
  var body = getById("sidebarCartBody");
  var totalTarget = getById("sidebarCartTotal");
  var countTarget = getById("sidebarCartItems");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = ""; // Clear it

  if (cart.length === 0) {
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

// Draws the slide-out cart (the "Drawer" that pops from the side of the screen)
function renderCartDrawer() {
  var body = getById("drawerCartBody");
  var totalTarget = getById("drawerCartTotal");
  var countTarget = getById("drawerCartItems");
  var shopNowBtn = getById("shopNowBtn");
  var clearBtn = getById("clearDrawerCartBtn");

  if (!body || !totalTarget || !countTarget) return;

  var cart = getCart();
  body.innerHTML = "";

  if (cart.length === 0) {
    body.innerHTML = '<tr><td colspan="2">Your cart is empty. Let\'s fix that!</td></tr>';
    totalTarget.textContent = "NPR 0";
    countTarget.textContent = "0";

    // Since it's empty, we show the "Shop Now" button and hide "Clear Cart"
    if (shopNowBtn) shopNowBtn.style.display = "block";
    if (clearBtn) clearBtn.style.display = "none";
    return;
  }

  // Since we have items, we hide "Shop Now" and show the "Clear Cart" button
  if (shopNowBtn) shopNowBtn.style.display = "none";
  if (clearBtn) clearBtn.style.display = "block";

  // For the drawer, we add cool + and - buttons to adjust quantities easily!
  for (var i = 0; i < cart.length; i += 1) {
    var item = cart[i];

    // Notice the class="qty-minus" and class="qty-plus". We will use these below!
    body.innerHTML +=
      "<tr><td>" + item.name + "</td>" +
      "<td style=\"text-align: center;\">" +
      "<button class=\"qty-btn qty-minus\" data-item=\"" + item.name + "\">−</button> " +
      item.qty +
      " <button class=\"qty-btn qty-plus\" data-item=\"" + item.name + "\">+</button>" +
      "</td></tr>";
  }

  var totals = calculateCartTotals(cart);
  totalTarget.textContent = "NPR " + totals.totalPrice;
  countTarget.textContent = String(totals.totalQty);

  // Remember those + and - buttons we just drew? We need to activate them!
  bindDrawerQuantityButtons();
}

// Wakes up the + and - buttons inside the drawer so they actually work
function bindDrawerQuantityButtons() {
  var plusButtons = document.querySelectorAll(".qty-plus");
  var minusButtons = document.querySelectorAll(".qty-minus");

  // Hook up the PLUS buttons
  for (var i = 0; i < plusButtons.length; i += 1) {
    plusButtons[i].addEventListener("click", function () {
      var itemName = this.getAttribute("data-item"); // Figure out which item they clicked
      updateItemQuantity(itemName, 1); // Add 1
    });
  }

  // Hook up the MINUS buttons
  for (var j = 0; j < minusButtons.length; j += 1) {
    minusButtons[j].addEventListener("click", function () {
      var itemName = this.getAttribute("data-item");
      updateItemQuantity(itemName, -1); // Subtract 1
    });
  }
}


// ==========================================
// SECTION 6: Cart Buttons (Clicks and Swipes)
// ==========================================

// Opens the slide-out cart drawer on the right side
function openCartDrawer() {
  var drawer = getById("cartDrawer");
  var backdrop = getById("cartDrawerBackdrop"); // The dark shadow behind it

  if (!drawer || !backdrop) return;

  renderCartDrawer(); // Make sure the items shown are up-to-date!

  // Adding the "open" class triggers CSS to slide it smoothly onto the screen
  drawer.classList.add("open");
  backdrop.classList.add("visible");
  drawer.setAttribute("aria-hidden", "false");
}

// Closes it by sliding it back out
function closeCartDrawer() {
  var drawer = getById("cartDrawer");
  var backdrop = getById("cartDrawerBackdrop");

  if (!drawer || !backdrop) return;

  drawer.classList.remove("open");
  backdrop.classList.remove("visible");
  drawer.setAttribute("aria-hidden", "true");
}

// When you click "Shop Now", it sends you to the products page!
function handleShopNowClick() {
  var currentPath = window.location.pathname;

  // If you're already ON the products page, just close the drawer.
  if (currentPath.indexOf("products.html") !== -1) {
    closeCartDrawer();
    return;
  }

  // Otherwise, teleport them to the products page.
  // We check if we are in the main folder or a sub-folder to get the link right.
  if (currentPath.includes('/pages/')) {
    window.location.href = 'products.html';
  } else {
    window.location.href = 'pages/products.html';
  }
}

// Attaches the events to open/close cart buttons
function bindCartDrawerButtons() {
  var openBtn = getById("openCartBtn");
  var closeBtn = getById("closeCartDrawer");
  var backdrop = getById("cartDrawerBackdrop");
  var clearBtn = getById("clearDrawerCartBtn");
  var shopNowBtn = getById("shopNowBtn");

  if (openBtn) openBtn.addEventListener("click", openCartDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeCartDrawer);
  if (backdrop) backdrop.addEventListener("click", closeCartDrawer); // Clicking the dark background closes it too

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart(); // Delete everything!
      renderCartPage();
      renderCartSidebar();
      renderCartDrawer();
      showAlertBar("Cart cleared like magic!");
    });
  }

  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", handleShopNowClick);
  }
}

// Finds every single "Add to Cart" button on the webpage and activates it!
function bindAddToCartButtons() {
  var buttons = document.querySelectorAll(".add-to-cart-btn");
  if (!buttons.length) return;

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function () {
      // It reads the hidden name and price from the button's HTML data
      var name = this.getAttribute("data-name");
      var price = this.getAttribute("data-price");
      addToCart(name, price);
    });
  }
}

// Buttons from old pages to clear the cart
function bindClearButtonsOnOldPages() {
  var clearBtn = getById("clearCartBtn") || getById("clearEstimateBtn");
  var clearSidebarBtn = getById("clearSidebarCartBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      clearCart();
      renderCartPage();
      showAlertBar("Cart totally cleared!");
    });
  }

  if (clearSidebarBtn) {
    clearSidebarBtn.addEventListener("click", function () {
      clearCart();
      renderCartSidebar();
      showAlertBar("Cart totally cleared!");
    });
  }
}


// ==========================================
// SECTION 7: Extra Cool Features
// ==========================================

// Puts today's actual date on the webpage so it feels alive
function updateCurrentDate() {
  var target = getById("todayDate");
  if (!target) return;
  // new Date().toDateString() gives us a readable date like "Wed Apr 29 2026"
  target.textContent = new Date().toDateString();
}

// The Category Filter (shows only "Plants" or "Seeds" when you select them from a dropdown)
function filterProducts() {
  var filter = getById("productFilter");
  if (!filter) return;

  var selected = filter.value; // What did the user pick? e.g. "tools"
  var cards = document.querySelectorAll(".product-card");

  for (var i = 0; i < cards.length; i += 1) {
    var category = cards[i].getAttribute("data-category");

    // If they picked "all", OR if the card matches the pick, show it!
    if (selected === "all" || category === selected) {
      cards[i].style.display = "block"; // Show
    } else {
      cards[i].style.display = "none"; // Hide
    }
  }
}

// The bouncer for our Contact Form. Checks if you typed everything correctly!
function validateFeedbackForm(event) {
  var form = getById("feedbackForm");
  if (!form) return true;

  var nameInput = getById("name");
  var emailInput = getById("email");
  var messageInput = getById("message");
  var errorBox = getById("formError");

  // This scary looking code is called a "Regular Expression" (RegEx).
  // It's like a secret code that checks if an email looks right (e.g., text@text.com)
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameInput || !emailInput || !messageInput || !errorBox) return true;

  // .trim() removes extra spaces if you accidentally typed spaces at the beginning or end
  var name = nameInput.value.trim();
  var email = emailInput.value.trim();
  var message = messageInput.value.trim();

  errorBox.textContent = ""; // Clear old error messages

  // Rule 1: Name must be at least 3 letters
  if (name.length < 3) {
    event.preventDefault(); // Stop! Don't send the form!
    errorBox.textContent = "Oops! Name should be at least 3 characters.";
    return false;
  }

  // Rule 2: Email must look like a real email
  if (!emailPattern.test(email)) {
    event.preventDefault();
    errorBox.textContent = "Hmm, that doesn't look like a real email address.";
    return false;
  }

  // If you passed all the rules, congratulations! 
  event.preventDefault(); // Normally we'd send it to a server, but we stop it here to just show a popup
  showPopup("Awesome! Thank you for your feedback!");
  form.reset(); // Erase what was typed to give them a clean slate
  return true;
}

// A button that shows or hides the Team Members section
function bindTeamToggleButton() {
  var toggleBtn = getById("teamToggleBtn");
  var teamSection = getById("teamMembersSection");

  if (!toggleBtn || !teamSection) return;

  toggleBtn.addEventListener("click", function () {
    var isHidden = teamSection.hasAttribute("hidden"); // Is it hidden right now?

    if (isHidden) {
      teamSection.removeAttribute("hidden"); // Unhide it!
      toggleBtn.textContent = "Hide Team Members"; // Change what the button says
      toggleBtn.setAttribute("aria-expanded", "true");
    } else {
      teamSection.setAttribute("hidden", ""); // Hide it!
      toggleBtn.textContent = "Show Our Team Members";
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function closeTeamMemberModal() {
  closeModal(getById("teamMemberModal"));
}

// Opens a popup when you click on a team member's name
function bindTeamMemberPopups() {
  var buttons = document.querySelectorAll(".team-member-name-btn");
  var modal = getById("teamMemberModal");
  var closeBtn = getById("teamMemberModalClose");
  var modalImage = getById("teamMemberModalImage");
  var modalName = getById("teamMemberModalName");
  var modalAbout = getById("teamMemberModalAbout");

  if (!buttons.length || !modal || !closeBtn || !modalImage || !modalName || !modalAbout) return;

  for (var i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener("click", function () {
      var name = this.getAttribute("data-name") || "Team Member";
      var about = this.getAttribute("data-about") || "";
      var photo = this.getAttribute("data-photo") || "";

      modalName.textContent = name;

      // We grab just the skills part, cutting off at the word 'Interest:'
      var skillsOnly = about.split(' Interest:')[0];
      modalAbout.textContent = skillsOnly;

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

// The Automatic Image Slider for the Home Page banner
function startHeroBackgroundSlider() {
  var hero = document.querySelector(".hero"); // Find the big top banner section
  if (!hero) return; // Stop if we aren't on the home page

  // A list (Array) of 4 cool pictures to slide through
  var heroImages = [
    "images/hero-bg.png",
    "images/home-bg-2.png",
    "images/home-bg-3.png",
    "images/home-bg-4.png"
  ];

  var currentIndex = 0; // We start at picture 0 (the first one)

  // window.setInterval is like a ticking clock. 
  // It runs this code over and over every 2000 milliseconds (2 seconds)
  window.setInterval(function () {
    currentIndex = currentIndex + 1; // Move to the next picture

    // If we reach the end of our list, go back to the start!
    if (currentIndex >= heroImages.length) {
      currentIndex = 0;
    }

    // Change the background image using CSS from JavaScript!
    hero.style.backgroundImage = 'url("' + heroImages[currentIndex] + '")';
    hero.style.backgroundPosition = "center";
    hero.style.backgroundSize = "cover";
    hero.style.backgroundRepeat = "no-repeat";
  }, 2000); // 2000 ms = 2 seconds
}

// A simple button on the Research page to expand large paragraphs of text
function bindResearchReadMoreButton() {
  var readMoreBtn = getById("researchReadMoreBtn");
  var showLessBtn = getById("researchShowLessBtn");
  var summarySection = getById("researchSummarySection");

  if (!readMoreBtn || !showLessBtn || !summarySection) return;

  // When you click "Read More"...
  readMoreBtn.addEventListener("click", function () {
    summarySection.removeAttribute("hidden"); // Show the huge text
    readMoreBtn.style.display = "none"; // Hide the "Read More" button
    showLessBtn.style.display = "inline-block"; // Show the "Show Less" button instead
  });

  // When you click "Show Less"...
  showLessBtn.addEventListener("click", function () {
    summarySection.setAttribute("hidden", ""); // Hide the huge text
    showLessBtn.style.display = "none"; // Hide the "Show Less" button
    readMoreBtn.style.display = "inline-block"; // Bring back the "Read More" button
  });
}


// ==========================================
// SECTION 8: START YOUR ENGINES! (Site Initialization)
// ==========================================
// This is the Master Controller. It runs all our setup functions 
// as soon as the page is ready.

function initSite() {
  updateCurrentDate(); // 1. Put the date on screen

  // 2. Wake up all cart-related buttons
  bindAddToCartButtons();
  bindProductModalAddToCart();
  bindCartDrawerButtons();
  bindClearButtonsOnOldPages();

  // 3. Draw the cart on the screen so it isn't blank
  renderCartPage();
  renderCartSidebar();
  renderCartDrawer();

  // 4. Wake up all popup windows so they open when clicked
  bindProductCardPopups();
  bindBlogCardPopups();
  bindTeamMemberPopups();
  bindEscapeToCloseModals();

  // 5. Setup the Category dropdown filter
  var filter = getById("productFilter");
  if (filter) {
    filter.addEventListener("change", filterProducts); // Run filter when dropdown changes
    filterProducts(); // Also run it once immediately
  }

  // 6. Setup the Contact form bouncer
  var form = getById("feedbackForm");
  if (form) {
    form.addEventListener("submit", validateFeedbackForm);
  }

  // 7. A cute little Welcome button on the homepage
  var welcomeBtn = getById("welcomeBtn");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", function () {
      showPopup("Namaste from Pokhara! Welcome to UrbanSprout Nepal!");
    });
  }

  // 8. Turn on the remaining features
  bindTeamToggleButton();
  startHeroBackgroundSlider();
  bindResearchReadMoreButton();
}

// This line is super important! 
// It tells the browser: "Wait until the HTML is 100% loaded and ready. 
// THEN, and only then, run the initSite function to start everything up!"
document.addEventListener("DOMContentLoaded", initSite);
