
function createDiv() {return document.createElement('div')}
function createElement(tag, className, attribute) {
    let element = document.createElement(tag);
    if (className instanceof Array) {
        for (let i=0; i<className.length; i++) {element.classList.add(className[i])}
    } else {
        element.classList.add(className);
    }
    if (attribute) {element.setAttribute(attribute[0], attribute[1])}
    return element
}
function createElementAndSetText(tag, classList, text, attribute) {
    let element = createElement(tag,classList, attribute);
    element.textContent = text;
    return element
}
function setInnerHtml(element, tag, textContent) {
    element.innerHTML = `<${tag}>${textContent}</${tag}>`;
}
function appendElements(parent, sourceListArray) {
    for (let i=0;i<sourceListArray.length;i++) {parent.appendChild(sourceListArray[i])}
    return parent
}
function clearDomInputValues(inputArray) {
    for (let i=0; i<inputArray.length;i++) {
        inputArray[i].value = null;
    }
}
function clearInputClassValues(ancestorElement) {
    let inputElements = Array.from(ancestorElement.querySelectorAll('[class*=Input'));
    clearDomInputValues(inputElements);
}
function setBlockOrNoneDisplay(blockArray, noneArray) {
    for (let i=0; i<blockArray.length; i++) {blockArray[i].style.display = 'block'}
    for (let i=0; i<noneArray.length; i++) {noneArray[i].style.display = 'none'}
}
function calculateTotalHeight(elementArray) {
    let totalHeight = 0;
    for (let i=0;i<elementArray.length;i++) {totalHeight += elementArray[i].scrollHeight;}
    return totalHeight;
}
function calculateTotalHeightWithMargin(elementArray, marginSize) {
    let totalHeight = calculateTotalHeight(elementArray);
    totalHeight += elementArray.length * marginSize;
    return totalHeight;
}
function createGrouperDiv(title, addElement, addTaskFunction, renameGrouperFunc,deleteGrouperFunc) { //with button at the top
    let grouperDiv = createElement('div', 'grouper',['title',title]);
    let titleContainer = createElement('div', 'grouperTitleContainer');
    let grouperTitle = createElementAndSetText('h2','grouperTitle',title);
    let expandButton = createElement('button', ['grouperExpandbtn']);
    let allTasksContainer = createElement('div',['allTasksContainer','testFormExpand']);
    let modifyGrouperContainer = createElement('div',['modifyGrouperContainer']);
    let addButton = createElementAndSetText('button',['newbtn','modifyGrouper'],'+ Add New Task',['type', 'button']);
    let renameButton = createElementAndSetText('button',['modifyGrouper', 'renameGrouper'],
        'Rename This Project Grouper',['type','button']);
    let deleteButton = createElementAndSetText('button',['modifyGrouper','deleteGrouper'],
        'Delete this Project Grouper',['type', 'button']);
    addButton.addEventListener('click', addTaskFunction);
    renameButton.addEventListener('click',renameGrouperFunc);
    deleteButton.addEventListener('click',deleteGrouperFunc);
    setInnerHtml(expandButton, 'h2', "&#8597");
    appendElements(titleContainer,[grouperTitle,expandButton]);
    appendElements(modifyGrouperContainer,[addButton,renameButton,deleteButton])
    appendElements(grouperDiv,[titleContainer, modifyGrouperContainer, addElement, allTasksContainer]);
    return grouperDiv
}
function createTaskDiv(title, description) {
    let taskDiv = createElement('div', 'task',['title',title]);
    let titleContainer = createElement('div', 'taskTitleContainer');
    let taskTitle = createElementAndSetText('h4', 'taskTitle', title);
    let expandButton = createElement('button', ['taskExpandbtn']);
    setInnerHtml(expandButton, 'h4', "&#8597");
    expandButton.firstElementChild.classList.add('noStrike');
    let taskContent = createElement('div',['taskContent']);
    setInnerHtml(taskContent,'p',description);
    taskContent.classList.add('testFormExpand');
    let modifyTaskButtonsContainer = createElement('div',['modifyTaskContainer','testFormExpand']);
    let editTaskButton = createElementAndSetText('button',['modifyTask', 'editTask'],
        'Edit',['type','button']);
    let deleteTaskButton = createElementAndSetText('button',['modifyTask', 'deleteTask'],
        'Delete',['type','button']);
    let statusTaskButton = createElementAndSetText('button',['modifyTask', 'changeTaskStatus'],
        'Done?',['type','button']);
    appendElements(modifyTaskButtonsContainer,[editTaskButton,deleteTaskButton,statusTaskButton]);
    appendElements(titleContainer,[taskTitle,expandButton]);
    appendElements(taskDiv,[titleContainer,taskContent,modifyTaskButtonsContainer]);
    return taskDiv
}
export {createDiv, createElement, createGrouperDiv, createTaskDiv, appendElements, clearDomInputValues,
    setBlockOrNoneDisplay, calculateTotalHeightWithMargin, clearInputClassValues}