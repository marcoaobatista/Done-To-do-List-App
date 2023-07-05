document.addEventListener('DOMContentLoaded', (event) => {

    // NAVBAR FUNCTIONALITIES
    let navOpenBtn = document.querySelector('.nav-open');
    let navCloseBtn = document.querySelector('.nav__close-btn');

    navOpenBtn.addEventListener('click', open_nav);
    navCloseBtn.addEventListener('click', close_nav);

    function open_nav(){
        document.querySelector('.nav').style.width = '250px';
        document.querySelector('.list').style.marginLeft = '250px';
    }

    function close_nav(){
        document.querySelector('.nav').style.width = '0';
        document.querySelector('.list').style.marginLeft= '0';
    }
    

    // ACTION CARDS MANAGEMENT
    let addTaskBtn = document.querySelector('.new-task-btn');
    addTaskBtn.addEventListener('click', () => show_action_page('new-task-page'));

    let editListBtn = document.getElementById('edit-list-btn');
    editListBtn.addEventListener('click', () => show_action_page('edit-list-page'));

    let addListBtn = document.getElementById('new-list-btn');
    addListBtn.addEventListener('click', () => show_action_page('new-list-page'));


    function show_action_page(page_id){
        inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.value = '');

        page = document.getElementById(page_id);
        page.style.display = 'flex';
        page.addEventListener('click', () => page.style.display = 'none');
    }

    // impede click from going to overlay
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(actionCard => actionCard.addEventListener('click', event => {
        event.stopPropagation();
    }));




    // OBJECT STRUCTURE IN TODOS OBJECT STORE
    // let generalList = {
    //     id: 1,
    //     name: 'General', 
    //     tasks: [
    //         { id: 1, name: 'buy groceries',  due: new Date('2024-06-30'), completed: false,},
    //         { id: 2, name: 'comemorate birthday',  due: new Date('2024-02-19'), completed: false,},
    //     ]
    // }    
    
    let urlListName = window.location.hash.substring(1);

    // INDEXEDDB CODE
    const request = indexedDB.open("DoneTodoList", 1);
    let db;

    request.onerror = e => {
        console.error("Error", openRequest.error);
    };

    request.onsuccess = e => {
        console.log("Opened db");
        db = e.target.result;

        load_list(urlListName);
        load_list_links();
        
    };

    request.onupgradeneeded = e => {
        let db = e.target.result;
        if (!db.objectStoreNames.contains('toDoLists')) {
            const listStore = db.createObjectStore('toDoLists', { keyPath: 'id', autoIncrement: true });
            listStore.createIndex('name', 'name', { unique: true });
        }
        alert("On onupgradeneeded");
    };


    function db_create_list(listName){
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['toDoLists'], 'readwrite');
            const store = transaction.objectStore('toDoLists');
            const request = store.add({name: listName, tasks: []});
            
            request.onsuccess = (e) => {
                console.log("List added to the store", e);
                resolve();
            };
            request.onerror = (e) => {
                console.log("Error", e.target.error.name);
                reject(e.target.error.name);
            };
        });
    }


    function create_task(listName, task) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['toDoLists'], 'readwrite');
            const store = transaction.objectStore('toDoLists');
    
            // First, retrieve the list from the object store
            const index = store.index('name');
            const getRequest = index.get(listName);
    
            getRequest.onsuccess = function(e) {
                const list = e.target.result;
    
                if (list) {
                    // Find the max id in the existing tasks
                    let maxId = list.tasks.reduce((max, task) => Math.max(max, task.id), 0);
    
                    // Assign a new id to the new task
                    task.id = maxId + 1;
    
                    // Add the new task to the tasks array
                    list.tasks.push(task);
    
                    // Then, put the updated list back into the object store
                    const putRequest = store.put(list);
    
                    putRequest.onsuccess = function(e) {
                        console.log('Task added to list', e);
                        resolve(); // Operation completed successfully, resolve the promise
                    };
    
                    putRequest.onerror = function(e) {
                        console.log('Error', e.target.error.name);
                        reject(e.target.error); // An error occurred, reject the promise
                    };
                } else {
                    console.log('List not found');
                    reject(new Error('List not found')); // List not found, reject the promise
                }
            };
    
            getRequest.onerror = function(e) {
                console.log('Error', e.target.error.name);
                reject(e.target.error); // An error occurred, reject the promise
            };
        });
    }
    

    function load_list_links(){
        const transaction = db.transaction(['toDoLists'], 'readwrite');
        const store = transaction.objectStore('toDoLists');
        
        let cursorRequest = store.openCursor();

        // FILL LIST LINKS
        listsLinkUl = document.getElementById('lists-link-ul');
        listsLinkUl.innerHTML = '';
        cursorRequest.onsuccess = (e) => {
            list = e.target.result;
            if (list){
                create_list_gui(list.value);
                list.continue();
            }
        }
        cursorRequest.onerror = (e) => {
            console.log('Error', e.target.error.name);
        };
    }


    function create_list_gui(list){
        listsLinkUl = document.getElementById('lists-link-ul');

        listLinkHtml = `
        <li>
            <a href="#${list.name}" class="list-link" id="${list.name}-anchor">
            <ion-icon name="list-outline" class="list-link__icon"></ion-icon>
            <div class="list-link__content">
                <span class="list-link__title">${list.name}</span>
                <span class="list-link__tasks-count">${list.tasks.length} Tasks</span>
            </div>
            </a>
        </li>
        `
        listsLinkUl.innerHTML +=  listLinkHtml;

        listLinks = document.querySelectorAll('.list-link');
        listLinks.forEach(listLink => {
            listLink.addEventListener('click', (e) => {
                load_list(listLink.id.replace('-anchor', ''));
                urlListName = window.location.hash.substring(1);
            });
        });
    }

    
    // LOAD PAGE CONTENT
    function load_list(urlListName){
        const transaction = db.transaction(['toDoLists'], 'readwrite');
        const store = transaction.objectStore('toDoLists');

        const index = store.index('name');
        const getRequest = index.get(urlListName);

        getRequest.onsuccess = (e) => {
            let list = e.target.result;

            if (list) {
                // FILL LIST TITLE
                title = document.querySelector('.list__header__title');
                title.textContent = list.name;

                // FILL TASKS
                let completedCount = 0;
                let incompletedCount = 0;
                
                incompletedUl = document.getElementById('incompleted-ul');
                incompletedUl.innerHTML = '';

                list.tasks.forEach(task => {
                    let listItem = document.createElement("li");
                    listItem.className = "task-card";
                    listItem.id = `task${task.id}`;

                    if (task.completed){
                        completedCount += 1;
                    }else{
                        incompletedCount += 1;
                    }
                    tasksHeading = document.getElementById('tasks-heading');
                    tasksHeading.textContent = `Tasks - ${incompletedCount}`
                    tasksHeading = document.getElementById('completed-heading');
                    tasksHeading.textContent = `Completed - ${completedCount}`

                    let dueSpan = '';
                    if (task.due != "Invalid Date"){
                        dueSpan = `<span class="task-card__date">${task.due.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>`
                    }

                    listItem.innerHTML = `
                        <input type="checkbox" class="task-card__checkbox"/>
                        <div class="task-card__content">
                            <span class="task-card__title">${task.name}</span>
                            ${dueSpan}
                        </div>
                    `
                    incompletedUl.appendChild(listItem);

                    let taskCards = document.querySelectorAll('.task-card');
                    taskCards.forEach(taskCard => taskCard.addEventListener('click', event => {
                        show_action_page('edit-task-page');
                    }));

                    const checkboxes = document.querySelectorAll('.task-card__checkbox');
                    checkboxes.forEach(checkbox => checkbox.addEventListener('click', event => {
                        event.stopPropagation();
                    }));
                });

            } else {
                console.log('List not found');
                let cursorRequest = store.openCursor();

                cursorRequest.onsuccess = (e) => {
                    list = e.target.result.value;
                    if (list) {
                        // FILL IN THE PAGE
                        console.log('Another list found');
                        window.location.href = `#${list.name}`;
                        title = document.querySelector('.list__header__title');
                        title.textContent = list.name;
                    }                    
                }
                cursorRequest.onerror = (e) => {
                    console.log('Error', e.target.error.name);
                };
                
            }
        };
        getRequest.onerror = function(e) {
            console.log('Error', e.target.error.name);
        };
    }


    document.getElementById('functester').addEventListener('click', () => {
        complete_task(1);
    });
    function complete_task(taskId){
        let completedUl = document.getElementById('completed-ul');
        let taskCard = document.getElementById(`task${taskId}`);

        taskCard.classList.add('fade-out');

        setTimeout(() => {
            completedUl.appendChild(taskCard);
            taskCard.classList.remove('fade-out');
        }, 600);

        setTimeout(() => {
            taskCard.classList.add('fade-in');
            
        }, 600);
        taskCard.classList.remove('fade-in');
    }

    


    // HANDLE FORMS SUBMISSIONS
    const createTaskForm = document.getElementById('add-task-form');
    createTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        taskInput = document.getElementById('add-task-text-input');
        taskName = taskInput.value;

        dateInput = document.getElementById('add-task-date-input');
        dateValue = dateInput.value;
        
        create_task(urlListName, {id: 0, name: taskName, due: new Date(dateValue), completed: false })
            .then(() => {
                // location.reload();
                load_list(urlListName);
                
            })
            .catch((error) => {
                console.error('Error adding task:', error);
            });
    });

    const createListForm = document.getElementById('add-list-form');
    createListForm.addEventListener('submit', (e) => {
        e.preventDefault();

        listInput = document.getElementById('create-list-text-input');
        listName = listInput.value;

        db_create_list(listName)
            .then(() => {
                location.reload();
            })
            .catch((error) => {
                console.error('Error adding task:', error);
            });
    });

});