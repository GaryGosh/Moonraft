const productsSection = document.getElementById("productsSection");

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    /* itemsList = data.items.map((item) => ({
      discount: item.discount,
      id: item.id,
      image: item.image,
      name: item.name,
      priceActual: item.price.actual,
      priceDisplay: item.price.display,
    }));
    console.log(name); */
    data.items.map((item) => {
      const productWrapper = document.createElement("div");
      productWrapper.classList.add("productWrapper");
      const productImage = document.createElement("div");
      productImage.classList.add("productImage");
      const image = document.createElement("img");
      const productDescription = document.createElement("div");
      productDescription.classList.add("productDescription");
      const productName = document.createElement("p");
      productName.classList.add("productName");
      const priceRow = document.createElement("div");
      priceRow.classList.add("priceRow");
      const displayPrice = document.createElement("span");
      displayPrice.classList.add("displayPrice");
      const actualPrice = document.createElement("span");
      const button = document.createElement("button");
      button.innerHTML = "Add to cart";

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
    /*
    console.log(itemsList);
    
    itemsList.forEach((element) => {
      
    }); */
  })
  .catch((err) => {
    console.log(err);
  });
