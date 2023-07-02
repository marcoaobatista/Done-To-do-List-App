import {taskCardElement} from './components.js';

export class List{
    constructor(idb, storeName){
        this.idb = idb;
        this.storeName = storeName;

        this.title = document.querySelector('.list__header__title');
        this.incompletedUl = document.querySelector('#incompleted-ul');
        this.completedUl = document.querySelector('#completed-ul');
        this.tasksHeadingCounter = document.querySelector('#tasks-heading-counter');
        this.completedHeadingCounter = document.querySelector('#completed-heading-counter');
    }

    async render(){
        let listName = window.location.hash.substring(1);
        // Get the todo list from the database and make sure that 
        let list = await this.idb.getList(listName).catch(()=>{
            console.log('List Name Not in Database');
        });
        if (!list){
            listName = await this.idb.getFirstListName().catch(()=>{
                // display no list in db page
            });
                
            list = await this.idb.getList(listName);
            window.location.href = `#${listName}`;
        }

        this.title.textContent = list.name;

        let completedCount = 0;
        let incompletedCount = 0;

        this.incompletedUl.innerHTML = '';
        this.completedUl.innerHTML = '';

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
    }

    async toggleTaskStatus(taskId){
        let listName = window.location.hash.substring(1);

        await this.idb.toggleTaskStatus(listName, taskId);

        // if checked, move to completed. Otherwise, move to tasks
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

        // update taskCounters
        // this.tasksHeading.textContent = `Tasks - ${}`;
        // this.completedHeading.textContent = `Completed - ${}`;
        
    }

    async addTask(taskName, dueDate){
        await this.idb.addTask(taskName, dueDate).then((taskId)=>{
            let taskCard = taskCardElement(this, taskName, taskId, new Date(dueDate));
            this.incompletedUl.prepend(taskCard);
        });
    }

    async deleteTask(taskId){
        await this.idb.deleteTask(taskId).then(()=>{
            let taskCard = document.getElementById(`task${taskId}-card`);
            taskCard.remove();
            this.updateCounters();
        });
    }

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