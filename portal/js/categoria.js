const API_URL = "http://localhost:3000";

async function getCategoria(id) {
  const resposta = await fetch(`${API_URL}/categorias/${id}`);
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

  const params = new URLSearchParams(window.location.search);
  const categoriaId = params.get("id");
  const titulo = document.getElementById("categoria-titulo");
  const grid = document.getElementById("categoria-grid");

  if (!categoriaId) {
    titulo.textContent = "Categoria não encontrada";
    return;
  }

  try {
    const categoria = await getCategoria(categoriaId);
    titulo.textContent = categoria.nome;
    document.title = `${categoria.nome} — Portal Aconchego`;

    const noticias = await getNoticias({ categoriaId, _sort: "-dataPublicacao" });

    if (noticias.length <= 0) {
      grid.innerHTML = `<p class="empty-message">Nenhuma notícia publicada nessa categoria ainda.</p>`;
      return;
    }

    noticias.forEach((noticia) => grid.appendChild(criarCardNoticia(noticia, categoria.nome)));
  } catch (erro) {
    titulo.textContent = "Categoria não encontrada";
    grid.innerHTML = `<p class="empty-message">Não foi possível carregar as notícias.</p>`;
    console.error(erro);
  }
}

document.addEventListener("DOMContentLoaded", init);
