// 驗證
let loginConstraints = {
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
};

let enrollConstraints = {
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
};

const loginForm = document.querySelector("#login-form");
const enrollForm = document.querySelector("#enroll-form");
const inputs = document.querySelectorAll("input"); // get all input NodeList
let enrollPageDisplay = false;
let noError = true;

for (let i = 0; i < inputs.length; i++) {
  inputs.item(i).addEventListener("input", () => {
    let loginErrors = validate(loginForm, loginConstraints);
    let enrollErrors = validate(enrollForm, enrollConstraints);
    let currentInput = inputs.item(i);

    // 顯示驗證訊息
    showErrorsForInput(currentInput, loginErrors);
    if (enrollPageDisplay) {
      showErrorsForInput(currentInput, enrollErrors);
    }
    console.log(noError);
  });
}

const showErrorsForInput = (inputPostion, error) => {
  let parentNode = inputPostion.parentNode;
  let p = document.createElement("p");
  p.classList.add("text-red-500");
  p.classList.add("font-bold");
  p.classList.add("text-[14px]");
  resetErrorsMsg(parentNode);
  if (error === undefined) {
    return;
  }
  if (error[inputPostion.name]) {
    noError = false;
    p.textContent = error[inputPostion.name];
    parentNode.appendChild(p);
  }
};

const resetErrorsMsg = (node) => {
  let p = node.querySelector("p");
  if (p) {
    node.removeChild(p);
  }
};

// 切換到註冊頁面
const toEnrollPage = document.querySelector("#toEnrollPage");
const loginPage = document.querySelector("#login-page");
const enrollPage = document.querySelector("#enroll-page");
toEnrollPage.addEventListener("click", () => {
  enrollPageDisplay = true;
  loginPage.classList.toggle("hidden");
  enrollPage.classList.toggle("flex");
  enrollPage.classList.toggle("hidden");
});

// All input value
let inputInfo = [];
for (let i = 0; i < inputs.length; i++) {
  inputInfo.push(inputs.item(i).value.trim());
}

// 註冊
let url = "https://todoo.5xcamp.us";
const enrollBtn = document.querySelector("#enroll-btn");
enrollBtn.addEventListener("click", () => {
  enroll();
});

const enroll = () => {
  if (noError) {
    let obj = {
      user: {
        email: inputInfo[2],
        nickname: inputInfo[3],
        password: inputInfo[4],
      },
    };
    axios
      .post(`${url}/users`, obj)
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
};

// 登入
const loginBtn = document.querySelector("#login-btn");
const enrollLoginBtn = document.querySelector("#enroll-login-btn");
loginBtn.addEventListener("click", () => {
  login();
});
enrollLoginBtn.addEventListener("click", () => {
  login();
});

const login = () => {
  let obj = {
    user: {
      email: inputInfo[0],
      password: inputInfo[1],
    },
  };
  axios
    .post(`${url}/users/sign_in`, obj)
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
};
