export class IndexedDB {
    constructor(dbName, version, storeName) {
      this.dbName = dbName;
      this.version = version;
      this.storeName = storeName;
    }
  
    async initDB(){
        /** */
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                // create an objectStore called `storeName` if it does not exist
                if (!this.db.objectStoreNames.contains(this.storeName)) {
                    const store = this.db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('name', 'name', { unique: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('success');
                resolve();
            };

            request.onerror = (event) => {
                console.log(`Error opening db ${this.dbName}: `, event.target.errorCode);
                reject(`Error opening db ${this.dbName}: `, event.target.errorCode);
            };
        });
    }
    
    async getAll(){
        /** */
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

    async getList(listName){
        /** */
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
    
            const index = store.index('name');
            const request = index.get(listName);
    
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

    async getFirstListName(){
        /** */
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const cursor = store.openCursor();

            cursor.onsuccess = (e) => {
                let list = e.target.result.value;
                if (list) {
                    resolve(list.name);
                }                    
            }
            cursor.onerror = (e) => {
                console.log('Error', e.target.error.name);
                reject('Error', e.target.error.name);
            };
        });
    }
  }
  