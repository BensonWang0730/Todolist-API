import { alertError, Toast } from "./sweetAlert.js";

Vue.createApp({
  data() {
    return {
      // API
      url: "https://todoo.5xcamp.us",
      nickname: localStorage.getItem("nickname"),
      token: {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      },
      // TodoList
      input: "",
      todoData: [],
      temp: [],
      undoNum: "",
    };
  },
  methods: {
    // 檢查登入狀態
    checkLoginStatus() {
      const userName = document.querySelector("#username");
      axios
        .get(`${this.url}/check`, this.token)
        .then(() => {
          // 設置用戶名
          userName.textContent = this.nickname;
        })
        .catch((err) => {
          alert("不存在此用戶");
          location.href = "./index.html";
        });
    },
    // 切換 TodoList 不同狀態的資料
    checkTodoStatus(status) {
      // 差一點點，因為 v-for 跑的是 todoData，所以只能去變動 todoData，
      // 但 filter 過後 todoData 就越變越少
      // 裝態：全部
      if (this.temp.length === 0) {
        this.temp = [...this.todoData];
      }
      if (status === "status-all") {
        this.todoData = this.temp;
        return;
      }
      // 狀態：待完成
      if (status === "status-undo") {
        this.todoData = this.temp.filter((item) => {
          return item.completed_at === null;
        });
        return this.todoData;
      }
      // 狀態：已完成
      if (status === "status-done") {
        this.todoData = this.temp.filter((item) => {
          return item.completed_at !== null;
        });
        return this.todoData;
      }
    },
    // input值 POST
    postTodo() {
      if (this.input === "") {
        alertError.fire({ title: "請輸入資料" });
        return;
      }
      let todoInput = { todo: { content: this.input } };
      axios
        .post(`${this.url}/todos`, todoInput, this.token)
        .then((res) => {
          this.getTodo();
          Toast.fire({
            icon: "success",
            title: "新增成功",
          });
        })
        .catch((err) => {
          console.log(err);
        });

      // 清空輸入
      this.input = "";
    },
    // 取得 Todolist 資料 GET
    async getTodo() {
      const todolist = document.querySelector("#todolist");
      // 沒有資料切換背景
      const todoEmpty = document.querySelector("#todo-empty");

      const res = await axios.get(`${this.url}/todos`, this.token);
      this.todoData = res.data.todos; //.reverse()
      await this.countUndo(this.todoData);
      if (this.todoData.length !== 0) {
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
    },
    // 刪除 TodoList 資料 DELETE
    deleteData(todoId, index) {
      axios
        .delete(`${this.url}/todos/${todoId}`, this.token)
        .then(() => {
          this.todoData.splice(index, 1);
          this.getTodo();
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    // 打勾完成 TodoList 資料 PATCH
    todoDone(todoId, index) {
      axios
        .patch(`${this.url}/todos/${todoId}/toggle`, {}, this.token)
        .then((res) => {
          this.todoData.splice(index, 1, res.data);
          this.countUndo(this.todoData);
          Toast.fire({
            icon: "success",
            title: "完成項目",
          });
        })
        .catch((err) => {
          alert(err.message);
        });
    },
    // 計算待完成數量
    countUndo(items) {
      let num = items.filter((item) => {
        return item.completed_at === null;
      });
      this.undoNum = num.length;
    },
    // 使用者登出
    logout() {
      axios
        .delete(`${this.url}/users/sign_out`, this.token)
        .then((res) => {
          localStorage.removeItem("authorization");
          localStorage.removeItem("nickname");
          location.href = "index.html";
        })
        .catch((err) => {
          alert("登出失敗");
        });
    },
  },
  async mounted() {
    this.checkLoginStatus();
    await this.getTodo();
  },
}).mount("#main");
