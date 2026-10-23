
document.addEventListener("DOMContentLoaded", () => {

    /* ================= CART DATA ================= */

    let cart = [];


    /* ================= HELPER FUNCTIONS ================= */

    const $ = (selector) => document.querySelector(selector);

    const $$ = (selector) => document.querySelectorAll(selector);


    function money(amount) {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    }


    /* ================= ELEMENTS ================= */

    const cartCount = $("#cart-count");

    const cartDrawer = $("#cart-drawer");

    const cartOverlay = $("#cart-overlay");

    const openCart = $("#open-cart");

    const closeCart = $("#close-cart");

    const continueShopping = $("#continue-shopping");

    const cartItems = $("#cart-items");

    const cartSubtotal = $("#cart-subtotal");

    const checkoutBtn = $("#checkout-btn");


    /* ================= OPEN CART ================= */

    function openCartDrawer() {

        if (!cartDrawer || !cartOverlay) return;

        cartDrawer.classList.add("active");

        cartOverlay.classList.add("active");

        document.body.classList.add("cart-open");
    }


    /* ================= CLOSE CART ================= */

    function closeCartDrawer() {

        if (!cartDrawer || !cartOverlay) return;

        cartDrawer.classList.remove("active");

        cartOverlay.classList.remove("active");

        document.body.classList.remove("cart-open");
    }


    /* ================= CART BUTTONS ================= */

    if (openCart) {
        openCart.addEventListener(
            "click",
            openCartDrawer
        );
    }


    if (closeCart) {
        closeCart.addEventListener(
            "click",
            closeCartDrawer
        );
    }


    if (cartOverlay) {
        cartOverlay.addEventListener(
            "click",
            closeCartDrawer
        );
    }


    if (continueShopping) {
        continueShopping.addEventListener(
            "click",
            closeCartDrawer
        );
    }


    /* ================= ADD TO CART ================= */

    $$(".add-cart").forEach(button => {

        button.addEventListener("click", () => {

            const productCard =
                button.closest(".product-card");


            const productName =
                button.dataset.product ||
                productCard?.querySelector("h3")
                    ?.textContent
                    ?.trim() ||
                "Product";


            const productPrice =
                Number(button.dataset.price) || 0;


            const imageElement =
                productCard?.querySelector(
                    ".product-image img"
                );


            const productImage =
                imageElement?.src || "";


            /* Check existing product */

            const existingProduct =
                cart.find(
                    item =>
                        item.name === productName
                );


            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({

                    name: productName,

                    price: productPrice,

                    quantity: 1,

                    image: productImage

                });

            }


            updateCart();


            showNotification(
                `${productName} added to cart`
            );

        });

    });


    /* ================= UPDATE CART ================= */

    function updateCart() {

        updateCartCount();

        renderCart();

        updateSubtotal();

    }


    /* ================= CART COUNT ================= */

    function updateCartCount() {

        const totalItems =
            cart.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        if (cartCount) {

            cartCount.textContent =
                totalItems;

        }

    }


    /* ================= RENDER CART ================= */

    function renderCart() {

        if (!cartItems) return;


        cartItems.innerHTML = "";


        /* ================= EMPTY CART ================= */

        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">

                        <i class="fa-solid fa-bag-shopping"></i>

                    </div>

                    <h3>Your cart is empty</h3>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <button
                        class="empty-cart-btn"
                        id="empty-cart-shopping">

                        Start Shopping

                    </button>

                </div>

            `;


            const emptyCartButton =
                $("#empty-cart-shopping");


            if (emptyCartButton) {

                emptyCartButton.addEventListener(
                    "click",
                    closeCartDrawer
                );

            }


            return;

        }


        /* ================= CART PRODUCTS ================= */

        cart.forEach((item, index) => {

            const cartItem =
                document.createElement("div");


            cartItem.className =
                "cart-item";


            cartItem.innerHTML = `

                <div class="cart-product-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="cart-product-details">

                    <div class="cart-product-top">

                        <div>

                            <p class="cart-product-category">
                                NOVACART
                            </p>

                            <h4>
                                ${item.name}
                            </h4>

                        </div>


                        <button
                            class="remove-item"
                            data-index="${index}"
                            title="Remove product">

                            <i class="fa-solid fa-trash-can"></i>

                        </button>

                    </div>


                    <div class="cart-product-bottom">

                        <strong>
                            ${money(item.price)}
                        </strong>


                        <div class="quantity-control">

                            <button
                                class="quantity-btn decrease"
                                data-index="${index}">

                                <i class="fa-solid fa-minus"></i>

                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                class="quantity-btn increase"
                                data-index="${index}">

                                <i class="fa-solid fa-plus"></i>

                            </button>

                        </div>

                    </div>

                </div>

            `;


            cartItems.appendChild(cartItem);

        });


        attachCartEvents();

    }


    /* ================= CART EVENTS ================= */

    function attachCartEvents() {


        /* ================= INCREASE ================= */

        $$(".increase").forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(button.dataset.index);


                    if (!cart[index]) return;


                    cart[index].quantity++;


                    updateCart();

                }
            );

        });


        /* ================= DECREASE ================= */

        $$(".decrease").forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(button.dataset.index);


                    if (!cart[index]) return;


                    if (cart[index].quantity > 1) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }


                    updateCart();

                }
            );

        });


        /* ================= REMOVE ================= */

        $$(".remove-item").forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(button.dataset.index);


                    if (!cart[index]) return;


                    cart.splice(index, 1);


                    updateCart();


                    showNotification(
                        "Product removed from cart"
                    );

                }
            );

        });

    }


    /* ================= SUBTOTAL ================= */

    function updateSubtotal() {

        const subtotal =
            cart.reduce(
                (total, item) =>
                    total +
                    item.price *
                    item.quantity,
                0
            );


        if (cartSubtotal) {

            cartSubtotal.textContent =
                money(subtotal);

        }

    }


    /* =====================================================
       PART 2 - WISHLIST + SEARCH + FILTER + MOBILE MENU
       ===================================================== */


/* ================= WISHLIST ================= */

const wishlistButtons = $$(".wishlist-btn");
const navbarWishlistButton = document.querySelector(
    '.nav-actions button[aria-label="Wishlist"]'
);

const wishlistPanel = $("#wishlist-panel");
const wishlistOverlay = $("#wishlist-overlay");
const closeWishlistButton = $("#close-wishlist");
const wishlistItems = $("#wishlist-items");
const wishlistCount = $("#wishlist-count");

function getWishlistProducts() {
    return [...document.querySelectorAll(".product-card")]
        .filter(card => card.querySelector(".wishlist-btn.liked"));
}

function renderWishlist() {
    if (!wishlistItems || !wishlistCount) return;

    const savedProducts = getWishlistProducts();

    wishlistCount.textContent =
        `${savedProducts.length} saved product${savedProducts.length === 1 ? "" : "s"}`;

    if (savedProducts.length === 0) {
        wishlistItems.innerHTML =
            '<p class="wishlist-empty">Your wishlist is empty. Click a product heart to save it!</p>';
        return;
    }

    wishlistItems.innerHTML = savedProducts.map((card, index) => {
        const image = card.querySelector(".product-image img");
        const name = card.querySelector(".product-info h3");
        const price = card.querySelector(".price strong");

        const imageSrc = image ? image.getAttribute("src") : "";
        const imageAlt = image ? image.alt : "Product";
        const productName = name ? name.textContent.trim() : "Product";
        const productPrice = price ? price.textContent.trim() : "";

        return `
            <div class="wishlist-item">
                <img src="${imageSrc}" alt="${imageAlt}">
                <div class="wishlist-item-info">
                    <h3>${productName}</h3>
                    <p>${productPrice}</p>
                    <button type="button"
                            class="wishlist-remove"
                            data-wishlist-index="${index}">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    }).join("");

    wishlistItems.querySelectorAll(".wishlist-remove").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.wishlistIndex);
            const savedProducts = getWishlistProducts();
            const card = savedProducts[index];

            if (!card) return;

            const heartButton = card.querySelector(".wishlist-btn");
            const icon = heartButton?.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-solid");
                icon.classList.add("fa-regular");
            }

            heartButton?.classList.remove("liked");

            renderWishlist();
            showNotification("Removed from wishlist");
        });
    });
}

