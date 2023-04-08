const todoInput = document.getElementById("todoinput");
const todoBtn = document.getElementById("todoinput-btn");
const user = document.getElementById("user");
const HTMLtodolist = document.getElementById("todolist-data");

const statusBtn = document.getElementById("status");
// 儲存所有輸入的資料
// let todoData = [];
let succData = [];

user.textContent = localStorage.getItem("nickname");

let url = "https://todoo.5xcamp.us";
let token = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

// 觸發傳送按鈕
todoBtn.addEventListener("click", function () {
  postData();
});

function postData() {
  if (todoInput.value == "") {
    alert("請輸入資料");
    return;
  }

  let list = { todo: { content: todoInput.value } };

  // console.log(list);

  axios
    .post(`${url}/todos`, list, token)
    .then((res) => {
      console.log("post success");
      getData(todoData);
    })
    .catch((err) => {
      console.log(err);
    });
  // 輸入欄位清空
  todoInput.value = "";
}

function getData() {
  axios.get(`${url}/todos/`, token).then((res) => {
    // 取的 todolist Data
    // console.log(res.data.todos);
    todoData = res.data.todos.reverse();
    if (todoData !== "") {
      renderData(todoData);
    }
  });
}

function deleteData(todoId) {
  axios
    .delete(`${url}/todos/${todoId}`, token)
    .then((res) => {
      console.log(`del:${res.data.message}`);
      getData();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function patchData(todoId) {
  axios.patch(`${url}/todos/${todoId}/toggle`, {}, token).then((res) => {
    succData.push(res.data);
    console.log(succData);
  });
}

// 顯示在 html 上
function renderData(data) {
  let str = "";
  data.forEach((item, index) => {
    str += `
        <li class="flex flex-row pt-[17px] pb-[15px] items-center border-b border-[#E5E5E5] justify-between" id-data="${item.id}">
            <div class="w-full flex flex-row" id-data="${item.id}">
                <input type="checkbox" class="w-5 h-5" name="" id="todo-content${index}" id-data="${item.id}">
                <label for="todo-content${index}" class="pl-6" id-data="${item.id}">${item.content}</label>
            </div>
            <i class="uil uil-multiply cursor-pointer" id="delete-btn" id-data="${item.id}"></i>
        </li>`;
  });
  HTMLtodolist.innerHTML = str;
}

// todolist 監聽
HTMLtodolist.addEventListener("click", function (e) {
  let id = e.target.getAttribute("id-data");
  let deleteClicked = e.target.getAttribute("id");

  console.log(id);
  // 完成
  if (id !== null && deleteClicked !== "delete-btn") {
    let selectData = todoData.filter((item) => {
      return item.id == id;
    });
    patchData(id);
  }

  // 刪除資料
  if (id !== null && deleteClicked == "delete-btn") {
    deleteData(id);
  }
});

// 切換不同狀態的 todolist
function checkStatus() {
  statusBtn.addEventListener("click", function (e) {
    let todoStatus = e.target.getAttribute("value");
    // console.log(todoStatus);

    switch (todoStatus) {
      case "全部":
        renderData(todoData);
        break;
      case "待完成":
        break;
      case "已完成":
        renderData(succData);
        break;
      default:
        break;
    }
  });
}

checkStatus();

// 缺少 init 檢查 user token
// 沒有的話要在導回登入頁
function init() {
  if (localStorage.getItem("nickname") == null) {
    redirect();
    return;
  }
  // if 有資料可以先顯示
  getData();
}

function redirect() {
  location.href = "./account.html";
}

init();
