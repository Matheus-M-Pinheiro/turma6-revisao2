function renderHeader() {
  return `
    <header class="site-header">
      <div class="container site-header__inner">
        <a href="index.html" class="site-logo">
          <span class="site-logo__text">Portal de Notícias</span>
        </a>
        <nav class="site-nav">
          <a href="index.html">Início</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const dataDinamica = new Date ()
  return `
    <footer class="site-footer">
      <div class="container">
        <p>&copy; ${dataDinamica.getFullYear()} Portal de Notícias. Todos os direitos reservados.</p>
      </div>
    </footer>
  `;
}

function montarLayout() {
  document.getElementById("site-header").innerHTML = renderHeader();
  document.getElementById("site-footer").innerHTML = renderFooter();
}
