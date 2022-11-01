const state = JSON.parse(localStorage.getItem('todos')) || [];

const pushStateToLocalStorage = (state) => {
    localStorage.setItem('todos', JSON.stringify(state))
}

// elements
const todoInput = document.getElementById('txtTodoItemTitle')
const todoCategoryInput = document.getElementById('txtTodoCategory')
const addBtn = document.getElementById('btnAddTodo')
const todoListUncomplete = document.getElementById('todoListUncomplete')
const todoListComplete = document.getElementById('todoListComplete')
const colorInput = document.getElementById('colorInput');
const colorBtn = document.getElementById('btnChangeColor');

// colorBtn.addEventListener('click', () => changeColor())

// const changeColor = () => {
//     document.body.style.backgroundColor = colorInput.value;
// }

addBtn.addEventListener('click', () => addTodo());

const addTodo = () => {
    try{
        inputValidator(todoInput.value);
        const todo = {
            id: Date.now(),
            text: todoInput.value,
            category: todoCategoryInput.value,
            important: false,
            complete: false,
            randomNumber: Math.floor(Math.random() * 4)
        }
        state.push(todo);
        todoInput.value = '';}
    catch(e) {
       console.log(e);
       todoInput.classList.add('shake')
       setTimeout(() => {
        todoInput.classList = 'todoInput textTodoInput'
       }, 2000);
       
    }
    window.dispatchEvent(new Event('statechange'));
};

const inputValidator = (input) => {
    if (input.length === 0) {
        throw new Error ('Input some text')
    };
}

// refactor this
const render = () => {
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

const createTodo = ({id, text, category, complete, important, randomNumber}) => {
    const deleteButton = `<button class='button deleteButton' onclick="deleteTodo(${id})">X</button>`
    const copyTextButton = `<button class="button copyButton" onclick="event.stopPropagation(); copyContent(${id})">Copy</button>`
    const importantButton = `
        <button class="button importantButton" onclick="event.stopPropagation();importantToggle(${id})">${important ? 'Not important' : 'Flag'}</button>`

    return `
        <article class=
                'todo ${complete? 'done':''} ${important? 'important':''}' 
            id=${id} 
            onclick="doneToggle(${id})">
            ${category? `<h2>${category}</h2>`: ``}
            <h3 id="todoText">${text}</h3>
            <section class = 'buttons-container'>
                ${importantButton}
                ${copyTextButton}
                ${deleteButton}
            </section>
        </article>
    `
};

const copyContent = (id) => {
    state.map(obj => {
        if (obj.id === id) {
            copy(obj.text);
        }
        
  })}

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  } 

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