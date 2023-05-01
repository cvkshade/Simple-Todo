const nav = document.querySelector(".nav");
const textBox = document.querySelector(".textBox");
const updateBox = document.querySelector(".updateBox");
const textArea = document.querySelector(".textarea");
const hisTotal = document.querySelector(".histotal");
const taskTotal = document.querySelector(".total");
const addTodoBtn = document.querySelector(".addTodo");
const xClose = document.querySelector(".box-close");
const updateClose = document.querySelector(".x-close");
const newTodo = document.getElementById("addTodo");
const searchBtn = document.getElementById("search");
const searchBox = document.getElementById("searchBox");
const updateTask = document.getElementById("update");
const showHistory = document.querySelector(".title");
const restoreTodo = document.querySelectorAll('.restore')
const statusText = document.querySelector(".statusText");

const list = document.querySelector(".main-list");
const searchForm = document.querySelector(".search-form");
const updater = document.querySelector(".update");
const historyList = document.querySelector(".history");
console.log(historyList)
let todoNum;
let localArr;
let todolist;
let completed;

let todoHis = [];

updateStorage = () => {
  window.localStorage.setItem("todoList", JSON.stringify(todolist));
};
getStorage = () => {
  let localyStoreData = window.localStorage.getItem('todoList');
  const retrieveArr = JSON.parse(localyStoreData);
  todolist = [...retrieveArr]

}
getStorage();

todoSearch = () => {
  let query = searchBox.value;
  list.innerHTML = "";
  let searchResult = todolist.filter(todo => todo.text == query);
  for (let i = 0; i < searchResult.length; i++) {
    searchItem = document.createElement("li");
    searchItem.setAttribute("class", `todoItem ${searchResult[i].completed}`);
    searchItem.setAttribute("data-num", `${searchResult[i].id}`);
    searchItem.innerHTML = `<div class="state"> <span class="checkbox" data-index="${i}"><ion-icon name="checkmark-outline"></ion-icon></span><span class="statusText" data-text>Uncompleted</span></div><p class="text">${searchResult[i].text}</p><button class="edit">Edit</button>
        <button class="delete">Delete</button>`;
        

    list.append(searchItem);
  }
  console.log(searchResult);
};
editTodo = (id) => {
  todolist.map((todo) => (todo.id === id ? { ...todo, ...updateInfo } : todo));
  updateBox.value = todolist[id].text;
};

renderTodo = () => {
  list.innerHTML = "";
  let todoItem;
  if (todolist.length === 0) return;
  for (let i = 0; i < todolist.length; i++) {
    todoItem = document.createElement("li");
    todoItem.setAttribute("class", `todoItem ${todolist[i].completed}`);
    todoItem.setAttribute("data-num", `${todolist[i].id}`);
    todoItem.innerHTML = `<div class="state"> <span class="checkbox" data-index="${i}"><ion-icon name="checkmark-outline"></ion-icon></span><span class="statusText" data-text>Uncompleted</span></div><p class="text">${todolist[i].text}</p><button class="edit">Edit</button>
        <button class="delete">Delete</button>`;
        

    list.append(todoItem);
  }
  updateStorage();
};
renderTodo();

restoreData = (event) => {
  index = event.target.getAttribute('data-restore');
  todolist.push(todoHis[index]);
  todoHis.splice(index, 1);
  historyList.innerHTML = "";
  renderTodo();
  taskReader();
}

updateState = (event) => {
  event.target.classList.toggle('completed')
  index = event.target.getAttribute("data-index");
  if(todolist[index].completed === false){
    todolist[index].completed = true;
    event.target.nextElementSibling.innerHTML = 'Completed';
    } else {
    event.target.classList.remove('completed')
    todolist[index].completed = false;
    event.target.nextElementSibling.innerHTML = 'Uncompleted'
  }
    stateRender() 
      console.log(
        event.target.nextElementSibling.classList
      )
};

stateRender = ()=> {
  completed = 0
  for (const todo in todolist) {
  if(todolist[todo].completed === true){completed += 1;}

  hisTotal.innerHTML = `${completed}`;

  }
}
stateRender();
updateHis = () => {
  let hisItem;
  if (todoHis.length === 0) return;
  for (let i = 0; i < todoHis.length; i++) {
    hisItem = document.createElement("li");
    hisItem.setAttribute("history-data-num", `${todoHis[i].id}`);
    hisItem.innerHTML = `<ion-icon name="refresh-circle-outline" data-restore="${i}" class="restore"></ion-icon><p class="history-layout">${todoHis[i].text}</p>`;
  }
  historyList.append(hisItem);
};
updateHis()

addItem = (text) => {
  if (todolist.length >= 10) {
    return;
  }
  const todo = {
    text,
    id: Date.now(),
    completed: false,
  };
  todo.text = text;

  if (textBox.value !== "") {
    todolist.push(todo);
  } else {
    return;
  }
  textBox.value = "";
  textBox.focus();

  renderTodo(todolist);
  updateStorage()
};

winClose = (e1, e2) => {
  e1.style.display = "none";
  e2.value = "";
};

textArea.addEventListener("submit", (e) => {
  e.preventDefault();
});
addTodoBtn.addEventListener("click", (e) => {
  textArea.style.display = "flex";
  textBox.focus();
});
xClose.addEventListener("click", (e) => {
  winClose(textArea, textBox);
});
updateClose.addEventListener("click", (e) => {
  winClose(updater, updateBox);
});

newTodo.addEventListener("click", (e) => {
  newtext = textBox.value.trim();
  addItem(newtext);
});
list.addEventListener("click", (e) => {
  const cls = e.target.parentElement.getAttribute("data-num");
  let itemIndex = todolist.findIndex((todo) => {
    return todo.id == cls;
  });
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    todoHis.push(todolist[itemIndex]);
    todolist.splice(itemIndex, 1);
    taskReader();
    stateRender();
    updateHis();
    updateState(e);
  } else if (e.target.classList.contains("edit")) {
    updateBox.value = todolist[itemIndex].text;
    textArea.style.display = "none";
    updater.style.display = "flex";

    editTodo(itemIndex);
  } else if (e.target.classList.contains("checkbox")) {
    updateState(e);
  }
  todoNum = itemIndex;
});
updater.addEventListener("submit", (e) => {
  e.preventDefault();
});
updateTask.addEventListener("click", () => {
  text = updateBox.value;
  todolist[todoNum].text = `${text}`;
  renderTodo();
  taskReader();
});
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

showHistory.addEventListener("click", (e) => {
  historyList.classList.toggle("show");
});
nav.addEventListener('click', e => {
  if(e.target.classList.contains('restore')){
    restoreData(e);
  } else if(e.target.classList.contains('search-btn')){
    todoSearch();
  }
})

taskReader = () => {
  let task = todolist.length;
  taskTotal.innerHTML = `${task}`;
};
taskReader();

renderTodo();
