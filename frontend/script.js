const API_URL = "http://localhost:5000/tasks";

async function loadTasks() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  data.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task.title}
      <div>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>`;
    list.appendChild(li);
  });
}

async function addTask() {
  const title = document.getElementById("taskTitle").value;
  if (!title) return alert("Enter a task!");

  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ title })
  });
  document.getElementById("taskTitle").value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

async function analyzeTasks() {
  const res = await fetch("http://127.0.0.1:5001/analyze");
  const data = await res.json();
  document.getElementById("analysisResult").innerHTML = `📊 ${data.message}`;
}

loadTasks();
