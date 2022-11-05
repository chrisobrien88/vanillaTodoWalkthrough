

const state = JSON.parse(localStorage.getItem('todos')) || [];

const pushStateToLocalStorage = (state) => {
    localStorage.setItem('todos', JSON.stringify(state))
}

// elements
const todoInput = document.getElementById('txtTodoItemTitle')
const todoCategoryInput = document.getElementById('txtTodoCategory')
const colorInput = document.getElementById('colorInput')
const addBtn = document.getElementById('btnAddTodo')

const todoUncompleteTitle = document.getElementById('todoUncompleteTitle')
const todoInProgressTitle = document.getElementById('todoInProgressTitle')
const todoDoneTitle = document.getElementById('todoDoneTitle')

const todoListUncomplete = document.getElementById('todoListUncomplete')
const todoListInProgress = document.getElementById('todoListInProgress')
const todoListComplete = document.getElementById('todoListComplete')

addBtn.addEventListener('click', () => addTodo());
colorInput.addEventListener('click', () => console.log(colorInput.value));

const checkBrightness = (inputColor) => {
    const hex = inputColor.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    console.log(brightness); 
    if(brightness > 120) {
        return 'black'
    }
    return 'white'
}
const addTodo = () => {
    try{
        inputValidator(todoInput.value);
        checkBrightness(colorInput.value);

        const todo = {
            id: Date.now(),
            text: todoInput.value,
            category: todoCategoryInput.value,
            important: false,
            complete: 'not done',
            backgroundColor: colorInput.value,
            color: checkBrightness(colorInput.value),
        }

        state.find(oldTodo => {
            if (oldTodo.category === todo.category && todo.category !== '')
                {
                    todo.backgroundColor = oldTodo.backgroundColor;
                    todo.color = oldTodo.color;
                };
        });
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

const mapAndCreate = (status) => {
    const orderedState = state.sort(
        (p1, p2) => (p1.order < p2.order) ? 1 : (p1.order > p2.order) ? -1 : 0);
    return orderedState.map(obj => 
        {if (obj.complete === status) 
           return createTodo(obj)
        }
    )
    .join('');
}

// refactor this
const render = () => {
    todoListUncomplete.innerHTML = mapAndCreate('not done');
    todoListUncomplete.innerHTML.length > 0? 
        todoUncompleteTitle.innerHTML = 'Todo':
        todoUncompleteTitle.innerHTML = ''
    ;
    todoListInProgress.innerHTML = mapAndCreate('in progress');
    todoListInProgress.innerHTML.length > 0?
        todoInProgressTitle.innerHTML = 'In Progress':
        todoInProgressTitle.innerHTML = ''
    
    todoListComplete.innerHTML = mapAndCreate('done');
    todoListComplete.innerHTML.length > 0? 
        todoDoneTitle.innerHTML = 'Done':
        todoDoneTitle.innerHTML = ''
    ;
}

const createTodo = ({id, text, category, complete, important, backgroundColor, color}) => {
    const deleteButton = `<button class='button deleteButton' onclick="deleteTodo(${id})">X</button>`
    const copyTextButton = `<button class="button copyButton" onclick="event.stopPropagation(); copyContent(${id})">Copy</button>`
    const importantButton = `
        <button class="button importantButton" onclick="event.stopPropagation();importantToggle(${id})">${important ? 'De-flag' : 'Flag'}</button>`

    return `
        <article style="background-Color:${backgroundColor};color:${color}"
            class = ' 
                ${complete === 'in progress' ? 'in-Progress': 'todo' }
                ${complete === 'done' ? 'done' : 'todo'}
                ${important? 'important' : 'not-important' }
            ' 
            id=${id} 
            onclick="doneToggle(${id})">
            <p id="todoText">${text}</p>
            ${category? `<h4>${category}</h4>`: ``}
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
        if (obj.id === id && obj.complete === 'done') {
            return obj.complete = 'not done'
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