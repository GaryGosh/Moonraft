const productsSection = document.getElementById("productsSection");

async function fetchData() {
  const request = await fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      data.items.map((item) => {
        const productWrapper = document.createElement("div");
        productWrapper.classList.add("productWrapper");
        const productImage = document.createElement("div");
        productImage.classList.add("productImage");
        const image = document.createElement("img");
        image.classList.add("productImage__img");
        const productDescription = document.createElement("div");
        productDescription.classList.add("productDescription");
        const productName = document.createElement("p");
        productName.classList.add("productName");
        const priceRow = document.createElement("div");
        priceRow.classList.add("priceRow");
        const displayPrice = document.createElement("span");
        displayPrice.classList.add("displayPrice");
        const actualPrice = document.createElement("span");
        actualPrice.classList.add("actualPrice");
        const button = document.createElement("button");
        button.innerHTML = "Add to cart";
        button.setAttribute("data-action", "ADD_TO_CART");

        priceRow.appendChild(displayPrice);
        priceRow.appendChild(actualPrice);
        priceRow.appendChild(button);
        productImage.appendChild(image);
        productWrapper.appendChild(productImage);
        productDescription.appendChild(productName);
        productDescription.appendChild(priceRow);
        productWrapper.appendChild(productDescription);
        productsSection.appendChild(productWrapper);

        productName.innerHTML = item.name;
        displayPrice.innerHTML = item.price.display;
        actualPrice.innerHTML = item.price.actual;
        image.setAttribute("src", item.image);
      });

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const cartDOM = document.querySelector(".cart");
      const addToCartButtonsDOM = document.querySelectorAll(
        '[data-action="ADD_TO_CART"]'
      );

      console.log("cart", addToCartButtonsDOM);

      console.log("cart", cart);

      if (cart.length > 0) {
        cart.forEach((cartItem) => {
          const product = cartItem;
          insertItemToDOM(product);
          /* countTotal(); */

          addToCartButtonsDOM.forEach((addToCartButton) => {
            const productDOM = addToCartButton.parentNode.parentNode;
            /* console.log("parent", productDOM); */

            if (
              productDOM.querySelector(".productName").innerText ===
              product.name
            ) {
              handleActionButtons(addToCartButton, product);
            }
          });
        });
      }

      addToCartButtonsDOM.forEach((addToCartButton) => {
        addToCartButton.addEventListener("click", () => {
          const productDOM = addToCartButton.parentNode.parentNode.parentNode;

          const product = {
            image: productDOM
              .querySelector(".productImage__img")
              .getAttribute("src"),
            name: productDOM.querySelector(".productName").innerText,
            price: productDOM.querySelector(".actualPrice").innerText,
            quantity: 1,
          };
          /* console.log(product); */

          const isInCart =
            cart.filter((cartItem) => cartItem.name === product.name).length >
            0;

          if (!isInCart) {
            insertItemToDOM(product);
            cart.push(product);
            saveCart();
            handleActionButtons(addToCartButton, product);
          }
        });
      });

      function insertItemToDOM(product) {
        cartDOM.insertAdjacentHTML(
          "beforeend",
          `
          <div class="cart__item">
            <img class="cart__item__image" src="${product.image}" alt="${product.name}">
            <h6 class="cart__item__name">${product.name}</h6>
            <button class="btn" data-action="INCREASE_ITEM"><i class="fas fa-plus"></i></button>
            <h6 class="cart__item__quantity">${product.quantity}</h6>
            <button class="btn" data-action="DECREASE_ITEM"><i class="fas fa-minus"></i></button>
            <h6 class="cart__item__price">${product.price}</h6>
            
          </div>`
        );
        addCartFooter();
      }

      function handleActionButtons(addToCartButton, product) {
        addToCartButton.innerText = "Added";
        addToCartButton.disabled = true;

        const cartItemsDOM = cartDOM.querySelectorAll(".cart__item");
        cartItemsDOM.forEach((cartItemDOM) => {
          if (
            cartItemDOM.querySelector(".cart__item__name").innerText ===
            product.name
          ) {
            cartItemDOM
              .querySelector('[data-action="INCREASE_ITEM"]')
              .addEventListener("click", () =>
                increaseItem(product, cartItemDOM)
              );
            cartItemDOM
              .querySelector('[data-action="DECREASE_ITEM"]')
              .addEventListener("click", () =>
                decreaseItem(product, cartItemDOM, addToCartButton)
              );
          }
        });
      }

      function increaseItem(product, cartItemDOM) {
        let cartTotal = 0;
        cart.forEach((cartItem) => {
          if (cartItem.name === product.name) {
            cartTotal += cartItem.quantity * cartItem.price;
            cartItemDOM.querySelector(
              ".cart__item__quantity"
            ).innerText = ++cartItem.quantity;
            cartItemDOM.querySelector(".cart__item__price").innerText =
              cartItem.price * product.quantity;
            cartItemDOM.querySelectorAll(".cartTotal").innerText = cartTotal;

            saveCart();
          }
        });
      }

      function decreaseItem(product, cartItemDOM, addToCartButton) {
        let cartTotal = 0;
        cart.forEach((cartItem) => {
          if (cartItem.name === product.name) {
            cartTotal += cartItem.quantity * cartItem.price;
            if (cartItem.quantity > 1) {
              cartItemDOM.querySelector(
                ".cart__item__quantity"
              ).innerText = --cartItem.quantity;
              cartItemDOM.querySelector(".cart__item__price").innerText =
                cartItem.price * product.quantity;
              cartItemDOM.querySelectorAll(".cartTotal").innerText = cartTotal;

              saveCart();
            } else {
              removeItem(product, cartItemDOM, addToCartButton);
            }
          }
        });
      }

      function removeItem(product, cartItemDOM, addToCartButton) {
        cartItemDOM.classList.add("cart__item__removed");
        setTimeout(() => cartItemDOM.remove(), 300);
        cart = cart.filter((cartItem) => cartItem.name !== product.name);
        saveCart();
        addToCartButton.innerText = "Add To Cart";
        addToCartButton.disabled = false;

        if (cart.length < 1) {
          document.querySelector(".cart-footer").remove();
        }
      }

      function addCartFooter() {
        if (document.querySelector(".cart-footer") === null) {
          let cartTotal = 0;
          let cartQuantity = 0;
          cart.forEach((cartItem) => {
            cartTotal += cartItem.quantity * cartItem.price;
            cartQuantity += cartItem.quantity;
          });
          cartDOM.insertAdjacentHTML(
            "afterend",
            `
                <div class="cart-footer">
                    <p>Total</p>
                    <ul>
                        <li>Items(${cartQuantity})<span>:</span><span class="cartTotal">${cartTotal}</span></li>
                        <li class="subTotoal"><b>Order Total<b><span>:</span><span class="cartTotal">$${cartTotal}</span></li>

                    </ul>
                </div>
            `
          );
        }
      }
      function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return request;
}
fetchData();
