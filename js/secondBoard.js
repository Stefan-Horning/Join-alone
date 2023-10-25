/**
 * closeNewCategoryfunction
 */
function closeNewCategoryfunction(categoryContainer,newCategoryContainer,childTaskContainer,dropDownBox,categoryColors,categoryBox){
    categoryBox.classList.add("d-none");
    categoryBox.classList.remove("categoryBox");
    categoryColors.classList.add("d-none");
    categoryColors.classList.remove("colorsContainer");
    categoryContainer.classList.remove("d-none");
    newCategoryContainer.classList.add("d-none");
    childTaskContainer.classList.remove("b-none");
    dropDownBox.classList.add("d-none");
    dropDownBox.classList.remove("dropDownBox");
}
/**
 * closeNewCategory
 */
function closeNewCategory() {
    let categoryContainer = document.getElementById("categoryContainer");
    let newCategoryContainer = document.getElementById("newCategoryContainer");
    let dropDownBox = document.getElementById("newCategoryBox");
    let childTaskContainer = document.getElementById("category");
    let categoryColors = document.getElementById("categoryColors");
    let categoryBox = document.getElementById("categoryBox");
    closeNewCategoryfunction(categoryContainer,newCategoryContainer,childTaskContainer,dropDownBox,categoryColors,categoryBox);
    clearCategory();
}
/**
 * dropDownBoxElse
 */
function dropDownBoxElse(dropDownBox,childTaskContainer,categoryBox){
    dropDownBox.classList.add("d-none");
    dropDownBox.classList.remove("newCategoryBox");
    childTaskContainer.classList.remove("b-none");
    categoryBox.classList.add("d-none");
    categoryBox.classList.remove("categoryBox");
}
/**
 * dropDownBoxDnone
 */
function dropDownBoxDnone(dropDownBox,childTaskContainer,categoryBox){
    dropDownBox.classList.remove("d-none");
    dropDownBox.classList.add("newCategoryBox");
    childTaskContainer.classList.add("b-none");
    categoryBox.classList.remove("d-none");
    categoryBox.classList.add("categoryBox");
}
/**
 * showPopup
 */
function showPopup() {
    const popup = document.querySelector(".popupAddTaskBoard");
    popup.style.transform = "translate(-50%, -50%)";
    setTimeout(hidePopup, 1000);
}
/**
 * hidePopup
 */
function hidePopup() {
    const popup = document.querySelector(".popupAddTaskBoard");
    popup.style.transform = "translate(-50%, 500%)";
    window.location.href = "board.html";
}
/**
 * setCurrentDate
 */
function setCurrentDate() {
    const dateInput = document.getElementById("date");
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    currentDate(year,month,day,dateInput);
}
/**
 * Set Current Date
 */
function currentDate(year,month,day,dateInput){
    const currentDate = year + "-" + month + "-" + day;
    dateInput.min = currentDate;
    dateInput.value = currentDate;
}
/**
 * set priority
 */
function prio(elementId,element){
    if (elementId === "urgent") {
      element.style.backgroundColor = "rgb(255, 61, 0)";
      element.querySelector("img").src = "img/Prio-urgent-white.png";
    } else if (elementId === "medium") {
      element.style.backgroundColor = "rgb(255, 168, 0)";
      element.querySelector("img").src = "img/Prio-medium-white.png";
    } else if (elementId === "low") {
      element.style.backgroundColor = "rgb(122, 226, 41)";
      element.querySelector("img").src = "img/Prio-low-white.png";
    }
}
/**
 * push to Subtasks
 */
function pushSubtask() {
    let subtaskElements = document.querySelectorAll(".subBox");
    let subtaskInfo = [];
    for (let i = 0; i < subtaskElements.length; i++) {
      subtaskInfo.push(subtaskElements[i].innerHTML);
    }
    allSubtask = subtaskInfo;
}
/**
 * add to Subtasks
 */
