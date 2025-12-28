"use strict";
/* Selecting Elements */
const appContainer = document.querySelector(".container");
const searchInput = document.querySelector(".textInput");
const addButton = document.querySelector(".addButton");
const taskContainer = document.querySelector(".taskContainer");
const searchBarContainer = document.querySelector(".searchBar");
const deleteAllContainer = document.querySelector(".deleteAllContainer");
const deleteAllButton = document.querySelector(".deleteAll");
const filterTasksContainer = document.querySelector(".filterTasks");
const hidden = document.querySelector(".hidden");
const taskInputInterface = document.querySelector(".hidden");
const toDoFilterbutton = document.querySelector(".toDo");
const completedFilterButton = document.querySelector(".completed");
const allFilterButton = document.querySelector(".all");

/* Html Function */
const taskContentHtml = function (title, description, key, done) {
  return `<div class="taskItem" data-key="${key}">
  <input name="checkbox" type="checkbox" class='task' ${done ? "checked" : ""}/>
  <div class="taskContent">
  <h3>${title}</h3>
  <p style='white-space:pre-wrap' class=${done ? "done" : ""}>${description}</p>
  </div>
  <button class='deleteTask material-symbols-outlined'>delete</button>
  </div>`;
};

/* Add task function */
const addTask = function (title, description) {
  const uniqueKey = Date.now();
  /* const html = `<div class="taskItem" data-key="${uniqueKey}">
  <input name="checkbox" type="checkbox" class='task' />
  <div class="taskContent">
  <h3>${title}</h3>
  <p>${description}</p>
  </div>
  <button class='deleteTask'>Delete</button>
  </div>`; */

  if (!description || !title) return; //If title or Description input field is empty exit fhe function

  //Covert Local Storage text to LowerCase
  const taskLowerCase = Object.values(localStorage).map((el) =>
    JSON.parse(el).text.toLowerCase()
  );
  //Covert Local Storage titles to LowerCase
  const titleLowerCase = Object.values(localStorage).map((el) =>
    JSON.parse(el).title.toLowerCase()
  );

  //Check if the text exist. If yes exist exit function
  if (
    taskLowerCase.includes(description.toLowerCase()) ||
    titleLowerCase.includes(title.toLowerCase())
  ) {
    alert(
      `${
        taskLowerCase.includes(description.toLowerCase())
          ? "Description"
          : "Title"
      } already exist.`
    );

    description = "";
    title = "";
    return;
  }

  // Push element into local storage
  localStorage.setItem(
    `${uniqueKey}`,
    JSON.stringify({ title: title, text: description, done: false })
  );
  //Push into the DOM //
  taskContainer.insertAdjacentHTML(
    "beforeend",
    taskContentHtml(title, description, uniqueKey)
  );

  description = "";
  title = "";
  hideShowDeleteAllBtn();
  const message = document.querySelector(".message");
  taskContainer.contains(message) ? message.remove() : "";
};

/* Remove task Function */
const removeTask = function (e) {
  if (e.target.classList.contains("deleteTask")) {
    localStorage.removeItem(e.target.parentElement.dataset.key);
    e.target.parentElement.remove();
    hideShowDeleteAllBtn();
    updateEmptyState();
  }
};

/* Mark Task as done */
const markAsDone = function (e) {
  if (e.target.classList.contains("task")) {
    const taskText = e.target.parentElement.querySelector("p");
    const taskTitle = e.target.parentElement.querySelector("h3");

    taskText.classList.toggle("done");
    taskTitle.classList.toggle("done");
    const getKey = e.target.parentElement.dataset.key;
    const taskDone = JSON.parse(localStorage.getItem(getKey));
    if (taskText.classList.contains("done")) {
      taskDone.done = true;
      localStorage.setItem(getKey, JSON.stringify(taskDone));
    } else {
      taskDone.done = false;
      localStorage.setItem(getKey, JSON.stringify(taskDone));
    }
  }
};

/* Delete all Item */
const deleteAll = function (e) {
  if (e.target.classList.contains("deleteAll")) {
    taskContainer.textContent = "";
    localStorage.clear();
  }
  hideShowDeleteAllBtn();
  updateEmptyState();
};

/* Hide / Show DeleteAll Button */
const hideShowDeleteAllBtn = function () {
  const hidden =
    taskContainer.children.length <= 1 ? "display: none" : "display: block";
  deleteAllButton.setAttribute("style", hidden);
};

/* GET ALL TASKS */
const getAllTasks = function () {
  const indexLocalStorage = Object.keys(localStorage).sort(); //Get Key values from local Storage
  for (const key of indexLocalStorage) {
    const value = JSON.parse(localStorage.getItem(key));

    taskContainer.insertAdjacentHTML(
      "beforeend",
      taskContentHtml(value.title, value.text, key, value.done)
    );
  }

  hideShowDeleteAllBtn();
  updateEmptyState();
};

