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
        element.querySelector('.grouperExpandbtn').addEventListener('click', function(e) {
            toggleExpandGrouperTasks(element.querySelector('.allTasksContainer'));
        });
        mainContentDiv.appendChild(element);
        return element;
    }
    function createTaskElement(grouper, taskTitle, taskDescription) {
        let taskContainer = grouper.querySelector('.allTasksContainer');
        let taskDiv = domEdit.createTaskDiv(taskTitle, taskDescription);
        taskDiv.querySelector('.taskExpandbtn').addEventListener('click', function(e) {
            toggleExpandTaskContent(taskDiv.querySelector('.taskContent'));
            toggleExpandTaskContent(taskDiv.querySelector('.modifyTaskContainer'))
        });
        taskContainer.appendChild(taskDiv);
        expandGrouperTasks(taskContainer);
        expandTaskContents(taskDiv.querySelector('.taskContent'));
        expandTaskContents(taskDiv.querySelector('.modifyTaskContainer'));
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
        userArray[grouperIndex].addNewTask(newTask);
        closeTaskForm(e);
    }
    function openNewGrouperForm() {
        newGrouperField.style.opacity = '1';
        enableButtons([cancelNewGrouperButton, saveNewGrouperButton]);
        domEdit.setBlockOrNoneDisplay([newGrouperForm],[]);
        expandForm(newGrouperForm);
    }
    function closeGrouperForm() {
        newGrouperField.style.opacity = '0';
        disableButtons([cancelNewGrouperButton, saveNewGrouperButton]); //probably don't need this anymore
        shrink(newGrouperForm);
        domEdit.clearDomInputValues([newGrouperField]);
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([newGrouperButton.parentElement],[newGrouperForm])
        },500)
    }
    function cancelNewGrouper() {closeGrouperForm()}
    function openNewTaskForm(e) {
        domEdit.setBlockOrNoneDisplay([e.target.nextElementSibling],[]);
        let inputEle = Array.from(e.target.nextElementSibling.querySelectorAll('[class*=Input]'));
        inputEle.forEach(input=>{input.style.opacity = '1'});
        expandForm(e.target.nextElementSibling)
    }
    function closeTaskForm(e) {
        let popup = e.target.parentElement.parentElement.parentElement;
        shrink(popup);
        let inputEle = Array.from(popup.querySelectorAll('[class*=Input]'));
        inputEle.forEach(input=>{input.style.opacity = '0'});
        domEdit.clearDomInputValues(inputEle);
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([],[popup])
        },500)
    }
    function expandForm(element) {
        element.style.maxHeight = 300 + element.scrollHeight + 'px';
    }
    function expandGrouperTasks(element) {
        const heightMax = domEdit.calculateTotalHeightWithMargin(Array.from(element.querySelectorAll(".task>*")),40);
        element.style.maxHeight = heightMax + 100 + 'px';
    }
    function expandTaskContents(element) {
        element.style.maxHeight = element.scrollHeight +'px';
    }
    function shrink(element) {
        element.style.maxHeight = null;
    }
    function toggleExpandGrouperTasks(element) {
        if (element.style.maxHeight) {shrink(element)}
        else {expandGrouperTasks(element)}
    }
    function toggleExpandTaskContent(element) {
        if (element.style.maxHeight) {shrink(element)}
        else {expandTaskContents(element)}
    }
    function enableButtons(buttonArray) {
        for (let i=0;i<buttonArray.length;i++) {buttonArray[i].disabled = false}
    }
    function disableButtons(buttonArray) {
        for (let i=0;i<buttonArray.length;i++) {buttonArray[i].disabled = true}
    }
    saveNewGrouperButton.addEventListener('click',saveNewGrouper);
    newGrouperButton.addEventListener('click',openNewGrouperForm);
    cancelNewGrouperButton.addEventListener('click',cancelNewGrouper);

})();