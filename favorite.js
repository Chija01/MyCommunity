const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const users = JSON.parse(localStorage.getItem("favoriteUsers"))
let filteredUsers = [];
const USERS_PER_PAGE = 12;
const dataPanel = document.querySelector("#data-panel");

//顯示社群清單
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `  
    <div class="col-sm-3">
    <div class="card m-2 bg-light">
       <button class="btn btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
   <img src="${item.avatar}" class="btn-show-user m-3 img-fluid img-thumbnail rounded-circle mx-auto"  data-bs-target="#user-modal" data-id="${item.id}" alt="avatar"></button>
    <div class="card-body ">
      <p class="card-text text-center fw-bold lh-lg text-nowrap overflow-hidden "> <button type="button" class="btn btn btn-outline-danger btn-sm float-start btn-remove-favorite" data-id="${item.id}" >&#128148;</button> ${item.name} ${item.surname}</p>
    </div>
  </div>  </div>`;
  });

  dataPanel.innerHTML = rawHTML;
}

//paginator
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE);
  let firstPageLink = 1;
  let pageLink = 4;
  let rawHTML = "";
  const prePage = `  <li class="page-item disabled" id="prePage">
      <a class="page-link">Previous</a>`;
  const nextPage = ` <li class="page-item" id="nextPage">
      <a class="page-link" href="#">Next</a>
    </li>`;
  for (let page = 1; page <= firstPageLink + pageLink; page++) {
    rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = prePage + rawHTML + nextPage;
}

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
    console.log(INDEX_URL + id);
    modalFullName.innerText = `${data.name} ${data.surname}`;
    modalAvatar.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid">`;
    modalemail.innerText = `E-mail: ${data.email}`;
    modalGender.innerText = `Gender: ${data.gender}`;
    modalAge.innerText = `Age: ${data.age}`;
    modalRegion.innerText = `Region: ${data.region}`;
    modalBirthday.innerText = `Birthday: ${data.birthday}`;
  });
}

//移出最愛
function removeFromFavorite(id) {
  const userIndex = users.findIndex((user) => user.id === id);
users.splice(userIndex,1)
  localStorage.setItem("favoriteUsers", JSON.stringify(users))
  renderUserList(users)

  }


dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-remove-favorite")) {
      removeFromFavorite(Number(event.target.dataset.id));
  }
});
//分頁跳轉
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderUserList(getUserByPage(page));
});

renderUserList(users)