function openWishlist() {
    renderWishlist();
    wishlistPanel?.classList.add("open");
    wishlistOverlay?.classList.add("open");
}

function closeWishlist() {
    wishlistPanel?.classList.remove("open");
    wishlistOverlay?.classList.remove("open");
}

wishlistButtons.forEach(button => {
    button.addEventListener("click", () => {
        const icon = button.querySelector("i");
        if (!icon) return;

        const isLiked = !button.classList.contains("liked");

        button.classList.toggle("liked", isLiked);
        icon.classList.toggle("fa-solid", isLiked);
        icon.classList.toggle("fa-regular", !isLiked);

        renderWishlist();

        showNotification(
            isLiked ? "Added to wishlist" : "Removed from wishlist"
        );
    });
});

navbarWishlistButton?.addEventListener("click", () => {
    console.log("Navbar Wishlist clicked");
    console.log("Wishlist panel:", wishlistPanel);
    console.log("Wishlist overlay:", wishlistOverlay);

    openWishlist();

    console.log(
        "Panel classes:",
        wishlistPanel?.className
    );
});
closeWishlistButton?.addEventListener("click", closeWishlist);
wishlistOverlay?.addEventListener("click", closeWishlist);


/* ================= NAVBAR SEARCH ================= */

const navbarSearchButton = document.querySelector(
    '.nav-actions button[aria-label="Search"]'
);

