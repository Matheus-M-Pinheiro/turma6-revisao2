# Exercício: Portal de Notícias com JSON Server

Crie um sistema de notícias composto por **dois módulos**: um **portal público**, onde os leitores navegam pelas notícias, e um **CMS (sistema de gerenciamento)**, onde o CRUD de categorias e notícias é feito. Ambos consomem os mesmos endpoints de um JSON Server.

## Estrutura dos dados

- `/categorias`: `id`, `nome` (string)
- `/noticias`: `id`, `titulo` (string), `resumo` (string), `textoCompleto` (string), `categoriaId` (string, referencia `/categorias`), `destaque` (boolean), `dataPublicacao` (date), `imagem` (string, URL opcional)

---

## Módulo 1: Portal Público

Todas as páginas do portal público (home, categoria e notícia) devem compartilhar o **mesmo header e o mesmo footer**, mantendo a identidade visual consistente entre elas. O header deve conter, no mínimo, o nome/logo do portal e um link para a home; o footer pode conter informações simples, como direitos autorais.

### Home principal

Deve exibir:
- Uma seção com as **últimas 5 notícias em destaque** (`destaque = true`), ordenadas pela mais recente.
- Para **cada categoria** cadastrada, uma seção mostrando as **3 notícias mais recentes** daquela categoria, com um link **"Ver todas"** que leva para a página de listagem daquela categoria.

Cada notícia exibida (em qualquer seção) deve ser clicável, levando à página de detalhe da notícia.

### Página de notícias da categoria

Ao acessar essa página (via link vindo da home), exibir **todas as notícias** pertencentes à categoria selecionada, ordenadas da mais recente para a mais antiga. O nome da categoria deve estar visível no topo da página.

### Página da notícia

Exibir o **texto completo** da notícia clicada (título, data de publicação, categoria e o conteúdo integral).

Após o final do texto, exibir uma seção de **"Leia também"** com 3 notícias:
1. A notícia em destaque mais recente (diferente da notícia atual, se ela mesma for destaque);
2. Duas notícias recentes da **mesma categoria** da notícia atual (excluindo a notícia atual).

---

## Módulo 2: CMS de Gerenciamento

O CMS deve ter o CRUD completo de **categorias** e de **notícias**, cada um com sua própria página de listagem e sua própria página de formulário (criação/edição):

**CRUD de Categorias:**
- **Listagem:** tabela com todas as categorias cadastradas, com botões de editar e excluir.
- **Formulário:** campo de nome, usado tanto para criar quanto para editar (reaproveitando a mesma página).

**CRUD de Notícias:**
- **Listagem:** tabela com título, categoria, status de destaque e data de publicação, com botões de editar e excluir.
- **Formulário:** campos de título, resumo, texto completo, data de publicação, marcação de destaque (checkbox) e um `select` de categoria (carregado dinamicamente via GET), usado tanto para criar quanto para editar.

Antes de excluir uma categoria ou notícia, exiba uma confirmação ao usuário.

## Validações do formulário de categoria

- **nome:** obrigatório; não pode ser enviado em branco ou apenas com espaços; não pode já existir uma categoria cadastrada com o mesmo nome (validar antes de salvar).

## Validações do formulário de notícia

- **titulo:** obrigatório; não pode ser enviado em branco ou apenas com espaços; mínimo de 5 caracteres.
- **resumo:** obrigatório; não pode ser enviado em branco; sugestão de limite máximo de 200 caracteres, com contador de caracteres visível no formulário.
- **textoCompleto:** obrigatório; não pode ser enviado em branco ou apenas com espaços; mínimo de 50 caracteres.
- **categoriaId:** obrigatório; o `select` deve iniciar sem nenhuma categoria pré-selecionada, obrigando o usuário a escolher uma; caso não haja nenhuma categoria cadastrada no sistema, exibir um aviso orientando o usuário a cadastrar uma categoria antes de continuar.
- **destaque:** campo do tipo checkbox; não exige validação de preenchimento (assume `false` quando desmarcado).
- **dataPublicacao:** obrigatório; deve ser uma data válida; não pode ser uma data futura em relação à data atual.
- **imagem:** campo opcional; se preenchido, deve ser uma URL em formato válido (ex: iniciar com `http://` ou `https://`).

Caso qualquer uma dessas validações falhe, o formulário não deve ser enviado, e uma mensagem de erro específica deve ser exibida próxima ao campo correspondente.

## JSON de referência

Ver arquivo `db-portal-noticias.json`, com categorias e notícias já populadas para uso no desenvolvimento e testes.