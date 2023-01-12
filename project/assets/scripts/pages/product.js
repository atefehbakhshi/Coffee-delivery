const BASE_URL = "http://localhost:3000";

// get product id
const paramString = window.location.search;
const searchParams = new URLSearchParams(paramString);
const productId = searchParams.get("id");

// check favorite
let isFavorite = false;

// display product
const productImage = document.querySelector("#product-image");
const productTitle = document.querySelector("#product-title");
const productSubtitle = document.querySelector("#product-subtitle");
const productDescription = document.querySelector("#product-description");
const productPrice = document.querySelector("#product-price");

// choose milk
const milkTypeButtonsContainer = document.querySelector(
  "#milk-type-buttons-container"
);

// selected properties
let productInfo = {
  id: "",
  image: "",
  title: "",
  subtitle: "",
  desc: "",
  price: "",
  milkType: "",
};

const addToDom = (product) => {
  productImage.src = `../${product.image}`;
  productTitle.innerText = product.title;
  productSubtitle.innerText = product.subtitle;
  productDescription.innerText = product.desc;
  productPrice.innerText = product.price;
};

const fillProperties = (product) => {
  productInfo = {
    id: product.id,
    image: product.image,
    title: product.title,
    subtitle: product.subtitle,
    desc: product.desc,
    price: product.price,
    milkType: "",
  };
};
// get product from server
const getProduct = (id) => {
  axios
    .get(`${BASE_URL}/products/${id}`)
    .then((result) => {
      addToDom(result.data);
      fillProperties(result.data);
      // isFavorite()
      userFavoritesProducts();
    })
    .catch((err) => {
      console.log(err);
    });
};
getProduct(productId);

// choose milk
[...milkTypeButtonsContainer.children].forEach((item) => {
  item.addEventListener("click", () => {
    [...milkTypeButtonsContainer.children].forEach((button) => {
      button.classList.remove("active-button");
    });
    item.classList.add("active-button");
    productInfo.milkType = item.innerText;
  });
});

// add to cart
const addToCartBtn = document.querySelector("#add-to-cart");

const addToCart = (selectedProduct) => {
  axios
    .get(`${BASE_URL}/carts?id=${selectedProduct.id}`)
    .then((cartResult) => {
      if (cartResult.data.length > 0) {
        axios
          .delete(`${BASE_URL}/carts/${selectedProduct.id}`)
          .catch((err) => console.log(err));
      }
      axios
        .post(`${BASE_URL}/carts`, selectedProduct)
        .then((response) => {
          window.location.href = "cart.html";
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

addToCartBtn.addEventListener("click", () => {
  addToCart(productInfo);
});

// add to favorite list
const favorite = document.querySelector("#favorit");
let favoriteList;

// get favorite list
const userFavoritesProducts = () => {
  axios
    .get(`${BASE_URL}/users/1`)
    .then((result) => {
      favoriteList = result.data.favorites;
      // is favorite
      isFavorite = favoriteList.includes(productId);
      if (isFavorite) {
        favorite.icon = "mdi:cards-heart";
        favorite.style.color = "red";
        favorite.classList.add("selected");
      }
    })
    .catch((err) => console.log(err));
};

const addToFavorite = (id) => {
  favoriteList.push(id);
  axios
    .patch(`${BASE_URL}/users/1`, {
      favorites: favoriteList,
    })
    .catch((err) => console.log(err));
};

const removeFromFavorite = (id) => {
  favoriteList = favoriteList.filter((item) => item !== id);
  axios
    .patch(`${BASE_URL}/users/1`, {
      favorites: favoriteList,
    })
    .catch((err) => console.log(err));
};

favorite.addEventListener("click", () => {
  if (favorite.classList.contains("selected")) {
    favorite.icon = "mdi:cards-heart-outline";
    favorite.style.color = "#efe3c8";
    favorite.classList.remove("selected");
    removeFromFavorite(productId);
  } else {
    favorite.icon = "mdi:cards-heart";
    favorite.style.color = "red";
    favorite.classList.add("selected");
    addToFavorite(productId);
  }
});

// back button
const backBtn = document.querySelector("#back-button");
backBtn.addEventListener("click", () => {
  window.history.back();
});
