
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
function createGrouperDiv(title, addElement, addTaskFunction) { //with button at the top
    let grouperDiv = createElement('div', 'grouper',['title',title]);
    let titleContainer = createElement('div', 'grouperTitleContainer');
    let grouperTitle = createElementAndSetText('h2','grouperTitle',title);
    let expandButton = createElement('button', 'grouperExpandbtn');
    let addButton = createElementAndSetText('button','newbtn','+',['type', 'button']);
    let taskContainer = createElement('div','taskContainer');
    addButton.addEventListener('click', addTaskFunction);
    setInnerHtml(expandButton, 'h2', "↓");
    appendElements(titleContainer,[grouperTitle,expandButton]);
    appendElements(grouperDiv,[titleContainer, addButton, addElement, taskContainer]);
    return grouperDiv
}
function createTaskDiv(title, description) {
    let taskDiv = createElement('div', 'task',['title',title]);
    let titleContainer = createElement('div', 'taskTitleContainer');
    let taskTitle = createElementAndSetText('h4', 'taskTitle', title);
    let expandButton = createElement('button', 'taskExpandbtn');
    setInnerHtml(expandButton, 'h4', "↓");
    let taskContent = createElement('div',['taskContent']);
    setInnerHtml(taskContent,'p',description);
    taskContent.classList.add('testFormExpand');
    appendElements(titleContainer,[taskTitle,expandButton]);
    appendElements(taskDiv,[titleContainer,taskContent]);
    return taskDiv
}
function clearDomInputValues(inputArray) {for (let i=0; i<inputArray.length;i++) {inputArray[i].value = null}}
function setBlockOrNoneDisplay(blockArray, noneArray) {
    for (let i=0; i<blockArray.length; i++) {blockArray[i].style.display = 'block'}
    for (let i=0; i<noneArray.length; i++) {noneArray[i].style.display = 'none'}
}

export {createDiv, createElement, createGrouperDiv, createTaskDiv, appendElements, clearDomInputValues,
    setBlockOrNoneDisplay}