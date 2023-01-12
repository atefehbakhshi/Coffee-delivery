const BASE_URL = "http://localhost:3000";
const loginForm = document.querySelector("#form");

const userInfo = (e) => {
  const { username, password } = e.target;
  const user = {
    name: username.value,
    pass: password.value,
    favorites: [],
  };
  return user;
};

const loginUser = (e) => {
  e.preventDefault();
  const userInformation = userInfo(e);
  if (userInformation.name !== "" && userInformation.pass !== "") {
    axios
      .post(`${BASE_URL}/users`, userInformation)
      .then((response) => {
        window.location.href = "home.html";
      })
      .catch((err) => console.log(err));
  } else {
    Toastify({
      text: "user name or password is empty",
      duration: 3000,
    }).showToast();
  }
};

loginForm.addEventListener("submit", loginUser);
