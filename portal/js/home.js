const API_URL = "http://localhost:3000";

async function getCategorias() {
  const resposta = await fetch(`${API_URL}/categorias`);
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

async function getNoticias(params = {}) {
  // O json-server só aplica _per_page quando _page também é enviado;
  // sem _page, o limite é ignorado e todos os itens são retornados.
  const usaPaginacao = params._per_page !== undefined;
  const parametros = usaPaginacao ? { _page: 1, ...params } : params;

  const busca = new URLSearchParams();
  for (const chave in parametros) {
    const valor = parametros[chave];
    if (valor !== undefined && valor !== null && valor !== "") {
      busca.set(chave, valor);
    }
  }
  const querystring = busca.toString() ? `?${busca.toString()}` : "";

  const resposta = await fetch(`${API_URL}/noticias${querystring}`);
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  const resultado = await resposta.json();
  return usaPaginacao ? resultado.data : resultado;
}

async function init() {
  montarLayout();
  await carregarDestaques();
  await carregarSecoesPorCategoria();
}

async function carregarDestaques() {
  const container = document.getElementById("destaques-grid");
  container.innerHTML = "";

  try {
    const [destaques, categorias] = await Promise.all([
      getNoticias({ destaque: true, _per_page: 5, _sort: "-dataPublicacao" }),
      getCategorias(),
      
    ]);
    

    if (destaques.length === 0) {
      container.innerHTML = `<p class="empty-message">Nenhuma notícia em destaque no momento.</p>`;
      return;
    }

    const mapaCategoria = {};
    for (const categoria of categorias) {
      mapaCategoria[categoria.id] = categoria.nome;
    }

    destaques.forEach((noticia, index) => {
      const card = criarCardNoticia(noticia, mapaCategoria[noticia.categoriaId] ?? "Sem categoria");
      if (index === 0) card.classList.add("news-card--featured");
      container.appendChild(card);
    });
  } catch (erro) {
    container.innerHTML = `<p class="empty-message">Não foi possível carregar os destaques.</p>`;
    console.error(erro);
  }
}

async function carregarSecoesPorCategoria() {
  const container = document.getElementById("categorias-sections");
  container.innerHTML = "";

  try {
    const categorias = await getCategorias();

    for (const categoria of categorias) {
      const noticias = await getNoticias({
        categoriaId: categoria.id,
        _sort: "-dataPublicacao",
        _per_page: 3,
      });

      if (noticias.length === 0) continue;

      const section = document.createElement("section");
      section.className = "category-section";
      section.innerHTML = `
        <div class="category-section__header">
          <h2>${categoria.nome}</h2>
          <a href="categoria.html?id=${categoria.id}" class="see-all-link">Ver todas &rarr;</a>
        </div>
        <div class="news-grid"></div>
      `;

      const grid = section.querySelector(".news-grid");
      noticias.forEach((noticia) => grid.appendChild(criarCardNoticia(noticia, categoria.nome)));

      container.appendChild(section);
    }
  } catch (erro) {
    container.innerHTML = `<p class="empty-message">Não foi possível carregar as categorias.</p>`;
    console.error(erro);
  }
}

document.addEventListener("DOMContentLoaded", init);
