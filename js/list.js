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
            let dueSpan = '';
            if (task.due != "Invalid Date"){
                let date = task.due.toLocaleDateString('en-US', 
                    { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
                dueSpan = `<span class="task-card__date">${date}</span>`
            }
            let taskCard = `
            <li class="task-card">
                <input type="checkbox" id="task1" class="task-card__checkbox"/>
                <div class="task-card__content">
                    <span class="task-card__title">${task.name}</span>
                    ${dueSpan}
                </div>
            </li>
            `

            if (!task.completed){
                this.incompletedUl.innerHTML += taskCard;
            }else{
                this.completedUl.innerHTML += taskCard
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