const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector(".js-toDoInput");
const toDoList = document.querySelector(".js-toDoList");
const toDoProgressBar = document.querySelector(".js-toDoProgressBar");
const completed = document.querySelector(".js-completed");
const empty = document.querySelector(".js-empty");
const nothing = document.querySelector(".js-nothing");


const TODOS_LS = "toDos";
let toDos = [];
let previousPercent = 0;

function deleteNothing() {
    nothing.classList.remove(SHOWING_CN);
}

function paintNothing() {
    nothing.classList.add(SHOWING_CN);
}

function saveToDos() {
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
    deleteNothing();
}

function paintProgressBar (toDoLength, checkedNum) {
    let percent = 0;
    if(toDos.length != 0) {
        percent = Math.round(checkedNum / toDos.length * 100);
    }

    let width = previousPercent;

    if(percent >= previousPercent)
    {
        const id = setInterval(function() {
            if(width >= percent){
                clearInterval(id);
            }
            else {
                width++;
                toDoProgressBar.style.width = `${width}`;
                completed.innerText = `${width}% completed`;
            }
        }, 5);
    }
    else
    {
        const id = setInterval(function() {
            if(width <= percent){
                clearInterval(id);
            }
            else {
                width--;
                toDoProgressBar.style.width = `${width}`;
                completed.innerText = `${width}% completed`;
            }
        }, 5);
    }
    previousPercent = percent;
}

function checkBoxChange(event) {
    const checkBox = event.target;
    const label = checkBox.parentNode;
    const li = label.parentNode;
    let checkedNum = 0;
    const isChecked = checkBox.checked;
    for(var i=0; i < toDos.length; i++)
    {
        if(toDos[i].id === parseInt(li.id))
        {
            toDos[i].isChecked = isChecked;
        }
        if(toDos[i].isChecked === true)
        {
            checkedNum = checkedNum + 1; 
        }
    }
    saveToDos();
    paintProgressBar(toDos.length, checkedNum);
}

function deleteToDo(event) {
    const btn = event.target;
    const btnSpan = btn.parentNode;
    const li = btnSpan.parentNode;
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function(toDo) {
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
    if(toDos.length === 0) {
        paintNothing();
    }
    let checkedNum = 0;
        for(var i = 0; i < toDos.length; i++) {
            if(toDos[i].checked === true) {
                checkedNum = checkedNum + 1;
            }
        }
        paintProgressBar(toDos.length, checkedNum);
}

function paintToDo(text, isChecked) {
    const newId = toDos.length + 1;
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "todoCheck");
    checkBox.checked = isChecked;
    const span = document.createElement("span");
    span.setAttribute("class", "content");
    const btnSpan = document.createElement("span");
    btnSpan.setAttribute("class", "controlBtns");
    //const editBtn = document.createElement("img");
    //editBtn.setAttribute("class", "editBtn");
    //editBtn.src = "image/edit.png";
    const delBtn = document.createElement("img");
    delBtn.setAttribute("class", "delBtn");
    delBtn.src = "image/delete.png";
    checkBox.addEventListener("change", checkBoxChange);
    //editBtn.innerText = "edit";
    delBtn.innerText = "delete";
    delBtn.addEventListener("click", deleteToDo);
    // start addEventListener
    span.innerText = `${text}`;
    li.appendChild(label);
    label.appendChild(checkBox);
    label.appendChild(span);
    li.appendChild(btnSpan);
    //btnSpan.appendChild(editBtn);
    btnSpan.appendChild(delBtn);
    toDoList.appendChild(li);
    li.id = newId;
    const toDoObj = {
        text : text,
        id : newId,
        isChecked : isChecked
    }
    toDos.push(toDoObj);
    saveToDos();
}

function toDoSubmit(event) {
    event.preventDefault();
    const currentValue = toDoInput.value;
    if(currentValue === "")
    {
        empty.classList.add(SHOWING_CN);
    }
    else
    {
        empty.classList.remove(SHOWING_CN);
        paintToDo(currentValue, false);
        let checkedNum = 0;
        for(var i = 0; i < toDos.length; i++) {
            if(toDos[i].checked === true) {
                checkedNum = checkedNum + 1;
            }
        }
        paintProgressBar(toDos.length, checkedNum);
        toDoInput.value = "";
    }

}

function loadToDos() {
    const loadedToDos = localStorage.getItem(TODOS_LS);
    let checkedNum = 0;
    if (loadedToDos !== null)
    {
        const parsedToDos = JSON.parse(loadedToDos);
        if (parsedToDos.length == 0)
            paintNothing();
        else {
            parsedToDos.forEach(function(toDo) {
                paintToDo(toDo.text, toDo.isChecked);
                if(toDo.isChecked === true)
                {
                    checkedNum = checkedNum + 1;
                }
            });
        }
        paintProgressBar(toDos.length, checkedNum);
    }
    else  paintNothing();
}

function init() {
    loadToDos();
    toDoForm.addEventListener("submit", toDoSubmit);
}

init();