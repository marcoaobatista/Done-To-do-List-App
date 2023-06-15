function open_nav(){
    document.getElementsByTagName('nav')[0].style.width = '335px';
    document.getElementsByClassName('main')[0].style.marginLeft = '335px';
}

function close_nav(){
    document.getElementsByTagName('nav')[0].style.width = '0';
    document.getElementsByClassName('main')[0].style.marginLeft = '0';
}