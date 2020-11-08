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
          /* insertItemToDOM(product);
            countTotal(); */

          addToCartButtonsDOM.forEach((addToCartButton) => {
            const productDOM = addToCartButton.parentNode.parentNode;
            console.log("parent", productDOM);

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
            <h6 class="cart__item__price">${product.price}</h6>
            <button class="btn" data-action="DECREASE_ITEM"><i class="fas fa-minus"></i></button>
          </div>`
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return request;
}
fetchData();
