const nameForm = document.querySelector(".js-name");
const nameInput = document.querySelector(".nameInput");
const greetings = document.querySelector(".js-greetings");
const pencil = document.querySelector(".js-pencil");

const USER_LS = "currentUser";
const SHOWING_CN = "showing";
const INLINE_SHOWING_CN = "inline_showing";

function deleteName() {
    localStorage.removeItem(USER_LS);
}

function editGreeting() {
    nameForm.classList.add(SHOWING_CN);
    greetings.classList.remove(INLINE_SHOWING_CN);
    pencil.classList.remove(INLINE_SHOWING_CN);
    deleteName();
    nameForm.addEventListener("submit", nameSubmit);
}

function saveName(text) {
    localStorage.setItem(USER_LS, text);
}

function paintGreeting(text) {
    nameForm.classList.remove(SHOWING_CN);
    greetings.classList.add(INLINE_SHOWING_CN);
    greetings.innerText=`Hello ${text}!`;
    pencil.classList.add(INLINE_SHOWING_CN);
    pencil.addEventListener("click", editGreeting);
}

function nameSubmit(event) {
    event.preventDefault();
    const currentValue = nameInput.value;
    paintGreeting(currentValue);
    saveName(currentValue);
}

function askForName() {
    nameForm.classList.add(SHOWING_CN);
    nameForm.addEventListener("submit", nameSubmit);
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser == null)
    {
        askForName();
    }
    else {
        paintGreeting(currentUser);
    }
}

function init() {
    loadName();
}

init();

