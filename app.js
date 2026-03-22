import { CEREBRAS_API_KEY } from "./cerebras-config.js";

const storageKey = "smart-todo-local-state";

const state = {
  aiDrafts: [],
  aiSummary: "",
  chatMessages: [
    {
      role: "assistant",
      content: "Hi! I can summarize paragraphs, help plan tasks, or just chat with you.",
    },
  ],
  todos: [],
};

const els = {
  chatForm: document.querySelector("#chat-form"),
  chatInput: document.querySelector("#chat-input"),
  chatLog: document.querySelector("#chat-log"),
  plannerAddAll: document.querySelector("#planner-add-all"),
  plannerDrafts: document.querySelector("#planner-drafts"),
  plannerInput: document.querySelector("#planner-input"),
  plannerStatus: document.querySelector("#planner-status"),
  plannerSubmit: document.querySelector("#planner-submit"),
  todoCount: document.querySelector("#todo-count"),
  todoExtra: document.querySelector("#todo-extra"),
  todoForm: document.querySelector("#todo-form"),
  todoList: document.querySelector("#todo-list"),
  todoTitle: document.querySelector("#todo-title"),
  toggleExtra: document.querySelector("#toggle-extra"),
};

loadLocalState();
renderTodos();
renderChat();
renderPlannerDrafts();
attachEvents();

function attachEvents() {
  els.todoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = els.todoTitle.value.trim();
    const extraInfo = els.todoExtra.value.trim();

    if (!title) {
      return;
    }

    upsertTodo({
      id: crypto.randomUUID(),
      title,
      extraInfo,
      createdAt: new Date().toISOString(),
    });

    els.todoForm.reset();
    els.todoExtra.classList.add("hidden");
    saveLocalState();
  });

  els.toggleExtra.addEventListener("click", () => {
    els.todoExtra.classList.toggle("hidden");
    if (!els.todoExtra.classList.contains("hidden")) {
      els.todoExtra.focus();
    }
  });

  els.plannerSubmit.addEventListener("click", async () => {
    const text = els.plannerInput.value.trim();
    if (!text) {
      setPlannerStatus("Add some text first.");
      return;
    }

    setPlannerStatus("Summarizing and building tasks...");

    try {
      const response = await askCerebras([
        {
          role: "system",
          content:
            "You turn raw user text into a concise JSON object with this exact shape: {\"summary\":\"...\",\"tasks\":[{\"title\":\"...\",\"extraInfo\":\"...\"}]}. Put useful paragraph details into each task's extraInfo, but keep extraInfo very short and easy to understand, ideally one brief sentence or phrase. Include only the most important context, constraints, or next-step note. Return only valid JSON with double-quoted keys and strings. Do not use markdown code fences. Keep titles practical and short.",
        },
        {
          role: "user",
          content: text,
        },
      ]);

      const parsed = safeJsonParse(response);

      if (!parsed || !Array.isArray(parsed.tasks)) {
        throw new Error("The AI response was not valid task JSON.");
      }

      state.aiSummary = parsed.summary || "";
      state.aiDrafts = parsed.tasks
        .filter((task) => task.title)
        .map((task) => ({
          id: crypto.randomUUID(),
          title: String(task.title).slice(0, 120),
          extraInfo: buildExtraInfo(task.extraInfo, parsed.summary, text),
          createdAt: new Date().toISOString(),
        }));

      renderPlannerDrafts();
      setPlannerStatus(
        state.aiSummary || `Prepared ${state.aiDrafts.length} AI task${state.aiDrafts.length === 1 ? "" : "s"}.`,
      );
    } catch (error) {
      setPlannerStatus(error.message || "Could not create tasks right now.");
    }
  });

  els.plannerAddAll.addEventListener("click", () => {
    if (!state.aiDrafts.length) {
      return;
    }

    state.todos = sortTodos([...state.aiDrafts, ...state.todos]);
    state.aiDrafts = [];
    state.aiSummary = "";
    els.plannerInput.value = "";
    renderTodos();
    renderPlannerDrafts();
    setPlannerStatus("Added the AI tasks to your list.");
    saveLocalState();
  });

  els.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const text = els.chatInput.value.trim();
    if (!text) {
      return;
    }

    appendChatMessage("user", text);
    els.chatInput.value = "";

    try {
      const response = await askCerebras([
        {
          role: "system",
          content:
            "You are a warm, concise assistant inside a todo app. You can summarize paragraphs, answer simple questions, and keep replies practical.",
        },
        ...state.chatMessages,
      ]);

      appendChatMessage("assistant", response);
    } catch (error) {
      appendChatMessage("assistant", `I hit a problem: ${error.message}`);
    }
  });
}

function upsertTodo(todo) {
  state.todos = sortTodos([todo, ...state.todos.filter((item) => item.id !== todo.id)]);
  renderTodos();
}

