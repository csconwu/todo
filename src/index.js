import * as domEdit from "./domEdit";
import * as taskEdit from "./taskEdit";
import {setBlockOrNoneDisplay} from "./domEdit";

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
        let element = domEdit.createGrouperDiv(title,newTaskFormClone,openNewTaskForm);
        mainContentDiv.appendChild(element);
        return element;
    }
    function createTaskElement(grouper, taskTitle, taskDescription) {
        let taskDiv = domEdit.createTaskDiv(taskTitle, taskDescription);
        taskDiv.querySelector('.taskExpandbtn').addEventListener('click', function(e) {
            toggleExpandContent(taskDiv.querySelector('.taskContent'));
        });
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
        createTaskElement(grouperDiv,form.children[0].value,form.children[1].value);
        const grouperIndex = userArray.findIndex(grouper=>grouper.title === grouperDiv.title);
        let newTask = taskEdit.createTaskObject(form.children[0].value,form.children[1].value,'',
            form.children[2].value,'');
        userArray[grouperIndex].tasks.push(newTask);
        closeTaskForm(e);
        console.log(userArray);
    }
    function openNewGrouperForm() {
        newGrouperField.style.opacity = '1';
        enableButtons([cancelNewGrouperButton, saveNewGrouperButton]);
        domEdit.setBlockOrNoneDisplay([newGrouperForm],[newGrouperButton.parentElement]);
        appearNewForm(newGrouperForm);
    }
    function openNewTaskForm(e) {
        domEdit.setBlockOrNoneDisplay([e.target.nextElementSibling],[e.target]);
        let inputEle = Array.from(e.target.nextElementSibling.querySelectorAll('[class*=Input]'));
        inputEle.forEach(input=>{input.style.opacity = '1'});
        appearNewForm(e.target.nextElementSibling)
    }
    function appearNewForm(element) {
        element.style.maxHeight = element.scrollHeight + 'px';
    }
    function appearTaskContent(element) {
        element.style.maxHeight = element.scrollHeight + 'px';
    }
    function disappearNewForm(element) {
        element.style.maxHeight = '50px';
    }
    function disappearTaskContent(element) {
        element.style.maxHeight = null;
    }
    function toggleExpandContent(element) {
        if (element.style.maxHeight) {disappearTaskContent(element)}
        else {appearTaskContent(element)}
    }
    function closeGrouperForm() {
        newGrouperField.style.opacity = '0';
        disableButtons([cancelNewGrouperButton, saveNewGrouperButton]); //probably don't need this anymore
        disappearNewForm(newGrouperForm);
        domEdit.clearDomInputValues([newGrouperField]);
        const removeForm = setTimeout(function() {
           domEdit.setBlockOrNoneDisplay([newGrouperButton.parentElement],[newGrouperForm])
        },500)
    }
    function closeTaskForm(e) {
        let popup = e.target.parentElement.parentElement.parentElement;
        disappearNewForm(popup);
        let inputEle = Array.from(popup.querySelectorAll('[class*=Input]'));
        inputEle.forEach(input=>{input.style.opacity = '0'});
        domEdit.clearDomInputValues(inputEle);
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([popup.previousElementSibling],[popup])
        },500)
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
    newGrouperButton.addEventListener('click',openNewGrouperForm);
    cancelNewGrouperButton.addEventListener('click',cancelNewGrouper);

})();