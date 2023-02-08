const todoInput = document.getElementById('todoinput');
const todoBtn = document.getElementById('todoinput-btn');
const user = document.getElementById('user');
const Htmltodolist = document.getElementById('todolist-data');


user.textContent = localStorage.getItem('nickname');
let url = 'https://todoo.5xcamp.us';
let token = {
    headers:{
        Authorization: localStorage.getItem('token'),
    }
};


// if 有資料可以先顯示
getData();

// 觸法傳送按鈕
todoBtn.addEventListener('click', function(){
    postData();
})

Htmltodolist.addEventListener('click',function(e){
    let id = e.target.getAttribute("id-data");
    // let checked = document.querySelectorAll('input[type=checkobx]:checked');

    if(id !== null){
        deleteData(id);
    }
})


function postData(){
    if(todoInput.value == ''){
        alert('請輸入資料');
        return
    }

    let list = {todo:{content:todoInput.value}};

    // console.log(list);

    axios.post(`${url}/todos`,list,token)
        .then((res)=>{
            console.log('post success');
        })
        .catch((err)=>{
            console.log(err);
        })
        .then(()=>{
            getData();
        })
    // 輸入欄位清空
    todoInput.value = '';
}


function getData(){
    axios.get(`${url}/todos/`,token)
        .then((res)=>{
            // 取的 todolist Data
            // console.log(res.data.todos);
            let APItodolist = res.data.todos.reverse();
            if( APItodolist !== ''){
                renderData(APItodolist);
            }
        })
}

function deleteData(todoId){
    axios.delete(`${url}/todos/${todoId}`,token)
        .then((res)=>{
            console.log(`del:${res.data.message}`)
            getData();
        })
        .catch((err)=>{
            console.log(err.message);
        })

}


// 顯示在 html 上
function renderData(data){
    let str = '';
    data.forEach((item, index) => {
        str += `
        <li class="flex flex-row pt-[17px] pb-[15px] items-center border-b border-[#E5E5E5]"><input type="checkbox" class="w-5 h-5" name="" id-data="${item.id}">
            <p class="pl-6">${item.content}</p>
        </li>`;
    });
    Htmltodolist.innerHTML = str;
}