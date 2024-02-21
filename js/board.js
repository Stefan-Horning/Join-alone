let currentElement = null;
let clickedId = null;
let allTasks = [];
let allCategory = [];
let allSubtask = [];
let allColors = ["#E200BE","#1FD7C1","#0038FF","#FF8A00","#2AD300","#FF0000","#8AA4FF",];
let selectedContacts = [];
let initialsColors = {};
let currentDraggedElement;
let currentTaskId;
load();
loadUsers();

/**
 * Includes NavBar
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  renderUserProfileHead();
  checkSite();
}

/*
* Starts Task-Functions
*/
async function renderBoardCards() {
  await load();
  renderTasksByStatus("todo", "todo");
  renderTasksByStatus("progress", "progress");
  renderTasksByStatus("feedback", "feedback");
  renderTasksByStatus("done", "done");
}

/**
 * Filters all tasks in every column
 * @param {status} status 
 * @param {Id} containerId 
 */
function renderTasksByStatus(status, containerId) {
  const tasks = allTasks.filter((task) => task.status === status);
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  tasks.forEach((task, index) => { 
    container.innerHTML += generateCardHTML(task, index);
  });
}

/**
 * Find-task
 */
function searchCards() {
  const searchInput = document.querySelector(".searchBarContainer input");
  const searchValue = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".card");
  const matchedCards = [];
  cards.forEach((card) => {const cardTitle = card.querySelector(".cardTitle").textContent.toLowerCase();
    const cardDescription = card.querySelector(".cardDescription").textContent.toLowerCase();
    if (cardTitle.includes(searchValue) ||cardDescription.includes(searchValue)) {
      matchedCards.push(card);
    }
  });
  cards.forEach((card) => {card.style.display = "none";});
  matchedCards.forEach((card) => {card.style.display = "block";
  });
}

/**
 * Progress
 * @param {Subtasks} task 
 * @returns completedSubtasks, totalSubtasks, progress
 */
function generateProgress(task) {
  let completedSubtasks = task.subtaskChecked ? task.subtaskChecked.filter((checked) => checked).length: 0;
  let totalSubtasks = task.subtask ? task.subtask.length : 0;
  let progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  return { completedSubtasks, totalSubtasks, progress };
}

/**
 * Generates html for Subtasks
 * @param {Subtask} task 
 * @returns ProgressBar HTML
 */
function generateProgressBarContainerHTML(task) {
  let { completedSubtasks, totalSubtasks, progress } = generateProgress(task);
  let progressBarContainerHTML = "";
  if (task.subtask && task.subtask.length > 0) {
    progressBarContainerHTML = generateProgressHTML(progress,completedSubtasks,totalSubtasks)
  }
  return progressBarContainerHTML;
}

/**
 * Renders Html
 * @param {Progress} progress 
 * @param {Completed Subtask} completedSubtasks 
 * @param {Total Subtask} totalSubtasks 
 * @returns Html Structure
 */
function generateProgressHTML(progress,completedSubtasks,totalSubtasks){
  return `
  <div class="progressBarContainer" id="progressBarContainer">
    <div class="cardProgress"><progress value="${progress}" max="100"></progress></div>
    <div class="checkboxCount">${completedSubtasks}/${totalSubtasks} Done</div>
  </div>
`;
}

/**
 * Searches right Priorities
 * @param {Task} task 
 * @returns Priorities
 */
async function checkPrioPopupCard(task) {
  let priorityImage, priorityText, backgroundColor, which;
  if (task.priority === "urgent") {
    priorityImage = "img/Prio-urgent-white.png";
    priorityText = "Urgent";
    backgroundColor = "rgb(255, 61, 0)";
    which = 'urgent'
  } else if (task.priority === "medium") {
    priorityImage = "img/Prio-medium-white.png";
    priorityText = "Medium";
    backgroundColor = "rgb(255, 168, 0)";
    which = 'medium'
  } else {
    priorityImage = "img/Prio-low-white.png";
    priorityText = "Low";
    backgroundColor = "rgb(122, 226, 41)";
    which = 'low'
  }
  return { priorityImage, priorityText, backgroundColor, which};
}

