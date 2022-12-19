// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListener();

function eventListener() { // Tüm eventler
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz ?")) {
        // Arayüz todo temizleme
        // todoList.innerHTML = ""; // Yavaş yöntem
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }

}

function filterTodos(e) { // Todo Filtreleme
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {
            // Bulamadı

            listItem.setAttribute("style", "display: none !important");
        } else {
            listItem.setAttribute("style", "display: block !important");
        }
    })
}

function deleteTodo(e) { // Todoları UI ' dan silme
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);

        showAlert("success", "Todo Başarıyla Silindi..");
    }
}


function deleteTodoFromStorage(deletetodo) { // Local storage silme
    let todos = getTodosFromStorage();
    todos.forEach(function (todo, index) {
        if (todo === deletetodo) {
            todos.splice(index, 1); // Arrayden değer silme
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })
}


function addTodo(e) { // Todo ekleme
    const newTodo = todoInput.value.trim();

    if (newTodo == "") {
        showAlert("danger", "Lütfen bir todo girin...");
    } else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo başarıyla eklendi..");
    }
    addTodoToUI(newTodo);


    e.preventDefault();
}

function getTodosFromStorage() { // Storagedan Todoları alma
    let todos;
    if (localStorage.getItem("todos") == null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) { // Boş todo girince çıkan alert
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    // setTimeot, alert i 1 sn sonra silme

    setTimeout(function () {
        alert.remove();
    }, 1000)
}


function addTodoToUI(newTodo) { // String değeri list item olarak ekleyecek

    // List item olusturma
    const listItem = document.createElement("li");
    // Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between";
    // Text Node ekleme

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // TodoList'e listitem ekleme

    todoList.appendChild(listItem);
    todoInput.value = "";
}

