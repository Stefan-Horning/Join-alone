let checked = false;

/**
 * Remember Me Button
 */
function RememberMeGetLocalStorage(){
    let RemeberMeAsString = localStorage.getItem('checkbox');
    if(RemeberMeAsString){
        let RemeberMeAsJson = JSON.parse(RemeberMeAsString);
        checked = RemeberMeAsJson;
        RememberMeSetLocalStorage();
        loadFromLocalStorage();
    }
}

/**
 * Set Remeber to LocalStorage
 */
function RememberMeSetLocalStorage(){
    let inputcheck = document.getElementById('check');
    if(checked == true){
        localStorage.setItem('checkbox', checked);
        inputcheck.checked = checked;
        checked = false;
    }else{
        inputcheck.checked = checked;
        localStorage.setItem('checkbox', checked);
        checked = true;
    }
}

/**
 * load From LocalStorage
 */
function loadFromLocalStorage(){
    let userAsString = localStorage.getItem('user');
    if(userAsString){
        let userAsJson = JSON.parse(userAsString);
        pushInInput(userAsJson);
    }
}

/**
 * push In Input
 * @param {User in JSON} userAsJson 
 */
function pushInInput(userAsJson){
    if(checked == false && userAsJson.email != "Guest@Guest.de"){
        let email = document.getElementById('email');
        let password = document.getElementById('password');
        email.value = userAsJson['email'];
        password.value = userAsJson['password'];
        isPasswordSeen = true;
        seePassword();
    }else{
        email.value = '';
        password.value = '';
    }
}

/**
 * login Function
 * @param {event} event 
 */
function login(event){
    event.preventDefault();
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    trueOrFalse(email,password,user);
}

/**
 * Guset login
 */
function guestLogin(){
    let guestUser = {name: 'Guest', email: 'Guest@Guest.de', password: '1234', contact: Array(0), tel: 0, firstLetter: 'Guest'}
    let userAsString = JSON.stringify(guestUser);
    localStorage.setItem('user', userAsString);
    location.href = "summary.html";
}

/**
 * Wrong Data to login
 * @param {email} email 
 * @param {password} password 
 * @param {user} user 
 */
function trueOrFalse(email,password,user){
    if(user){
        if(user.email != 'Guest@Guest.de'){
            let userAsString = JSON.stringify(user);
            localStorage.setItem('user', userAsString);
        }
        location.href = "summary.html";
    }else{
        email.value = ''
        password.value = ''
        document.getElementById('wrong').classList.remove('d-none');
    }
}

/**
 * forgott Password
 */
function forgotPassword(){
    document.getElementById('send').classList.remove('d-none');
    document.getElementById('email').value = '';
}