const { SUPABASE_ANON_KEY, SUPABASE_URL } = window.AI_STUDY_CONFIG || {};

const DEMO_PROJECTS = [
  {
    id: "steal-bomb-game",
    title: "스틸 & 밤",
    category: "게임",
    description: "섯다 족보, 폭탄 회피, 카드 스틸을 결합한 2~8인용 웹 미니게임 프로토타입입니다.",
    link: "https://taeu0102.github.io/ai-study-portal/steal-bomb-game/",
    status: "공개",
    updated_at: "2026-07-04",
    tests: 0,
    icon: "bomb",
  },
];

const isConfigured =
  SUPABASE_URL?.startsWith("https://") && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR_");
const supabaseClient = isConfigured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const state = {
  projects: [],
  selectedCategory: "전체",
  search: "",
  sort: "latest",
  session: null,
  isAdmin: false,
  loading: true,
};

const els = {
  projectGrid: document.querySelector("#projectGrid"),
  categoryTabs: document.querySelector("#categoryTabs"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  clearFiltersButton: document.querySelector("#clearFiltersButton"),
  metricTotal: document.querySelector("#metricTotal"),
  metricCategories: document.querySelector("#metricCategories"),
  metricTests: document.querySelector("#metricTests"),
  adminDrawer: document.querySelector("#adminDrawer"),
  openAdminButton: document.querySelector("#openAdminButton"),
  closeAdminButton: document.querySelector("#closeAdminButton"),
  closeAdminBackdrop: document.querySelector("#closeAdminBackdrop"),
  loginPanel: document.querySelector("#loginPanel"),
  cmsPanel: document.querySelector("#cmsPanel"),
  authMessage: document.querySelector("#authMessage"),
  adminEmail: document.querySelector("#adminEmail"),
  adminPassword: document.querySelector("#adminPassword"),
  adminEmailLabel: document.querySelector("#adminEmailLabel"),
  adminAvatar: document.querySelector("#adminAvatar"),
  logoutButton: document.querySelector("#logoutButton"),
  projectForm: document.querySelector("#projectForm"),
  projectId: document.querySelector("#projectId"),
  projectTitle: document.querySelector("#projectTitle"),
  projectCategory: document.querySelector("#projectCategory"),
  projectDescription: document.querySelector("#projectDescription"),
  projectLink: document.querySelector("#projectLink"),
  projectStatus: document.querySelector("#projectStatus"),
  resetFormButton: document.querySelector("#resetFormButton"),
  adminTable: document.querySelector("#adminTable"),
  projectDialog: document.querySelector("#projectDialog"),
  closeDialogButton: document.querySelector("#closeDialogButton"),
  dialogContent: document.querySelector("#dialogContent"),
};

async function init() {
  if (!isConfigured) {
    state.projects = DEMO_PROJECTS;
    state.loading = false;
    setAuthMessage("config.js에 Supabase URL과 anon key를 넣으면 운영 인증이 활성화됩니다.", "warning");
    render();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  state.session = data.session;
  await refreshAdminState();
  await loadProjects();

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    await refreshAdminState();
    await loadProjects();
    render();
  });
}

async function refreshAdminState() {
  state.isAdmin = false;
  if (!supabaseClient || !state.session?.user) return;

  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("user_id,email")
    .eq("user_id", state.session.user.id)
    .maybeSingle();

  state.isAdmin = Boolean(data && !error);
}

async function loadProjects() {
  state.loading = true;
  renderProjects();

  if (!supabaseClient) {
    state.projects = DEMO_PROJECTS;
    state.loading = false;
    render();
    return;
  }

  const query = supabaseClient
    .from("projects")
    .select("id,title,category,description,link,status,updated_at,tests,icon")
    .order("updated_at", { ascending: false });

  const { data, error } = state.isAdmin ? await query : await query.eq("status", "공개");

  if (error) {
    state.projects = [];
    setAuthMessage(`데이터를 불러오지 못했습니다: ${error.message}`, "danger");
  } else {
    state.projects = data || [];
  }

  state.loading = false;
  render();
}

