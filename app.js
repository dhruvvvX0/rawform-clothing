
(() => {
  "use strict";

  // RAWFORM® PRODUCT CATALOGUE
  // Sample prices in INR.

  const products = [
    // TEES
    { id: 1, name: "SIGNAL OVERSIZED TEE", price: 1299, category: "tees", color: "Off-white", image: "photo-1521572163474-6864f9cf17ab" },
    { id: 2, name: "RAW GRAPHIC TEE", price: 1499, category: "tees", color: "Black", image: "photo-1503341504253-dff4815485f1" },
    { id: 3, name: "CORE HEAVYWEIGHT TEE", price: 1199, category: "tees", color: "White", image: "photo-1576566588028-4147f3842f27" },

    // TROUSERS
    { id: 4, name: "UTILITY CARGO TROUSER", price: 2499, category: "trousers", color: "Olive", image: "photo-1515886657613-9f3515b0c78f" },
    { id: 5, name: "RELAXED FIT TROUSER", price: 2199, category: "trousers", color: "Stone", image: "photo-1473966968600-fa801b869a1a" },
    { id: 6, name: "WIDE LEG TROUSER", price: 2699, category: "trousers", color: "Black", image: "photo-1517438476312-10d79c077509" },

    // PANTS & JEANS
    { id: 7, name: "DISTRESSED DENIM JEANS", price: 2799, category: "pants", color: "Blue denim", image: "photo-1542272604-787c3835535d" },
    { id: 8, name: "FORM TRACK PANTS", price: 1899, category: "pants", color: "Black", image: "photo-1552902865-b72c031ac5ea" },
    { id: 9, name: "BAGGY DENIM PANTS", price: 2899, category: "pants", color: "Washed blue", image: "photo-1512436991641-6745cdb1723f" },

    // JACKETS
    { id: 10, name: "UTILITY SHELL JACKET", price: 4299, category: "jackets", color: "Black", image: "photo-1551028719-00167b16eac5" },
    { id: 11, name: "STREET BOMBER", price: 3999, category: "jackets", color: "Charcoal", image: "photo-1591047139829-d91aecb6caea" },
    { id: 12, name: "DENIM WORK JACKET", price: 3699, category: "jackets", color: "Blue denim", image: "photo-1544923246-77307dd654cb" },

    // BAGS
    { id: 13, name: "UTILITY SLING BAG", price: 1499, category: "bags", color: "Black", image: "photo-1553062407-98eeb64c6a62" },
    { id: 14, name: "EVERYDAY BACKPACK", price: 2299, category: "bags", color: "Black", image: "photo-1622560480654-d96214fdc887" },
    { id: 15, name: "CROSSBODY BAG", price: 1299, category: "bags", color: "Grey", image: "photo-1548036328-c9fa89d128fa" },

    // CAPS
    { id: 16, name: "RAWFORM BASEBALL CAP", price: 799, category: "caps", color: "Black", image: "photo-1588850561407-ed78c282e89b" },
    { id: 17, name: "EVERYDAY SNAPBACK", price: 899, category: "caps", color: "Stone", image: "photo-1521369909029-2afed882baee" },
    { id: 18, name: "MINIMAL DAD CAP", price: 699, category: "caps", color: "Olive", image: "photo-1534215754734-18e55d13e346" },

    // HOODIES
    { id: 19, name: "FORM OVERSIZED HOODIE", price: 2499, category: "hoodies", color: "Grey", image: "photo-1556821840-3a63f95609a7" },
    { id: 20, name: "CORE PULLOVER", price: 2299, category: "hoodies", color: "Black", image: "photo-1578681994506-b8f463449011" },
    { id: 21, name: "RAW CREWNECK", price: 1999, category: "hoodies", color: "Bone", image: "photo-1578768079052-aa76e52ff62e" },

    // ACCESSORIES
    { id: 22, name: "STREET SOCKS SET", price: 499, category: "accessories", color: "White", image: "photo-1586350977771-b3b0abba4e95" },
    { id: 23, name: "UTILITY BELT", price: 699, category: "accessories", color: "Black", image: "photo-1553062407-98eeb64c6a62" },
    { id: 24, name: "EVERYDAY WALLET", price: 999, category: "accessories", color: "Black", image: "photo-1627123424574-724758594e93" }
  ];

  const categoryNames = {
    tees: "TEES",
    trousers: "TROUSERS",
    pants: "PANTS & JEANS",
    jackets: "JACKETS",
    bags: "BAGS",
    caps: "CAPS",
    hoodies: "HOODIES",
    accessories: "ACCESSORIES"
  };

  const colorOptions = [
    "Black", "White", "Off-white", "Grey", "Stone",
    "Olive", "Bone", "Charcoal", "Blue denim", "Washed blue"
  ];

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const money = amount =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);

  // Supports full URLs and Unsplash photo IDs.
  function imageURL(image) {
    if (!image) return fallbackImage();

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=800&q=85`;
  }

  const bag = new Map();

  let activeFilter = "all";
  let selectedProduct = null;
  let selectedSize = "M";
  let selectedColor = "Black";
  let toastTimer;

  const grid = $("#products-grid");
  const dialog = $("#product-dialog");
  const toast = $("#toast");

  // RAWFORM fallback image.
  function fallbackImage() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
        <rect width="400" height="500" fill="#c9ff00"/>
        <text x="22" y="435" font-family="Arial" font-weight="900"
          font-size="42" fill="#171813">RAWFORM®</text>
      </svg>`;

    return "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(svg);
  }

  function setImageFallback(img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackImage();
    };
  }

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // PRODUCT CARDS
  function renderProducts() {
    if (!grid) {
      console.error('Missing element: #products-grid');
      return;
    }

    const visibleProducts = products.filter(product =>
      activeFilter === "all" ||
      product.category === activeFilter
    );

    grid.replaceChildren();

    const countElement = $("#product-count");

    if (countElement) {
      countElement.textContent =
        `${visibleProducts.length} ${visibleProducts.length === 1 ? "PIECE" : "PIECES"}`;
    }

    visibleProducts.forEach(product => {
      const card = document.createElement("article");
      card.className = "product";

      const imageButton = document.createElement("button");
      imageButton.type = "button";
      imageButton.className = "product-image";
      imageButton.setAttribute("aria-label", `View ${product.name}`);

      const img = document.createElement("img");
      img.src = imageURL(product.image);
      img.alt = product.name;
      img.loading = "lazy";
      img.decoding = "async";
      setImageFallback(img);

      const tag = document.createElement("span");
      tag.className = "product-tag";
      tag.textContent =
        `RF—${String(product.id).padStart(2, "0")} / ${categoryNames[product.category]}`;

      const quickAdd = document.createElement("span");
      quickAdd.className = "quick-add";
      quickAdd.textContent = "VIEW PRODUCT ↗";

      imageButton.append(img, tag, quickAdd);

      imageButton.addEventListener("click", () => {
        openProduct(product);
      });

      const info = document.createElement("div");
      info.className = "product-info";

      const description = document.createElement("div");

      const name = document.createElement("h3");
      name.textContent = product.name;

      const color = document.createElement("p");
      color.textContent = product.color.toUpperCase();

      const price = document.createElement("span");
      price.textContent = money(product.price);

      description.append(name, color);
      info.append(description, price);
      card.append(imageButton, info);
      grid.append(card);
    });

    if (visibleProducts.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "NO PRODUCTS FOUND.";
      grid.append(empty);
    }
  }

  // CATEGORY FILTERS
  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      updateActiveFilterButtons();
      renderProducts();
    });
  });

  function updateActiveFilterButtons() {
    $$(".filter").forEach(button => {
      const isActive =
        (button.dataset.filter || "all") === activeFilter;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  // HEADER CATEGORY SHORTCUTS
  $$("[data-nav-category]").forEach(link => {
    link.addEventListener("click", () => {
      activeFilter = link.dataset.navCategory || "all";
      updateActiveFilterButtons();
      renderProducts();
    });
  });

  // OPEN PRODUCT DETAILS
  function openProduct(product) {
    if (!dialog) {
      showToast("Product details are unavailable.");
      return;
    }

    selectedProduct = product;
    selectedSize = "M";
    selectedColor = product.color;

    $("#dialog-name").textContent = product.name;
    $("#dialog-price").textContent = money(product.price);
    $("#dialog-category").textContent =
      `RAWFORM® / ${categoryNames[product.category]}`;

    const image = $("#dialog-image");
    image.src = imageURL(product.image);
    image.alt = product.name;
    setImageFallback(image);

    const colorSelect = $("#product-color");

    colorSelect.replaceChildren();

    const availableColors = [
      product.color,
      ...colorOptions.filter(color => color !== product.color)
    ];

    availableColors.forEach(color => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      colorSelect.append(option);
    });

    colorSelect.value = product.color;

    $("#selected-color-label").textContent =
      product.color.toUpperCase();

    $$("#size-options button").forEach(button => {
      const isSelected = button.dataset.size === selectedSize;

      button.classList.toggle("selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    $("#add-to-bag").disabled = false;

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  // SIZE SELECTION
  $$("#size-options button").forEach(button => {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;

      $$("#size-options button").forEach(sizeButton => {
        const isSelected = sizeButton === button;

        sizeButton.classList.toggle("selected", isSelected);
        sizeButton.setAttribute("aria-pressed", String(isSelected));
      });
    });
  });

  // COLOR SELECTION
  $("#product-color").addEventListener("change", event => {
    selectedColor = event.target.value;
    $("#selected-color-label").textContent =
      selectedColor.toUpperCase();
  });

  $("#close-dialog").addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  // ADD TO BAG
  $("#add-to-bag").addEventListener("click", () => {
    if (!selectedProduct) return;

    const key = [
      selectedProduct.id,
      selectedSize,
      selectedColor
    ].join("-");

    const existing = bag.get(key);

    if (existing) {
      existing.quantity += 1;
    } else {
      bag.set(key, {
        ...selectedProduct,
        size: selectedSize,
        chosenColor: selectedColor,
        quantity: 1
      });
    }

    renderBag();
    dialog.close();
    showToast(`${selectedProduct.name} ADDED TO BAG`);
  });

  // RENDER BAG
  function renderBag() {
    const entries = [...bag.entries()];

    const count = entries.reduce(
      (total, [, item]) => total + item.quantity, 0
    );

    const subtotal = entries.reduce(
      (total, [, item]) => total + item.price * item.quantity, 0
    );

    $("#bag-count").textContent = count;
    $("#drawer-count").textContent = `(${count})`;
    $("#bag-subtotal").textContent = money(subtotal);

    $("#bag-empty").classList.toggle("visible", count === 0);
    $("#bag-items").hidden = count === 0;
    $("#checkout-button").disabled = count === 0;

    const itemsContainer = $("#bag-items");
    itemsContainer.replaceChildren();

    entries.forEach(([key, item]) => {
      const row = document.createElement("article");
      row.className = "bag-line";

      const img = document.createElement("img");
      img.src = imageURL(item.image);
      img.alt = item.name;
      img.loading = "lazy";
      setImageFallback(img);

      const details = document.createElement("div");

      const title = document.createElement("h3");
      title.textContent = item.name;

      const meta = document.createElement("p");
      meta.textContent =
        `SIZE ${item.size} · ${item.chosenColor} · ${money(item.price)}`;

      const bottom = document.createElement("div");
      bottom.className = "bag-line-bottom";

      const quantityControl = document.createElement("div");
      quantityControl.className = "quantity-control";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Decrease quantity");

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Increase quantity");

      minus.addEventListener("click", () => {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          bag.delete(key);
        }

        renderBag();
      });

      plus.addEventListener("click", () => {
        item.quantity += 1;
        renderBag();
      });

      quantityControl.append(minus, quantity, plus);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-item";
      remove.textContent = "REMOVE";

      remove.addEventListener("click", () => {
        bag.delete(key);
        renderBag();
      });

      bottom.append(quantityControl, remove);
      details.append(title, meta, bottom);
      row.append(img, details);
      itemsContainer.append(row);
    });
  }

  // SHOPPING BAG DRAWER
  function openBag() {
    $("#bag-overlay").hidden = false;
    $("#bag-drawer").classList.add("open");
    $("#bag-drawer").setAttribute("aria-hidden", "false");

    document.body.classList.add("bag-open");
    $("#close-bag").focus();
  }

  function closeBag() {
    $("#bag-drawer").classList.remove("open");
    $("#bag-drawer").setAttribute("aria-hidden", "true");

    $("#bag-overlay").hidden = true;
    document.body.classList.remove("bag-open");

    $("#open-bag").focus();
  }

  $("#open-bag").addEventListener("click", openBag);
  $("#close-bag").addEventListener("click", closeBag);
  $("#bag-overlay").addEventListener("click", closeBag);

  $("#continue-shopping").addEventListener("click", () => {
    closeBag();

    $("#collection").scrollIntoView({
      behavior: "smooth"
    });
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      $("#bag-drawer").classList.contains("open")
    ) {
      closeBag();
    }
  });

  // CHECKOUT DEMO
  $("#checkout-button").addEventListener("click", () => {
    if (bag.size === 0) return;

    showToast(
      "DEMO ONLY — CONNECT A PAYMENT PROVIDER TO CHECK OUT"
    );
  });

  // MOBILE NAVIGATION
  const menuToggle = $("#menu-toggle");
  const navigation = $("#navigation");

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // NEWSLETTER DEMO
  $("#newsletter-form").addEventListener("submit", event => {
    event.preventDefault();

    const email = $("#email");

    if (!email.checkValidity()) {
      email.reportValidity();
      return;
    }

    $("#form-message").textContent =
      "THANK YOU! CONNECT AN EMAIL SERVICE TO SAVE SUBSCRIPTIONS.";

    email.value = "";
  });

  // INITIALIZE
  renderProducts();
  renderBag();
})();
