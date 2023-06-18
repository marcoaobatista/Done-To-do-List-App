document.addEventListener('DOMContentLoaded', (event) => {
    let navOpenBtn = document.querySelector('.nav-open');
    let navCloseBtn = document.querySelector('.nav-close');

    navOpenBtn.addEventListener('click', open_nav);
    navCloseBtn.addEventListener('click', close_nav);

    function open_nav(){
        document.querySelector('nav').style.width = '250px';
        document.querySelector('.main').style.marginLeft = '250px';
    }

    function close_nav(){
        document.querySelector('nav').style.width = '0';
        document.querySelector('.main').style.marginLeft= '0';
    }
});