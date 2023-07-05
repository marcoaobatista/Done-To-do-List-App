import {taskCardElement} from './components.js';

export class List{
    constructor(idb, storeName){
        this.idb = idb;
        this.storeName = storeName;

        // List elements
        this.title = document.querySelector('.list__header__title');
        this.incompletedUl = document.querySelector('#incompleted-ul');
        this.completedUl = document.querySelector('#completed-ul');
        this.tasksHeadingCounter = document.querySelector('#tasks-heading-counter');
        this.completedHeadingCounter = document.querySelector('#completed-heading-counter');
    }

    async render(){
        let listName = window.location.hash.substring(1);
        // Get the todo list from the database. If it does not exist, create one
        let list = await this.idb.getList(listName).catch(()=>{
            console.log('List Name Not in Database');
        });
        if (!list){
            listName = await this.idb.getFirstListName().catch(async ()=>{
                // Create default todo list
                this.idb.addList('Todos').then(()=>{
                    location.reload();
                });
            });
                
            list = await this.idb.getList(listName);
            window.location.href = `#${listName}`;
        }

        // Update the title of the list
        this.title.textContent = list.name;

        let completedCount = 0;
        let incompletedCount = 0;

        // Clear list elements
        this.incompletedUl.innerHTML = '';
        this.completedUl.innerHTML = '';

        // Populate the lists and counters
        if (list.tasks.length){
            list.tasks.reverse().forEach(task => {
    
                if (task.completed){
                    completedCount += 1;
                }else{
                    incompletedCount += 1;
                }
                this.tasksHeadingCounter.textContent = incompletedCount;
                this.completedHeadingCounter.textContent = completedCount;
    
                let taskCard = taskCardElement(this, task.name, task.id, task.due, task.completed);
    
                if (!task.completed){
                    this.incompletedUl.appendChild(taskCard);
                } else {
                    this.completedUl.appendChild(taskCard);
                }
            });
        }else{
            // If no tasks, set counters to 0
            this.tasksHeadingCounter.textContent = '0';
            this.completedHeadingCounter.textContent = '0';
        }
    }

    // Method to change task status
    async toggleTaskStatus(taskId){
        let listName = window.location.hash.substring(1);
        await this.idb.toggleTaskStatus(listName, taskId);

        // Move the task card to the corresponding list
        let incompletedUl = document.getElementById('incompleted-ul');
        let completedUl = document.getElementById('completed-ul');
        let taskCard = document.getElementById(`task${taskId}-card`);

        taskCard.classList.add('fade-out');

        setTimeout(() => {
            if (incompletedUl.contains(taskCard)){
                completedUl.appendChild(taskCard);
                this.updateCounters();
            }else{
                incompletedUl.prepend(taskCard)
                this.updateCounters();
            }
            taskCard.classList.remove('fade-out');
        }, 600);

        setTimeout(() => {
            taskCard.classList.add('fade-in');
        }, 600);
        
        taskCard.classList.remove('fade-in');
    }

    // Method to add a task
    async addTask(taskName, dueDate){
        await this.idb.addTask(taskName, dueDate).then((taskId)=>{
            let taskCard = taskCardElement(this, taskName, taskId, new Date(dueDate));
            this.incompletedUl.prepend(taskCard);
            this.updateCounters();
        });
    }

    // Method to delete a task
    async deleteTask(taskId){
        await this.idb.deleteTask(taskId).then(()=>{
            let taskCard = document.getElementById(`task${taskId}-card`);
            taskCard.remove();
            this.updateCounters();
        });
    }

    // Method to update task counters
    updateCounters(){
        let listName = window.location.hash.substring(1);

        let tasksCurrentCount = this.incompletedUl.childElementCount;
        let completedCurrentCount = this.completedUl.childElementCount;

        this.tasksHeadingCounter.textContent = tasksCurrentCount;
        this.completedHeadingCounter.textContent = completedCurrentCount;

        let linkTasksCount = document.getElementById(`${listName}-link-count`);
        linkTasksCount.textContent = `${tasksCurrentCount} Tasks`;
    }
}