const userName = document.querySelector("#username");
const todoValue = document.querySelector("#todo-value");
const todoBtn = document.querySelector("#todo-btn");
let deleteBtn;
const unfinishItem = document.querySelector("#unfinish-item");
const logoutBtn = document.querySelector("#logout");

// API
const url = "https://todoo.5xcamp.us";
const nickname = localStorage.getItem("nickname");
const token = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

let todoData = [];

// 沒有資料切換背景
const todoEmpty = document.querySelector("#todo-empty");
// ALL LIST
const todolist = document.querySelector("#todolist");

// 檢查登入狀態
const checkLoginStatus = () => {
  axios
    .get(`${url}/check`, token)
    .then(() => {
      // 設置用戶名
      userName.textContent = nickname;
    })
    .catch((err) => {
      alert("不存在此用戶");
      location.href = "./index.html";
    });
};
const checkTodoStatus = (status) => {
  // 裝態：全部
  if (status === "status-all") {
    renderData(todoData);
  }
  // 狀態：待完成
  if (status === "status-undo") {
    let undoData = todoData.filter((item) => {
      return item.completed_at === null;
    });
    renderData(undoData);
  }
  // 狀態：已完成
  if (status === "status-done") {
    let doneData = todoData.filter((item) => {
      return item.completed_at !== null;
    });
    renderData(doneData);
  }
};

// 增加 Enter 觸發事件
const enter = (e) => {
  if (e.key === "Enter") {
    postTodo();
  }
};
todoBtn.addEventListener("click", () => {
  postTodo();
});
todoValue.addEventListener("keydown", (e) => {
  enter(e);
});

// deleteEvent 本身就是監聽事件，但因為要取的渲然後的 deleteBtn
// 所以又寫成 fn
todolist.addEventListener("click", (e) => {
  deleteEvent();
  // 完成按鈕
  if (e.target.getAttribute("id") === "done-btn") {
    let todoItem = e.target.parentNode.parentNode;
    let todoItemId = todoItem.dataset.id;
    let doneItem = todoData.filter((item) => {
      return item.id === todoItemId;
    })[0];
    // console.log(doneItem);
    let doneIndex = todoData.indexOf(doneItem);
    todoDone(todoItemId, doneIndex);
  }
  // 切換裝態
  checkTodoStatus(e.target.getAttribute("id"));
});

// input值(todo)  post
const postTodo = () => {
  if (todoValue.value === "") {
    alert("請輸入資料");
    return;
  }
  let todoInput = { todo: { content: todoValue.value } };
  axios
    .post(`${url}/todos`, todoInput, token)
    .then((res) => {
      getTodo();
    })
    .catch((err) => {
      console.log(err);
    });

  // 清空輸入
  todoValue.value = "";
};

// get input
const getTodo = async () => {
  const res = await axios.get(`${url}/todos`, token);
  todoData = res.data.todos; //.reverse()
  console.log(todoData);
  if (todoData.length !== 0) {
    renderData(todoData);
    todolist.classList.remove("hidden");
    todoEmpty.classList.add("hidden");
    todoEmpty.classList.remove("flex");
  } else {
    // 沒有資料切換背景
    todoEmpty.classList.toggle("hidden");
    todoEmpty.classList.toggle("flex");
    todolist.classList.toggle("hidden");
    return false;
  }
};

// 渲然資料
const renderData = (data) => {
  let str = "";
  let undoCount = 0;
  data.map((item) => {
    const { id, content, completed_at } = item;
    str += `
      <li class="flex flex-row px-[17px] md:pr-0 md:pl-6 items-center" data-id="${id}" data-complete="${completed_at}">
        <div class="flex flex-row items-center border-b border-[#E5E5E5] pb-[15px] w-full">
          <img class="mr-4 cursor-pointer" id="done-btn" data-id="${id}" src="${
      completed_at === null ? "../img/checkbox.png" : "../img/done.png"
    }" alt="" />
          <p class="${
            completed_at === null ? "" : "line-through"
          }">${content}</p>
        </div>
        <img class="pl-0 pb-[15px] md:px-[17px] cursor-pointer" id="delete-btn" data-id="${id}" src="../img/cross.png" alt="" />
      </li>
    `;
    if (completed_at === null) {
      undoCount += 1;
    }
  });
  list.innerHTML = str;
  unfinishItem.innerHTML = `${undoCount} 個待完成項目`;
  deleteBtn = document.querySelectorAll("#delete-btn");
};

// 刪除資料
const deleteEvent = () => {
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn.item(i).addEventListener("click", () => {
      let id = deleteBtn.item(i).dataset.id;
      let deleteItem = todoData.filter((item) => {
        return item.id === id;
      })[0];
      let deleteIndex = todoData.indexOf(deleteItem);
      deleteData(id, deleteIndex);
    });
  }
};
const deleteData = (todoId, index) => {
  axios
    .delete(`${url}/todos/${todoId}`, token)
    .then(() => {
      todoData.splice(index, 1);
      renderData(todoData);
      // getTodo();
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const todoDone = (todoId, index) => {
  axios
    .patch(`${url}/todos/${todoId}/toggle`, {}, token)
    .then((res) => {
      // console.log(res.data);
      // 需要完成 patch 但不重新發送 get 請求
      todoData.splice(index, 1, res.data);
      renderData(todoData);
      // getTodo();
    })
    .catch((err) => {
      // console.log(err.message);
    });
};

logoutBtn.addEventListener("click", () => {
  logout();
});

const logout = () => {
  axios
    .delete(`${url}/users/sign_out`, token)
    .then((res) => {
      // console.log(res);
      localStorage.removeItem("authorization");
      localStorage.removeItem("nickname");
      alert("成功登出");
      location.href = "index.html";
    })
    .catch((err) => {
      // console.log(err);
      alert("登出失敗");
    });
};

const init = async () => {
  checkLoginStatus();
  let todoDataHasValue = await getTodo();
  // todoData沒有資料即終止;
  if (!todoDataHasValue) {
    return;
  }
  getTodo();
  deleteEvent();
};

init();
