const state = JSON.parse(localStorage.getItem('todos')) || [];

const pushStateToLocalStorage = (state) => {
    localStorage.setItem('todos', JSON.stringify(state))
}

// elements
const todoInput = document.getElementById('txtTodoItemTitle')
const todoCategoryInput = document.getElementById('txtTodoCategory')
const addBtn = document.getElementById('btnAddTodo')
const todoListUncomplete = document.getElementById('todoListUncomplete')
const todoListInProgress = document.getElementById('todoListInProgress')
const todoListComplete = document.getElementById('todoListComplete')
const colorInput = document.getElementById('colorInput');
const colorBtn = document.getElementById('btnChangeColor');

addBtn.addEventListener('click', () => addTodo());

const addTodo = () => {
    try{
        inputValidator(todoInput.value);
        const todo = {
            id: Date.now(),
            text: todoInput.value,
            category: todoCategoryInput.value,
            important: false,
            complete: 'not done',
            randomNumber: Math.floor(Math.random() * 4)
        }
        state.push(todo);
        todoInput.value = '';
        todoCategoryInput.value = ''}
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
        {if (obj.complete === 'not done') 
           return createTodo(obj)
        }
    )
    .join('');
    
    todoListInProgress.innerHTML = state.map(obj => 
        {if (obj.complete === 'in progress') 
            return createTodo(obj)
        }
    )
    .join('');

    todoListComplete.innerHTML = state.map(obj => 
        {if (obj.complete === 'done') 
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
                'todo 
                ${complete === 'in progress' ? 'in-Progress':''}
                ${complete === 'done' ? 'done':''}
                ${important? 'important':''}
                ${randomNumber === 3 ? 'green' : ''}
                ${randomNumber === 2 ? 'blue' : ''}
                ${randomNumber === 1 ? 'pink' : ''}
                ${randomNumber === 0 ? 'orange' : ''}
                ' 
            id=${id} 
            onclick="doneToggle(${id})">
            ${category? `<h2>${category}</h2>`: ``}
            <p id="todoText">${text}</p>
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
        if (obj.id === id && obj.complete === 'not done') {
            return obj.complete = 'in progress'
        }
        if (obj.id === id && obj.complete === 'in progress') {
            return obj.complete = 'done'
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