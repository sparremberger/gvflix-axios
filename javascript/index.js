let mainCard =
  document.getElementById("maincard"); /* Filme selecionado/em destaque */
let movieList =
  document.getElementsByClassName("card"); /* Lista de filmes no rodapé */
let paused = false; /* Estado atual do auto-play */

let currentMovie; // a variável 'filme atual' será inicializada no momento que o autoplay rodar pela primeira vez após o carregamento da página
const switchMovies = (currentMovie) => {
  mainCard.firstChild.nextElementSibling.nextElementSibling.firstElementChild.src =
    currentMovie.firstElementChild.src;
};

// Função responsável por selecionar e destacar um filme após clicado
const changeMovieOnClick = (clickedMovie) => {
  if (!paused) {
    pausePreview(document.querySelector(".fa-pause"));
    paused = true;
  }
  else {

  }
  mainCard.firstChild.nextElementSibling.nextElementSibling.firstElementChild.src =
    clickedMovie.firstChild.nextElementSibling.src;
};

// Controle do seletor de filmes para retornar um filme
const previousMovie = () => {
  let currentMovieSrc =
    mainCard.firstElementChild.nextElementSibling.firstElementChild.currentSrc; // Viajando no DOM
  let image = document.getElementById("main_image");

  for (let i = 0; i < movieList.length; i++) {
    // Faz o loop de volta na lista
    if (currentMovieSrc == movieList[i].firstElementChild.src) {
      if (i > 0) {
        image.src = movieList[i - 1].firstElementChild.src;
      }
      if (i == 0) {
        image.src = movieList[movieList.length - 1].firstElementChild.src;
      }
    }
  }
};

// Pausa o auto-play
const pausePreview = (element) => {
  console.log(element.classList);
  if (!paused) {
    element.classList.replace("fa-pause", "fa-play");
    paused = true;
  } else {
    element.classList.replace("fa-play", "fa-pause");
    paused = false;
  }
};

// Igual ao outro controle, mas avançando os filmes
const nextMovie = () => {
  let element = document.querySelector(
    "#maincard > div.controls > div.play-button.button > i"
  );
  element.classList.replace("fa-pause", "fa-play");
  paused = true;
  let currentMovieSrc =
    mainCard.firstElementChild.nextElementSibling.firstElementChild.currentSrc;

  let image = document.getElementById("main_image");

  for (let i = 0; i < movieList.length; i++) {
    if (currentMovieSrc == movieList[i].firstElementChild.src) {
      if (i < movieList.length - 1) {
        image.src = movieList[i + 1].firstElementChild.src;
      }
      if (i >= movieList.length - 1) {
        image.src = movieList[0].firstElementChild.src;
      }
    }
  }
};

// auto-play de 5 em 5 segundos
let counter = 0;
const interval = setInterval(function () {
  console.log(paused);
  if (!paused) {
    if (currentMovie) {
      counter++;
      if (counter >= movieList.length) {
        counter = 0;
      }
      currentMovie = movieList[counter];
    }
    if (!currentMovie) {
      currentMovie = movieList[1];
    }
    switchMovies(currentMovie);
  }
}, 5000);
