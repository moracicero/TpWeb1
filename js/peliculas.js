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

  elementos.forEach(item => {
    const card = document.createElement("a");
    const linkDetalle = "info-pelicula.html";
    card.href = `${linkDetalle}?titulo=${encodeURIComponent(item.titulo)}`;
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" />
      <h3>${item.titulo}</h3>
    `;
    grilla.appendChild(card);
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

