
function createTaskObject(title,description,priority,dueDate,status) {return {title, description, priority, dueDate, status}}
function createGrouper(title, numOfTasks, tasks, id) {return {title, numOfTasks, tasks, id}}
function createDefaultGrouper() {return createGrouper('Tasks',0,[],'defaultGrouper')}
function createNewGrouper(title) {return createGrouper(title,0,[],null)}

export {createTaskObject, createDefaultGrouper, createNewGrouper}