function getFilteredProjects() {
  const keyword = state.search.trim().toLowerCase();
  const visible = state.projects.filter((project) => {
    const matchesCategory = state.selectedCategory === "전체" || project.category === state.selectedCategory;
    const matchesKeyword =
      !keyword ||
      project.title.toLowerCase().includes(keyword) ||
      project.description.toLowerCase().includes(keyword) ||
      project.category.toLowerCase().includes(keyword);

    return matchesCategory && matchesKeyword;
  });

  return visible.sort((a, b) => {
    if (state.sort === "popular") return Number(b.tests || 0) - Number(a.tests || 0);
    if (state.sort === "title") return a.title.localeCompare(b.title, "ko");
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
}

function render() {
  renderMetrics();
  renderTabs();
  renderProjects();
  renderAdmin();
  refreshIcons();
}

function renderMetrics() {
  const publicProjects = state.projects.filter((project) => project.status === "공개");
  const categories = new Set(publicProjects.map((project) => project.category));
  const tests = publicProjects.reduce((sum, project) => sum + Number(project.tests || 0), 0);

  els.metricTotal.textContent = publicProjects.length;
  els.metricCategories.textContent = categories.size;
  els.metricTests.textContent = tests.toLocaleString("ko-KR");
}

function renderTabs() {
  const categories = ["전체", ...new Set(state.projects.map((project) => project.category))];
  els.categoryTabs.innerHTML = categories
    .map(
      (category) => `
        <button class="tab-button ${category === state.selectedCategory ? "active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `,
    )
    .join("");
}

function renderProjects() {
  if (state.loading) {
    els.projectGrid.innerHTML = `<div class="empty-state">결과물을 불러오는 중입니다.</div>`;
    return;
  }

  const projects = getFilteredProjects();
  if (projects.length === 0) {
    els.projectGrid.innerHTML = `<div class="empty-state">조건에 맞는 결과물이 없습니다.</div>`;
    return;
  }

  els.projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <div>
            <div class="preview">
              <i data-lucide="${project.icon || "boxes"}" aria-hidden="true"></i>
            </div>
            <div class="card-top">
              <span class="badge">${escapeHtml(project.category)}</span>
              ${renderStatus(project.status)}
            </div>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <div class="meta-row">
              <span class="badge">${formatDate(project.updated_at)}</span>
              <span class="badge">${Number(project.tests || 0).toLocaleString("ko-KR")} tests</span>
            </div>
          </div>
          <div class="card-actions">
            <a class="primary-button" href="${project.link}" target="_blank" rel="noreferrer">
              <i data-lucide="play"></i>
              테스트하기
            </a>
            <button class="secondary-button" type="button" data-detail="${project.id}">
              <i data-lucide="panel-top-open"></i>
              사용법
            </button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderStatus(status) {
  const className =
    status === "공개" ? "status-public" : status === "검토중" ? "status-review" : "status-private";
  return `<span class="badge ${className}">${escapeHtml(status)}</span>`;
}

function renderAdmin() {
  els.loginPanel.hidden = state.isAdmin;
  els.cmsPanel.hidden = !state.isAdmin;

  if (state.session?.user?.email) {
    els.adminEmail.value = state.session.user.email;
  }

  if (!state.isAdmin) {
    if (state.session && !state.loading) {
      setAuthMessage("로그인은 되었지만 관리자 권한이 없습니다. admin_users에 계정을 추가하세요.", "danger");
    }
    return;
  }

  const email = state.session.user.email || "관리자";
  els.adminEmailLabel.textContent = email;
  els.adminAvatar.textContent = email.slice(0, 2).toUpperCase();
  els.adminTable.innerHTML = state.projects
    .map(
      (project) => `
        <tr>
          <td>
            <strong>${escapeHtml(project.title)}</strong>
            <br />
            <span class="muted">${escapeHtml(project.category)}</span>
          </td>
          <td>${renderStatus(project.status)}</td>
          <td>
            <div class="table-actions">
              <button type="button" data-edit="${project.id}" aria-label="수정">
                <i data-lucide="pencil"></i>
              </button>
              <button type="button" data-delete="${project.id}" aria-label="삭제">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

function openAdmin() {
  els.adminDrawer.classList.add("open");
  els.adminDrawer.setAttribute("aria-hidden", "false");
  renderAdmin();
  refreshIcons();
}

function closeAdmin() {
  els.adminDrawer.classList.remove("open");
  els.adminDrawer.setAttribute("aria-hidden", "true");
}

function resetForm() {
  els.projectId.value = "";
  els.projectTitle.value = "";
  els.projectCategory.value = "챗봇";
  els.projectDescription.value = "";
  els.projectLink.value = "https://example.com/";
  els.projectStatus.value = "공개";
  els.projectTitle.focus();
}

function fillForm(project) {
  els.projectId.value = project.id;
  els.projectTitle.value = project.title;
  els.projectCategory.value = project.category;
  els.projectDescription.value = project.description;
  els.projectLink.value = project.link;
  els.projectStatus.value = project.status;
}

async function handleProjectSubmit(event) {
  event.preventDefault();
  if (!guardAdmin()) return;

  const id = els.projectId.value || undefined;
  const existing = state.projects.find((project) => project.id === id);
  const payload = {
    title: els.projectTitle.value.trim(),
    category: els.projectCategory.value,
    description: els.projectDescription.value.trim(),
    link: els.projectLink.value.trim(),
    status: els.projectStatus.value,
    updated_at: new Date().toISOString(),
    tests: Number(existing?.tests || 0),
    icon: existing?.icon || iconForCategory(els.projectCategory.value),
  };

  const request = id
    ? supabaseClient.from("projects").update(payload).eq("id", id).select().single()
    : supabaseClient.from("projects").insert(payload).select().single();

  const { error } = await request;
  if (error) {
    setAuthMessage(`저장 실패: ${error.message}`, "danger");
    return;
  }

  setAuthMessage("저장했습니다.", "success");
  resetForm();
  await loadProjects();
}

function openDialog(projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) return;

  els.dialogContent.innerHTML = `
    <div class="dialog-body">
      <div class="preview">
        <i data-lucide="${project.icon || "boxes"}" aria-hidden="true"></i>
      </div>
      <div>
        <div class="dialog-meta">
          <span class="badge">${escapeHtml(project.category)}</span>
          ${renderStatus(project.status)}
          <span class="badge">${formatDate(project.updated_at)}</span>
        </div>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.description)}</p>
      </div>
      <div class="dialog-meta">
        <span class="badge">입력 확인</span>
        <span class="badge">결과 검수</span>
        <span class="badge">피드백 반영</span>
      </div>
      <a class="primary-button" href="${project.link}" target="_blank" rel="noreferrer">
        <i data-lucide="external-link"></i>
        테스트하기
      </a>
    </div>
  `;

  els.projectDialog.showModal();
  refreshIcons();
}

async function deleteProject(projectId) {
  if (!guardAdmin()) return;

  const { error } = await supabaseClient.from("projects").delete().eq("id", projectId);
  if (error) {
    setAuthMessage(`삭제 실패: ${error.message}`, "danger");
    return;
  }

  setAuthMessage("삭제했습니다.", "success");
  await loadProjects();
}

function guardAdmin() {
  if (!isConfigured || !supabaseClient) {
    setAuthMessage("먼저 config.js에 Supabase 설정을 입력하세요.", "danger");
    return false;
  }

  if (!state.isAdmin) {
    setAuthMessage("관리자 권한이 필요합니다.", "danger");
    return false;
  }

  return true;
}

function iconForCategory(category) {
  return {
    챗봇: "messages-square",
    자동화: "workflow",
    문서: "file-text",
    데이터: "chart-no-axes-combined",
    프롬프트: "sparkles",
  }[category] || "boxes";
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function setAuthMessage(message, type = "info") {
  els.authMessage.textContent = message;
  els.authMessage.dataset.type = type;
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

els.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProjects();
  refreshIcons();
});

els.sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProjects();
  refreshIcons();
});

els.categoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.selectedCategory = button.dataset.category;
  render();
});

els.clearFiltersButton.addEventListener("click", () => {
  state.selectedCategory = "전체";
  state.search = "";
  state.sort = "latest";
  els.searchInput.value = "";
  els.sortSelect.value = "latest";
  render();
});

els.projectGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-detail]");
  if (!detailButton) return;
  openDialog(detailButton.dataset.detail);
});

els.openAdminButton.addEventListener("click", openAdmin);
els.closeAdminButton.addEventListener("click", closeAdmin);
els.closeAdminBackdrop.addEventListener("click", closeAdmin);
els.closeDialogButton.addEventListener("click", () => els.projectDialog.close());

els.loginPanel.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isConfigured || !supabaseClient) {
    setAuthMessage("config.js에 Supabase URL과 anon key를 먼저 입력하세요.", "danger");
    return;
  }

  setAuthMessage("로그인 중입니다.", "info");
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: els.adminEmail.value.trim(),
    password: els.adminPassword.value,
  });

  if (error) {
    setAuthMessage(`로그인 실패: ${error.message}`, "danger");
    els.adminPassword.focus();
    return;
  }

  els.adminPassword.value = "";
  setAuthMessage("로그인했습니다.", "success");
});

els.logoutButton.addEventListener("click", async () => {
  if (supabaseClient) await supabaseClient.auth.signOut();
  state.session = null;
  state.isAdmin = false;
  resetForm();
  await loadProjects();
});

els.projectForm.addEventListener("submit", handleProjectSubmit);
els.resetFormButton.addEventListener("click", resetForm);

els.adminTable.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const project = state.projects.find((item) => item.id === editButton.dataset.edit);
    if (project) fillForm(project);
  }

  if (deleteButton) {
    deleteProject(deleteButton.dataset.delete);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAdmin();
});

init();
