// Cargamos los datos del localStorage o desde el JSON directamente
const data = JSON.parse(localStorage.getItem("peliculasyseries")) || DATA_PELISYSERIES;

// Referencias al DOM
const grilla = document.getElementById("grilla-home");
const inputBusqueda = document.getElementById("inputBusqueda");
const botonBuscar = document.getElementById("botonBuscar");
const selectGenero = document.getElementById("selectGenero");

// Renderizar grilla
function renderizarGrilla(elementos) {
  grilla.innerHTML = "";

  elementos.forEach(item => {
    const card = document.createElement("a");
    const linkDetalle = item.tipo === "pelicula" ? "info-pelicula.html" : "info-series.html";
    card.href = `${linkDetalle}?titulo=${encodeURIComponent(item.titulo)}`;
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" />
      <h3>${item.titulo}</h3>
    `;
    grilla.appendChild(card);
  });
}

// Filtrar por género y/o búsqueda
function aplicarFiltros() {
  const generoSeleccionado = selectGenero.value.toLowerCase();
  const tituloBuscado = inputBusqueda.value.trim().toLowerCase();

  let filtrados = data.filter(item => {
    // Filtro por género
    const cumpleGenero =
      generoSeleccionado === "todos" ||
      (Array.isArray(item.genero)
        ? item.genero.map(g => g.toLowerCase()).includes(generoSeleccionado)
        : item.genero.toLowerCase() === generoSeleccionado);

    // Filtro por título parcial (no exacto)
    const cumpleBusqueda =
      tituloBuscado === "" ||
      item.titulo.toLowerCase().includes(tituloBuscado);

    return cumpleGenero && cumpleBusqueda;
  });

  renderizarGrilla(filtrados);
}

// Cargar géneros únicos al <select>
function cargarGeneros() {
  const generosUnicos = [...new Set(data.flatMap(item =>
    Array.isArray(item.genero) ? item.genero.map(g => g.toLowerCase()) : [item.genero.toLowerCase()]
  ))];

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
renderizarGrilla(data);

