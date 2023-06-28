export class List{
    constructor(){
        this.title = document.querySelector('.list__header__title');
        this.incompletedUl = document.querySelector('#incompleted-ul');
        this.completedUl = document.querySelector('#completed-ul');
    }

    async render(idb, listName){
        // Get the todo list from the database and make sure that 
        let list = await idb.getList(listName).catch(()=>{
            console.log('List Name Not in Database');
        });
        if (!list){
            listName = await idb.getFirstListName().catch(()=>{
                // display no list in db page
            });
                
            list = await idb.getList(listName);
            window.location.href = `#${listName}`;
        }

        this.title.textContent = list.name;
        this.incompletedUl.innerHTML = '';
        this.completedUl.innerHTML = '';

        list.tasks.forEach(task => {
            let taskCard = document.createElement("li");
            taskCard.className = "task-card";

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `task${task.id}`;
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

            checkbox.addEventListener('change', () => {
                console.log('change');
            });

            if (!task.completed){
                this.incompletedUl.appendChild(taskCard);
            } else {
                this.completedUl.appendChild(taskCard);
            }
        });
    }

    completeTask(listName, taskId){

    }

    addTask(){
        
    }

    deleteTask(){

    }
}