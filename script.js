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

    let taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(taskCard => taskCard.addEventListener('click', event => {
        taskCard.addEventListener('click', () => show_action_page('edit-task-page'));
    }));

    let addListBtn = document.getElementById('new-list-btn');
    addListBtn.addEventListener('click', () => show_action_page('new-list-page'));


    function show_action_page(page_id){
        page = document.getElementById(page_id);

        page.style.display = 'flex';
        page.addEventListener('click', () => page.style.display = 'none');
    }

    // impede click from going to overlay
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(actionCard => actionCard.addEventListener('click', event => {
        event.stopPropagation();
    }));

    const checkboxes = document.querySelectorAll('.task-card__checkbox');
    checkboxes.forEach(checkbox => checkbox.addEventListener('click', event => {
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


    // INDEXEDDB CODE
    const request = indexedDB.open("DoneTodoList", 2);
    let db;

    request.onerror = e => {
        console.error("Error", openRequest.error);
    };

    request.onsuccess = e => {
        console.log("Opened db");
        db = e.target.result;
    };

    request.onupgradeneeded = e => {
        let db = e.target.result;
        if (!db.objectStoreNames.contains('toDoLists')) {
          db.createObjectStore('toDoLists', { keyPath: 'id', autoIncrement: true});
        }
        alert("On onupgradeneeded")
    };


    function create_list(listName, tasks){
        const transaction = db.transaction(['toDoLists'], 'readwrite');
        const store = transaction.objectStore('toDoLists');
        const request = store.add({name: listName, tasks: tasks});
    
        request.onsuccess = (e) => {
            console.log("List added to the store", e);
        };
    
        request.onerror = (e) => {

            console.log("Error", e.target.error.name);
        };
    }
    
    document.querySelector('.list__tasks__title').addEventListener('click', () => {
        console.log('general created')
        create_list('General', [
            { id: 1, name: 'buy groceries', due: new Date('2024-06-30'), completed: false },
            { id: 2, name: 'commemorate birthday', due: new Date('2024-02-19'), completed: false },
            { id: 3, name: 'do whatever', due: new Date('2023-09-19'), completed: false }
        ]);
    });



});