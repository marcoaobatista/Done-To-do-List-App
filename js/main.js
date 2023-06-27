import { IndexedDB } from './indexedDB.js';
import { renderNavBar } from './navbar.js';
import { renderList } from './list.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize the IndexedDB
  idb = IndexedDB("DoneTodoList", 1, "toDoLists");
  await idb.initDB();

  // Get the todo lists from the database
  const lists = await getLists();

  // Render the navbar with the lists
  renderNavBar(lists);

  // Render the first list by default or a blank list if no lists exist yet
  if (lists.length > 0) {
    renderList(lists[0].id);
  } else {
    renderList(null);
  }
});

// Optional: Listen to changes in URL (if you want different URLs for different lists)
window.addEventListener('hashchange', async () => {
  const listId = window.location.hash.substring(1); // Get list ID from URL
  renderList(listId);
});
