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
const addToDom = (products) => {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
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
  });
};

const getProducts = () => {
  axios
    .get(`${BASE_URL}/products`)
    .then((result) => {
      addToDom(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
getProducts();

// search
const searchProducts = (value) => {
  axios
    .get(`${BASE_URL}/products?subtitle_like=${value}`)
    .then((result) => {
      addToDom(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

// delay at request to server when user typed
let timeout = null;
const searchText = document.querySelector("#search-text");
searchText.addEventListener("keyup", (e) => {
  clearInterval(timeout);
  timeout = setTimeout(() => searchProducts(e.target.value), 1000);
});

// search by title aside buttons
const searchByTitle = (title) => {
  axios
    .get(`${BASE_URL}/products?title=${title}`)
    .then((result) => {
      addToDom(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const productTitles = document.querySelector("#search-by-title");
productTitles.addEventListener("click", (e) => {
  if (e.target.classList.contains("products-title")) {
    [...productTitles.children].forEach((item) => {
      item.classList.remove("active-text");
    });

    e.target.classList.add("active-text");
    searchByTitle(e.target.innerHTML);
  }
});
