const taskInput = document.querySelector('.task-input input')
const taskBox = document.querySelector('.task-box')
const menu = document.querySelector('.setting-menu')
const filters = document.querySelectorAll('.filter span')
const clearBtn = document.querySelector('.clear-btn')
// get all todo
let todos = JSON.parse(localStorage.getItem('todo'))
let editTaskId
let isEdited = false

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('span.active').classList.remove('active')
    btn.classList.add('active')
    showTodos(btn.id)
  })
})

clearBtn.addEventListener('click', () => {
  if (confirm('Do you want to clear all tasks?') == true) {
    localStorage.clear()
    showTodos()
  }
})

showTodos()

function showTodos(filter = 'all') {
  let li = '';
  if (todos) {
    todos.forEach( (todo, id) => {
      let isCompleted = todo.status === 'completed' ? 'checked' : '';
      
      if (filter === todo.status || filter == 'all') {
        li += `
          <li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
              <p class="${isCompleted}">${todo.name}</p>
            </label>
            <div  onclick="showMenu(this)" class="settings">
              <i class="fa-solid fa-ellipsis"></i>
              <ul class="setting-menu">
                <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
              </ul>
            </div>
        </li>
        `;
      }
  
      taskBox.innerHTML = li || `<span class="empty">You do not have any tasks here!</span>`;
    })
  }
}

function editTask(id, name) {
  taskInput.value = name;

  editTaskId = id;
  isEdited = true;
}

function updateStatus(task) {
  const taskName = task.parentElement.lastElementChild;

  if (task.checked) {
    taskName.classList.add('checked')
    todos[task.id].status = 'completed'
  } else {
    taskName.classList.remove('checked')
    todos[task.id].status = 'pending'
  }
  localStorage.setItem('todo', JSON.stringify(todos));
}

function showMenu(task) {
  let menuSetting = task.lastElementChild;
  menuSetting.classList.add('show');

  window.addEventListener('click', e => {
	
    if (!task.contains(e.target)){
      menuSetting.classList.remove('show')
    }
  })
}

function deleteTask(taskId) {
  todos.splice(taskId, 1);
  localStorage.setItem('todo', JSON.stringify(todos));
  showTodos()
}

taskInput.addEventListener('keyup', e => {
  let userTask = taskInput.value.trim();
  if (userTask === '') {
    alert("Please write something to do!");
  }else {
    if (e.key === 'Enter' || e.keyCode == 13) {
      if (isEdited) {
        todos[editTaskId].name = userTask
      } else {
          if (!todos) todos = [];
          let taskInfo = { name: userTask, status: 'pending' }
          todos.push(taskInfo)
        }
      taskInput.value = ''
      localStorage.setItem('todo', JSON.stringify(todos))
      showTodos()
    }
  }
})