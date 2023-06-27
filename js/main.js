import { IndexedDB } from './indexedDB.js';
import { NavBar } from './navbar.js';
import { List } from './list.js';

document.addEventListener('DOMContentLoaded', async () => {
    let listName = window.location.hash.substring(1);

    // Initialize the IndexedDB
    const idb = new IndexedDB("DoneTodoList", 1, "toDoLists");
    await idb.initDB();

    // Get the todo lists from the database
    const lists = await idb.getAll();
    // Create and render the navbar
    const navBar = new NavBar(idb);
    navBar.render(lists);

    // Get the todo list from the database
    let list = await idb.getList(listName).catch(()=>{
        console.log('Invalid List Name');
    });
    if (!list){
        listName = await idb.getFirstListName();
        list = await idb.getList(listName);
        window.location.href = `#${listName}`;
    }
    const todoList = new List(idb);
    todoList.render(list);

    // // Render the first list by default or a blank list if no lists exist yet
    // if (lists.length > 0) {
    //     renderList(lists[0].id);
    // } else {
    //     renderList(null);
    // }


    // Listen to changes in URL
    window.addEventListener('hashchange', async () => {
        console.log('onHashChange');
        listName = window.location.hash.substring(1); // Get list ID from URL
        // Get the todo list from the database
        let list = await idb.getList(listName).catch(()=>{
            console.log('onHashChange - Invalid List Name');
        });
        if (!list){
            console.log('onHashChange - Url not valid');
            listName = await idb.getFirstListName();
            list = await idb.getList(listName);
            window.location.href = `#${listName}`;
        }
        const todoList = new List(idb);
        todoList.render(list);
    });
});