/**
 * Creates Tasks
 * @param {Status} status 
 * @returns ""
 */
function createTask(status) {
  const title = document.getElementById("title"); const description = document.getElementById("description"); const date = document.getElementById("date"); const categoryText = document.getElementById("categoryText").innerHTML; const categoryColor = document.getElementById("selectColorBox");
  let checkCategory = getSelectetCategory(categoryText);
  let selectedContacts = getSelectedContacts();
  let priority = clickedId;
  if (checkPrioritySelected()) {
    return;
  }
  let allTask = {id: allTasks.length, title: title.value, description: description.value, categoryText: categoryText, categoryColor: categoryColor.style.backgroundColor, date: date.value, priority: priority, status: status, subtask: allSubtask, contacts: selectedContacts,};
  showPopup();
  allTasks.push(allTask);
  save();
  allSubtask = [];
  clearTask();
}

/**
 * @returns Selectet Category
 */
function getSelectetCategory(){
  const myForm = document.getElementById('myForm');
  let div = document.getElementById(`categoryTextBox`);
  if(div.innerHTML.includes("<p>Select task category</p>")){
    let errorMessage = document.getElementById("assigned-error-Catergory");
    errorMessage.textContent = "Please select at least one Category.";
    errorMessage.style.color = "red";
    myForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    return ;
  }
}

/**
 * Selects Contacts
 * @returns selected Contacts
 */
function getSelectedContacts() {
  const myForm = document.getElementById('myForm');
  let selectedContacts = [];
  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    let errorMessage = document.getElementById("assigned-error");
    errorMessage.textContent = "Please select at least one contact.";
    errorMessage.style.color = "red";
    myForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    return selectedContacts;
  }
  checkboxes.forEach((checkbox) => {
    let contactId = checkbox.id.replace("contact", "");
    selectedContacts.push(allContacts[contactId]);
  });
  return selectedContacts;
}

/**
 * Checks priority
 * @returns true/false
 */
function checkPrioritySelected() {
  if (!clickedId) {
    removeEventListener()
    document.getElementById(
      "prioBoxAlarm"
    ).innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
    return true;
  }
  return false;
}

/**
 * Clears tasks
 */
function clearTask() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const alarmbox = document.getElementById("prioBoxAlarm");
  const subtask = document.getElementById("subtask");
  const subtaskDescription = document.getElementById("subTaskDescription");
  alarmbox.innerHTML = ``;
  title.value = ``;
  description.value = ``;
  subtask.value = ``;
  subtaskDescription.innerHTML = ``;
  startNewFunctionsclear(currentElement);
}

/**
 * Starts new functions
 * @param {currentElement} currentElement 
 */
function startNewFunctionsclear(currentElement){
  setCurrentDate();
  clearCategory();
  clearDropBoxAssigned();
  resetElement(currentElement);
}

/**
 * Resets Element
 * @param {currentElement} currentElement 
 */
function resetElement(currentElement) {
  if (currentElement !== null) {
    currentElement.style.backgroundColor = "";
    resetImage(currentElement);
    currentElement = null;
    clickedId = null;
  }
}

/**
 * Clears categories
 */
function clearCategory() {
  let category = document.getElementById("category");
  category.innerHTML = `<div id="categoryTextBox" class="categoryTextBox"><p>Select task category</p></div><div><img src="img/arrowTask.svg"></div>`;
}

/**
 * Opens task container
 * @param {Status} status 
 */
function openAddTaskContainer(status) {
  let popupAddTaskContainer = document.getElementById("popupAddTaskContainer");
  popupAddTaskContainer.innerHTML = ``;
  popupAddTaskContainer.innerHTML += popupAddTaskContainerTemplate(status);
  renderCategory();
  renderColorCategory();
  slideAnimation();
}

/**
 * Slides animation
 */
function slideAnimation() {
  let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
  let overlayDiv = document.createElement("div");
  mainAddTaskContainer.style.transform = "translateX(150%)";
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  setCurrentDate();
  setTimeout(function () {
    mainAddTaskContainer.style.transform = "translate(0%)";
  }, 100);
}

