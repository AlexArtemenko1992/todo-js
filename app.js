const arrOfTasks = [
  {
    id: 1,
    title: "First task",
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem, tempora possimus ipsa consequuntur quos sed quas voluptatum itaque sint, repellendus nam eum nulla error dicta quisquam necessitatibus eaque. Tempore, repellendus.",
    complated: false,
  }
];
// UI
const container = document.querySelector('.container')
const form = document.querySelector('.form')
const formInputTitle = document.querySelector('.input-title')
const formInputBody = document.querySelector('.input-body')
const btnGroup = document.querySelector(".btn-group-control");



const objOfTasks = serializeToObj(arrOfTasks)

form.addEventListener('submit', onSubmit)
btnGroup.addEventListener('click', setTaskList)
container.addEventListener('click', onDeleteTask)
renderAlTasks(objOfTasks);



function serializeToObj(arr) {
  const objOfTasks = arr.reduce((acc, el) => {
    acc[el.id] = el
    return acc
  }, {})
  return objOfTasks
}


function setTaskList({ target }) {
  if (target.classList.contains('btn-primary')) {
    container.innerHTML = ''
    renderAlTasks(objOfTasks);
  } else if (target.classList.contains('btn-warning')) {
    container.innerHTML = ''
    renderNotComplatedTusk(objOfTasks);
  } else if (target.classList.contains('btn-info')) {
    container.innerHTML = ''
    renderComplatedTask(objOfTasks)
  }
}

function renderAlTasks(taskList) {
  if (!taskList) {
    console.error('Передайте список задач!')
    return
  }
  const fragment = document.createDocumentFragment()
  Object.values(taskList).forEach(task => {
    const card = generateCard(task)
    fragment.appendChild(card)
  });
  container.appendChild(fragment)
}

function renderNotComplatedTusk(taskList) {
  const fragment = document.createDocumentFragment()
  const notComplatedTasks = Object.values(taskList).filter((el) => !el.complated);
  if (!Object.keys(notComplatedTasks).length) {
        container.insertAdjacentHTML(
          "afterbegin",
          showInfoMsg(
            "У Вас нет задач, которые нужно завершить",
            'Если Вы вополнили задачу, то Вам нужно нажать кнопку "Выполнено", и затем Вы сможете ее увидеть в разделе "Выполненые".'
          )
        );
  }
  notComplatedTasks.forEach(task => {
    const card = generateCard(task)
    fragment.appendChild(card)
  });
  container.appendChild(fragment)
}

function renderComplatedTask(taskList) {
  const fragment = document.createDocumentFragment()
  const complatedTask = Object.values(taskList).filter(el => el.complated)
  if (!Object.values(complatedTask).length) {
    container.insertAdjacentHTML("afterbegin", showInfoMsg('У Вас нет невыполненных задач', 'Если Вы выполнили задачу, то Вам нужно отметить ее как выполненную. Достаточно нажать кнопку "Выполнено".'));
  }
  complatedTask.forEach(task => {
    const card = generateCard(task)
    card.classList.add('complated')
    fragment.appendChild(card)
  });
  container.appendChild(fragment)
}

function generateCard({id, title, body}) {
  const card = document.createElement('div')
  card.classList.add('card')
  card.dataset.id = id
  const icon = document.createElement('i')
  icon.classList.add('far', 'fa-check-circle')
  const cardHeader = document.createElement('h4')
  cardHeader.style = 'font-weight: bold'
  cardHeader.classList.add('card-header')
  cardHeader.textContent = title
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const cardText = document.createElement('p')
  cardText.classList.add('card-text')
  cardText.textContent = body
  const btnDelete = document.createElement('button')
  btnDelete.classList.add("btn", "btn-danger");
  btnDelete.textContent = "Удалить";
  const btnDone = document.createElement('button')
  btnDone.classList.add("btn", "btn-success", 'ml-2');
  btnDone.textContent = "Выполнено";

  cardBody.appendChild(cardText)
  cardBody.appendChild(btnDelete);
  cardBody.appendChild(btnDone)
  card.appendChild(cardHeader)
  card.appendChild(cardBody)
  card.appendChild(icon)

  return card
}

function onSubmit(e) {
  e.preventDefault()

  const titleValue = formInputTitle.value
  const bodyValue = formInputBody.value

  if (!titleValue || !bodyValue) {
    alert('Введите значения в поля')
    return
  }

  const newTask = createNewTask(titleValue, bodyValue)
  const newTaskTemplate = generateCard(newTask)
  container.insertAdjacentElement('afterbegin', newTaskTemplate)

  form.reset()
}

function createNewTask(title, body) {
  const newTask = {
    id: Math.random(),
    title,
    body,
    complated: false
  }
  objOfTasks[newTask.id] = newTask
  console.log(objOfTasks)
  return newTask
}

function deleteTask(id){
  console.log(objOfTasks[id])
  delete objOfTasks[id]
  if (!Object.keys(objOfTasks).length) {
    container.insertAdjacentHTML('afterbegin',showInfoMsg);
  }
}

function onDeleteTask(e) {
  if (e.target.classList.contains('btn-danger')) {
    const parent = e.target.closest('[data-id]')
    const id = parent.dataset.id
    deleteTask(id)
    parent.remove()
  }

  if (e.target.classList.contains('btn-success')) {
    const parent = e.target.closest("[data-id]");
    const id = parent.dataset.id;
    objOfTasks[id].complated = true;
    parent.classList.toggle('complated')
  }
}

function showInfoMsg(title, body) {
  return `
    <div class="alert alert-success" role="alert">
  <h4 class="alert-heading">${title}</h4>
  <p>${body}</p>
  <hr>
  <p class="mb-0">Необходимо добавить задачу</p>
</div>
  `;
}

