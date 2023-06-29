export class List{
    constructor(idb){
        this.idb = idb;

        this.title = document.querySelector('.list__header__title');
        this.incompletedUl = document.querySelector('#incompleted-ul');
        this.completedUl = document.querySelector('#completed-ul');
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
        this.incompletedUl.innerHTML = '';
        this.completedUl.innerHTML = '';

        list.tasks.forEach(task => {
            let taskCard = document.createElement("li");
            taskCard.className = "task-card";
            taskCard.id = `task${task.id}-card`;

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `task${task.id}-checkbox`;
            checkbox.className = "task-card__checkbox";

            let contentDiv = document.createElement("div");
            contentDiv.className = "task-card__content";

            let titleSpan = document.createElement("span");
            titleSpan.className = "task-card__title";
            titleSpan.textContent = task.name;

            contentDiv.appendChild(titleSpan);

            if (task.due != "Invalid Date") {
                let date = task.due.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

                let dueSpan = document.createElement("span");
                dueSpan.className = "task-card__date";
                dueSpan.textContent = date;
                contentDiv.appendChild(dueSpan);
            }

            taskCard.appendChild(checkbox);
            taskCard.appendChild(contentDiv);

            checkbox.addEventListener('change', (event) => {
                let taskId = event.target.id.replace('task', '').replace('-checkbox', '');
                this.toggleTaskStatus(taskId);
            });

            if (!task.completed){
                this.incompletedUl.appendChild(taskCard);
            } else {
                checkbox.checked = true
                this.completedUl.appendChild(taskCard);
            }
        });
    }

    async toggleTaskStatus(taskId){
        let listName = window.location.hash.substring(1);

        await this.idb.toggleTaskStatus(listName, taskId).then(()=>{
            // if checked, move to completed. Otherwise, move to tasks
            let incompletedUl = document.getElementById('incompleted-ul');
            let completedUl = document.getElementById('completed-ul');
            let taskCard = document.getElementById(`task${taskId}-card`);

            taskCard.classList.add('fade-out');

            setTimeout(() => {
                if (incompletedUl.contains(taskCard)){
                    completedUl.appendChild(taskCard);
                }else{
                    incompletedUl.prepend(taskCard)
                }
                taskCard.classList.remove('fade-out');
            }, 600);

            setTimeout(() => {
                taskCard.classList.add('fade-in');
                
            }, 600);
            taskCard.classList.remove('fade-in');
        });
        
        
    }

    addTask(){
        
    }

    deleteTask(){

    }
}