/**
 * Selects color
 * @param {User} name 
 * @returns Color
 */
function getRandomColor(name) {
  let User = users.find(u => u.name == name);
  if(User){
    let color = User['color'];
    return color;
  }
  return 'rgb(211,211,211)'
}

/**
 * Show card
 * @param {Id} taskId 
 */
async function showCard(taskId) {
  document.getElementById('body').style.overflow = 'hidden';
  let screenWidth = window.innerWidth;
  if (screenWidth >= 769) {
    await showCardPopup(taskId);
  } else {
    showCardMainBoard(taskId);
  }
}

/**
 * Shows popup card
 * @param {Id} taskId 
 */
async function showCardPopup(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let overlayDiv = document.createElement("div");
  let popupCard = document.getElementById("popupContainer");
  let { priorityImage, priorityText, backgroundColor } =
    await checkPrioPopupCard(task);
  let subtask = generateSubtaskHtml(task, taskId);
  let assignedContactsHtml = task.contacts
    .map((contact) => generateInitialsAndFullName(contact))
    .join("");
  overlayDiv.classList.add("overlay");
  document.body.appendChild(overlayDiv);
  popupCard.innerHTML = generatePopupCardHtml(task,taskId,subtask,backgroundColor,priorityText,priorityImage,assignedContactsHtml);
}
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("overlay")) {
    closePopupCard();
  }
});

/**
 * Shows boardcards
 * @param {Id} taskId 
 */
function showCardMainBoard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let showMainBoardContainer = document.getElementById("showMainBoardContainer");
  let mainBoardContainer = document.getElementById("mainBoardContainer");
  let Image = CheckImagePrioagain(task);
  let Text = CheckTextPrioagain(task);
  let background = CheckBackgroundPrioagain(task);
  let subtask = generateSubtaskHtml(task, taskId);
  let assignedContactsHtml = task.contacts
    .map((contact) => generateInitialsAndFullName(contact))
    .join("");
  mainBoardContainer.style.display = "none";
  showMainBoardContainer.innerHTML = generateShowCardHtml(task,taskId,subtask,background,Text,Image,assignedContactsHtml);
}

/**
 * @param {Task} task 
 * @returns Backgroundcolor 
 */
function CheckBackgroundPrioagain(task){
  if (task.priority === "urgent") {
    priorityB = "rgb(255, 61, 0)";;
  } else if (task.priority === "medium") {
    priorityB = "rgb(255, 168, 0)";
  } else {
    priorityB = "rgb(122, 226, 41)";
  }
  return priorityB;
}

/**
 * @param {Task} task 
 * @returns Text
 */
function CheckTextPrioagain(task){
  if (task.priority === "urgent") {
    priorityText = "Urgent";
  } else if (task.priority === "medium") {
    priorityText = "Medium";
  } else {
    priorityText = "Low";
  }
  return priorityText;
}

/**
 * @param {Task} task 
 * @returns Image
 */
function CheckImagePrioagain(task){
  if (task.priority === "urgent") {
    priorityImage = "img/Prio-urgent-white.png";
  } else if (task.priority === "medium") {
    priorityImage = "img/Prio-medium-white.png";
  } else {
    priorityImage = "img/Prio-low-white.png";
  }
  return priorityImage;
}

/**
 * Generates subtask html
 * @param {Task} task 
 * @param {Id} taskId 
 * @returns subtaskHtml
 */
function generateSubtaskHtml(task, taskId) {
  let subtaskHtml = "";
  if (task.subtask && task.subtask.length > 0) {
    for (let i = 0; i < task.subtask.length; i++) {
      let checkboxId = `checkbox-${taskId}-${i}`;
      let checkedAttribute =
        task.subtaskChecked && task.subtaskChecked[i] ? "checked" : "";
      subtaskHtml += SubtaskHTMLgerate(checkboxId,checkedAttribute,taskId,i,task);
    }
  }
  return subtaskHtml;
}

/**
 * 
 * @param {Id} taskId 
 * @param {Index} subtaskIndex 
 */
