// 關注點分離
// - 資料
// - 方法
// - 生命週期

const component = {
  // - 資料
  data: {
    url: "https://todoo.5xcamp.us",
    inputInfo: [],
    // 驗證限制
    loginConstraints: {
      email: {
        presence: {
          message: "^此為必填",
        },
        email: {
          message: "^不符合 Email 格式",
        },
      },
      密碼: {
        presence: {
          message: "^此為必填",
        },
        length: {
          minimum: 6,
          message: "^密碼長度需大於6位數",
        },
      },
    },
    enrollConstraints: {
      註冊Email: {
        presence: {
          message: "此為必填",
        },
        email: {
          message: "^不符合 Email 格式",
        },
      },
      註冊密碼: {
        presence: {
          message: "^此為必填",
        },
        length: {
          minimum: 6,
          message: "^密碼長度需大於6位數",
        },
      },

      再次輸入密碼: {
        presence: {
          message: "^此為必填",
        },
        equality: {
          attribute: "註冊密碼", // 綁定屬性 password，兩者 input 需相同
          message: "^與密碼不相符",
        },
      },
    },
    // 驗證訊息
    loginErrors: "",
    enrollErrors: "",
    // 註冊頁狀態
    enrollPageDisplay: false,
    noError: true,
  },
  // - 方法 --------------------------------------------------
  // 登入驗證
  showErrorsForInput(inputPostion, error) {
    let parentNode = inputPostion.parentNode;
    let p = document.createElement("p");
    p.classList.add("text-red-500");
    p.classList.add("font-bold");
    p.classList.add("text-[14px]");
    this.resetErrorsMsg(parentNode);
    if (error === undefined) {
      return;
    }
    if (error[inputPostion.name]) {
      noError = false;
      p.textContent = error[inputPostion.name];
      parentNode.appendChild(p);
    }
  },
  // 重置錯誤訊息
  resetErrorsMsg(node) {
    let p = node.querySelector("p");
    if (p) {
      node.removeChild(p);
    }
  },
  // 註冊頁
  enrollPage() {
    // 切換到註冊頁面
    const toEnrollPage = document.querySelector("#toEnrollPage");
    const loginPage = document.querySelector("#login-page");
    const enrollPage = document.querySelector("#enroll-page");
    toEnrollPage.addEventListener("click", () => {
      this.data.enrollPageDisplay = true;
      loginPage.classList.toggle("hidden");
      enrollPage.classList.toggle("flex");
      enrollPage.classList.toggle("hidden");
    });
    // 註冊
    const enrollBtn = document.querySelector("#enroll-btn");
    enrollBtn.addEventListener("click", () => {
      this.enroll();
    });
  },
  // 發送註冊 POST API
  enroll() {
    if (this.data.noError) {
      let userInfo = {
        user: {
          email: this.data.inputInfo[2],
          nickname: this.data.inputInfo[3],
          password: this.data.inputInfo[4],
        },
      };
      axios
        .post(`${this.data.url}/users`, userInfo)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.response.data.error);
        });
    } else {
      alert("輸入資料有問題！");
      return;
    }
  },
  // 發送登入 POST API
  login() {
    let userInfo = {
      user: {
        email: this.data.inputInfo[0],
        password: this.data.inputInfo[1],
      },
    };
    axios
      .post(`${this.data.url}/users/sign_in`, userInfo)
      .then((res) => {
        if (res.data.message == "登入成功") {
          let token = res.headers.authorization;
          let nickname = res.data.nickname;
          // console.log(res);
          // 跳到todolist頁面
          location.href = "./todo.html";
          localStorage.setItem("token", token);
          localStorage.setItem("nickname", nickname);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  },
  // - 生命週期 ---------------------------------------------
  render() {
    const loginForm = document.querySelector("#login-form");
    const enrollForm = document.querySelector("#enroll-form");
    // get all input NodeList(login page and enroll page)
    const inputs = document.querySelectorAll("input");

    for (let i = 0; i < inputs.length; i++) {
      inputs.item(i).addEventListener("input", () => {
        this.data.loginErrors = validate(loginForm, this.data.loginConstraints);
        this.data.enrollErrors = validate(
          enrollForm,
          this.data.enrollConstraints
        );
        let currentInput = inputs.item(i);

        // 顯示驗證訊息
        this.showErrorsForInput(currentInput, this.data.loginErrors);
        if (this.data.enrollPageDisplay) {
          this.showErrorsForInput(currentInput, this.data.enrollErrors);
        }
        // console.log(noError);
      });
    }
    for (let i = 0; i < inputs.length; i++) {
      this.data.inputInfo.push(inputs.item(i).value.trim());
    }

    // 監聽事件
    this.enrollPage();
    // 登入
    const loginBtn = document.querySelector("#login-btn");
    const enrollLoginBtn = document.querySelector("#enroll-login-btn");
    loginBtn.addEventListener("click", () => {
      if (this.data.loginErrors !== undefined) {
        alert("請檢查輸入");
        return;
      }
      this.login();
    });
    enrollLoginBtn.addEventListener("click", () => {
      if (this.data.loginErrors !== undefined) {
        alert("請檢查輸入");
        return;
      }
      this.login();
    });
  },
};

component.render();
