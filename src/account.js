const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');

const email = document.getElementById('email');
const signupEmail = document.getElementById('signup-email');
const UserName = document.getElementById('signup-name');
const password = document.getElementById('password');
const signupPassword = document.getElementById('signup-password');
const passwordAgain = document.getElementById('password-again');
const warm = document.getElementById('warm');

// page toggle
const signupPage = document.getElementById('signup-page');
const loginPage = document.getElementById('login-page');
const signupChangePage = document.getElementById('signup');
const loginChangePage = document.getElementById('login'); 


let url = 'https://todoo.5xcamp.us';

// login button 發送資料
loginBtn.addEventListener('click',login);
// signup button 發送資料
signupBtn.addEventListener('click',signup);



// signup click
signupChangePage.addEventListener('click', Login_Signup_Togggle);
loginChangePage.addEventListener('click',Login_Signup_Togggle);

// css toggle
function Login_Signup_Togggle(){
    loginPage.classList.toggle('hidden');
    signupPage.classList.toggle('hidden');
    signupPage.classList.toggle('flex');
}

// passwordConfirm
function passwordConfirm(){
    if(signupPassword.value !== passwordAgain.value){
        passwordAgain.value = "";
        warm.innerHTML = `<p class='text-red-500 text-xs mt-1'>請重新輸入正確密碼</p>`;
        return 
    }
}


// API Post
function login(e){
    let obj = {
        user:{
            email:email.value.trim(),
            password:password.value.trim()
        }
    }

    // API Post login
    axios
        .post(`${url}/users/sign_in`,obj)
        .then((res)=>{
            console.log(res);
            if(res.data.message == '登入成功'){
                let token = res.headers.authorization;
                let nickname = res.data.nickname;
                console.log(res);
                // 跳到todolist頁面
                location.href= './todolist.html';
                localStorage.setItem('token',token);
                localStorage.setItem('nickname',nickname);
            }
        })
        .catch((err)=>{
            console.log(err.message);
        })
}

// APi Post
function signup(){
    passwordConfirm();
    let obj = {
        user: {
            email: signupEmail.value.trim(),
            nickname: UserName.value.trim(),
            password: signupPassword.value.trim()
        }
    }
    axios
        .post(`${url}/users`,obj)
        .then((res)=>{
            alert(res.data.message);
            // 註冊成功直接跳頁
        })
        .catch((err)=>{
            // console.log(err.response.data.error);
            alert(err.response.data.error);
        })
}

