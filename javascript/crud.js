/* crud.js
   Possui as funções do crud (GET, POST, PUT, DELETE) assim como a funcionalidade
   genérica da página, como manipulação de dados e interação com o usuário. */

let filmeSelecionado; // variavel para guardar o filme atualmente selecionado para edição ou exclusão

/* 1. GET - Executa o método GET no backend para receber a lista de filmes,
e caso tenha sucesso, insere os dados na tabela html. */
const getData = async () => {
  axios
    .get("http://localhost:57383/api/Filmes")
    .then((res) => {
      putDataInTable(res.data);
    })
    .catch((err) => console.log(err));
};

/* 2. POST - Após validar se os campos nome e ano estão preenchidos, executa o método POST
   com as informações do filme, em seguida inserindo o novo registro na tabela html. */
const postFilme = async () => {
  document.querySelector("#filmenome").value &&
  document.querySelector("#filmeano").value
    ? axios
        .post("http://localhost:57383/api/Filmes", {
          id: 0,
          nome: document.querySelector("#filmenome").value,
          ano: document.querySelector("#filmeano").value,
        })
        .then((res) => {
          document.querySelector("#error_post").style.display = "none";
          getData(); // atualiza a table
          document.querySelector("#success_post").style.display = "block";
        })
    : (document.querySelector("#success_post").style.display = "none"),
    (document.querySelector("#error_post").style.display = "block");
};

// 3. PUT - Valida e envia, assim como no outro.
const putFilme = async () => {
  const config = { headers: { "Content-Type": "application/json" } };
  const obj = {
    id: document.getElementById("put_id").value,
    nome: document.getElementById("put_nome").value,
    ano: document.getElementById("put_ano").value,
  };
  if (
    document.getElementById("put_id").value &&
    document.getElementById("put_nome").value &&
    document.getElementById("put_ano").value
  ) {
    document.querySelector("#error_put").style.display = "none";
    axios
      .put("http://localhost:57383/api/Filmes/" + obj.id, obj, config)
      .then((res) => {
        getData();
        document.querySelector("#success_put").style.display = "block";
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    document.querySelector("#error_put").style.display = "flex";
    document.querySelector("#success").style.display = "none";
  }
};

const deleteFilme = () => {
  if (filmeSelecionado) {

    document.querySelector("#error_delete").style.display = "none";
    axios
    .delete("http://localhost:57383/api/Filmes/" + filmeSelecionado.firstChild.textContent)
    .then((res) => {
      getData();
      document.querySelector("#success_delete").style.display = "block";
      filmeSelecionado = null;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  else {
    document.querySelector("#error_delete").style.display = "block";

  }
};

/* Insere na tabela html um array de dados recebidos via requisição.
   Caso haja apenas um único registro para inserir, basta colocá-lo num array como: [registro] */
const putDataInTable = (data) => {
  let tabela = document.querySelector(".tabela > tbody");
  tabela.innerHTML = "";
  data.forEach((element) => {
    let regiao = document.createElement("tr");
    regiao.addEventListener("click", () => {
      clickFilme(regiao);
    });
    regiao.innerHTML = `<td>${element.id}</td>
                            <td>${element.nome}</td>
                            <td>${element.ano}</td>`;
    tabela.appendChild(regiao);
  });
};

// Exibe e esconde os formulários de inserção e edição conforme o usuário seleciona a opção desejada
const showForm = (form) => {
  let put = document.getElementById("put");
  let post = document.getElementById("post");
  let remove = document.getElementById("remove");

  if (form === "put") {
    post.style.display = "none";
    remove.style.display = "none";
    if (put.style.display === "none") {
      put.style.display = "flex";
    } else {
      put.style.display = "none";
    }
  }
  if (form === "post") {
    put.style.display = "none";
    remove.style.display = "none";
    if (post.style.display === "none") {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  }
  if (form === "remove") {
    post.style.display = "none";
    put.style.display = "none";
    if (remove.style.display === "none") {
      remove.style.display = "flex";
    } else {
        remove.style.display = "none";
    }
  }
  if (form === null) {
    post.style.display = "none";
    put.style.display = "none";
    remove.style.display = "none";
  }
};

/* Essa função é responsável por selecionar o filme clicado pelo usuário, assim como de-selecionar
   qualquer outro que possa ter sido selecionado previamente, de forma que seja possível editar
   apenas um filme por vez. */
const clickFilme = (filme) => {
  filmeSelecionado = filme;
  for (let i = 1; i < filme.parentElement.childElementCount; i++) {
    filme.parentElement.children[i].firstChild.classList.remove("selected");
    filme.parentElement.children[
      i
    ].firstChild.nextElementSibling.classList.remove("selected");
    filme.parentElement.children[
      i
    ].firstChild.nextElementSibling.nextElementSibling.classList.remove(
      "selected"
    );
  }
  filme.firstChild.classList.add("selected");
  filme.firstChild.nextElementSibling.classList.add("selected");
  filme.firstChild.nextElementSibling.nextElementSibling.classList.add(
    "selected"
  );
  document.getElementById("put_id").value = filme.firstChild.textContent;
  document.getElementById("put_nome").value =
    filme.firstChild.nextElementSibling.textContent;
  document.getElementById("put_ano").value =
    filme.firstChild.nextElementSibling.nextElementSibling.textContent;
};


// Realiza a filtragem na tabela html
const filtrar = () => {
    let tabela = document.querySelector(".tabela > tbody");
    let filhos = tabela.children;
    let input = document.getElementById("filter").value.toUpperCase();
    for (i = 0; i < tabela.childElementCount; i++) {

        let a = filhos[i].firstChild.nextElementSibling;
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(input) > -1) {
          filhos[i].style.display = "";
        } else {
            filhos[i].style.display = "none";
        }
      }
}

let filter = document.getElementById("filter");
filter.addEventListener("keyup", filtrar)



// EXECUÇÃO
showForm(null); // hack pra resolver um bug que exigia que o usuário clicasse 2x no botão de "NOVO FILME" para que ele funcion
getData(); // faz o primeiro GET quando o usuário abre a página, preenchendo a tabela html
