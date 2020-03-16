
function createTaskObject(title,description,priority,dueDate,status) {
    return {title, description, priority, dueDate, status}
}
function createGrouper(title, numOfTasks, tasks, id, currentTaskEditingIndex, currentTaskEditingTitle) {
    return  {
        title: title,
        numOfTasks: numOfTasks,
        tasks: tasks,
        id: id,
        currentTaskEditingIndex: currentTaskEditingIndex,
        currentTaskEditingTitle: currentTaskEditingTitle,
        addNewTask: function(taskObject) {
            this.tasks.push(taskObject);
            this.numOfTasks++;
        },
        replaceExistingTask: function(oldTaskIndex,newTaskObject) {
            this.tasks.splice(oldTaskIndex, 1, newTaskObject);
        },
        addExistingItemsToEdit: function(taskIndex, taskTitle) {
            this.currentTaskEditingIndex = taskIndex;
            this.currentTaskEditingTitle = taskTitle;
        },
        removeExistingItemsToEdit: function () {
            this.currentTaskEditingTitle = null;
            this.currentTaskEditingIndex = null;
        }
    };
}
function createDefaultGrouper() {
    return createGrouper('Tasks',0,[],'defaultGrouper')
}
function createNewGrouper(title) {
    return createGrouper(title,0,[],null)
}

export {createTaskObject, createDefaultGrouper, createNewGrouper}