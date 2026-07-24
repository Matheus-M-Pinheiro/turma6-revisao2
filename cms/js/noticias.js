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

async function excluirNoticia(id) {
  const resposta = await fetch(`${API_URL}/noticias/${id}`, { method: "DELETE" });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
}

async function init() {
  montarLayout("noticias");
  await carregarTabela();
}

async function carregarTabela() {
  const corpo = document.getElementById("tabela-corpo");
  const vazio = document.getElementById("estado-vazio");
  corpo.innerHTML = "";

  try {
    const [noticias, categorias] = await Promise.all([
      getNoticias({ _sort: "-dataPublicacao" }),
      getCategorias(),
    ]);

    if (noticias.length === 0) {
      vazio.style.display = "block";
      return;
    }
    vazio.style.display = "none";

    const mapaCategoria = {};
    for (const categoria of categorias) {
      mapaCategoria[categoria.id] = categoria.nome;
    }

    noticias.forEach((noticia) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${noticia.titulo}</td>
        <td>${noticia.categoriaId}</td>
        <td>${noticia.destaque}</td>
        <td>${new Date(noticia.dataPublicacao)}</td>
        <td class="tabela-acoes">
          <a href="noticia-form.html?id=${noticia.id}" class="botao botao--secundario botao--pequeno">Editar</a>
          <button class="botao botao--perigo botao--pequeno" data-id="${noticia.id}" data-titulo="${noticia.titulo}">Excluir</button>
        </td>
      `;
      corpo.appendChild(linha);
    });

    corpo.querySelectorAll("button[data-id]").forEach((botao) => {
      botao.addEventListener("click", () => excluir(botao.dataset.id, botao.dataset.titulo));
    });
  } catch (erro) {
    console.error(erro);
    corpo.innerHTML = `<tr><td colspan="5">Não foi possível carregar as notícias.</td></tr>`;
  }
}

async function excluir(id, titulo) {
  const confirmado = confirm(`Tem certeza que deseja excluir a notícia "${titulo}"?`);
  if (!confirmado) return;

  try {
    await excluirNoticia(id);
    await carregarTabela();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível excluir a notícia.");
  }
}

document.addEventListener("DOMContentLoaded", init);