navbarSearchButton?.addEventListener("click", () => {
    const searchInput = $("#product-search");

    if (!searchInput) {
        showNotification("Product search is unavailable");
        return;
    }

    $("#products")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    searchInput.focus();
    searchInput.placeholder = "Type a product name...";
});

    /* ================= PRODUCT SEARCH ================= */

    const productSearch =
        $("#product-search");


    const productCards =
        $$(".product-card");


    function filterProducts() {

        const searchText =
            productSearch
                ? productSearch.value
                    .toLowerCase()
                    .trim()
                : "";


        const activeFilter =
            $(".filter-btn.active");


        const selectedCategory =
            activeFilter
                ? activeFilter.textContent
                    .trim()
                    .toLowerCase()
                : "all";


        productCards.forEach(card => {

            const productText =
                card.textContent
                    .toLowerCase();


            const categoryElement =
                card.querySelector(
                    ".product-category"
                );


            const category =
                categoryElement
                    ? categoryElement.textContent
                        .trim()
                        .toLowerCase()
                    : "";


            let categoryMatch = true;


            if (
                selectedCategory !== "all"
            ) {

                categoryMatch =
                    category.includes(
                        selectedCategory
                    );

            }


            const searchMatch =
                searchText === "" ||
                productText.includes(
                    searchText
                );


            if (
                categoryMatch &&
                searchMatch
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    }


    /* ================= SEARCH EVENT ================= */

    if (productSearch) {

        productSearch.addEventListener(
            "input",
            filterProducts
        );

    }


    /* ================= PRODUCT FILTER ================= */

    let filterButtons =
        $$(".filter-btn");


    /*
       Create Beauty filter only if
       it is not already present.
    */

    const beautyExists =
        Array.from(filterButtons)
            .some(
                button =>
                    button.textContent
                        .trim()
                        .toLowerCase() ===
                    "beauty"
            );


    if (!beautyExists) {

        const filterContainer =
            filterButtons.length
                ? filterButtons[0]
                    .parentElement
                : null;


        if (filterContainer) {

            const beautyButton =
                document.createElement(
                    "button"
                );


            beautyButton.className =
                "filter-btn";


            beautyButton.textContent =
                "Beauty";


            filterContainer.appendChild(
                beautyButton
            );

        }

    }


    filterButtons =
        $$(".filter-btn");


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                filterProducts();

            }
        );

    });


    /* ================= CATEGORY CARDS ================= */

    const categoryCards =
        $$(".category-card");


    categoryCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const categoryText =
                    card.textContent
                        .trim()
                        .toLowerCase();


                let matchingFilter =
                    null;


                filterButtons.forEach(
                    button => {

                        const buttonText =
                            button.textContent
                                .trim()
                                .toLowerCase();


                        if (
                            categoryText.includes(
                                buttonText
                            )
                        ) {

                            matchingFilter =
                                button;

                        }

                    }
                );


                if (matchingFilter) {

                    filterButtons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    matchingFilter.classList.add(
                        "active"
                    );


                    filterProducts();


                    const productsSection =
                        $("#products");


                    if (productsSection) {

                        productsSection.scrollIntoView(
                            {
                                behavior: "smooth"
                            }
                        );

                    }

                }

            }
        );

    });


    /* ================= MOBILE MENU ================= */

    const menuButton =
        $(".menu-btn");


    const navLinks =
        $(".nav-links");


    if (
        menuButton &&
        navLinks
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                navLinks.classList.toggle(
                    "mobile-active"
                );


                navLinks.classList.toggle(
                    "mobile-open"
                );

            }
        );


        navLinks
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "mobile-active"
                        );


                        navLinks.classList.remove(
                            "mobile-open"
                        );

                    }
                );

            });

    }


    /* =====================================================
       PART 3 - CHECKOUT + ORDER SUMMARY
       ===================================================== */


    /* ================= CHECKOUT ELEMENTS ================= */

    const checkoutOverlay =
        $("#checkout-overlay");


    const closeCheckout =
        $("#close-checkout");


    const checkoutForm =
        $("#checkout-form");


    const summaryProducts =
        $("#summary-products");


    const summarySubtotal =
        $("#summary-subtotal");


    const summaryTotal =
        $("#summary-total");


    const summaryItemCount =
        $("#summary-item-count");


    /* ================= OPEN CHECKOUT ================= */

    if (checkoutBtn) {

        checkoutBtn.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    showNotification(
                        "Your cart is empty"
                    );

                    return;

                }


                renderCheckoutSummary();


                if (checkoutOverlay) {

                    checkoutOverlay.classList.add(
                        "active"
                    );

                }


                closeCartDrawer();

            }
        );

    }


    /* ================= CLOSE CHECKOUT ================= */

    if (closeCheckout) {

        closeCheckout.addEventListener(
            "click",
            () => {

                if (checkoutOverlay) {

                    checkoutOverlay.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* ================= CLICK OUTSIDE CHECKOUT ================= */

    if (checkoutOverlay) {

        checkoutOverlay.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    checkoutOverlay
                ) {

                    checkoutOverlay.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* ================= ORDER SUMMARY ================= */

    function renderCheckoutSummary() {

        if (!summaryProducts) return;


        summaryProducts.innerHTML = "";


        let totalItems = 0;

        let subtotal = 0;


        cart.forEach(item => {

            totalItems +=
                item.quantity;


            subtotal +=
                item.price *
                item.quantity;


            const product =
                document.createElement(
                    "div"
                );


            product.className =
                "summary-product";


            product.innerHTML = `

                <div class="summary-product-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <div class="summary-product-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        Qty: ${item.quantity}
                    </p>

                </div>


                <div class="summary-product-price">

                    ${money(
                        item.price *
                        item.quantity
                    )}

                </div>

            `;


            summaryProducts.appendChild(
                product
            );

        });


        if (summaryItemCount) {

            summaryItemCount.textContent =
                `${totalItems} ${
                    totalItems === 1
                        ? "Item"
                        : "Items"
                }`;

        }


        if (summarySubtotal) {

            summarySubtotal.textContent =
                money(subtotal);

        }


        if (summaryTotal) {

            summaryTotal.textContent =
                money(subtotal);

        }

    }


    /* ================= PLACE ORDER ================= */

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                if (cart.length === 0) {

                    showNotification(
                        "Your cart is empty"
                    );


                    if (checkoutOverlay) {

                        checkoutOverlay.classList.remove(
                            "active"
                        );

                    }


                    return;

                }


                /* Customer Name */

                const customerNameInput =
                    $("#customer-name");


                const customerName =
                    customerNameInput
                        ? customerNameInput.value.trim()
                        : "";


                /* Payment */

                const selectedPayment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );


                const paymentMethod =
                    selectedPayment
                        ? selectedPayment.value
                        : "Cash on Delivery";


                /* Validation */

                if (!customerName) {

                    showNotification(
                        "Please enter your name"
                    );


                    if (customerNameInput) {

                        customerNameInput.focus();

                    }


                    return;

                }


                /* Close checkout */

                if (checkoutOverlay) {

                    checkoutOverlay.classList.remove(
                        "active"
                    );

                }


                /* Success */

                showNotification(
                    `Thank you ${customerName}! Order placed via ${paymentMethod}.`
                );


                /* Clear cart */

                cart = [];


                updateCart();


                /* Reset form */

                checkoutForm.reset();

            }
        );

    }


    /* =====================================================
                        
    NOTIFICATION
       ===================================================== */

    function showNotification(message) {

        const oldNotification =
            $(".cart-notification");


        if (oldNotification) {

            oldNotification.remove();

        }


        const notification =
            document.createElement("div");


        notification.className =
            "cart-notification";


        notification.innerHTML = `

            <i class="fa-solid fa-circle-check"></i>

            <span>${message}</span>

        `;


        document.body.appendChild(
            notification
        );


        setTimeout(() => {

            notification.classList.add(
                "hide"
            );


            setTimeout(() => {

                notification.remove();

            }, 300);

        }, 2200);

    }


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                closeCartDrawer();


                if (checkoutOverlay) {

                    checkoutOverlay.classList.remove(
                        "active"
                    );

                }

            }

        }
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    updateCart();

});