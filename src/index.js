const state = [];

const input = document.getElementById('txtTodoItemTitle')
const btn = document.getElementById('btnAddTodo')
const todoList = document.getElementById('todoList')

const createTodo = (stateObj) => {
    if (stateObj.complete === false) {
    return `
    <article class='todo' id=${stateObj.id} onclick="toggle(${stateObj.id})">
        <h3>${stateObj.text}</h3>
    </article>
    `}
    return `
    <article class='todo done' id=${stateObj.id} onclick="toggle(${stateObj.id})">
            <h3>${stateObj.text}</h3>
        <button onclick="deleteTodo(${stateObj.id})">X</button>
    </article>
    `
};

const toggle = (id) => {
    state.map(obj => {
        if (obj.id === id && obj.complete === false) {
            return obj.complete = true
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
    todoList.innerHTML = state.map(obj => createTodo(obj))
    .join('')   
}

btn.addEventListener('click', () => addTodo());

const addTodo = () => {
    const todo = {
        id: Date.now(),
        text: input.value,
        complete: false
    }
    state.push(todo);
    input.value = '';
    window.dispatchEvent(new Event('statechange'));
}

window.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo()
    }
});
window.addEventListener('statechange', () => {
    render();
  });