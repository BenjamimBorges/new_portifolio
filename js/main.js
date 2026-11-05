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
  const projectDialog = document.querySelector("#project-dialog");
  const demoDialog = document.querySelector("#demo-dialog");
  const projects = Array.isArray(window.portfolioProjects) ? window.portfolioProjects : [];
  const demos = Array.isArray(window.portfolioDemos) ? window.portfolioDemos : [];
  let activeFilter = "todos";
  let searchTerm = "";

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function applyTheme(theme) {
    root.dataset.theme = theme === "dark" ? "dark" : "light";
    const dark = root.dataset.theme === "dark";
    themeToggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
    themeToggle.title = dark ? "Ativar tema claro" : "Ativar tema escuro";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#171a17" : "#f5f4ef");
  }

  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("bb-portfolio-theme") || "light"; } catch (_) { /* opcional */ }
  applyTheme(savedTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try { localStorage.setItem("bb-portfolio-theme", nextTheme); } catch (_) { /* opcional */ }
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
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  let revealObserver;
  function observeReveals(scope = document) {
    const elements = scope.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach(element => element.classList.add("is-visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .10, rootMargin: "0px 0px -30px 0px" });
    }
    elements.forEach(element => revealObserver.observe(element));
  }

  function projectCard(project, index) {
    const tags = project.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("");
    return `
      <article class="project-card reveal" style="--card-index:${index}">
        <a href="#projeto=${escapeHTML(project.id)}" class="project-card-trigger" data-project="${escapeHTML(project.id)}" aria-label="Ver detalhes de ${escapeHTML(project.title)}">
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
            <span class="project-action">Explorar projeto <span class="card-arrow" aria-hidden="true">↗</span></span>
          </div>
        </a>
      </article>`;
  }

  function renderProjects() {
    const filtered = projects.filter(project => {
      const matchesCategory = activeFilter === "todos" || project.category === activeFilter;
      const haystack = `${project.title} ${project.description} ${project.tags.join(" ")} ${project.categoryLabel}`.toLowerCase();
      return matchesCategory && haystack.includes(searchTerm);
    });
    projectsGrid.innerHTML = filtered.map(projectCard).join("");
    emptyState.hidden = filtered.length > 0;
    document.querySelectorAll("[data-count='todos']").forEach(node => { node.textContent = projects.length; });
    observeReveals(projectsGrid);
  }
  filters.addEventListener("click", event => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    filters.querySelectorAll("button").forEach(item => {
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
    document.querySelector("#demo-grid").innerHTML = demos.map((demo, index) => `
      <article class="demo-card reveal" style="--card-index:${index}">
        <button type="button" class="demo-card-button" data-open-demo="${escapeHTML(demo.id)}" aria-label="Experimentar ${escapeHTML(demo.title)}">
          <span class="demo-card-top"><span class="demo-card-index">0${index + 1} / DEMO</span><span class="demo-card-icon" aria-hidden="true">↗</span></span>
          <span class="demo-card-mark tone-${escapeHTML(demo.tone)}">${escapeHTML(demo.mark)}</span>
          <span class="demo-card-category">${escapeHTML(demo.category)}</span>
          <strong class="demo-card-title">${escapeHTML(demo.title)}</strong>
          <span class="demo-card-description">${escapeHTML(demo.description)}</span>
          <span class="demo-card-action">Experimentar no navegador <span aria-hidden="true">↗</span></span>
        </button>
      </article>`).join("");
    observeReveals(document.querySelector("#laboratorio"));
  }

  function setHash(hash) {
    if (window.location.hash !== hash) history.pushState(null, "", hash);
  }
  function syncBodyDialog() {
    document.body.classList.toggle("dialog-open", projectDialog.open || demoDialog.open);
  }

  function projectDetail(project) {
    const tags = project.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join("");
    const demo = demos.find(item => item.id === project.demoId);
    const demoButton = demo ? `<button type="button" class="button button-dark case-demo-button" data-open-demo="${escapeHTML(demo.id)}">Abrir demonstração <span aria-hidden="true">↗</span></button>` : "";
    const repoButton = project.link ? `<a class="button case-repo-button" href="${escapeHTML(project.link)}" target="_blank" rel="noopener noreferrer">Ver repositório <span aria-hidden="true">↗</span></a>` : "";
    return `
      <div class="case-cover art-${escapeHTML(project.visual)}">
        <span class="case-cover-index">${escapeHTML(project.categoryLabel)} / ${escapeHTML(project.year)}</span>
        <span class="case-cover-mark" aria-hidden="true">${escapeHTML(project.mark)}</span>
        <span class="case-cover-status">${escapeHTML(project.status)}</span>
      </div>
      <div class="case-content">
        <p class="eyebrow"><span class="eyebrow-line"></span> ${escapeHTML(project.categoryLabel)} / ${escapeHTML(project.year)}</p>
        <h2 id="project-dialog-title">${escapeHTML(project.title)}</h2>
        <p class="case-lead">${escapeHTML(project.description)}</p>
        <div class="case-tag-list tag-list">${tags}</div>
        <div class="case-details">
          <section class="case-detail"><span class="case-detail-label">01 / DESAFIO</span><div><h3>O problema</h3><p>${escapeHTML(project.problem || "Projeto em documentação.")}</p></div></section>
          <section class="case-detail"><span class="case-detail-label">02 / SOLUÇÃO</span><div><h3>A abordagem</h3><p>${escapeHTML(project.solution || project.description)}</p></div></section>
          <section class="case-detail"><span class="case-detail-label">03 / ENGENHARIA</span><div><h3>Decisões e desafios</h3><p>${escapeHTML(project.challenge || "Detalhes em elaboração.")}</p></div></section>
        </div>
        <div class="case-actions">${demoButton}${repoButton}${(!demo && !project.link) ? '<span class="case-private-note">Projeto em desenvolvimento; demonstração ou código público ainda não disponível.</span>' : ''}</div>
      </div>`;
  }

  function openProject(id, updateUrl = true) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    if (demoDialog.open) demoDialog.close();
    if (projectDialog.open) projectDialog.close();
    document.querySelector("#project-dialog-content").innerHTML = projectDetail(project);
    projectDialog.showModal();
    syncBodyDialog();
    if (updateUrl) setHash(`#projeto=${encodeURIComponent(project.id)}`);
  }

  function selectDemoTab(which) {
    demoDialog.querySelectorAll("[data-demo-tab]").forEach(button => {
      const active = button.dataset.demoTab === which;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    demoDialog.querySelector("#demo-workspace").hidden = which !== "experimentar";
    demoDialog.querySelector("#demo-about").hidden = which !== "sobre";
  }

  function openDemo(id, updateUrl = true) {
    const demo = demos.find(item => item.id === id);
    if (!demo) return;
    if (projectDialog.open) projectDialog.close();
    if (demoDialog.open) demoDialog.close();
    document.querySelector("#demo-dialog-title").textContent = demo.title;
    document.querySelector("#demo-dialog-description").textContent = demo.description;
    const about = document.querySelector("#demo-about-content");
    about.replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.textContent = demo.how;
    const notice = document.createElement("p");
    notice.className = "demo-warning";
    notice.textContent = demo.notice;
    about.append(paragraph, notice);
    const host = document.querySelector("#demo-workspace-content");
    host.replaceChildren();
    const runner = window.portfolioDemoRunners?.[demo.id];
    if (typeof runner === "function") runner(host);
    else host.textContent = "Demonstração indisponível no momento.";
    selectDemoTab("experimentar");
    demoDialog.showModal();
    syncBodyDialog();
    if (updateUrl) setHash(`#demo=${encodeURIComponent(demo.id)}`);
  }

  document.addEventListener("click", event => {
    const projectButton = event.target.closest("[data-project]");
    if (projectButton) { event.preventDefault(); openProject(projectButton.dataset.project); return; }
    const demoButton = event.target.closest("[data-open-demo]");
    if (demoButton) { openDemo(demoButton.dataset.openDemo); return; }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) document.getElementById(closeButton.dataset.closeDialog)?.close();
  });

  [projectDialog, demoDialog].forEach(dialog => {
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", () => {
      syncBodyDialog();
      if (dialog === projectDialog && location.hash.startsWith("#projeto=")) history.replaceState(null, "", "#projetos");
      if (dialog === demoDialog && location.hash.startsWith("#demo=")) history.replaceState(null, "", "#laboratorio");
    });
  });
  demoDialog.querySelectorAll("[data-demo-tab]").forEach(button => {
    button.addEventListener("click", () => selectDemoTab(button.dataset.demoTab));
    button.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const next = button.dataset.demoTab === "experimentar" ? "sobre" : "experimentar";
      selectDemoTab(next);
      demoDialog.querySelector(`[data-demo-tab="${next}"]`).focus();
    });
  });

  function applyRoute() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash.startsWith("projeto=")) openProject(hash.slice(8), false);
    else if (hash.startsWith("demo=")) openDemo(hash.slice(5), false);
    else {
      if (projectDialog.open) projectDialog.close();
      if (demoDialog.open) demoDialog.close();
    }
  }
  window.addEventListener("popstate", applyRoute);
  window.addEventListener("hashchange", applyRoute);

  const yearNode = document.querySelector("#current-year");
  if (yearNode) yearNode.textContent = new Date().getFullYear();
  renderProjects();
  renderLab();
  observeReveals();
  applyRoute();
})();
