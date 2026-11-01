(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector("#theme-toggle");
  const menuToggle = document.querySelector("#menu-toggle");
  const mainNav = document.querySelector("#main-nav");
  const projectsGrid = document.querySelector("#projects-grid");
  const filters = document.querySelector("#project-filters");
  const searchInput = document.querySelector("#project-search");
  const emptyState = document.querySelector("#empty-state");

  const iconArrow = '<span class="card-arrow" aria-hidden="true">↗</span>';

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    themeToggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
    themeToggle.setAttribute("title", dark ? "Ativar tema claro" : "Ativar tema escuro");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", dark ? "#171a17" : "#f5f4ef");
  }

  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("bb-portfolio-theme") || "light";
  } catch (_) {
    savedTheme = "light";
  }
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("bb-portfolio-theme", nextTheme); } catch (_) { /* armazenamento opcional */ }
  });

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
    mainNav.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
  let activeFilter = "todos";
  let searchTerm = "";

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function projectCard(project, index) {
    const tags = project.tags.map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("");
    const action = project.link
      ? `<a class="project-action" href="${escapeHTML(project.link)}" target="_blank" rel="noopener noreferrer">Ver projeto ${iconArrow}</a>`
      : `<span class="project-action project-action-muted">${escapeHTML(project.linkLabel || project.status)}</span>`;
    return `
      <article class="project-card reveal" style="--card-index:${index}">
        <div class="project-art art-${escapeHTML(project.visual)}">
          <span class="art-grain" aria-hidden="true"></span>
          <span class="art-mark">${escapeHTML(project.mark)}</span>
          <span class="art-category">${escapeHTML(project.categoryLabel)}</span>
          <span class="art-year">${escapeHTML(project.year)}</span>
          <span class="art-orbit orbit-one" aria-hidden="true"></span>
          <span class="art-orbit orbit-two" aria-hidden="true"></span>
        </div>
        <div class="project-card-body">
          <div class="project-meta"><span>${escapeHTML(project.categoryLabel)}</span><span class="project-status">${escapeHTML(project.status)}</span></div>
          <h3>${escapeHTML(project.title)}</h3>
          <p class="project-description">${escapeHTML(project.description)}</p>
          <div class="tag-list">${tags}</div>
          ${action}
        </div>
      </article>`;
  }

  function renderProjects() {
    const filtered = projects.filter((project) => {
      const matchesCategory = activeFilter === "todos" || project.category === activeFilter;
      const haystack = `${project.title} ${project.description} ${project.tags.join(" ")} ${project.categoryLabel}`.toLowerCase();
      return matchesCategory && haystack.includes(searchTerm);
    });
    projectsGrid.innerHTML = filtered.map(projectCard).join("");
    emptyState.hidden = filtered.length > 0;
    document.querySelectorAll("[data-count='todos']").forEach((node) => { node.textContent = projects.length; });
    observeReveals(projectsGrid);
  }

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll("button").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    renderProjects();
  });

  searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderProjects();
  });

  function renderLab() {
    const lab = Array.isArray(window.portfolioLab) ? window.portfolioLab : [];
    document.querySelector("#lab-list").innerHTML = lab.map((item, index) => `
      <a class="lab-item reveal" href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer">
        <span class="lab-number">0${index + 1}</span>
        <span class="lab-main"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.description)}</span></span>
        <span class="lab-tags">${escapeHTML(item.tags)}</span>
        <span class="lab-arrow" aria-hidden="true">↗</span>
      </a>`).join("");
  }

  let revealObserver;
  function observeReveals(scope = document) {
    const elements = scope.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    }
    elements.forEach((element) => revealObserver.observe(element));
  }

  const yearNode = document.querySelector("#current-year");
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  renderProjects();
  renderLab();
  observeReveals();
})();