/* FILTER TASK: TODO / COMPLETED */
const filterTask = function (isCompleted) {
  const indexLocalStorage = Object.keys(localStorage).sort(); //Get Key values from local Storage
  indexLocalStorage
    .filter((el) => {
      const item = localStorage.getItem(el);
      /*  if (!item) return false; */
      return JSON.parse(item).done === isCompleted;
    })
    .forEach((el) => {
      const value = JSON.parse(localStorage.getItem(el));

      taskContainer.insertAdjacentHTML(
        "beforeend",
        taskContentHtml(value.title, value.text, el, value.done)
      );
    });
};

/* Open Task Interface */
const taskInterface = function () {
  hidden.classList.add("taskInputInterface");
  hidden.classList.remove("hidden");
  taskContainer.classList.add("hidden");
  deleteAllContainer.classList.add("hidden");
};
/* Close Task Interface */
const closeTaskInterface = function () {
  taskInputInterface.classList.add("hidden");
  taskInputInterface.classList.remove("taskInputInterface");
  taskContainer.classList.remove("hidden");
  deleteAllContainer.classList.remove("hidden");
  appContainer.classList.remove("hidden");
};

/* Search Task: filters and displays tasks that match the search input */
const searchTask = function () {
  // Clear the task container before displaying search results
  taskContainer.textContent = "";

  // Get all keys from localStorage and sort them
  const key = Object.keys(localStorage).sort();

  // Get the search text from the input and convert to lowercase
  const text = searchInput.value.toLowerCase();

  // Filter keys to find tasks whose title or description includes the search text
  key
    .filter((el) => {
      const value = JSON.parse(localStorage.getItem(el));
      // Check if either the title or description contains the search text
      if (
        value.title.toLowerCase().includes(text) ||
        value.text.toLowerCase().includes(text)
      ) {
        return value;
      }
    })
    .forEach((el) => {
      // For each matching task, get its data
      const value = JSON.parse(localStorage.getItem(el));
      const { title, text, done } = value;

      // Insert the filtered task into the DOM
      taskContainer.insertAdjacentHTML(
        "beforeend",
        taskContentHtml(title, text, el, done)
      );
    });
};
/* If no task yet, add message: "No task yet" */
const updateEmptyState = function () {
  const html = `<div class='message' style="text-align: center">
          <h3>No task yet</h3>
          <p style='color: grey'>Add you first task to get started!</p>
        </div>`;
  if (taskContainer.children.length === 0) {
    taskContainer.insertAdjacentHTML("beforeend", html);
  }
};

/* FilterTask:  Active Button */
const activeFilterButton = function (all, toDo, completed) {
  all.classList.add("active");
  toDo.classList.contains("active") ? toDo.classList.remove("active") : "";
  completed.classList.contains("active")
    ? completed.classList.remove("active")
    : "";
};

function app() {
  /* Retrieve All value from local Storage */
  getAllTasks();

  console.log(document.querySelectorAll(".filter"));

  /* EVENT LISTENER  */
  searchInput.addEventListener("keyup", searchTask);

  searchBarContainer.addEventListener("click", (e) => {
    if (e.target.className === "addButton") {
      let taskTitle = document.querySelector(".titleInput");
      let taskDescription = document.querySelector(".descriptionInput");
      taskTitle.value = "";
      taskDescription.value = "";
      appContainer.classList.add("hidden");
      taskInterface();
    }
  });

  taskContainer.addEventListener("click", removeTask);

  taskContainer.addEventListener("click", markAsDone);

  deleteAllContainer.addEventListener("click", deleteAll);

  filterTasksContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("all")) {
      taskContainer.textContent = "";
      activeFilterButton(
        allFilterButton,
        toDoFilterbutton,
        completedFilterButton
      );
      getAllTasks();
    }

    if (e.target.classList.contains("toDo")) {
      taskContainer.textContent = "";

      activeFilterButton(
        toDoFilterbutton,
        allFilterButton,
        completedFilterButton
      );
      filterTask(false);
    }
    if (e.target.classList.contains("completed")) {
      taskContainer.textContent = "";
      activeFilterButton(
        completedFilterButton,
        allFilterButton,
        toDoFilterbutton
      );
      filterTask(true);
    }
  });

  taskInputInterface.addEventListener("click", (e) => {
    if (e.target.classList.contains("addTask")) {
      let taskTitle = document.querySelector(".titleInput").value.trim();
      let taskDescription = document
        .querySelector(".descriptionInput")
        .value.trim();
      addTask(taskTitle, taskDescription);
      closeTaskInterface();
    }
    if (e.target.classList.contains("closeButton")) {
      closeTaskInterface();
    }
  });
}

app();
