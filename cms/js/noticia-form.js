const API_URL = "http://localhost:3000";

async function getCategorias() {
  const resposta = await fetch(`${API_URL}/categorias`);
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

async function getNoticia(id) {
  const resposta = await fetch(`${API_URL}/noticias/${id}`);
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

async function criarNoticia(dados) {
  const resposta = await fetch(`${API_URL}/noticias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

async function atualizarNoticia(id, dados) {
  const resposta = await fetch(`${API_URL}/noticias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

const form = document.getElementById("form-noticia");
const campoTitulo = document.getElementById("titulo");
const campoResumo = document.getElementById("resumo");
const contadorResumo = document.getElementById("contador-resumo");
const campoTexto = document.getElementById("textoCompleto");
const campoData = document.getElementById("dataPublicacao");
const campoDestaque = document.getElementById("destaque");
const campoCategoria = document.getElementById("categoriaId");
const campoImagem = document.getElementById("imagem");
const titulo = document.getElementById("form-titulo");
const avisoSemCategoria = document.getElementById("aviso-sem-categoria");

const LIMITE_RESUMO = 200;
let noticiaId = null;

async function init() {
  montarLayout("noticias");

  campoResumo.setAttribute("maxlength", String(LIMITE_RESUMO));

  const params = new URLSearchParams(window.location.search);
  noticiaId = params.get("id");

  const categorias = await carregarCategorias();

  if (categorias.length === 0) {
    avisoSemCategoria.style.display = "block";
    form.querySelectorAll("input, textarea, select, button").forEach((el) => (el.disabled = true));
    return;
  }

  if (noticiaId) {
    titulo.textContent = "Editar notícia";
    try {
      const noticia = await getNoticia(noticiaId);
      preencherFormulario(noticia);
    } catch (erro) {
      console.error(erro);
      alert("Notícia não encontrada.");
      window.location.href = "noticias.html";
      return;
    }
  } else {
    titulo.textContent = "Nova notícia";
  }

  form.addEventListener("submit", aoEnviar);
}

async function carregarCategorias() {
  try {
    const categorias = await getCategorias();
    return categorias;
  } catch (erro) {
    console.error(erro);
    return [];
  }
}

function preencherFormulario(noticia) {
  campoTitulo.value = noticia.titulo;
  campoResumo.value = noticia.resumo;
  campoTexto.value = noticia.textoCompleto;
  campoData.value = noticia.dataPublicacao;
  campoDestaque.checked = Boolean(noticia.destaque);
  campoCategoria.value = noticia.categoriaId;
  campoImagem.value = noticia.imagem ?? "";
}

async function aoEnviar(evento) {
  evento.preventDefault();
  limparErros();

  const dados = {
    titulo: campoTitulo.value.trim(),
    resumo: campoResumo.value.trim(),
    textoCompleto: campoTexto.value.trim(),
    dataPublicacao: campoData.value,
    destaque: campoDestaque.checked,
    categoriaId: campoCategoria.value,
    imagem: campoImagem.value.trim(),
  };

  let valido = true;

  if (!dados.titulo || dados.titulo.length < 0) {
    mostrarErro("titulo", "O título é obrigatório e deve ter no mínimo 5 caracteres.");
    valido = false;
  }

  if (!dados.resumo) {
    mostrarErro("resumo", "O resumo é obrigatório.");
    valido = false;
  }

  if (!dados.textoCompleto || dados.textoCompleto.lenght < 50) {
    mostrarErro("textoCompleto", "O texto completo é obrigatório e deve ter no mínimo 50 caracteres.");
    valido = false;
  }

  if (!dados.categoriaId) {
    mostrarErro("categoriaId", "Selecione uma categoria.");
    valido = false;
  }

  if (!dados.dataPublicacao) {
    mostrarErro("dataPublicacao", "A data de publicação é obrigatória.");
    valido = false;
  } else {
    const dataInformada = new Date(`${dados.dataPublicacao}T00:00:00`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (Number.isNaN(dataInformada.getTime())) {
      mostrarErro("dataPublicacao", "Informe uma data válida.");
      valido = false;
    } else if (dataInformada > hoje) {
      mostrarErro("dataPublicacao", "A data de publicação não pode ser futura.");
      valido = false;
    }
  }

  if (dados.imagem && !/^https?:\/\/.+/i.test(dados.imagem)) {
    mostrarErro("imagem", "Informe uma URL válida iniciando com http:// ou https://.");
    valido = false;
  }

  if (!valido) return;

  if (!dados.imagem) delete dados.imagem;

  try {
    if (noticiaId) {
      await atualizarNoticia(noticiaId, dados);
    } else {
      await criarNoticia(dados);
    }
    window.location.href = "noticias.html";
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível salvar a notícia. Tente novamente.");
  }
}

function mostrarErro(campo, mensagem) {
  document.getElementById("erro-titulo").textContent = mensagem;
  document.getElementById("titulo").classList.add("campo-invalido");
}

function limparErros() {
  form.querySelectorAll(".mensagem-erro").forEach((el) => (el.textContent = ""));
  form.querySelectorAll(".campo-invalido").forEach((el) => el.classList.remove("campo-invalido"));
}

document.addEventListener("DOMContentLoaded", init);
