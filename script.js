/* apps loaded */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("fade-out");
  }, 3000); // 3 seconds
});
// script.js
const monthSelect = document.getElementById("monthSelect");
const calendar = document.getElementById("calendar");
const themeToggle = document.getElementById("themeToggle");
const modal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");
const tagSelect = document.getElementById("tagSelect");
const selectedDateText = document.getElementById("selectedDateText");
const saveTask = document.getElementById("saveTask");
const deleteTask = document.getElementById("deleteTask");
const closeModal = document.getElementById("closeModal");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

let selectedDate = null;
const months = [
  { name: "January", days: 31 },
  { name: "February", days: 28 },
  { name: "March", days: 31 },
  { name: "April", days: 30 },
  { name: "May", days: 31 },
  { name: "June", days: 30 },
  { name: "July", days: 31 },
  { name: "August", days: 31 },
  { name: "September", days: 30 },
  { name: "October", days: 31 },
  { name: "November", days: 30 },
  { name: "December", days: 31 },
];

// Load months
months.forEach((month, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = month.name;
  monthSelect.appendChild(option);
});

monthSelect.addEventListener("change", () => {
  const monthIndex = parseInt(monthSelect.value);
  let days = months[monthIndex].days;
  const year = new Date().getFullYear();
  if (monthIndex === 1 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) days = 29;
  renderCalendar(monthIndex, days);
});

function renderCalendar(month, days) {
  calendar.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("studyTasks") || "{}");
  let doneCount = 0;

  for (let i = 1; i <= days; i++) {
    const dayBox = document.createElement("div");
    dayBox.className = "day";
    dayBox.textContent = i;

    const key = `${month + 1}-${i}`;
    if (saved[key]) {
      dayBox.classList.add("done");
      if (saved[key].tag) dayBox.classList.add(saved[key].tag);
      doneCount++;
    }

    dayBox.addEventListener("click", () => {
      selectedDate = key;
      selectedDateText.textContent = `Day ${i}, ${months[month].name}`;
      taskInput.value = saved[key]?.text || "";
      tagSelect.value = saved[key]?.tag || "";
      modal.style.display = "flex";
    });

    calendar.appendChild(dayBox);
  }

  const percent = Math.round((doneCount / days) * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `Progress: ${percent}%`;
}

// Modal Actions
saveTask.onclick = () => {
  const saved = JSON.parse(localStorage.getItem("studyTasks") || "{}");
  saved[selectedDate] = {
    text: taskInput.value.trim(),
    tag: tagSelect.value
  };
  localStorage.setItem("studyTasks", JSON.stringify(saved));
  modal.style.display = "none";
  monthSelect.dispatchEvent(new Event("change"));
};

deleteTask.onclick = () => {
  const saved = JSON.parse(localStorage.getItem("studyTasks") || "{}");
  delete saved[selectedDate];
  localStorage.setItem("studyTasks", JSON.stringify(saved));
  modal.style.display = "none";
  monthSelect.dispatchEvent(new Event("change"));
};

closeModal.onclick = () => modal.style.display = "none";

// Theme Toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
};


// Default load
monthSelect.value = new Date().getMonth();
monthSelect.dispatchEvent(new Event("change"));
