function renderHeader(active) {
  const links = [
    { href: "categorias.html", label: "Categorias", key: "categorias" },
    { href: "noticias.html", label: "Notícias", key: "noticias" },
  ];

  let navHtml = "";
  for (const link of links) {
    const classeAtiva = link.key === active ? "is-active" : "";
    navHtml += `<a href="${link.href}" class="${classeAtiva}">${link.label}</a>`;
  }

  return `
    <header class="cms-header">
      <div class="container cms-header__inner">
        <a href="index.html" class="cms-logo">
          <span class="cms-logo__icon">🗂️</span>
          <span>Notícias <strong>CMS</strong></span>
        </a>
        <nav class="cms-nav">
          ${navHtml}
          <a href="../portal/index.html" target="_blank" class="cms-nav__external">Ver portal ↗</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="cms-footer">
      <div class="container">
        <p>Painel administrativo do Portal de Notícias.</p>
      </div>
    </footer>
  `;
}

function montarLayout(active) {
  document.getElementById("site-header").innerHTML = renderHeader(active);
  document.getElementById("site-footer").innerHTML = renderFooter();
}
