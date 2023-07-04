export class ActionPages{
    constructor(idb, list, navbar){
        this.idb = idb;
        this.list = list;
        this.navbar = navbar;

        this.newTaskBtn = document.querySelector('.new-task-btn');
        this.newTaskPage = document.getElementById('new-task-page');
        this.newTaskForm = document.getElementById('add-task-form');
        this.newTaskInput = document.getElementById('add-task-text-input');
        this.newDateInput = document.getElementById('add-task-date-input');

        this.newListBtn = document.querySelector('#new-list-btn');
        this.newListPage = document.getElementById('new-list-page');
        this.newListForm = document.getElementById('add-list-form');
        this.newListInput = document.getElementById('create-list-text-input');

        this.editListBtn = document.querySelector('#edit-list-btn');
        this.editListPage = document.getElementById('edit-list-page');
    }

    render(){
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(actionCard => actionCard.addEventListener('click', event => {
            event.stopPropagation();
        }));

        this.newTaskBtn.addEventListener('click', () => this.openAddTask());
        this.newTaskPage.addEventListener('click', () => this.closeAddTask());
        this.newTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let taskName = this.newTaskInput.value;
            let dueDate = this.newDateInput.value;
            this.list.addTask(taskName, dueDate);
            this.closeAddTask();
        });

        this.newListBtn.addEventListener('click', () => this.openAddList());
        this.newListPage.addEventListener('click', () => this.closeAddList());
        this.newListForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let listName = this.newListInput.value;
            this.navbar.createList(listName);
            this.closeAddList();
        });


        this.editListBtn.addEventListener('click', () => this.openEditList());
        this.editListPage.addEventListener('click', () => this.closeEditList());
    }

    openAddTask(){
        this.newTaskPage.style.display = 'flex';
    }
    closeAddTask(){
        this.newTaskPage.style.display = 'none';
        this.newTaskPage.querySelectorAll('input').forEach((input)=>{
            input.value = '';
        });
    }

    openAddList(){
        this.newListPage.style.display = 'flex';
    }
    closeAddList(){
        this.newListPage.style.display = 'none';
        this.newListPage.querySelectorAll('input').forEach((input)=>{
            input.value = '';
        });
    }

    openEditList(){
        let listName = window.location.hash.substring(1);
        this.editListPage.style.display = 'flex';
        this.editListPage.querySelector('input').value = listName;
    }
    closeEditList(){
        this.editListPage.style.display = 'none';
        this.editListPage.querySelectorAll('input').forEach((input)=>{
            input.value = '';
        });
    }
}