function updateProgress(taskId, subtaskIndex) {
  let task = allTasks.find((task) => task.id === taskId);
  if (!task.subtaskChecked) {
    task.subtaskChecked = [];
  }
  task.subtaskChecked[subtaskIndex] = !task.subtaskChecked[subtaskIndex];
  renderBoardCards();
  save();
}

/**
 * Saves checkbockes
 * @param {Id} taskId 
 * @param {Index} subtaskIndex 
 */
function saveCheckboxState(taskId, subtaskIndex) {
  let checkboxId = `checkbox-${taskId}-${subtaskIndex}`;
  let checkbox = document.getElementById(checkboxId);
  let task = allTasks.find((task) => task.id === taskId);
  if (!task.subtaskChecked) {
    task.subtaskChecked = [];
  }
  task.subtaskChecked[subtaskIndex] = checkbox.checked;
  setItem("allTasks", JSON.stringify(allTasks));
}

/**
 * Renders category
 */
async function renderCategory() {
  await load();
  let categoryBox = document.getElementById("categoryBox");
  categoryBox.innerHTML = "";
  for (let i = 0; i < allCategory.length; i++) {
    const category = allCategory[i].category;
    const color = allCategory[i].color;
    categoryBox.innerHTML += `<div class="colorCategoryBox" onclick="selectCategory(${i})" id="selectCategory${i}"><div id="categoryText">${category}</div><div class="selectColorBox" id="selectColorBox" style="background-color:${color};"></div></div>`;
  }
}

/**
 * Renders all users
 * @param {Id} taskId 
 */
function renderAllContacts(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  dropDownUser.innerHTML = "";
  for (let i = 0; i < allContacts.length; i++) {
    const name = allContacts[i];
    const isChecked = selectedContacts.includes(name) ? "checked" : ""; 
    dropDownUser.innerHTML += `<div class="contactBox"><input type="checkbox" id="contact${i}" name="contact${i}" ${isChecked} onchange="saveSelectedContact(${i})"><label for="contact${i}">${name}</label></div>`;
  }
  markMatchingContacts(taskId);
}

/**
 * Selects popup categories
 * @param {index} i 
 */
function selectPopupCategory(i) {
  let sourceDiv = document.getElementById(`selectPopupCategory${i}`);
  let targetDiv = document.getElementById(`popupcardCategory`);
  let backgroundColor = sourceDiv.style.backgroundColor;
  targetDiv.innerHTML = sourceDiv.innerHTML;
  targetDiv.style.backgroundColor = backgroundColor;
  setPopupCategoryCard();
  popupCategoryBox.innerHTML = ``;
}

/**
 * Edits functions
 * @param {Id} taskId 
 */
async function editPopupCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let popupCard = document.getElementById("popupContainer");
  let wichPrio = await checkPrioPopupCard(task);
  popupCard.innerHTML = generateEditPopupCardHtml(task, taskId, today);
  renderAllContacts(taskId);
  checkPrioboxforedit(wichPrio);
}

function checkPrioboxforedit(wichPrio){
  if(wichPrio.which == "urgent"){
    checkpriobox('urgent');
  }else if(wichPrio.which == "medium"){
    checkpriobox('medium');
  }else{
    checkpriobox('low');
  }
}

/**
 * Edits cards
 * @param {Id} taskId 
 */
async function editShowCard(taskId) {
  let task = allTasks.find((task) => task.id === taskId);
  let today = new Date();
  let showCard = document.getElementById("showCard");
  let wichPrio = await checkPrioPopupCard(task);
  showCard.innerHTML = generateEditShowCardHtml(task, taskId, today, showCard);
  renderAllContacts(taskId);
  checkPrioboxforedit(wichPrio);
}

/**
 * Gets categorys text
 * @param {Task} task 
 * @param {Default element} defaultTextElementId 
 * @returns text
 */
function getCategoryText(task, defaultTextElementId) {
  let textElement = document.getElementById(defaultTextElementId);
  let text;
  if (textElement && textElement.textContent) {
    text = textElement.textContent;
  } else {
    text = task.categoryText;
  }
  return text;
}

/**
 * Gets color to category
 * @param {Task} task 
 * @param {Default color} defaultColorElementId 
 * @returns color
 */
