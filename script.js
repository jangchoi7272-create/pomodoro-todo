// ===== 타이머 =====
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const sessionCountEl = document.getElementById('sessionCount');
const alarmSound = document.getElementById('alarmSound');

let currentMode = 'focus';
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let intervalId = null;
let sessionCount = Number(localStorage.getItem('sessionCount') || 0);

sessionCountEl.textContent = sessionCount;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  document.title = `${formatTime(remainingSeconds)} - 포모도로`;
}

function setMode(mode, minutes) {
  currentMode = mode;
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;
  updateDisplay();
  modeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setMode(btn.dataset.mode, Number(btn.dataset.min));
  });
});

function tick() {
  remainingSeconds--;
  updateDisplay();
  if (remainingSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    alarmSound.play().catch(() => {});
    if (currentMode === 'focus') {
      sessionCount++;
      localStorage.setItem('sessionCount', sessionCount);
      sessionCountEl.textContent = sessionCount;
    }
    alert(currentMode === 'focus' ? '집중 끝! 잠깐 쉬어가요 ☕' : '휴식 끝! 다시 집중해볼까요? 💪');
  }
}

startBtn.addEventListener('click', () => {
  if (intervalId) return;
  intervalId = setInterval(tick, 1000);
  startBtn.disabled = true;
  pauseBtn.disabled = false;
});

pauseBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  remainingSeconds = totalSeconds;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

updateDisplay();

// ===== 할 일 목록 =====
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = todo.text;
    span.addEventListener('click', () => {
      todos[index].done = !todos[index].done;
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  todos.push({ text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
});

renderTodos();
