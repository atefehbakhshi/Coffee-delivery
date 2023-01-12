const BASE_URL = "http://localhost:3000";
const cartsContainer = document.querySelector("#carts-container");
const grandTotal = document.querySelector("#grand-total");
const productsPrice = document.querySelectorAll(".cart__info-price");
const payBtn = document.querySelector("#pay-button");

let totalPrice = 0;
let productsId = [];

const addToDom = (products) => {
  cartsContainer.innerHTML = "";
  products.forEach((product) => {
    const html = `
    <div class="cart flex j-sb a-c gap10">
          <div class="cart__info flex j-c gap5">
            <img
              src="../${product.image}"
              alt="cappuccino"
            />
            <div class="flex col gap10 j-c">
              <p class="cart__info-title">${product.title}</p>
              <p class="cart__info-subtitle">${product.subtitle}</p>
              <p class="cart__info-price">₹ <span>${product.price}</span></p>
            </div>
          </div>
          <div class="cart__quantity flex a-c gap10">
            <div class="cart__quantity-counter flex j-c a-c" onClick="counter(event,${product.price})">-</div>
            <div class="cart__quantity-number">1</div>
            <div class="cart__quantity-counter flex j-c a-c" onClick="counter(event,${product.price})">+</div>
          </div>
   </div>
          `;
    cartsContainer.insertAdjacentHTML("beforeend", html);
    totalPrice += +product.price;
    productsId.push(product.id);
  });
  // add taxes and delivery charges
  totalPrice = totalPrice + 49 + 64.87;

  grandTotal.innerText = totalPrice;
};

const getProducts = () => {
  axios
    .get(`${BASE_URL}/carts`)
    .then((result) => {
      addToDom(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
getProducts();

const counter = (e, price) => {
  const operator = e.target.innerText;
  const cartQuantity = e.target.closest(".cart__quantity");
  const quantity = cartQuantity.children[1];
  const productPriceContainer =
    e.target.closest(".cart").children[0].children[1].children[2].children[0];

  if (operator === "-" && +quantity.innerText > 0) {
    quantity.innerText--;
    totalPrice -= price;
    grandTotal.innerText = totalPrice;
  }
  if (operator === "+") {
    quantity.innerText++;
    totalPrice += Number(price);
    grandTotal.innerText = totalPrice;
  }
  productPriceContainer.innerText = price * quantity.innerText;
};

payBtn.addEventListener("click", () => {
  productsId.forEach((id) => {
    axios.delete(`${BASE_URL}/carts/${id}`).catch((err) => console.log(err));
  });

  window.location.href = "home.html";
});