function getCategoryColor(task, defaultColorElementId) {
  let colorElement = document.getElementById(defaultColorElementId);
  let color;
  if (colorElement && colorElement.style.backgroundColor) {
    color = colorElement.style.backgroundColor;
  } else {
    color = task.categoryColor;
  }
  return color;
}

/**
 * Updates tasks
 * @param {All tasks} allTasks 
 * @param {Id} taskId 
 * @param {Updated tasks} updatedTask 
 */
function updateTaskInArray(allTasks, taskId, updatedTask) {
  let taskIndex = allTasks.findIndex((task) => task.id === taskId);
  allTasks.splice(taskIndex, 1, updatedTask);
  setItem("allTasks", JSON.stringify(allTasks));
}

/**
 * Drag & drop
 * @param {Status} status 
 */
function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  save();
  renderBoardCards();
}

/**
 * Moves to status
 * @param {Id} taskId 
 * @param {Status} status 
 */
function moveToStatus(taskId, status) {
  allTasks[taskId].status = status;
  save();
  renderBoardCards();
  closeShowCard();
}

/**
 * New category
 */
function newCategory() {
  let categoryContainer = document.getElementById("categoryContainer");
  let newCategoryContainer = document.getElementById("newCategoryContainer");
  let categoryColors = document.getElementById("categoryColors");
  renderColorCategory();
  newCategoryClass(categoryContainer,newCategoryContainer,categoryColors);
}

/**
 * Loads function
 */
async function load() {
  let allCategoryInString = await getItem("allCategory");
  allCategory = JSON.parse(allCategoryInString) || [];
  let allTaskInString = await getItem("allTasks");
  allTasks = JSON.parse(allTaskInString) || [];
}

/**
 * Saves function
 */
async function save() {
  await setItem("allTasks", JSON.stringify(allTasks));
  await setItem("allCategory", JSON.stringify(allCategory));
}

/**
 * Opens dropbox
 * @param {Id} taskId 
 */
function openDropBoxAssigned(taskId) {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  renderAllContacts(taskId);
  if (dropDownUser.classList.contains("d-none")) {
    dropUser(dropDownUser,childUserContainer);
  } else {
    dropUserElse(dropDownUser,childUserContainer);
  }
}

/**
 * Opens category from dropbox
 */
function openDropBoxCategory() {
  let dropDownBox = document.getElementById("newCategoryBox");
  let childTaskContainer = document.getElementById("category");
  let categoryBox = document.getElementById("categoryBox");
  renderCategory();
  if (dropDownBox.classList.contains("d-none")) {
    dropDownBoxDnone(dropDownBox,childTaskContainer,categoryBox);
  } else {
    dropDownBoxElse(dropDownBox,childTaskContainer,categoryBox)
  }
}

/**
 * Cleares dropbox
 */
function clearDropBoxAssigned() {
  let dropDownUser = document.getElementById("dropDownUser");
  let childUserContainer = document.getElementById("assigned");
  selectedContacts = [];
  dropDownUser.classList.add("d-none");
  dropDownUser.classList.remove("dropDownBox");
  childUserContainer.classList.remove("b-none");
}

/**
 * Resets image
 * @param {Box} box 
 */
function resetImage(box) {
  const img = box.querySelector("img");
  const defaultImg = img.dataset.defaultImg;
  img.src = defaultImg;
}

/**
 * Current element
 * @param {Element} element 
 */
function ifcurrentElement(element){
  element.style.backgroundColor = "";
  resetImage(element);
  currentElement = null;
  clickedId = null;
}

/**
 * Styles current element
 */
function ifcurrentElementNull(){
  currentElement.style.backgroundColor = "";
  resetImage(currentElement);
}

/**
 * Checks priority box
 * @param {Id} elementId 
 */
function checkpriobox(elementId) {
  let element = document.getElementById(elementId);
  let mobile = document.getElementById('popupPrioBox');
  if (currentElement === element) {
    ifcurrentElement(element)
  } else {
    if (currentElement !== null) {
      ifcurrentElementNull()
    }
    prio(elementId,element);
    currentElement = element;
    clickedId = elementId;
  }
}