function addSubtask() {
    let subtask = document.getElementById("subtask").value;
    if (subtask.trim() !== "") {
      document.getElementById(
        "subTaskDescription"
      ).innerHTML += `<div class="checkContainer"><input type="checkbox"><div class="subBox">${subtask}</div></div>`;
      document.getElementById("subtask").value = ``;
      pushSubtask();
    }
}
/**
 * drop down Users
 */
function dropUser(dropDownUser,childUserContainer){
    dropDownUser.classList.remove("d-none");
    dropDownUser.classList.add("dropDownBox");
    childUserContainer.classList.add("b-none");
}
/**
 * drop down else User
 */
function dropUserElse(dropDownUser,childUserContainer){
    dropDownUser.classList.add("d-none");
    dropDownUser.classList.remove("dropDownBox");
    childUserContainer.classList.remove("b-none");
}
/**
 * highlight
 */
function highlight(id) {
    document.getElementById(id).classList.add("box-highlight");
}
/**
 * removeHighlight
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("box-highlight");
}
/**
 * startDragging
 */
function startDragging(id) {
    currentDraggedElement = id;
}
/**
 * allowDrop
 */
function allowDrop(ev) {
    ev.preventDefault();
}
/**
 * delete Card (PopUp)
 */
function deletePopupCard(taskId) {
    const taskIndex = allTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      allTasks.splice(taskIndex, 1);
      for (let i = 0; i < allTasks.length; i++) {
        allTasks[i].id = i;
      }
      save();
      renderBoardCards();
      closePopupCard();
      closeShowCard();
      load();
    }
}
/**
 * add New Category
 */
async function addNewCategory() {
    let newCategory = document.getElementById("inputCategory").value;
    let colorBox = document.getElementById("colorBox");
    let selectedColor = colorBox.querySelector(".selected-color");
    let newColor = selectedColor.getAttribute("data-color");
    allCategory.push({ category: newCategory, color: newColor });
    await save();
    document.getElementById("inputCategory").value = ``;
    closeNewCategory();
    renderCategory();
    openDropBoxCategory();
}
/**
 * selectColor
 */
function selectColor(i) {
    let colorBox = document.getElementById("colorBox");
    colorBox.innerHTML = "";
    let selectedColor = document.createElement("div");
    selectedColor.style.backgroundColor = allColors[i];
    selectedColor.setAttribute("data-color", allColors[i]);
    selectedColor.classList.add("selected-color");
    colorBox.appendChild(selectedColor);
}
/**
 * newCategoryClass
 */
function newCategoryClass(categoryContainer,newCategoryContainer,categoryColors){
    categoryContainer.classList.add("d-none");
    newCategoryContainer.classList.remove("d-none");
    categoryColors.classList.remove("d-none");
    categoryColors.classList.add("colorsContainer");
    document.getElementById("newCategoryContainer").innerHTML = newCategoryHtml();
}
/**
 * close ShowCard
 */
function closeShowCard() {
    let showMainBoardContainer = document.getElementById("showMainBoardContainer");
    let mainBoardContainer = document.getElementById("mainBoardContainer");
    document.getElementById('body').style.overflow = 'scroll';
    mainBoardContainer.style.display = "block";
    showMainBoardContainer.innerHTML = "";
    renderBoardCards();
}
/**
 * close PopupCard
 */
function closePopupCard() {
    document.getElementById('body').style.overflow = 'auto';
    let popupCard = document.getElementById("popupContainer");
    let overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      document.body.removeChild(overlayDiv);
    }
    popupCard.innerHTML = "";
    renderBoardCards();
}
/**
 * selectCategory
 */
function selectCategory(i) {
    let sourceDiv = document.getElementById(`selectCategory${i}`);
    let targetDiv = document.getElementById(`categoryTextBox`);
    targetDiv.innerHTML = sourceDiv.innerHTML;
    sourceDiv.parentNode.removeChild(sourceDiv);
    openDropBoxCategory();
}
/**
 * @returns Save Popup
 */
