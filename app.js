// Elements
const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const themeSelector = document.getElementById("themeSelector");
const pseudoInput = document.getElementById("pseudoInput");
const userName = document.getElementById("userName");
const savePseudoBtn = document.getElementById("savePseudoBtn");

// Toggle menu
hamburger.addEventListener("click", () => {
  sideMenu.classList.toggle("visible");
});

// Load saved data
window.addEventListener("DOMContentLoaded", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const theme = localStorage.getItem("theme") || "light";
  const pseudo = localStorage.getItem("pseudo") || "toi";

  document.body.classList.add(`theme-${theme}`);
  themeSelector.value = theme;
  pseudoInput.value = pseudo;
  userName.textContent = pseudo;

  savedTasks.forEach(task => renderTask(task));
});

// Add new task
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = taskDate.value;
  if (!text || !date) return;

  const task = { text, date };
  renderTask(task);
  saveTask(task);
  taskForm.reset();

  scheduleReminder(task);
});

// Save task to localStorage
function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render task in list
function renderTask({ text, date }) {
  const li = document.createElement("li");
  li.innerHTML = `${text} <small>${date}</small> <button onclick="this.parentElement.remove(); removeTask('${text}', '${date}')">✖</button>`;
  taskList.appendChild(li);
}

// Remove task
function removeTask(text, date) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filtered = tasks.filter(t => !(t.text === text && t.date === date));
  localStorage.setItem("tasks", JSON.stringify(filtered));
}

// Theme change
themeSelector.addEventListener("change", e => {
  document.body.className = '';
  const theme = e.target.value;
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem("theme", theme);
});

// Pseudo save
savePseudoBtn.addEventListener("click", () => {
  const pseudo = pseudoInput.value.trim();
  if (!pseudo) return;
  localStorage.setItem("pseudo", pseudo);
  userName.textContent = pseudo;
  alert("✅ Pseudo sauvegardé !");
});

// Reminder alert
function scheduleReminder(task) {
  const now = new Date();
  const taskDate = new Date(task.date);
  const delay = taskDate.getTime() - now.getTime();

  if (delay > 0 && delay < 86400000) { // < 24h
    setTimeout(() => {
      alert(`⏰ N'oublie pas : ${task.text}`);
    }, delay);
  }
}
