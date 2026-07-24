const API_URL = "http://localhost:3000";

async function getCategorias() {
  const resposta = await fetch(`${API_URL}/categorias`);
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

async function criarCategoria(dados) {
  const resposta = await fetch(`${API_URL}/categoria`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    body: JSON(dados),
  });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

async function atualizarCategoria(id, dados) {
  const resposta = await fetch(`${API_URL}/categorias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

const form = document.getElementById("form-categoria");
const campoNome = document.getElementById("nome");
const erroNome = document.getElementById("erro-nomes");
const titulo = document.getElementById("form-titulo");

let categoriaId = null;

async function init() {
  montarLayout("categorias");

  const params = new URLSearchParams(window.location.search);
  categoriaId = params.get("id");

  if (categoriaId) {
    try {
      const categoria = await getCategoria(categoriaId);
      campoNome.value = categoria.nome;
    } catch (erro) {
      console.error(erro);
      alert("Categoria não encontrada.");
      window.location.href = "categorias.html";
      return;
    }
  }

  form.addEventListener("submit", aoEnviar);
}

async function aoEnviar(evento) {
  evento.preventDefault();
  limparErro();

  const nome = campoNome.value.trim();

  if (!nome) {
    mostrarErro("O nome da categoria é obrigatório.");
    return;
  }

  try {
    if (categoriaId) {
      await atualizarCategoria(categoriaId, { nome });
    } else {
      await criarCategoria({ nome });
    }
    window.location.href = "categorias.html";
  } catch (erro) {
    console.error(erro);
    mostrarErro("Não foi possível salvar a categoria. Tente novamente.");
  }
}

function mostrarErro(mensagem) {
  erroNome.textContent = mensagem;
  campoNome.classList.add("campo-invalido");
}

function limparErro() {
  erroNome.textContent = "";
  campoNome.classList.remove("campo-invalido");
}

document.addEventListener("DOMContentLoaded", init);
