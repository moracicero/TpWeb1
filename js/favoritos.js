const getUsuarioActivo = () => {
  const usuario = localStorage.getItem("usuarioSesionIniciada");
  return usuario ? JSON.parse(usuario) : null;
};

const getUsuarios = () => {
  const usuarios = localStorage.getItem("usuarios");
  return usuarios ? JSON.parse(usuarios) : [];
};

const usuarioActivo = getUsuarioActivo();
const usuarios = getUsuarios();

if (!usuarioActivo) {
  document.querySelector(".grilla").textContent = "No hay sesión iniciada.";
} else {
  const usuarioIndex = usuarios.findIndex(u => u.usuario === usuarioActivo.usuario);

  if (usuarioIndex === -1) {
    document.querySelector(".grilla").textContent = "Usuario no encontrado.";
  } else {
    const favoritos = usuarios[usuarioIndex].favoritos || [];

    function agregarFavoritos(listaFavoritos) {
      const nodoRaiz = document.querySelector(".grilla");
      nodoRaiz.innerHTML = '';

      if (listaFavoritos.length === 0) {
        nodoRaiz.innerHTML = `<p style="text-align: center;">No tenés favoritos guardados.</p>`;
        return;
      }

      for (let elemento of listaFavoritos) {
        const nodoCard = document.createElement("div");
        nodoCard.className = "card";

        const esSerie = elemento.tipo === "serie";
        const linkHref = esSerie
          ? `info-series.html?titulo=${encodeURIComponent(elemento.titulo)}`
          : `info-pelicula.html?titulo=${encodeURIComponent(elemento.titulo)}`;

        nodoCard.innerHTML = `
          <a href="${linkHref}">
            <img src="${elemento.imagen}" alt="${elemento.titulo}" class="img">
          </a>
          <div class="card-info">
            <h3>${elemento.titulo}</h3>
            <i class="fa-solid fa-heart heart-icon activo" title="${elemento.titulo}"></i>
          </div>
        `;

        nodoRaiz.appendChild(nodoCard);

        const heart = nodoCard.querySelector(".heart-icon");

        heart.addEventListener("click", (e) => {
          e.preventDefault();
          const titulo = e.target.getAttribute("title");

          const index = favoritos.findIndex(p => p.titulo === titulo);
          if (index !== -1) {
            favoritos.splice(index, 1);
          }

          usuarios[usuarioIndex].favoritos = favoritos;
          localStorage.setItem("usuarios", JSON.stringify(usuarios));
          localStorage.setItem("usuarioSesionIniciada", JSON.stringify(usuarios[usuarioIndex]));

          agregarFavoritos(favoritos); // volver a renderizar
        });
      }
    }

    agregarFavoritos(favoritos);
  }
}

// Buscador de favoritos
const nodoInputSearch = document.querySelector(".search");
if (nodoInputSearch) {
  nodoInputSearch.addEventListener("keyup", () => {
    const nombreABuscar = nodoInputSearch.value.toLowerCase();
    const nodoRaiz = document.getElementById(".grilla");
    const nodosPeliculas = nodoRaiz.querySelectorAll(".card");

    nodosPeliculas.forEach((card) => {
      const titulo = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = titulo.includes(nombreABuscar) ? "block" : "none";
    });
  });
}
