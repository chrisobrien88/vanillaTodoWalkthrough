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

btn.addEventListener('click', () => addTodo());

const addTodo = () => {
    try{
        inputValidator(input.value);
        const todo = {
            id: Date.now(),
            text: input.value,
            important: false,
            complete: false,
        }
        state.push(todo);
        input.value = '';}
    catch(e) {
       console.log(e);
       input.classList.add('shake')
       setTimeout(() => {
        input.classList = 'none'
       }, 2000);
       
    }
    window.dispatchEvent(new Event('statechange'));
};

const inputValidator = (input) => {
    if (input.length === 0) {
        throw new Error ('Input some text')
    };
}

const render = () => {
    todoList.innerHTML = state.map(obj => 
        createTodo(obj)
    )
    .join('')   
}

const createTodo = ({id, text, complete, important}) => {
    const deleteButton = `<button class='button deleteButton' onclick="deleteTodo(${id})">X</button>`
    return `
        <article class='todo ${complete? 'done':''} ${important? 'important':''}' id=${id} onclick="doneToggle(${id})">
            <h3 id="todoText">${text}</h3>
            <button onclick="event.stopPropagation();importantToggle(${id})">${important ? 'Not important' : 'Important'}</button>
            ${complete ? deleteButton : ''}
        </article>
    `
};

const importantToggle = (id) => {
    console.log('hello', id);
    state.map(obj => {
        if (obj.id === id && obj.important === false) {
            return obj.important = true
        }
        if (obj.id === id && obj.important) {
            return obj.important = false
        }
    })
    window.dispatchEvent(new Event('statechange'));
};

const doneToggle = (id) => {
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
    });
    window.dispatchEvent(new Event('statechange'));
};

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