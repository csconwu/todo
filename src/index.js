import * as domEdit from "./domEdit";
import * as taskEdit from "./taskEdit";
import {setBlockOrNoneDisplay} from "./domEdit";
import {createNewGrouper} from "./taskEdit";

(function toDoPage() {
    let userArray = [];
    const mainContentDiv = document.getElementById('mainContent');
    const newGrouperButton = document.getElementById('newGrouperbtn');
    const saveNewGrouperButton = document.querySelector('.newGrouperForm .savebtn');
    const cancelNewGrouperButton = document.querySelector('.newGrouperForm .cancelbtn');
    const newGrouperField = document.getElementById('newGrouperTitleField');
    const newGrouperPopup = document.getElementById('newGrouperPopup');
    const newTaskForm = document.querySelector('.newTaskPopup');

    if (localStorage.getItem('hasToDoList') === 'true') {
        updateUserArrayFromLocalStorage();
    } else {
        const newGrouper = taskEdit.createDefaultGrouper();
        userArray.push(newGrouper);
        localStorage.setItem('hasToDoList','true');
        updateLocalStorage();
    }
    const m = userArray.length;
    for (let i=0; i<m; i++) {
        const grouperObj = userArray[i];
        let grouperDiv = createGrouperElement(grouperObj.title);
        const n = userArray[i].numOfTasks;
        for (let a = 0; a < n; a++) {
            const taskObj = grouperObj.tasks[a];
            const taskDiv = createTaskElement(taskObj.title, taskObj.description);
            renderNewTaskElement(grouperDiv.querySelector('.allTasksContainer'),taskDiv);
            if (taskObj.status) {taskDiv.querySelector('.changeTaskStatus').click()}
        }
    }
    function createGrouperElement(title) {
        const newTaskFormClone = newTaskForm.cloneNode(true);
        let taskFormButtons = newTaskFormClone.querySelectorAll('button');
        taskFormButtons[0].addEventListener('click',cancelTaskForm);
        taskFormButtons[1].addEventListener('click',saveTask);
        let element = domEdit.createGrouperDiv(title,newTaskFormClone,openNewTaskForm,openExistingGrouperForm,
            deleteExistingGrouper);
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
        taskDiv.querySelector('.changeTaskStatus').addEventListener('click',toggleTaskStatus);
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
    function getGrouperAndFormElements(e) {
        const grouperElement = e.target.parentElement.parentElement.parentElement.parentElement;
        const grouperTaskForm = e.target.parentElement.parentElement;
        return {grouperElement, form: grouperTaskForm}
    }
    function getItemsForModifyGrouper(e) {
        const grouperDiv  = e.target.parentElement.parentElement;
        const grouperTitleElement = grouperDiv.querySelector('.grouperTitle');
        const grouperTaskForm = grouperDiv.querySelector('newTaskPopup');
        const grouperIndex = getGrouperIndex(grouperDiv);
        return {grouperDiv,grouperTitleElement,grouperTaskForm, grouperIndex}
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
        const newTask = taskEdit.createTaskObject(values[0],values[1],null,values[2],false);
        const newTaskDiv = createTaskElement(newTask.title, newTask.description);
        return {newTask, newTaskDiv};
    }
    function deleteExistingGrouper(e) {
        if (window.confirm("This will delete this Project grouper and all it's tasks within it." +
            "\nAre you sure you want to proceed?") !== true) {return}
        const modifyItems = getItemsForModifyGrouper(e);
        userArray.splice(modifyItems.grouperIndex,1);
        modifyItems.grouperDiv.remove();
        console.log(userArray);
        updateLocalStorage();
    }
    function deleteExistingTask(e) {
        if (window.confirm('Are you sure you want to delete this task?') !== true) {return}
        const modifyItems = getItemsForModifyTask(e);
        modifyItems.grouperObj.deleteTask(modifyItems.taskIndex);
        modifyItems.taskDiv.remove();
        updateLocalStorage();
    }
    function toggleTaskStatus(e) {
        const modifyItems = getItemsForModifyTask(e);
        if (modifyItems.taskDiv.classList.contains('taskIsDone')) {
            modifyItems.taskDiv.classList.remove('taskIsDone');
            e.target.textContent = "Done?";
            modifyItems.taskObj.status = false;
        } else {
            modifyItems.taskDiv.classList.add('taskIsDone');
            e.target.textContent = "Not Done?"
            modifyItems.taskObj.status = true;
        }
        updateLocalStorage();
    }
    function saveGrouperChecks(newTitle) {
        const alreadyExists = userArray.some(grouper => {
            return grouper.title === newTitle && userArray.currentGrouperEditingTitle !== newTitle
        });
        if (alreadyExists) {
            return "You already have another project grouper with this title.\n" + "Please choose another name"
        } else if (newTitle.length > 25) {
            return "Please reduce the length of the title to 25 characters or less. "+`(currently ${newTitle.length})`
        } else {
            return null
        }
    }
    function saveTaskChecks(grouperIndex, newTaskTitle, newTaskDescription) {
        const alreadyExists = userArray[grouperIndex].tasks.some(task=> {
            return task.title === newTaskTitle && userArray[grouperIndex].currentTaskEditingTitle !== newTaskTitle
        });
        if (alreadyExists) {
            return "You already have another task in this Project with this title.\n"+"Please choose another name"
        } else if (newTaskTitle.length > 50) {
            return "Please reduce the length of the title to 50 characters or less. "+`(currently ${newTaskTitle.length})`
        } else if (newTaskDescription.length > 1000) {
            return "Please reduce the length of the description to 1000 characters or less. "+
                `(currently ${newTaskDescription.length})`
        } else {
            return null
        }
    }
    function saveNewGrouper() {
        createGrouperElement(newGrouperField.value);
        userArray.push(taskEdit.createNewGrouper(newGrouperField.value));
        closeGrouperForm();
    }
    function saveExistingGrouper() {
        const grouperObj = userArray[userArray.currentGrouperEditingIndex];
        grouperObj.title = userArray.currentGrouperEditingDiv.title =
            userArray.currentGrouperTitleElement.textContent = newGrouperField.value;
        closeGrouperForm();
    }
    function saveGrouper() {
        const checkMessage = saveGrouperChecks(newGrouperField.value);
        if (checkMessage) {
            window.alert(checkMessage);
            return;
        }
        if (newGrouperPopup.classList.contains('editingExistingGrouper')) {
            saveExistingGrouper();
        } else {
            saveNewGrouper();
        }
        updateLocalStorage();
    }
    function saveExistingTask(newGrouperItems, newTaskItems,grouperIndex) {
        userArray[grouperIndex].replaceExistingTask(userArray[grouperIndex].currentTaskEditingIndex,
            newTaskItems.newTask);
        renderExistingTaskElement(userArray[grouperIndex].currentTaskEditingTitle,newTaskItems.newTaskDiv);
    }
    function saveNewTask(newGrouperItems, newTaskItems, grouperIndex) {
        userArray[grouperIndex].addNewTask(newTaskItems.newTask);
        renderNewTaskElement(newGrouperItems.grouperElement.querySelector('.allTasksContainer'),
            newTaskItems.newTaskDiv);
    }
    function saveTask(e) {
        const newGrouperItems = getGrouperAndFormElements(e);
        const newTaskItems = taskCreationPlaceHolder(newGrouperItems.grouperElement,newGrouperItems.form);
        const grouperIndex = getGrouperIndex(newGrouperItems.grouperElement);
        const checkMessage = saveTaskChecks(grouperIndex,newTaskItems.newTask.title, newTaskItems.newTask.description);
        if (checkMessage) {
            window.alert(checkMessage);
            return;
        }
        if (newGrouperItems.form.parentElement.classList.contains('editingExistingTask')) {
            saveExistingTask(newGrouperItems,newTaskItems,grouperIndex);
        } else {
            saveNewTask(newGrouperItems,newTaskItems,grouperIndex);
        }
        updateLocalStorage();
        closeTaskForm(e, userArray[grouperIndex]);
    }
    function cancelNewGrouper() {closeGrouperForm()}
    function bringUpForm(form) {
        domEdit.setBlockOrNoneDisplay([form],[]);
        const animateForm = setTimeout(function() {
            testUnshrinkForm(form)
        },100);
    }
    function bringUpTaskForm(taskForm) {
        bringUpForm(taskForm)
    }
    function openNewGrouperForm() {
        bringUpForm(newGrouperPopup);
    }
    function closeGrouperForm() {
        testShrinkForm(newGrouperPopup);
        newGrouperPopup.classList.remove('editingExistingGrouper');
        domEdit.clearDomInputValues([newGrouperField]);
        const removeForm = setTimeout(function() {
            domEdit.setBlockOrNoneDisplay([newGrouperButton.parentElement],[newGrouperPopup])
        },500)
        userArray.currentGrouperEditingDiv = userArray.currentGrouperTitleElement =
            userArray.currentGrouperEditingIndex = userArray.currentGrouperEditingTitle = null;
    }
    function openExistingGrouperForm(e) {
        openNewGrouperForm();
        newGrouperPopup.classList.add('editingExistingGrouper');
        const modifyItems = getItemsForModifyGrouper(e);
        const oldTitle = userArray[modifyItems.grouperIndex].title;
        userArray.currentGrouperEditingTitle = oldTitle;
        userArray.currentGrouperEditingIndex = modifyItems.grouperIndex;
        userArray.currentGrouperTitleElement = modifyItems.grouperTitleElement;
        userArray.currentGrouperEditingDiv = modifyItems.grouperDiv;
        newGrouperField.value = oldTitle;
    }
    function openNewTaskForm(e) {
        bringUpTaskForm(e.target.parentElement.nextElementSibling);
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
    function clearCurrentEditingTaskItems(grouperObj) {
        grouperObj.removeExistingItemsToEdit();
        updateLocalStorage();
    }
    function cancelTaskForm(e) {
        const newGrouperItems = getGrouperAndFormElements(e);
        const grouperIndex = getGrouperIndex(newGrouperItems.grouperElement);
        closeTaskForm(e, userArray[grouperIndex]);
    }
    function closeTaskForm(e, grouperObj) {
        let popup = e.target.parentElement.parentElement.parentElement;
        popup.classList.remove('editingExistingTask');
        clearCurrentEditingTaskItems(grouperObj);
        testShrinkForm(popup);
        domEdit.clearInputClassValues(popup);
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
        element.style.maxHeight = heightMax + 500 + 'px';
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
    function preventEnterOnFields(e) {
        if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
            e.preventDefault();
        }
    }
    function updateLocalStorage() {
        //delete all todo first
        let iLength = localStorage.length-1; //going backwards for loop
        for (iLength; iLength>=0; iLength--) {
            if (localStorage.key(iLength).includes('TODO')) {
                localStorage.removeItem(localStorage.key(iLength));
            }
        }
        const ul = userArray.length;
        for (let i=0; i<ul; i++) {
            const grouperObj = Object.assign({},userArray[i]);
            const tl = grouperObj.numOfTasks;
            let formattedTasks = [];
            for (let a = 0; a < tl; a++) {
                let taskObj = Object.assign({},grouperObj.tasks[a]);
                formattedTasks.push(JSON.stringify(taskObj));
            }
            grouperObj.formattedTasks = JSON.stringify(formattedTasks);
            localStorage.setItem(`TODO${i}`,JSON.stringify(grouperObj));
        }
    }
    function updateUserArrayFromLocalStorage() {
        let lsLength = localStorage.length -1;
        for (lsLength; lsLength >= 0; lsLength--) {
            if (localStorage.key(lsLength).includes('TODO')) {
                let grouperObj = JSON.parse(localStorage.getItem(localStorage.key(lsLength)));
                grouperObj.tasks = [];
                let convertedArray = JSON.parse(grouperObj.formattedTasks);
                const tl = grouperObj.numOfTasks;
                for (let a=0; a<tl;a++) {
                    let taskObj = convertedArray[a];
                    grouperObj.tasks.push(JSON.parse(taskObj));
                }
                const grouperObjWithFunctions = taskEdit.createNewGrouper(grouperObj.title);
                for (let key in grouperObj) {
                    grouperObjWithFunctions[key] = grouperObj[key];
                }
                userArray.push(grouperObjWithFunctions);
            }
        }
    }

    saveNewGrouperButton.addEventListener('click',saveGrouper);
    newGrouperButton.addEventListener('click',openNewGrouperForm);
    cancelNewGrouperButton.addEventListener('click',cancelNewGrouper);
    window.addEventListener('keypress', preventEnterOnFields);

})();