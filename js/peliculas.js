// Obtenemos los datos del localStorage o desde la constante
const data = JSON.parse(localStorage.getItem("peliculasyseries")) || DATA_PELISYSERIES;
const peliculas = data.filter(item => item.tipo === "pelicula");

// Referencias al DOM
const grilla = document.getElementById("grilla-home");
const inputBusqueda = document.getElementById("inputBusqueda");
const botonBuscar = document.getElementById("botonBuscar");
const selectGenero = document.getElementById("selectGenero");

// Renderiza la grilla de películas
function renderizarGrilla(elementos) {
  grilla.innerHTML = "";

  const usuarioActivo = getUsuarioActivo();
  const usuarios = getUsuarios();
  const userIndex = usuarios.findIndex(u => u.usuario === usuarioActivo?.usuario);

  // Si no existe, lo inicializamos
  if (userIndex !== -1 && !usuarios[userIndex].favoritos) {
    usuarios[userIndex].favoritos = [];
  }

  const favoritos = userIndex !== -1 ? usuarios[userIndex].favoritos : [];

  elementos.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    const esFavorito = favoritos.some(f => f.titulo === item.titulo);
    const linkDetalle = "info-pelicula.html";

    card.innerHTML = `
      <a href="${linkDetalle}?titulo=${encodeURIComponent(item.titulo)}">
        <img src="${item.imagen}" alt="${item.titulo}" />
      </a>
      <div class="card-info">
        <h3>
          ${item.titulo}
          <i class="fa-solid fa-heart heart-icon ${esFavorito ? 'activo' : ''}" title="${item.titulo}"></i>
        </h3>
      </div>
    `;

    grilla.appendChild(card);

    const heart = card.querySelector(".heart-icon");
    heart.addEventListener("click", (e) => {
      e.preventDefault();

      if (userIndex === -1) return;

      const titulo = e.target.getAttribute("title");
      const favoritos = usuarios[userIndex].favoritos;
      const yaEsta = favoritos.some(f => f.titulo === titulo);

      if (yaEsta) {
        usuarios[userIndex].favoritos = favoritos.filter(f => f.titulo !== titulo);
        e.target.classList.remove("activo");
      } else {
        const favoritoNuevo = data.find(d => d.titulo === titulo);
        usuarios[userIndex].favoritos.push(favoritoNuevo);
        e.target.classList.add("activo");
      }

      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("usuarioSesionIniciada", JSON.stringify(usuarios[userIndex]));
    });
  });
}


// Aplica filtros por género y búsqueda
function aplicarFiltros() {
  const generoSeleccionado = selectGenero.value.toLowerCase();
  const tituloBuscado = inputBusqueda.value.trim().toLowerCase();

  const filtrados = peliculas.filter(item => {
    // Filtro por género
    const cumpleGenero =
      generoSeleccionado === "todos" ||
      (Array.isArray(item.genero)
        ? item.genero.map(g => g.toLowerCase()).includes(generoSeleccionado)
        : item.genero.toLowerCase() === generoSeleccionado);

    // Filtro por nombre parcial
    const cumpleBusqueda = item.titulo.toLowerCase().includes(tituloBuscado);

    return cumpleGenero && cumpleBusqueda;
  });

  renderizarGrilla(filtrados);
}

// Carga los géneros únicos al select
function cargarGeneros() {
  const generosUnicos = [
    ...new Set(
      peliculas.flatMap(item =>
        Array.isArray(item.genero)
          ? item.genero.map(g => g.toLowerCase())
          : [item.genero.toLowerCase()]
      )
    )
  ];

  selectGenero.innerHTML = '<option value="todos">Todos</option>';

  generosUnicos.forEach(genero => {
    const option = document.createElement("option");
    option.value = genero;
    option.textContent = genero.charAt(0).toUpperCase() + genero.slice(1);
    selectGenero.appendChild(option);
  });
}

// Eventos
selectGenero.addEventListener("change", aplicarFiltros);
botonBuscar.addEventListener("click", aplicarFiltros);
inputBusqueda.addEventListener("keyup", e => {
  if (e.key === "Enter") aplicarFiltros();
});

// Inicialización
cargarGeneros();
renderizarGrilla(peliculas);
