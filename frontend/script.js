const API_URL = '/api/tasks';
const taskList = document.getElementById('taskList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const emptyState = document.getElementById('emptyState');

function showLoading(show) {
    loading.style.display = show ? '' : 'none';
}
function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = msg ? '' : 'none';
}
function showEmpty(show) {
    emptyState.style.display = show ? '' : 'none';
}

async function fetchTasks() {
    showLoading(true);
    showError('');
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const tasks = await res.json();
        renderTasks(tasks);
    } catch (err) {
        showError(err.message);
        renderTasks([]);
    } finally {
        showLoading(false);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    if (!tasks.length) {
        showEmpty(true);
        return;
    }
    showEmpty(false);
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex align-items-center' + (task.completed ? ' completed' : '');
        li.innerHTML = `
            <span>${task.title}</span>
            <button class="btn btn-success btn-sm ms-auto" ${task.completed ? 'disabled' : ''} title="Mark as completed">
                <i class="bi bi-check-lg"></i>
            </button>
        `;
        const btn = li.querySelector('button');
        btn.addEventListener('click', () => completeTask(task._id));
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', async e => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    showLoading(true);
    showError('');
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        if (!res.ok) throw new Error('Failed to add task');
        taskInput.value = '';
        fetchTasks();
    } catch (err) {
        showError(err.message);
    } finally {
        showLoading(false);
    }
});

async function completeTask(id) {
    showLoading(true);
    showError('');
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'PUT' });
        if (!res.ok) throw new Error('Failed to update task');
        fetchTasks();
    } catch (err) {
        showError(err.message);
    } finally {
        showLoading(false);
    }
}

// Initial load
fetchTasks();