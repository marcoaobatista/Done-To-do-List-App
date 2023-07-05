export class ActionPages{
    constructor(idb, list, navbar){
        this.idb = idb;
        this.list = list;
        this.navbar = navbar;

        // New task page elements
        this.newTaskBtn = document.querySelector('.new-task-btn');
        this.newTaskPage = document.getElementById('new-task-page');
        this.newTaskForm = document.getElementById('add-task-form');
        this.newTaskInput = document.getElementById('add-task-text-input');
        this.newDateInput = document.getElementById('add-task-date-input');

        // New list page elements
        this.newListBtn = document.querySelector('#new-list-btn');
        this.newListPage = document.getElementById('new-list-page');
        this.newListForm = document.getElementById('add-list-form');
        this.newListInput = document.getElementById('create-list-text-input');
        this.newListError = document.getElementById('create-list-error');

        // Edit list page elements
        this.editListBtn = document.querySelector('#edit-list-btn');
        this.editListPage = document.getElementById('edit-list-page');
        this.editListForm = document.getElementById('edit-list-form');
        this.editListInput = document.getElementById('edit-list-text-input');
        this.editListDeleteBtn = document.querySelector('.action-card__btn--delete');
        this.editListSubmitBtn = document.getElementById('edit-list-submit-btn');
        this.editListError = document.getElementById('edit-list-error');
    }

    // Set up action pages
    render(){
        // Stop event propagation on action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(actionCard => actionCard.addEventListener('click', event => {
            event.stopPropagation();
        }));

        // Add event listeners to new task page elements
        this.newTaskBtn.addEventListener('click', () => this.openAddTask());
        this.newTaskPage.addEventListener('click', () => this.closeAddTask());
        this.newTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let taskName = this.newTaskInput.value;
            let dueDate = this.newDateInput.value;
            this.list.addTask(taskName, dueDate);
            this.closeAddTask();
        });

        // Add event listeners to new list page elements
        this.newListBtn.addEventListener('click', () => this.openAddList());
        this.newListPage.addEventListener('click', () => this.closeAddList());
        this.newListForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const listName = this.newListInput.value;
            const hashPattern = /^[a-zA-Z0-9]+$/; // Regular expression pattern to match alphanumeric characters
            
            if (hashPattern.test(listName)) {
                // Valid hash value, proceed with further processing or updating the URL hash
                this.navbar.createList(listName);
                this.closeAddList();
            } else {
                // Invalid hash value, show an error message or handle appropriately
                this.newListInput.style.border = 'red solid 1px';
                this.newListError.style.display = 'block';
            }
        });

        // Add event listeners to edit list page elements
        this.editListBtn.addEventListener('click', () => this.openEditList());
        this.editListPage.addEventListener('click', () => this.closeEditList());
        this.editListForm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            let newName = this.editListInput.value;
            const hashPattern = /^[a-zA-Z0-9]+$/; // Regular expression pattern to match alphanumeric characters
            
            if (hashPattern.test(newName)) {
                // Valid hash value, proceed with further processing or updating the URL hash
                await this.idb.editListName(newName).then(()=>{
                    window.location.href = `#${newName}`;
                    this.list.render();
                    this.navbar.render();
                    this.closeEditList();
                });
            } else {
                // Invalid hash value, show an error message or handle appropriately
                this.editListInput.style.border = 'red solid 1px';
                this.editListError.style.display = 'block';
            }
        });
        this.editListDeleteBtn.addEventListener('click', async ()=>{
            await this.idb.deleteList().then(()=>{
                this.list.render();
                this.navbar.render();
                this.closeEditList();
            });
        });
        
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
        this.newListInput.style.border = 'none';
        this.newListError.style.display = 'none';
        this.newListPage.style.display = 'none';
        // Clear input fields
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
        this.editListInput.style.border = 'none';
        this.editListError.style.display = 'none';
        this.editListPage.style.display = 'none';
        // Clear input fields
        this.editListPage.querySelectorAll('input').forEach((input)=>{
            input.value = '';
        });
    }
}
