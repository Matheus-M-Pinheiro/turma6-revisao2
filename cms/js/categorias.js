const API_URL = "http://localhost:3000";

async function getCategorias() {
  const resposta = await fetch(`${API_URL}/categorias`);
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
  return resposta.json();
}

async function excluirCategoria(id) {
  const resposta = await fetch(`${API_URL}/categorias/${id}`, { method: "DELETE" });
  if (!resposta.ok) {
    throw new Error(`Erro na requisição: ${resposta.status}`);
  }
}

async function init() {
  montarLayout("categorias");
  await carregarTabela();
}

async function carregarTabela() {
  const corpo = document.getElementById("tabela-corpo");
  const vazio = document.getElementById("estado-vazio");
  corpo.innerHTML = "";

  try {
    const categorias = await getCategorias();

    if (categorias.length === 0) {
      vazio.style.display = "block";
      return;
    }
    vazio.style.display = "none";

    categorias.forEach((categoria) => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${categoria.nome}</td>
        <td class="tabela-acoes">
          <a href="categoria-form.html?id=${categoria.id}" class="botao botao--secundario botao--pequeno">Editar</a>
          <button class="botao botao--perigo botao--pequeno" data-id="${categoria.id}" data-nome="${categoria.nome}">Excluir</button>
        </td>
      `;
      corpo.appendChild(linha);
    });

    corpo.querySelectorAll("button[data-id]").forEach((botao) => {
      botao.addEventListener("click", () => excluir(botao.dataset.id, botao.dataset.nome));
    });
  } catch (erro) {
    console.error(erro);
    corpo.innerHTML = `<tr><td colspan="2">Não foi possível carregar as categorias.</td></tr>`;
  }
}

async function excluir(id, nome) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await excluirCategoria(id);
        await carregarTabela(); Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });

      } catch (erro) {
        console.error(erro);
        alert("Não foi possível excluir a categoria.");
      }
    }
  });

}

document.addEventListener("DOMContentLoaded", init);
