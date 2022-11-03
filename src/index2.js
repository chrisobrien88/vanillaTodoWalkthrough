const state = [];

// elements
const todoInput = document.getElementById('txtTodoItemTitle')
const todoCategoryInput = document.getElementById('txtTodoCategory')
const addBtn = document.getElementById('btnAddTodo')
const todoListUncomplete = document.getElementById('todoListUncomplete')
const todoListComplete = document.getElementById('todoListComplete')
const colorInput = document.getElementById('colorInput');
const colorBtn = document.getElementById('btnChangeColor');


addBtn.addEventListener('click', () => addTodo());

const addTodo = () => {
    inputValidator(todoInput.value);
    const todo = {
        id: Date.now(),
        text: todoInput.value,
        category: todoCategoryInput.value,
        important: false,
        complete: false,
    }
    state.push(todo);
    todoInput.value = '';
    todoCategoryInput.value = ''
    window.dispatchEvent(new Event('statechange'));
};

const inputValidator = (input) => {
    if (input.length === 0) {
        console.log('no input');
        throw new Error ('Input some text')
    };
}

// refactor this
const render = () => {
    console.log(state);
    todoListUncomplete.innerHTML = 
        state.map(obj => 
        {if (!obj.complete) 
           return createTodo(obj)
        }
    )
    .join('');
    
    todoListComplete.innerHTML = state.map(obj => 
        {if (obj.complete) 
            return createTodo(obj)
        }
    )
    .join('');
}

const createTodo = ({id, text, category, complete, important}) => {
    const deleteButton = `<button class='button deleteButton' onclick="deleteTodo(${id})">X</button>`
    const importantButton = `
        <button 
            class="button importantButton" 
            onclick="event.stopPropagation(); importantToggle(${id})">
            ${important ? 'Not important' : 'Flag'}
        </button>`

    return `
        <article class=
                'todo ${complete? 'done':''}' 
            id=${id} 
            onclick="doneToggle(${id})">
            ${category? `<h2>${category}</h2>`: ``}
            <p id="todoText">${text}</p>
            <section class = 'buttons-container'>
                ${importantButton}
                ${complete? `${deleteButton}`: ``}
            </section>
        </article>
    `
};


const importantToggle = (id) => {
    state.map(obj => {
        if (obj.id === id && !obj.important) {
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
        if (obj.id === id && !obj.complete) {
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
    render();
  });