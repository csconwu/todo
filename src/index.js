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
    const newGrouperPopup = document.getElementById('newGrouperPopup');
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
        taskFormButtons[1].addEventListener('click',saveTask);
        let element = domEdit.createGrouperDiv(title,newTaskFormClone,openNewTaskForm);
        element.querySelector('.grouperExpandbtn').addEventListener('click', function(e) {
            toggleExpandGrouperTasks(element.querySelector('.allTasksContainer'));
        });
        mainContentDiv.appendChild(element);
        return element;
    }
    function createTaskElement(taskTitle, taskDescription) {
        let taskDiv = domEdit.createTaskDiv(taskTitle, taskDescription);
        taskDiv.querySelector('.taskExpandbtn').addEventListener('click', function(e) {
            toggleExpandTaskContent(taskDiv.querySelector('.taskContent'));
            toggleExpandTaskContent(taskDiv.querySelector('.modifyTaskContainer'))
        });
        taskDiv.querySelector('.editTask').addEventListener('click',openExistingTaskForm);
        taskDiv.querySelector('.deleteTask').addEventListener('click',deleteExistingTask);
        return taskDiv;
    }
    function renderNewTaskElement(grouperTasksContainer, newTaskDiv) {
        grouperTasksContainer.appendChild(newTaskDiv);
        expandGrouperTasks(grouperTasksContainer);
        expandTaskContents(newTaskDiv.querySelector('.taskContent'));
        expandTaskContents(newTaskDiv.querySelector('.modifyTaskContainer'));
    }
    function renderExistingTaskElement(oldTaskTitle, newTaskDiv) {
        const oldTaskDiv = document.querySelector(`.task[title='${oldTaskTitle}'`);
        oldTaskDiv.parentElement.replaceChild(newTaskDiv,oldTaskDiv);
        expandTaskContents(newTaskDiv.querySelector('.taskContent'));
        expandTaskContents(newTaskDiv.querySelector('.modifyTaskContainer'));
    }
    function getGrouperIndex(grouperElement) {
        return userArray.findIndex(grouper=>grouper.title === grouperElement.title)
    }
    function getTaskIndex(grouperObject, taskTitle) {
        return grouperObject.tasks.findIndex(
            task=>task.title === taskTitle);
    }
    function saveNewGrouper() {
        createGrouperElement(newGrouperField.value);
        userArray.push(taskEdit.createNewGrouper(newGrouperField.value));
        closeGrouperForm();
    }
    function getGrouperAndFormElements(e) {
        const grouperElement = e.target.parentElement.parentElement.parentElement.parentElement;
        const grouperTaskForm = e.target.parentElement.parentElement;
        return {grouperElement, form: grouperTaskForm}
    }
    function getItemsForModifyTask(e) {
        const taskDiv = e.target.parentElement.parentElement;
        const grouperDiv = taskDiv.parentElement.parentElement;
        const grouperTaskForm = grouperDiv.querySelector('.newTaskPopup');
        const grouperIndex = getGrouperIndex(grouperDiv);
        const grouperObj = userArray[grouperIndex];
        const taskIndex = getTaskIndex(grouperObj,taskDiv.title);
        const taskObj = grouperObj.tasks[taskIndex];
        return {taskDiv,grouperDiv,grouperTaskForm,grouperIndex,grouperObj,taskIndex,taskObj}
    }
    function taskCreationPlaceHolder(grouperElement, groupersTaskForm) { //grouperElement used for the form
        const values = [];
        values.push(groupersTaskForm.children[0].value);
        if (groupersTaskForm.children[1]) {
            values.push(groupersTaskForm.children[1].value.replace(/\n\r?/g, '<br />'));
        }
        values.push(groupersTaskForm.children[2].value);
        const newTask = taskEdit.createTaskObject(values[0],values[1],null,values[2],null);
        const newTaskDiv = createTaskElement(newTask.title, newTask.description);
        return {newTask, newTaskDiv};
    }
    function deleteExistingTask(e) {
        if (window.confirm('Are you sure you want to delete this task?') !== true) {return}
        const modifyItems = getItemsForModifyTask(e);
        modifyItems.grouperObj.tasks.splice(modifyItems.taskIndex,1);
        modifyItems.taskDiv.remove();
    }
    function saveExistingTask(newGrouperItems, newTaskItems) {
        const grouperIndex = getGrouperIndex(newGrouperItems.grouperElement);
        userArray[grouperIndex].replaceExistingTask(userArray[grouperIndex].currentTaskEditingIndex,
            newTaskItems.newTask);
        renderExistingTaskElement(userArray[grouperIndex].currentTaskEditingTitle,newTaskItems.newTaskDiv);
    }
    function saveNewTask(newGrouperItems, newTaskItems) {
        const grouperIndex = getGrouperIndex(newGrouperItems.grouperElement);
        userArray[grouperIndex].addNewTask(newTaskItems.newTask);
        renderNewTaskElement(newGrouperItems.grouperElement.querySelector('.allTasksContainer'),newTaskItems.newTaskDiv);
    }
    function saveTask(e) {
        const newGrouperItems = getGrouperAndFormElements(e);
        const newTaskItems = taskCreationPlaceHolder(newGrouperItems.grouperElement,newGrouperItems.form);
        if (newGrouperItems.form.parentElement.classList.contains('editingExistingTask')) {
            saveExistingTask(newGrouperItems,newTaskItems);
        } else {
            saveNewTask(newGrouperItems,newTaskItems);
        }
        closeTaskForm(e);
    }
    function openNewGrouperForm() {
        domEdit.setBlockOrNoneDisplay([newGrouperPopup],[]);
        const animateForm = setTimeout(function() {
            testUnshrinkForm(newGrouperPopup);
        },100);
    }
    function closeGrouperForm() {
        testShrinkForm(newGrouperPopup);
        domEdit.clearDomInputValues([newGrouperField]);
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([newGrouperButton.parentElement],[newGrouperPopup])
        },500)
    }
    function cancelNewGrouper() {closeGrouperForm()}
    function bringUpTaskForm(taskForm) {
        domEdit.setBlockOrNoneDisplay([taskForm],[]);
        const inputElements = Array.from(taskForm.querySelectorAll('[class*=Input]'));
        inputElements.forEach(input=>{input.style.opacity = '1'});
        /*expandForm(taskForm);*/
        const animateForm = setTimeout(function() {
            testUnshrinkForm(taskForm)
        },100);
    }
    function openNewTaskForm(e) {
        bringUpTaskForm(e.target.nextElementSibling);
    }
    function openExistingTaskForm(e) {
        const modifyItems = getItemsForModifyTask(e);
        modifyItems.grouperTaskForm.classList.add('editingExistingTask');
        modifyItems.grouperObj.addExistingItemsToEdit(modifyItems.taskIndex,modifyItems.taskDiv.title);
        modifyItems.grouperTaskForm.querySelector('.taskTitleInput').value = modifyItems.taskObj.title;
        modifyItems.grouperTaskForm.querySelector('.taskDescriptionInput').value =
            modifyItems.taskObj.description.replace(/<br \/>/g,'\n');
        modifyItems.grouperTaskForm.querySelector('.dueDateInput').value = modifyItems.taskObj.dueDate;
        bringUpTaskForm(modifyItems.grouperTaskForm);
    }
    function closeTaskForm(e) {
        let popup = e.target.parentElement.parentElement.parentElement;
        popup.classList.remove('editingExistingTask');
        testShrinkForm(popup);
        let inputEle = Array.from(popup.querySelectorAll('[class*=Input]'));
        domEdit.clearDomInputValues(inputEle);
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([],[popup])
        },500)
    }
    function expandForm(element) {
        element.style.maxHeight = 300 + element.scrollHeight + 'px';
    }
    function expandGrouperTasks(element) {
        const heightMax = domEdit.calculateTotalHeightWithMargin(
            Array.from(element.querySelectorAll(".task>*")),40);
        element.style.maxHeight = heightMax + 100 + 'px';
    }
    function expandTaskContents(element) {
        element.style.maxHeight = element.scrollHeight +'px';
    }
    function shrink(element) {
        element.style.maxHeight = null;
    }
    function testShrinkForm(element) {
        element.style.transform = 'scale(0)';
    }
    function testUnshrinkForm(element) {
        element.style.transform = 'scale(1)';
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