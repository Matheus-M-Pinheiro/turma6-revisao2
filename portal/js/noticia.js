const API_URL = "http://localhost:3000";

async function getNoticia(id) {
  const resposta = await fetch(`${API_URL}/noticias/${id}`);
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

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
  const noticiaId = params.get("id");
  const artigo = document.getElementById("artigo");
  const leiaTambem = document.getElementById("leia-tambem");
  leiaTambem.style.display = "none";

  if (!noticiaId) {
    artigo.innerHTML = `<p class="empty-message">Notícia não encontrada.</p>`;
    return;
  }

  try {
    const noticia = await getNoticia(noticiaId);
    const categoria = await getCategoria(noticia.categoriaId);

    document.title = `${noticia.titulo} — Portal Aconchego`;

    const linkCategoria = document.getElementById("noticia-categoria");
    linkCategoria.textContent = categoria.nome;
    linkCategoria.href = `categoria.html?id=${categoria.id}`;

    document.getElementById("noticia-titulo").textContent = noticia.titulo;
    document.getElementById("noticia-data").textContent = formatarData(noticia.dataPublicacao);
    document.getElementById("noticia-texto").textContent = noticia.textoCompleto;

    const imagemEl = document.getElementById("noticia-imagem");
    if (noticia.imagem) {
      imagemEl.src = noticia.imagem;
      imagemEl.alt = noticia.titulo;
      imagemEl.style.display = "block";
    }

    await carregarLeiaTambem(noticia, categoria);
  } catch (erro) {
    artigo.innerHTML = `<p class="empty-message">Não foi possível carregar a notícia.</p>`;
    console.error(erro);
  }
}

async function carregarLeiaTambem(noticiaAtual, categoriaAtual) {
  const grid = document.getElementById("leia-tambem-grid");
  const secao = document.getElementById("leia-tambem");
  const idsUsados = [noticiaAtual.id];
  const recomendadas = [];

  try {
    const destaques = await getNoticias({ destaque: true, _sort: "-dataPublicacao", _per_page: 5 });
    const destaqueRecente = destaques.find((n) => !idsUsados.includes(n.id));
    if (destaqueRecente) {
      recomendadas.push(destaqueRecente);
      idsUsados.push(destaqueRecente.id);
    }

    const daMesmaCategoria = await getNoticias({
      categoriaId: categoriaAtual.id,
      _sort: "-dataPublicacao",
      _per_page: 5,
    });
    const relacionadas = daMesmaCategoria.filter((n) => !idsUsados.includes(n.id)).slice(0, 2);
    relacionadas.forEach((n) => idsUsados.push(n.id));
    recomendadas.push(...relacionadas);

    if (recomendadas.length === 0) {
      secao.style.display = "none";
      return;
    }

    secao.style.display = "block";

    const categoriasCache = { [categoriaAtual.id]: categoriaAtual.nome };
    for (const noticia of recomendadas) {
      if (!(noticia.categoriaId in categoriasCache)) {
        const cat = await getCategoria(noticia.categoriaId);
        categoriasCache[noticia.categoriaId] = cat.nome;
      }
      grid.appendChild(criarCardNoticia(noticia, categoriasCache[noticia.categoriaId]));
    }
  } catch (erro) {
    secao.style.display = "none";
    console.error(erro);
  }
}

document.addEventListener("DOMContentLoaded", init);
