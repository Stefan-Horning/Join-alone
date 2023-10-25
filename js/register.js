let users = [];
let allContacts = [];
let initials = '';
let logOutButton;
let helpButton; 
let legalButton;

/**
 * Start Function
 */
async function userInit(){
    await loadUsers();
}

/**
 * LogOut Function
 */
function showLogOut(){
    logOutButton =  document.getElementById('logout');
    helpButton = document.getElementById('openhelp');
    legalButton = document.getElementById('openlegal'); 
    if(window.innerWidth <= 768) {
      if(logOutButton.classList.contains('d-none')){
        logtOutButtonremove();
      }else{
        logtOutButtonadd();
      };
    }else{
      if(logOutButton.classList.contains('d-none')){
        logOutButtonMobileadd()
      }else{
        logOutButtonMobileremove();
      };
    }
}

/**
 * logtOutButtonadd
 */
function logtOutButtonadd(){
  logOutButton.classList.add('d-none');
  helpButton.classList.add('d-none');
  legalButton.classList.add('d-none');
}

/**
 * logtOutButtonremove
 */
function logtOutButtonremove(){
  logOutButton.classList.remove('d-none');
  helpButton.classList.remove('d-none');
  legalButton.classList.remove('d-none');
}

/**
 * logOutButtonMobileadd
 */
function logOutButtonMobileadd(){
  document.getElementById('logout').classList.remove('logoutdiv');
  document.getElementById('logout').classList.add('logoutdivOne');
  logOutButton.classList.remove('d-none');
}

/**
 * logOutButtonMobileremove
 */
function logOutButtonMobileremove(){
  document.getElementById('logout').classList.add('logoutdiv')
  document.getElementById('logout').classList.remove('logoutdivOne')
  logOutButton.classList.add('d-none');
}

/**
 * Open help.html
 */
function openhelp(){
  location.href = "help.html";
}

/**
 * open legal.html
 */
function openlegal(){
  location.href = "legal.html";
}

/**
 * logout
 */
function logout(){
  location.href = "index.html";
}

/**
 * Load Users
 */
async function loadUsers() {
    const storedUsers = await getItem('users');
    users = storedUsers ? JSON.parse(storedUsers) : [];
    updateAllContacts();
}

/**
 * updateAllContacts
 */
function updateAllContacts() {
    allContacts = users.map(user => user.name).sort();
}

/**
 * @returns Random Color
 */
async function getRandomColor() {
  let colors = ["orange", "hsl(193.32deg 88.4% 45.3%)", "hsl(330.81deg 88.4% 45.3%)", "hsl(0deg 97.03% 50.22%)", "rgb(221, 23, 221)", "rgb(31, 196, 31)"];
  let randomIndex = Math.floor(Math.random() * colors.length);
  let randomColor = colors[randomIndex];
  if (typeof randomColor === 'string') {
    return randomColor;
  } else {
    return getRandomColor();
  }
}

/**
 * register
 */
async function register() {
    Btn.disabled = true;
    let name = inputName.value;
    let email = inputEmail.value
    renderfirstNames(name);
    let rendomColor = await getRandomColor();
    if (Array.isArray(users)) {
      users.push({
        'name': name,
        'email': email,
        'password': password.value,
        'contact': [],
        'tel': '',
        'firstLetter': initials,
        'color': rendomColor,
      });
      await setItem('users', JSON.stringify(users))
      StartOtherFunctionsForRegister(email);
    }
}

/**
 * StartOtherFunctionsForRegister
 * @param {email} email 
 */
function StartOtherFunctionsForRegister(email){
  clearInput();
  render();
  back();
  setinLocalstorage(email)
}

/**
 * setinLocalstorage
 * @param {email} email 
 */
function setinLocalstorage(email){
    let user =  users.find(u => u.email == email);
    let userAsString = JSON.stringify(user);
    localStorage.setItem('user', userAsString);
    location.href = "summary.html";
}

/**
 * clear all input
 */
function clearInput(){
    inputName.value = '';
    inputEmail.value = '';
    password.value = '';
    Btn.disabled = false;
}

/**
 * initials Name
 * @param {Name} inputname 
 */
function renderfirstNames(inputname){
  let names = inputname.split(' ');
  initials = '';
  for(let i = 0; i < names.length; i++){
      let name = names[i];
      let initial = name.charAt(0).toUpperCase();
      initials += initial;
  }
  updateAllContacts(); 
}

/**
 * Check site
 */
function checkSite(){
  if(window.location.pathname.split('/').pop() == 'board.html'){
    document.getElementById("board").style.backgroundColor = "#091931";
  }else if(window.location.pathname.split('/').pop() == 'summary.html'){
    document.getElementById("summary").style.backgroundColor = "#091931";
  }else if(window.location.pathname.split('/').pop() == 'addtask.html'){
    document.getElementById("addTask").style.backgroundColor = "#091931";
  } else if(window.location.pathname.split('/').pop() == 'contact.html'){
    document.getElementById("contact").style.backgroundColor = "#091931";
  } else if(window.location.pathname.split('/').pop() == 'legal.html'){
    document.getElementById("legal").style.backgroundColor = "#091931";
  }
} 