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
    card.href = `detalle.html?titulo=${encodeURIComponent(item.titulo)}`;
    card.innerHTML = `
      <img src="${item.imagen}" alt="${item.titulo}" />
      <h3>${item.titulo}</h3>
    `;
    grilla.appendChild(card);
  });
}

// Filtrar por género y/o título
function aplicarFiltros() {
  const generoSeleccionado = selectGenero.value;
  const tituloBuscado = inputBusqueda.value.trim().toLowerCase();

  let filtrados = data;

  // Filtro por género
  if (generoSeleccionado !== "todos") {
    filtrados = filtrados.filter(item => {
      if (Array.isArray(item.genero)) {
        return item.genero.map(g => g.toLowerCase()).includes(generoSeleccionado);
      } else {
        return item.genero.toLowerCase() === generoSeleccionado;
      }
    });
  }

  // Filtro por búsqueda de texto
  if (tituloBuscado !== "") {
    filtrados = filtrados.filter(item =>
      item.titulo.toLowerCase().includes(tituloBuscado)
    );
  }

  renderizarGrilla(filtrados);
}

// Cargar géneros únicos al <select>
function cargarGeneros() {
  const generosUnicos = [...new Set(data.flatMap(item => item.genero.map(g => g.toLowerCase())))];
  
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
