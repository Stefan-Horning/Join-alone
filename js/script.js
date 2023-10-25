let isPasswordSeen = false;
let eyeImg = false;

/**
 * StartFunction
 */
function init(){
    render();
}

/**
 * render in HTML
 */
function render(){
    let div = document.getElementById('loginDiv');
    div.innerHTML = renderHTML();
}

/**
 * Render Sign-up
 */
function renderSignUp(){
    document.getElementById('navbar').classList.add('d-none');
    let div = document.getElementById('loginDiv');
    div.innerHTML = SignUpHTML();
}

/**
 * renderPassword
 */
function renderPassword(){
    document.getElementById('navbar').classList.add('d-none');
    let div = document.getElementById('loginDiv');
    div.innerHTML = forgotMyPasswordHTML();
}

/**
 * seePassword
 */
function seePassword(){
    let input = document.getElementById('password');
    let img = document.getElementById('password-img');
    if(!isPasswordSeen){
        input.type = 'text';
        isPasswordSeen = true;
        img.src = 'img/seePassword.svg';
    }else{
        input.type = 'password';
        isPasswordSeen = false;
        img.src = 'img/seeNotPassword.svg';
    }
}

/**
 * checkInput
 */
function checkInput(){
    let input = document.getElementById('password');
    let img = document.getElementById('password-img');
    if(input.value == ''){
        input.type = 'password';
        img.src = 'img/passwordicon.svg';
    }else{
        img.src = 'img/seeNotPassword.svg';
    }
}

/**
 * go back
 */
function back(){
    document.getElementById('navbar').classList.remove('d-none');
    render();
}