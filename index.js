const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = [];
let filteredUsers = [];
const USERS_PER_PAGE = 12;
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const allPages = document.querySelectorAll(".page-item")
const totalPage = Math.ceil(users.length / USERS_PER_PAGE)
let firstPageLink = 1;
let pageLink = 9
let lastPageLink = firstPageLink + pageLink

//顯示社群清單
function renderUserList(data) {

  let rawHTML = "";
  data.forEach((item) => {
    const favoritelist = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
    if (favoritelist.some((user) => user.id === item.id)) {
      favoritButtonClass = "btn-add-favorite btn-danger btn-sm float-start"
    }
    else { favoritButtonClass = "btn-add-favorite btn btn-outline-secondary btn-sm float-start" }

    rawHTML += `  
    <div class="col-sm-3">
    <div class="card m-2 bg-light">
       <button class="btn btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
   <img src="${item.avatar}" class="btn-show-user m-3 img-fluid img-thumbnail rounded-circle mx-auto"  data-bs-target="#user-modal" data-id="${item.id}" alt="avatar"></button>
    <div class="card-body ">
      <p class="card-text text-center fw-bold lh-lg text-nowrap overflow-hidden "> <button class="${favoritButtonClass}" data-id="${item.id}" >&#9825</button> ${item.name} ${item.surname}</p>
    </div>
  </div>  </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

//paginator
function renderPaginator(amount) {
  const totalPage = Math.ceil(users.length / USERS_PER_PAGE)

  let rawHTML = "";
  const prePageHTML = `
<li class="page-item" id="prePage">
  <a class="page-link" data-page="prePage">Previous</a>
</li>`;
  const nextPageHTML = `
<li class="page-item" id="nextPage">
  <a class="page-link" data-page="nextPage">Next</a>
</li>`;

  for (let page = firstPageLink; page <= firstPageLink + pageLink; page++) {
    if (page == totalPage + 1) { break }
    rawHTML += `
<li class="page-item" id=${page}>
  <a class="page-link" href="#" data-page="${page}">${page}</a>
</li>`;
  }

  paginator.innerHTML = prePageHTML + rawHTML + nextPageHTML;
  if (document.querySelector(".page-item.active") == null && firstPageLink == 1) {
    document.getElementById(1).classList.add("active");
    document.querySelector("#prePage").classList.add("disabled")
  }
}

paginator.addEventListener("click", function onPaginatorCliecked(event) {
  if (event.target.tagName !== "A") return;
  const clickedPage = event.target.parentElement
  const allPages = document.querySelectorAll(".page-item")
  const prePage = document.querySelector("#prePage")
  const nextPage = document.querySelector("#nextPage")
  const totalPage = Math.ceil(users.length / USERS_PER_PAGE)
  const currentPage = document.querySelector(".page-item.active")

  prePage.classList.remove("disbaled")
  nextPage.classList.remove("disabled")

  if (clickedPage.id == 1) { prePage.classList.add("disabled") }

  // clikced page number
  if (clickedPage.id != "prePage" && clickedPage.id != "nextPage") {
    currentPage.classList.remove("active")
    clickedPage.classList.add("active")
    if (clickedPage.id !== "1") { prePage.classList.remove("disabled") } else { prePage.classList.add("disabled") }
    if (Number(clickedPage.id) !== totalPage) { nextPage.classList.remove("disabled") } else { nextPage.classList.add("disabled") }
  }

  //Clicked previous button
  if (clickedPage.id == "prePage") {
    if (currentPage.id == firstPageLink) {
      let prePrePagelink = firstPageLink - 1
      firstPageLink = firstPageLink - pageLink;
      if (firstPageLink < 1) { firstPageLink = 1 }
      renderPaginator(firstPageLink)

      document.getElementById(prePrePagelink).classList.add("active")
    }
    else {
      let prePageLink = currentPage.previousElementSibling
      currentPage.classList.remove("active")
      prePageLink.classList.add("active")
      if (prePageLink.id !== 1) { prePage.classList.remove("disabled") }
    }
  }

  // clicked next button
  if (clickedPage.id == "nextPage") {
    prePage.classList.remove("disabled")
    if (currentPage.id == lastPageLink) {
      firstPageLink = lastPageLink + 1;
      renderPaginator(firstPageLink)
      let nextNextPageLink = document.getElementById(firstPageLink); nextNextPageLink.classList.add("active")
    }
    else {
      let nextPageLink = currentPage.nextElementSibling
      currentPage.classList.remove("active")
      nextPageLink.classList.add("active")
      if (Number(nextPageLink.id) !== totalPage) { nextPage.classList.remove("disabled") } else { nextPage.classList.add("disabled") }
    }

  }
  let activePageNumber = document.querySelector(".page-item.active").id

  renderUserList(getUserByPage(activePageNumber));

})


//每頁資料數量
function getUserByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users;
  const startIndex = (page - 1) * USERS_PER_PAGE;
  return users.slice(startIndex, startIndex + USERS_PER_PAGE);
}

//顯示個人詳細資料
function showUserModal(id) {
  const modalFullName = document.querySelector("#user-modal-Fullname");
  const modalAvatar = document.querySelector("#user-modal-avatar");
  const modalemail = document.querySelector("#user-modal-email");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalBirthday = document.querySelector("#user-modal-birthday");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalFullName.innerText = `${data.name} ${data.surname}`;
    modalAvatar.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid">`;
    modalemail.innerText = `E-mail: ${data.email}`;
    modalGender.innerText = `Gender: ${data.gender}`;
    modalAge.innerText = `Age: ${data.age}`;
    modalRegion.innerText = `Region: ${data.region}`;
    modalBirthday.innerText = `Birthday: ${data.birthday}`;
  });
}
//加入最愛
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [];
  const user = users.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert("此用戶已經在最愛清單中");
  }
  const favoriteButton = document.querySelector(`button.btn-add-favorite[data-id="${id}"]`);
  if (user.id == favoriteButton.dataset.id) { favoriteButton.classList.add("btn-danger") }
  list.push(user);
  localStorage.setItem("favoriteUsers", JSON.stringify(list));
}

//找出最愛id
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

//觸發search功能
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  let filteredUsers = [];
  if (!keyword.length) {
    return alert("Please enter a valid string");
  }
  filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) |
      user.surname.toLowerCase().includes(keyword)
  );
  if (filteredUsers.length === 0) {
    return alert("Cannot find thiss name");
  }
  renderUserList(filteredUsers);
});

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results);
    renderUserList(getUserByPage(1));
    renderPaginator(users.length);
  })
  .catch((err) => console.log(err));
