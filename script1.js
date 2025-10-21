const taskInput = document.querySelector('#task-input');
const moodSelect = document.querySelector('#mood-select');
const addBtn = document.querySelector('#add-btn');
const taskList = document.querySelector('#task-list');
const moodStats = document.querySelector('#mood-stats');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Color palette for each mood
const moodColors = {
  happy: "#ffeaa7",
  calm: "#81ecec",
  stressed: "#fab1a0",
  excited: "#74b9ff",
};

// Render all tasks
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task';
    if (task.completed) li.classList.add('completed');
    li.style.borderLeft = `5px solid ${moodColors[task.mood]}`;

    const span = document.createElement('span');
    span.textContent = `${task.emoji} ${task.text}`;
    span.addEventListener('click', () => toggleTask(index));

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '🗑';
    removeBtn.addEventListener('click', () => removeTask(index));

    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
  updateStats();
  updateTheme();
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  const mood = moodSelect.value;
  if (!text) return;

  const emoji = moodSelect.options[moodSelect.selectedIndex].text.split(' ')[0];
  tasks.push({ text, mood, emoji, completed: false });
  taskInput.value = '';
  renderTasks();
});

// Toggle task completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();

  // Fun animation when completed
  if (tasks[index].completed) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.textContent = '✨';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 500);
  }
}

// Remove a task
function removeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Update mood statistics
function updateStats() {
  const counts = {};
  tasks.forEach(t => counts[t.mood] = (counts[t.mood] || 0) + 1);
  const summary = Object.keys(counts)
    .map(mood => `${mood} (${counts[mood]})`)
    .join(' | ') || "No tasks yet.";
  moodStats.textContent = summary;
}

// Update background color based on dominant mood
function updateTheme() {
  if (tasks.length === 0) {
    document.body.style.background = 'linear-gradient(135deg, #74b9ff, #a29bfe)';
    return;
  }
  let dominant = tasks.reduce((a, b) => (a.count > b.count ? a : b));
  const topMood = tasks[0].mood;
  document.body.style.background = `linear-gradient(135deg, ${moodColors[topMood]}, #6c5ce7)`;
}

// Initial render
renderTasks();
