export class NavBar{
    constructor(db){
        this.db = db;

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

    render(lists){
        lists.forEach(list => {
            let completedTasks = list.tasks.filter(task => !task.completed).length;
            let listLinkHtml = `
            <li>
                <a href="#${list.name}" class="list-link" id="${list.name}-anchor">
                <ion-icon name="list-outline" class="list-link__icon"></ion-icon>
                <div class="list-link__content">
                    <span class="list-link__title">${list.name}</span>
                    <span class="list-link__tasks-count">${completedTasks} Tasks</span>
                </div>
                </a>
            </li>
            `
            this.ul.innerHTML += listLinkHtml;
        });
    }
}