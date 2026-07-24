function criarCardNoticia(noticia, categoriaNome) {
  const imagem = noticia.imagem || `https://picsum.photos/seed/${noticia.id}/600/400`;

  const card = document.createElement("article");
  card.className = "news-card";
  card.innerHTML = `
    <a href="noticia.html?id=${noticia.id}" class="news-card__link">
      <div class="news-card__image" style="background-image:url('${imagem}')"></div>
      <div class="news-card__body">
        <span class="news-card__category">${categoriaNome}</span>
        <h3 class="news-card__title">${noticia.titulo}</h3>
        <p class="news-card__summary">${noticia.resumo}</p>
        <time class="news-card__date">${formatarData(noticia.dataPublicacao)}</time>
      </div>
    </a>
  `;
  return card;
}
