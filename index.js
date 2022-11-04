const state = JSON.parse(localStorage.getItem('todos')) || [];

const pushStateToLocalStorage = (state) => {
    localStorage.setItem('todos', JSON.stringify(state))
}

// elements
const todoInput = document.getElementById('txtTodoItemTitle')
const todoCategoryInput = document.getElementById('txtTodoCategory')
const addBtn = document.getElementById('btnAddTodo')

const todoUncompleteTitle = document.getElementById('todoUncompleteTitle')
const todoInProgressTitle = document.getElementById('todoInProgressTitle')
const todoDoneTitle = document.getElementById('todoDoneTitle')

const todoListUncomplete = document.getElementById('todoListUncomplete')
const todoListInProgress = document.getElementById('todoListInProgress')
const todoListComplete = document.getElementById('todoListComplete')
const colorInput = document.getElementById('colorInput');
const colorBtn = document.getElementById('btnChangeColor');

addBtn.addEventListener('click', () => addTodo());

const addTodo = () => {
    try{
        inputValidator(todoInput.value);

        // categories = state.map(todo => todo.category)
        // matchingCategory = categories.find(category => { 
        //     if (category === todoCategoryInput.value) 
        //         return category
        //     });
        // console.log('matching', matchingCategory);
        // const matchingTodo = state.find(todo => {
        //     if (todo.category === matchingCategory) 
        //         {return [todo.randomNumber, todo.id]}
        //     return 'no match'
        //     })
        // console.log('huh', matchingTodo);

        const todo = {
            id: Date.now(),
            text: todoInput.value,
            category: todoCategoryInput.value,
            important: false,
            complete: 'not done',
            randomNumber: Math.floor(Math.random() * 4),
        }
        // if (matchingCategory) {
        //     todo.randomNumber = matchingTodo[0]
        // }
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

const createTodo = ({id, text, category, complete, important, randomNumber}) => {
    const deleteButton = `<button class='button deleteButton' onclick="deleteTodo(${id})">X</button>`
    const copyTextButton = `<button class="button copyButton" onclick="event.stopPropagation(); copyContent(${id})">Copy</button>`
    const importantButton = `
        <button class="button importantButton" onclick="event.stopPropagation();importantToggle(${id})">${important ? 'Not important' : 'Flag'}</button>`

    return `
        <article class=
                'todo 
                ${complete === 'in progress' ? 'in-Progress': '' }
                ${complete === 'done' ? 'done' : ''}
                ${important? 'important':'not-important'}
                ${complete !== 'done' ? randomNumber : ''}
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