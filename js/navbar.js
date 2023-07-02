import {listLinkElement} from './components.js';

export class NavBar{
    constructor(idb){
        this.idb = idb;

        this.openBtn = document.querySelector('.nav-open');
        this.closeBtn = document.querySelector('.nav__close-btn');
        this.navBar = document.querySelector('.nav');
        this.list = document.querySelector('.list')
        this.ul = document.querySelector('#lists-link-ul');
       
        this.openBtn.addEventListener('click', () => this.open());
        this.closeBtn.addEventListener('click', () => this.close());
    }

    open(){
        this.navBar.style.width = '250px';
        this.list.style.marginLeft = '250px';
    }
    close(){
        this.navBar.style.width = '0';
        this.list.style.marginLeft= '0';
    }

    async render(){
        let listName = window.location.hash.substring(1);
         // Get the todo lists from the database
        const lists = await this.idb.getAll();

        lists.forEach(list => {
            let completedTasks = list.tasks.filter(task => !task.completed).length;
            let listLink = listLinkElement(list.name, completedTasks);
            
            this.ul.appendChild(listLink);
        });
    }
}