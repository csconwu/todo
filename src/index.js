import * as domEdit from "./domEdit";
import * as taskEdit from "./taskEdit";

(function toDoPage() {
    let userArray = [];
    const mainContentDiv = document.getElementById('mainContent');
    const newGrouperButton = document.getElementById('newGrouperbtn');
    const saveNewGrouperButton = document.querySelector('.newGrouperForm .savebtn');
    const cancelNewGrouperButton = document.querySelector('.newGrouperForm .cancelbtn');
    const newGrouperField = document.getElementById('newGrouperTitleField');
    const newGrouperForm = document.getElementById('newGrouperPopup');
    const newTaskForm = document.querySelector('.newTaskPopup');

    if (localStorage.length>0) {} else {userArray.push(taskEdit.createDefaultGrouper())}

    for (let i=0; i<userArray.length; i++) {
        let grouperDiv = createGrouperElement(userArray[i].title);
        for (let a = 0; a < userArray[i].numOfTasks; a++) {
            let taskDiv = domEdit.createTaskDiv(userArray[i].tasks[a].title);
            grouperDiv.appendChild(taskDiv);
        }
    }
    function createGrouperElement(title) {
        const newTaskFormClone = newTaskForm.cloneNode(true);
        let taskFormButtons = newTaskFormClone.querySelectorAll('button');
        taskFormButtons[0].addEventListener('click',closeTaskForm);
        taskFormButtons[1].addEventListener('click',saveNewTask);
        let element = domEdit.createGrouperDiv(title,newTaskFormClone,addNewTask);
        mainContentDiv.appendChild(element);
        return element;
    }
    function createTaskElement(grouper, taskTitle) {
        let taskDiv = domEdit.createTaskDiv(taskTitle);
        grouper.children[3].appendChild(taskDiv);
    }
    function saveNewGrouper() {
        createGrouperElement(newGrouperField.value);
        userArray.push(taskEdit.createNewGrouper(newGrouperField.value));
        closeGrouperForm();
    }
    function saveNewTask(e) {
        const grouperDiv = e.target.parentElement.parentElement.parentElement.parentElement;
        const form = e.target.parentElement.parentElement;
        createTaskElement(grouperDiv,form.children[0].value);
        const grouperIndex = userArray.findIndex(grouper=>grouper.title === grouperDiv.title);
        let newTask = taskEdit.createTaskObject(form.children[0].value,form.children[1].value,'',
            form.children[2].value,'');
        userArray[grouperIndex].tasks.push(newTask);
        closeTaskForm(e);
    }
    function addNewGrouper() {
        enableButtons([cancelNewGrouperButton, saveNewGrouperButton]);
        domEdit.setBlockOrNoneDisplay([newGrouperForm],[newGrouperButton.parentElement]);
        appearNewForm(newGrouperForm);
    }
    function addNewTask(e) {
        domEdit.setBlockOrNoneDisplay([e.target.nextElementSibling],[e.target]);
        appearNewForm(e.target.nextElementSibling)
    }
    function appearNewForm(element) {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.opacity = '1';
    }
    function disappearNewForm(element) {
        element.style.opacity = '0';
        element.style.maxHeight = '50px';
    }
    function closeGrouperForm() {
        disableButtons([cancelNewGrouperButton, saveNewGrouperButton]);
        disappearNewForm(newGrouperForm);
        domEdit.clearDomInputValues([newGrouperField]);
        const removeForm = setTimeout(function() {
           domEdit.setBlockOrNoneDisplay([newGrouperButton.parentElement],[newGrouperForm])
        },800)
    }
    function closeTaskForm(e) {
        let popup = e.target.parentElement.parentElement.parentElement
        disappearNewForm(popup);
        domEdit.clearDomInputValues(Array.from(popup.querySelectorAll('[class*=Input]')));
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([popup.previousElementSibling],[popup])
        },800)
    }
    function enableButtons(buttonArray) {
        for (let i=0;i<buttonArray.length;i++) {buttonArray[i].disabled = false}
    }
    function disableButtons(buttonArray) {
        for (let i=0;i<buttonArray.length;i++) {buttonArray[i].disabled = true}
    }
    function cancelNewGrouper() {
        closeGrouperForm()
    }
    saveNewGrouperButton.addEventListener('click',saveNewGrouper);
    newGrouperButton.addEventListener('click',addNewGrouper);
    cancelNewGrouperButton.addEventListener('click',cancelNewGrouper);
})();