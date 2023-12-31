export class IndexedDB {
    constructor(dbName, version, storeName) {
      this.dbName = dbName;
      this.version = version;
      this.storeName = storeName;
    }
  
    // Open database and creates objectStore if it does not exist
    async initDB(){
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                // create an objectStore called `storeName` if it does not exist
                if (!this.db.objectStoreNames.contains(this.storeName)) {
                    const store = this.db.createObjectStore(this.storeName, { keyPath: 'name'});
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Successfully Connected to Database');
                resolve();
            };

            request.onerror = (event) => {
                console.log(`Error opening db ${this.dbName}: `, event.target.errorCode);
                reject(`Error opening db ${this.dbName}: `, event.target.errorCode);
            };
        });
    }
    
    // Gets and retuns an array of list objects from the database
    async getAll(){
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const cursor = store.openCursor();
            let lists = [];
            cursor.onsuccess = (event) => {
                let list = event.target.result;
                if (list) {
                    lists.push(list.value);
                    list.continue();
                }else{
                    resolve(lists);
                }
            }
            cursor.onerror = (event) => {
                console.log('Error', e.target.error.name);
                reject('Error', e.target.error.name);
            }
        });
    }

    // Get and returns list object with listName from database
    async getList(listName){
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const request = store.get(listName);
    
            request.onsuccess = (event) => {
                let list = event.target.result;
                if (list){
                    resolve(list);
                }else{
                    reject('Error', event.target.error);
                }
            }
            request.onerror = (event) => {
                reject('Error', event.target.error);
            }
        });
    }

    // Gets and returns the first list's name in database
    async getFirstListName(){
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const cursor = store.openCursor();

            cursor.onsuccess = (e) => {
                let list;
                if (e && e.target && e.target.result){
                    list = e.target.result.value;
                    resolve(list.name);
                }else{
                    reject('Error No List on the Database');
                }
            }
            cursor.onerror = (e) => {
                console.log('Error', e.target.error.name);
                reject('Error', e.target.error.name);
            };
        });
    }

    // Changes given task's completion status in databse
    async toggleTaskStatus(listName, taskId){
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
    
            // First, retrieve the list from the object store
            const request = store.get(listName);

            request.onsuccess = function(e) {
                const list = e.target.result;
                if (list) {
                    // Find the task in the tasks array
                    const task = list.tasks.find(task => task.id === Number(taskId));
                    if (task) {
                        // Toggle task's completed status
                        task.completed = !task.completed;
    
                        // Then, put the updated list back into the object store
                        const putRequest = store.put(list);
    
                        putRequest.onsuccess = function(e) {
                            console.log('Task marked as completed', e);
                            resolve(); // Operation completed successfully, resolve the promise
                        };
    
                        putRequest.onerror = function(e) {
                            console.log('Error', e.target.error.name);
                            reject(e.target.error); // An error occurred, reject the promise
                        };
                    } else {
                        console.log('Task not found');
                        reject(new Error('Task not found')); // Task not found, reject the promise
                    }
                } else {
                    console.log('List not found');
                    reject(new Error('List not found')); // List not found, reject the promise
                }
            };
    
            request.onerror = function(e) {
                console.log('Error', e.target.error.name);
                reject(e.target.error); // An error occurred, reject the promise
            };
        });
    }

    // Adds new task to current list in database
    async addTask(taskName, dueDate){
        return new Promise((resolve, reject) => {
            let task = {id: 0, name: taskName, due: new Date(dueDate), completed: false }

            let listName = window.location.hash.substring(1);
            
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
    
            // First, retrieve the list from the object store
            const getRequest = store.get(listName);
    
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
                        resolve(task.id); // Operation completed successfully, resolve the promise
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

    // Deletes given task from current list in database
    async deleteTask(taskId){
        return new Promise((resolve, reject) => {
            let listName = window.location.hash.substring(1);

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // First, retrieve the list from the object store
            const getRequest = store.get(listName);

            getRequest.onsuccess = function(e) {
                const list = e.target.result;
                console.log(list);
                if (list) {
                    // Find the index of the task in the tasks array
                    const taskIndex = list.tasks.findIndex(task => task.id === taskId);

                    if (taskIndex !== -1) {
                        // Remove the task from the tasks array
                        list.tasks.splice(taskIndex, 1);

                        // Then, put the updated list back into the object store
                        const putRequest = store.put(list);

                        putRequest.onsuccess = function(e) {
                            console.log('Task deleted', e);
                            resolve(); // Operation completed successfully, resolve the promise
                        };

                        putRequest.onerror = function(e) {
                            console.log('Error', e.target.error.name);
                            reject(e.target.error); // An error occurred, reject the promise
                        };
                    } else {
                        console.log('Task not found');
                        reject(new Error('Task not found')); // Task not found, reject the promise
                    }
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

    // Adds new list to database
    async addList(listName){
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
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

    // Changes current list's name to newName in database
    async editListName(newName){
        return new Promise((resolve, reject) => {
            let listName = window.location.hash.substring(1);

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
    
            // Retrieve the list from the object store
            const getRequest = store.get(listName);
    
            getRequest.onsuccess = function(e) {
                const list = e.target.result;
    
                if (list) {
                    // If the list was found, create a new list with the new name and the same tasks
                    const newList = { name: newName, tasks: list.tasks };
    
                    // Then, add the new list to the object store
                    const addRequest = store.add(newList);
    
                    addRequest.onsuccess = function(e) {
                        console.log('New list added', e);
    
                        // After the new list has been added, delete the old list
                        const deleteRequest = store.delete(listName);
    
                        deleteRequest.onsuccess = function(e) {
                            console.log('Old list deleted', e);
                            resolve(); // Operation completed successfully, resolve the promise
                        };
    
                        deleteRequest.onerror = function(e) {
                            console.log('Error', e.target.error.name);
                            reject(e.target.error); // An error occurred, reject the promise
                        };
                    };
    
                    addRequest.onerror = function(e) {
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

    // Deletes current list from database
    async deleteList(){
        return new Promise((resolve, reject) => {
            let listName = window.location.hash.substring(1);

            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
    
            // Delete the list from the object store
            const deleteRequest = store.delete(listName);
    
            deleteRequest.onsuccess = function(e) {
                console.log('List deleted', e);
                resolve(); // Operation completed successfully, resolve the promise
            };
    
            deleteRequest.onerror = function(e) {
                console.log('Error', e.target.error.name);
                reject(e.target.error); // An error occurred, reject the promise
            };
        });
    }
  }
  