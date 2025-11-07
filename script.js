// Simple Todo app (vanilla JS). Stores todos in localStorage under key 'todos_v1'
(() => {
  const KEY = "todos_v1";
  const newTodo = document.getElementById("newTodo");
  const addBtn = document.getElementById("addBtn");
  const list = document.getElementById("todoList");
  const countEl = document.getElementById("count");
  const clearCompleted = document.getElementById("clearCompleted");
  const filters = document.querySelectorAll(".filter");
  let todos = [];
  let filter = "all";

  function save() {
    localStorage.setItem(KEY, JSON.stringify(todos));
  }
  function load() {
    try {
      todos = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch (e) {
      todos = [];
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }


  function render() {
    list.innerHTML = "";
    const visible = todos.filter((t) =>
      filter === "all" ? true : filter === "active" ? !t.done : t.done
    );

    visible.forEach((t) => list.appendChild(createItem(t)));
    const remaining = todos.filter((t) => !t.done).length;
    countEl.textContent = `${remaining} item${remaining !== 1 ? "s" : ""}`;
  }


  function createItem(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " completed" : "");
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      save();
      render();
    });

    const title = document.createElement("div");
    title.className = "title";
    title.tabIndex = 0;
    title.textContent = todo.text;
    // double click to edit
    title.addEventListener("dblclick", () => startEdit(title, todo));

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.title = "Edit";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => startEdit(title, todo));

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.title = "Delete";
    delBtn.textContent = "🗑️";
    delBtn.addEventListener("click", () => {
      todos = todos.filter((x) => x.id !== todo.id);
      save();
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    return li;
  }

  function startEdit(titleEl, todo) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = todo.text;
    input.className = "edit-input";
    titleEl.replaceWith(input);
    input.focus();
    input.select();
    function finish() {
      const v = input.value.trim();
      if (!v) {
        todos = todos.filter((x) => x.id !== todo.id);
      } else {
        todo.text = v;
      }
      save();
      render();
    }
    input.addEventListener("blur", finish);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finish();
      if (e.key === "Escape") {
        render();
      }
    });
  }

  function addTodo(text) {
    const t = { id: uid(), text: text.trim(), done: false };
    todos.unshift(t);
    save();
    render();
  }

  addBtn.addEventListener("click", () => {
    const v = newTodo.value.trim();
    if (!v) return;
    addTodo(v);
    newTodo.value = "";
    newTodo.focus();
  });
  newTodo.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  clearCompleted.addEventListener("click", () => {
    todos = todos.filter((t) => !t.done);
    save();
    render();
  });

  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filter = btn.dataset.filter;
      render();
    })
  );

  // init
  load();
  render();
})();