function savePopupCard(taskId) {
    let task = allTasks.find((task) => task.id === taskId);
    let title = document.getElementById("popupCardTitle").value;
    let description = document.getElementById("popupcardDescription").value;
    let date = document.getElementById("popupCardDate").value;
    let categoryText = getCategoryText(task, "categoryPopupText");
    let categoryColor = getCategoryColor(task, "selectColorBox");
    let selectedContacts = getSelectedContacts();
    let priority = clickedId;
    if (!clickedId) {
      document.getElementById("prioBoxAlarm").innerHTML = `<div class="alarmBoxPrio">Select a priority!</div>`;
      return;
    }
    upadateValuePopUp(task,title,description,date,categoryText,categoryColor,selectedContacts,priority)
    startOtherFunctions(allTasks,taskId,task,currentElement);
}
/**
 * Upadate Popup
 */
function upadateValuePopUp(task,title,description,date,categoryText,categoryColor,selectedContacts,priority){
    task.title = title;
    task.description = description;
    task.date = date;
    task.categoryText = categoryText;
    task.categoryColor = categoryColor;
    task.priority = priority;
    task.contacts = selectedContacts;
}
/**
 * startOtherFunctions
 */
function startOtherFunctions(allTasks,taskId,task,currentElement){
    updateTaskInArray(allTasks, taskId, task);
    resetElement(currentElement);
    closePopupCard();
    closeShowCard();
}
/**
 * @returns Popup category
 */
function setPopupCategoryCard() {
    let popupCategoryBox = document.getElementById("popupCategoryBox");
    if (popupCategoryBox.innerHTML !== "") {
      popupCategoryBox.innerHTML = "";
      return;
    }
    for (let i = 0; i < allCategory.length; i++) {
      const category = allCategory[i].category;
      const color = allCategory[i].color;
      popupCategoryBox.innerHTML += `<div class="colorPopupCategoryBox" style="background-color:${color}" onclick="selectPopupCategory(${i})" id="selectPopupCategory${i}"><div id="categoryPopupText">${category}</div><div class="selectColorBox" id="selectColorBox" style="background-color:${color};"></div></div>`;
    }
}
/**
 * Matching Contacts
 */
function markMatchingContacts(taskId) {
    const task = allTasks.find((task) => task.id === taskId);
    if (task) {
      const taskContacts = task.contacts;
      for (let i = 0; i < allContacts.length; i++) {
        const contact = allContacts[i];
        const checkboxId = `contact${i}`;
        const checkbox = document.getElementById(checkboxId);
        if (taskContacts.includes(contact)) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
        }
      }
    }
}
/**
 * saveSelectedContact
 */
function saveSelectedContact(index) {
    const checkbox = document.getElementById(`contact${index}`);
    const contactName = allContacts[index];
    if (checkbox.checked) {
      selectedContacts.push(contactName);
    } else {
      const contactIndex = selectedContacts.indexOf(contactName);
      if (contactIndex !== -1) {
        selectedContacts.splice(contactIndex, 1);
      }
    }
}
/**
 * @returns HTML div
 */
function generateInitials(name) {
    const names = name.substring(0, name.indexOf(" ")).charAt(0);
    const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);
    const initialsBackgroundColor = initialsColors[name] || getRandomColor(name);
    initialsColors[name] = initialsBackgroundColor;
    return `<div class="initialsSecond" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div>`;
}
/**
 * @returns HTML div
 */
function generateInitialsAndFullName(name) {
    const names = name.substring(0, name.indexOf(" ")).charAt(0);
    const lastnames = name.substring(name.indexOf(" ") + 1).charAt(0);
    const initialsBackgroundColor = initialsColors[name] || getRandomColor();
    initialsColors[name] = initialsBackgroundColor;
    return `<div class="initialsNameBox"><div class="initials" id="initials" style="background-color:${initialsBackgroundColor}">${names}${lastnames}</div><div id="initialsName">${name}</div></div>`;
}
/**
 * closePopupTaskCard
 */
function closePopupTaskCard() {
    let mainAddTaskContainer = document.querySelector(".mainAddTaskContainer");
    let overlayDiv = document.querySelector(".overlay");
    document.body.removeChild(overlayDiv);
    mainAddTaskContainer.classList.remove("open");
    mainAddTaskContainer.classList.add("d-none");
}