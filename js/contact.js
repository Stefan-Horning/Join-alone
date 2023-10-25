let firstLetters = [];
let sortLetter = [];
let usersLetter = [];
let sortedContacts = {};

/**
 * Sort all User by Name
 */
function sortUsers() {
    users.sort((a, b) => a.name.localeCompare(b.name));
    users.forEach(user => {
        if(user != undefined){
            const firstLetter = user.name.charAt(0).toUpperCase();
            SortUserIf(firstLetter, user);
        }
    });
    const sortedContactsArray = Object.entries(sortedContacts)
      .map(([letter, contacts]) => ({
        letter,
        contacts
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
    sortedContacts = {};
    sortedContactsArray.forEach(({ letter, contacts }) => {
      sortedContacts[letter] = contacts;
    });
    sortContactsByName();
}

/**
 * Open Edit
 * @param {form} form 
 */
function openEdit(form){
    let email = document.getElementById('contactEmail').innerHTML;
    loadContactForm(form,email);
    openOverdiv();
    loadUserInformations(email);
    let WithoutTitel = document.getElementById('phone');
    WithoutTitel.title = '';
}

/**
 * Load User Infomations
 * @param {Email} email 
 */
function loadUserInformations(email) {
    let u;
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
      u = users[index];
      const { name, email: emailC, tel, firstLetter } = u;
      document.getElementById('name').value = name;
      document.getElementById('email').value = emailC;
      document.getElementById('phone').value = tel;
      document.getElementById('twoLettersForEdit').innerHTML = firstLetter;
      document.getElementById('deleteButton').setAttribute('onclick', `deleteContact(${index})`);
      document.getElementById('SaveUserButton').setAttribute('onclick', `SaveUser(${index})`);
      document.getElementById('twoLettersForEdit').style.backgroundColor = users[index]['color'];
    }
}

/**
 * @param {Name} inputname 
 * @returns initials
 */
function newLetters(inputname){
    let names = inputname.split(' ');
    let initials = '';
    for(let i = 0; i < names.length; i++){
      let name = names[i];
      let initial = name.charAt(0).toUpperCase();
      initials += initial;
    }
    return initials;
}

/**
 * @param {index} i 
 * @returns New User Informations
 */
async function SaveUser(i){
    let name = document.getElementById('name').value;
    let firstLetter = newLetters(name)
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    if(email && name && phone != ''){
        users[i]['name'] = name;
        users[i]['email'] = email;
        users[i]['tel'] = phone;
        users[i]['firstLetter'] = firstLetter;
        await setItem('users', JSON.stringify(users));
        closeOverdiv();
        document.getElementById('informationsContacts').innerHTML = '';
        contactInit();
        closeOverdivArrow();
    }
    return false;
}

/**
 * delete Users 
 * @param {index} i 
 */
async function deleteContact(i){ 
    users.splice(i,1);
    await setItem('users', JSON.stringify(users))
    closeOverdiv();
    document.getElementById('informationsContacts').innerHTML = '';
    contactInit();
    closeOverdivArrow();
}

/**
 * Sort Contacts by name
 */
function sortContactsByName() {
    for (const letter in sortedContacts) {
      sortedContacts[letter].sort((a, b) => a.name.localeCompare(b.name));
    }
    for(let i = 0; i < firstLetters.length; i++){
        renderUser(i);
    }
}

/**
 * Sort User by Letters
 * @param {letters} firstLetter 
 * @param {user} user 
 */
function SortUserIf(firstLetter, user) {
    if (!sortedContacts[firstLetter]) {
      sortedContacts[firstLetter] = [];
    }
    if (!sortedContacts[firstLetter].includes(user)) {
      sortedContacts[firstLetter].push(user);
    }
}

/**
 * start function for Contacts.html
 */
async function contactInit(){
    firstLetters = [];
    sortLetter = [];
    usersLetter = [];
    sortedContacts = {};
    await loadUsers();
    getFirstLetters();
    loadContactForm('newContactHTML');
    hover();
}

/**
 * Load Form for Contacts 
 * @param {form} form 
 * @param {email} email 
 */
function loadContactForm(form,email){
    let div = document.getElementById('overdiv');
    if(form == 'newContactHTML'){
        div.innerHTML = newContactHTML();
    }else{
        div.innerHTML = editContactHTML();
    }
}

/**
 * Hover Effect
 */
function hover(){
    let image = document.getElementById('Cancel');
    let hoverTrigger = document.querySelector('.cancelButton');

    hoverTrigger.addEventListener('mouseenter', function() {
        image.src = ' img/BlueCancel.svg';
    });

    hoverTrigger.addEventListener('mouseleave', function() {
        image.src = 'img/cancel.svg';
    });
}

/**
 * get first letter for sort
 */
function getFirstLetters() {
    for (let i = 0; i < users.length; i++) {
        firstLetters.sort();
        let name = users[i]['name'];
        let firstLetter = name.charAt(0).toUpperCase();
        if (!firstLetters.includes(firstLetter)) {
            firstLetters.push(firstLetter);
            sortLetter.push(firstLetter);
            sortLetter.sort();
            sortArray();
        }else{
            let recurringUser = users[i];
            usersLetter.push(recurringUser);
        }
    }
    firstLettersForContact();
}

/**
 * firstLettersForContact
 */
function firstLettersForContact(){
    renderContactHTML();
    sortUsers();
}

/**
 * Render all User
 * @param {index} index 
 */
function renderUser(index) {
    let div = document.getElementById(`contact${index}`);
    div.classList.add('ContactHover');
    div.innerHTML = '';
    div.innerHTML = generateUserHTML(index);
}

/**
 * HTML Contact
 */
function renderContactHTML() {
    let div = document.getElementById('contact-list-overview');
    div.innerHTML = '';
    for (let i = 0; i < sortLetter.length; i++) {
        div.innerHTML += contactHTML(sortLetter[i], i);
        usersLetter.sort();
    }
}

/**
 * @param {width} width 
 * @returns window.width
 */
function isWindowBelowWidth(width) {
    return window.innerWidth < width;
}

/**
 * @param {Letter} Letter 
 * @param {Index} i 
 */
function openContact(Letter,i){
    if (!isWindowBelowWidth(1160)) {
        setInformationsForContact(Letter, i);
    }else{
        setInformationsForContact(Letter, i);
        document.getElementById('contact-info-container').classList.replace('contact-info-container', 'contact-info-container-new');
    }
}

/**
 * @param {Letter} Letter 
 * @param {Index} i 
 */
function setInformationsForContact(Letter, i){
    let name = sortedContacts[`${Letter}`][i]['name'];
    let firstandSecoundLetters = sortedContacts[`${Letter}`][i]['firstLetter'];
    let email = sortedContacts[`${Letter}`][i]['email'];
    let phone = sortedContacts[`${Letter}`][i]['tel'];
    document.getElementById('informationsContacts').innerHTML = openContactHTML(name,firstandSecoundLetters,email,phone,Letter,i);
    mobileDelButton(email);
}

/**
 * Sort Array
 */
function sortArray(){
    let unsort = firstLetters;
    unsort.sort();
    firstLetters = unsort; 
}

/**
 * Close Overdiv 
 */
function closeOverdiv(){
    let div = document.getElementById('overdiv');
    let overlayDiv = document.querySelector(".overlay");
    div.classList.remove('overdiv-slide');
    if (overlayDiv) { 
        document.body.removeChild(overlayDiv);
    }
   
}
/**
 * closeOverdivArrow
 */
function closeOverdivArrow(){
    document.getElementById('contact-info-container').classList.replace('contact-info-container-new','contact-info-container');
}
/**
 * Open Overdiv
 * @param {form} form 
 */
function openOverdiv(form){
    loadContactForm(form);
    let div = document.getElementById('overdiv');
    let overlayDiv = document.createElement("div");
    div.classList.add('overdiv-slide');
    overlayDiv.classList.add("overlay");
    document.body.appendChild(overlayDiv);
}

/**
 * Not Close by click
 * @param {event} event 
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * @returns User Color
 */
async function getRandomColorContact() {
    let colors = ["orange", "hsl(193.32deg 88.4% 45.3%)", "hsl(330.81deg 88.4% 45.3%)", "hsl(0deg 97.03% 50.22%)","rgb(221, 23, 221)","rgb(31, 196, 31)"];
    let randomIndex = Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomIndex];
    return randomColor;
}

/**
 * create new Contact
 */
function createNewContact(){
    let name = document.getElementById('name');
    let email = document.getElementById('email')
    let phone = document.getElementById('phone')
    registerForContacts(name,email,phone);
}

/**
 * @param {name} name 
 * @param {email} email 
 * @param {number} phone 
 */
function clearInputContacts(name,email,phone){
    name.value = '';
    email.value = '';
    phone.value = '';
}

/**
 * @param {name} name 
 * @param {email} email 
 * @param {phone} phone 
 */
async function registerForContacts(name,email,phone) {
    renderfirstNames(name.value);
    let rendomColor = await getRandomColorContact();
    if (Array.isArray(users)) {
      users.push({
        'name': name.value,
        'email': email.value,
        'password': 'StartPassword' + `${email.value}`,
        'contact': [],
        'tel': phone.value,
        'firstLetter': initials,
        'color': rendomColor,
      });
      await setItem('users', JSON.stringify(users));
      contactInit();
      closeOverdiv();
      clearInputContacts(name,email,phone);
    } 
}

/**
 * Mobile delete button
 * @param {email} email 
 */
function mobileDelButton(email){
    if(window.innerWidth <= 768){
        let index = users.findIndex(u => u['email'] == email);
        let button = document.getElementById('delMobile');
        button.setAttribute('onclick', `deleteContact(${index})`);
    }
}

/**
 * check InputLength
 * @param {Input} input 
 * @param {lenght} maxLength 
 */
function checkInputLength(input, maxLength) {
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
}