function sortTodos(todos) {
  return todos
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function renderTodos() {
  els.todoList.innerHTML = "";

  if (!state.todos.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No todos yet. Add one above or use the AI planner.";
    els.todoList.append(empty);
  }

  state.todos.forEach((todo, index) => {
    const item = document.createElement("article");
    item.className = "todo-item";
    item.style.setProperty("--stagger", `${index * 60}ms`);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      state.todos = state.todos.filter((item) => item.id !== todo.id);
      renderTodos();
      saveLocalState();
    });

    const layout = document.createElement("div");
    layout.className = "todo-layout";

    const label = document.createElement("label");
    label.className = "todo-main";
    label.append(checkbox);

    const textWrap = document.createElement("div");
    textWrap.className = "todo-copy";

    const title = document.createElement("div");
    title.className = "todo-title";
    title.textContent = todo.title;
    textWrap.append(title);

    if (todo.extraInfo) {
      const extra = document.createElement("p");
      extra.className = "todo-extra";
      extra.textContent = todo.extraInfo;
      textWrap.append(extra);
    }

    label.append(textWrap);

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "ghost-button small-button";
    editButton.textContent = "Edit";

    const editor = document.createElement("div");
    editor.className = "todo-editor hidden";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.maxLength = 120;
    titleInput.value = todo.title;

    const extraInput = document.createElement("textarea");
    extraInput.maxLength = 500;
    extraInput.value = todo.extraInfo || "";

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "primary-button small-button";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
      todo.title = titleInput.value.trim() || todo.title;
      todo.extraInfo = extraInput.value.trim();
      renderTodos();
      saveLocalState();
    });

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.className = "ghost-button small-button";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", () => {
      renderTodos();
    });

    editButton.addEventListener("click", () => {
      editor.classList.toggle("hidden");
      editButton.textContent = editor.classList.contains("hidden") ? "Edit" : "Hide";
    });

    editor.append(titleInput, extraInput, saveButton, cancelButton);
    actions.append(editButton);
    layout.append(label, actions);
    item.append(layout, editor);
    els.todoList.append(item);
  });

  els.todoCount.textContent = `${state.todos.length} task${state.todos.length === 1 ? "" : "s"}`;
}

function renderPlannerDrafts() {
  els.plannerDrafts.innerHTML = "";

  if (!state.aiDrafts.length) {
    els.plannerAddAll.classList.add("hidden");
    return;
  }

  if (state.aiSummary) {
    const summary = document.createElement("div");
    summary.className = "draft-summary";
    summary.textContent = state.aiSummary;
    els.plannerDrafts.append(summary);
  }

  state.aiDrafts.forEach((todo, index) => {
    const draft = document.createElement("article");
    draft.className = "draft-item";
    draft.style.setProperty("--stagger", `${index * 50}ms`);

    const title = document.createElement("div");
    title.className = "todo-title";
    title.textContent = todo.title;

    const extra = document.createElement("p");
    extra.className = "todo-extra";
    extra.textContent = todo.extraInfo;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "ghost-button small-button";
    addButton.textContent = "Add this task";
    addButton.addEventListener("click", () => {
      state.todos = sortTodos([todo, ...state.todos]);
      state.aiDrafts = state.aiDrafts.filter((item) => item.id !== todo.id);
      renderTodos();
      renderPlannerDrafts();
      saveLocalState();
    });

    draft.append(title, extra, addButton);
    els.plannerDrafts.append(draft);
  });

  els.plannerAddAll.classList.remove("hidden");
}

function appendChatMessage(role, content) {
  state.chatMessages.push({ role, content });
  state.chatMessages = state.chatMessages.slice(-12);
  renderChat();
}

function renderChat() {
  els.chatLog.innerHTML = "";

  state.chatMessages.forEach((message, index) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${message.role}`;
    bubble.style.setProperty("--stagger", `${index * 40}ms`);
    bubble.textContent = message.content;
    els.chatLog.append(bubble);
  });

  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function saveLocalState() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      todos: sortTodos(state.todos),
    }),
  );
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      state.todos = [];
      return;
    }

    const parsed = JSON.parse(raw);
    state.todos = Array.isArray(parsed.todos) ? sortTodos(parsed.todos) : [];
  } catch {
    state.todos = [];
  }
}

async function askCerebras(messages) {
  const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CEREBRAS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.1-8b",
      messages,
    }),
  });

  const raw = await response.text();
  const data = raw ? safeJsonParseLoose(raw) : null;

  if (!response.ok) {
    throw new Error(
      data?.detail?.message ||
        data?.error ||
        raw ||
        "AI request failed while calling Cerebras directly.",
    );
  }

  if (!data) {
    throw new Error("The AI service returned an empty response.");
  }

  return data.choices?.[0]?.message?.content?.trim() || "No response received.";
}

function safeJsonParse(text) {
  const normalized = extractJsonString(text);

  try {
    const parsed = JSON.parse(normalized);
    return normalizePlannerPayload(parsed);
  } catch {
    return null;
  }
}

function safeJsonParseLoose(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractJsonString(text) {
  const trimmed = String(text || "").trim();

  if (!trimmed) {
    return "";
  }

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    return fenceMatch[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

function normalizePlannerPayload(parsed) {
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
  const tasks = Array.isArray(parsed.tasks)
    ? parsed.tasks
        .map((task) => {
          if (typeof task === "string") {
            return {
              title: task.trim(),
              extraInfo: "",
            };
          }

          if (!task || typeof task !== "object") {
            return null;
          }

          return {
            title: String(task.title || "").trim(),
            extraInfo: String(task.extraInfo || "").trim(),
          };
        })
        .filter((task) => task && task.title)
    : [];

  return {
    summary,
    tasks,
  };
}

function buildExtraInfo(extraInfo, summary, paragraph) {
  const parts = [String(extraInfo || "").trim(), String(summary || "").trim()].filter(Boolean);
  const combined = parts.join(" ");

  if (combined) {
    return combined.slice(0, 160);
  }

  return String(paragraph || "").trim().slice(0, 160);
}

function setPlannerStatus(message) {
  els.plannerStatus.textContent = message;
}
