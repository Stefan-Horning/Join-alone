let logtinUser;

/**
 * Load LoftIn User
 */
async function loadLogtinUser() {
  let logtinUserAsString = localStorage.getItem('user');
  logtinUser = JSON.parse(logtinUserAsString);
}

/**
 * Render User in NavBar
 */
function renderUserProfileHead() {
  let profileDiv = document.getElementById('headProfile');
  let letters = logtinUser['firstLetter'];
  profileDiv.innerHTML = letters;
  profileDiv.style.backgroundColor = logtinUser['color'];
}

/**
 * Render Profile 
 */
async function renderUserProfile() {
  await loadLogtinUser(); // Warten, bis logtinUser geladen ist
  let profileDiv = document.getElementById('greeting-user');
  let name = logtinUser['name'];
  profileDiv.innerHTML = name;
}

/**
 * renderOverlayProfile
 */
async function renderOverlayProfile() {
  await loadLogtinUser(); // Warten, bis logtinUser geladen ist
  let profileDiv = document.getElementById('overlayUser');
  let name = logtinUser['name'];
  profileDiv.innerHTML = name;
}