// const hexToComplimentary = require('./colorChanger')


function hexToComplimentary(hex){

    // Convert hex to rgb
    // Credit to Denis http://stackoverflow.com/a/36253499/4939630
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

    // Get array of RGB values
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    // Convert RGB to HSL
    // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0;  //achromatic
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

    // Convert h s and l values into r g and b values
    // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    // Convert r b and g values to hex
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}  

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

const checkBrightness = (inputColor, fontColor) => {
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
        checkBrightness(colorInput.value)
        categoriesArr = state.map(todo => todo.category)

        const todo = {
            id: Date.now(),
            text: todoInput.value,
            category: todoCategoryInput.value,
            important: false,
            complete: 'not done',
            randomNumber: Math.floor(Math.random() * 4),
            backgroundColor: colorInput.value,
            color: checkBrightness(colorInput.value),
        }

        state.find(oldTodo => {
            if (oldTodo.category === todo.category && todo.category !== '')
                {
                    todo.randomNumber = oldTodo.randomNumber;
                    todo.backgroundColor = oldTodo.backgroundColor;
                    todo.color = oldTodo.color;
                    // todo.id = oldTodo.id + 1;
                };
        });
        console.log(todo);
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

const createTodo = ({id, text, category, complete, important, randomNumber, backgroundColor, color}) => {
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