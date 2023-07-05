import {listLinkElement} from './components.js';

export class NavBar{
    constructor(idb){
        this.idb = idb;

        // Navigation control elements
        this.openBtn = document.querySelector('.nav-open');
        this.closeBtn = document.querySelector('.nav__close-btn');
        this.navBar = document.querySelector('.nav');
        this.list = document.querySelector('.list')
        this.ul = document.querySelector('#lists-link-ul');
       
        // Add event listeners for navigation controls
        this.openBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
    }

    // Open navigation based on screen width
    open(){
        if (window.screen.width <= 512){
            this.navBar.style.width = '100%';
        }else{
            this.navBar.style.width = '250px';
            this.list.style.marginLeft = '250px';
        }
    }

    // Close navigation
    close(){
        this.navBar.style.width = '0';
        this.list.style.marginLeft= '0';
    }

    // Populate the navigation bar
    async render(){
        let listName = window.location.hash.substring(1);
         // Get todo lists from the database
        const lists = await this.idb.getAll();
        this.ul.innerHTML = '';

        // Append list elements to navigation bar
        lists.forEach(list => {
            let completedTasks = list.tasks.filter(task => !task.completed).length;
            let listLink = listLinkElement(list.name, completedTasks);
            
            this.ul.appendChild(listLink);
        });
    }
    
    // Create new list
    async createList(listName){
        // Create list in database and append to navigation bar
        await this.idb.addList(listName).then(()=>{
            let listLink = listLinkElement(listName, 0);
            this.ul.appendChild(listLink);
        });
    }
}