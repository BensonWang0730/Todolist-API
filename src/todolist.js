const todoInput = document.getElementById('todoinput');
const todoBtn = document.getElementById('todoinput-btn');


todoBtn.addEventListener('click',function(){
    postData();
})

let url = 'https://todoo.5xcamp.us';
let token = {
    headers:{
        Authorization: localStorage.getItem("token"),
    }
};

function postData(){
    let list = {
        todo:{}
    };
    list.todo.content = todoInput.value;
    console.log(list);
    // axios.post(`${url}/todos`,token)

}

