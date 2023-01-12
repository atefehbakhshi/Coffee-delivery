const BASE_URL = "http://localhost:3000";
const productsContainer = document.querySelector("#products-container");

// click on product
const gotoProductPage = (id) => {
  window.location.href = `product.html?id=${id}`;
};

// click on plus button
const addToCart = (e, id) => {
  e.preventDefault();
  e.stopPropagation();

  axios
    .get(`${BASE_URL}/carts?id=${id}`)
    .then((cartResult) => {
      if (cartResult.data.length > 0) {
        Toastify({
          text: "The product has already been added to the card",
          duration: 3000,
        }).showToast();
      } else {
        axios
          .get(`${BASE_URL}/products/${id}`)
          .then((result) => {
            axios
              .post(`${BASE_URL}/carts`, result.data)
              .then((response) => {
                Toastify({
                  text: "The product has been added to the card",
                  duration: 3000,
                }).showToast();
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
};

// read product from server
const addToDom = (product) => {
  const html = `
    <div class="product" id="${product.id}" onClick="gotoProductPage(${product.id})">
  <!-- image -->
  <div class="product__image flex a-c j-c mb8">
    <div class="product__image__icon flex a-c gap5">
      <iconify-icon
        icon="material-symbols:star"
        style="color: #d3a601"
        width="25"
        height="25"
      ></iconify-icon>
      <p class="product__image__icon-text">4.5</p>
    </div>
    <img src="../${product.image}" alt="cappuccino" /> 
  </div>
  <!-- information -->
  <div class="flex col gap10">
    <p class="product__title">${product.subtitle}</p>
    <div class="product__priceAdd">
      <p class="product__priceAdd-price">₹${product.price}</p>
      <p class="product__priceAdd-add flex a-c j-c" onClick="addToCart(event,${product.id})">+</p>
    </div>
  </div>
</div>
    `;
  productsContainer.insertAdjacentHTML("beforeend", html);
};

const getProducts = () => {
  let favoriteList = [];
  axios
    .get(`${BASE_URL}/users/1`)
    .then((result) => {
      favoriteList = result.data.favorites;
      favoriteList.forEach((id) => {
        axios
          .get(`${BASE_URL}/products/${id}`)
          .then((product) => {
            addToDom(product.data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => console.log(err));
};

getProducts();
