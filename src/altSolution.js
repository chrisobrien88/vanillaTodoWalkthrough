const state = JSON.parse(localStorage.getItem('todos')) || [];

const pushStateToLocalStorage = (state) => {
    localStorage.setItem('todos', JSON.stringify(state))
}

const input = document.getElementById('txtTodoItemTitle')
const btn = document.getElementById('btnAddTodo')
const todoList = document.getElementById('todoList')

const colorInput = document.getElementById('colorInput');
const colorBtn = document.getElementById('btnChangeColor');
colorBtn.addEventListener('click', () => changeColor())

const changeColor = () => {
    document.body.style.backgroundColor = colorInput.value;
}

const createTodo = (stateObj) => {
    if (!stateObj.complete) {
        return `
        <article class='todo' id=${stateObj.id} onclick="toggle(${stateObj.id})">
            <h3 id="todoText">${stateObj.text}</h3> 
            <button onclick="importanceToggle(${stateObj.id})">Mark as important</button>
        </article>
    `}

    return `
    <article class='todo done' id=${stateObj.id} onclick="toggle(${stateObj.id})">
            <h3>${stateObj.text}</h3>
        <button class='button deleteButton' onclick="deleteTodo(${stateObj.id})">X</button>
    </article>
    `
};

const importanceToggle = (id) => {
    state.map(obj => {
        if (obj.id === id && obj.highlighted === false) {
            return obj.highlighted = true
        }
        if (obj.id === id && obj.highlighted) {
            return obj.highlighted = false
        }
    })
    window.dispatchEvent(new Event('statechange'));
};

const toggle = (id) => {
    state.map(obj => {
        if (obj.id === id && obj.complete === false) {
            return obj.complete = true
        }
        if (obj.id === id && obj.complete) {
            return obj.complete = false
        }
    })
    window.dispatchEvent(new Event('statechange'));
};

const deleteTodo = (id) => {
    state.map((obj, index)=> {
        if (obj.id === id) {
            state.splice(index, 1);
        }
    window.dispatchEvent(new Event('statechange'));
    });
}

const render = () => {
    todoList.innerHTML = state.map(obj => { 
        return createTodo(obj);
    })
    .join('')   
}

btn.addEventListener('click', () => addTodo());

const inputValidator = (input) => {
    if (input.length === 0) {
        throw new Error ('Input some text')
    };
}

const addTodo = () => {
    try{
        inputValidator(input.value);
        const todo = {
            id: Date.now(),
            text: input.value,
            complete: false,
        }
        state.push(todo);
        input.value = '';}
    catch(e) {
        console.log(e.message);
       input.className = "input noInput";
        
    }
    window.dispatchEvent(new Event('statechange'));
}

window.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo()
    }
});

window.onload=render();
window.addEventListener('statechange', () => {
    pushStateToLocalStorage(state);
    render();
  });