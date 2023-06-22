document.addEventListener('DOMContentLoaded', (event) => {
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
    

    
    function create_db(){
        const request = indexedDB.open("Done_todo_list");
        request.onsuccess = e =>{
            console.log("success");
        }
        request.onupgradeneeded = e =>{
            console.log("upgrade");
        }
        request.onerror = e =>{
            console.log("error");
        }
    }
    create_db();



    function create_list(){
        
    }
    function delete_list(){
        
    }
    function update_list(){

    }

    function create_task(){
        
    }
    function delete_task(){
        
    }
    function update_task(){

    }
    function complete_task(){

    }    



});