import { IndexedDB } from './indexedDB.js';
import { NavBar } from './navbar.js';
import { List } from './list.js';
import { ActionPages } from './actionPages.js';

document.addEventListener('DOMContentLoaded', async () => {
    const storeName = "toDoLists";
    const dbName = "DoneTodoList";
    const dbVersion = 1;

    // Initialize the IndexedDB
    const idb = new IndexedDB(dbName, dbVersion, storeName);
    await idb.initDB();
    
    // Create and render the navbar
    const navBar = new NavBar(idb);
    navBar.render();

    const todoList = new List(idb, storeName);
    await todoList.render();

    const actionPages = new ActionPages(idb, todoList, navBar);
    actionPages.render();

    // document.getElementById('functester').addEventListener('click',()=>{
    //     todoList.addTask("this is a todo task", "2004-02-19");
    // });

    // Listen to changes in URL
    window.addEventListener('hashchange', async () => {
        console.log('on HashChange');
        todoList.render();
    });
});