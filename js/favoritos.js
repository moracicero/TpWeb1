function getUsuarioActivo() {
  return JSON.parse(localStorage.getItem("usuarioActivo"));
}

function guardarFavoritos(usuario) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let index = usuarios.findIndex(u => u.username === usuario.username);
  if (index !== -1) {
    usuarios[index] = usuario;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

function toggleFavorito(id, tipo) {
  let usuario = getUsuarioActivo();
  if (!usuario) return;

  if (!usuario.favoritos) {
    usuario.favoritos = { peliculas: [], series: [] };
  }

  let lista = usuario.favoritos[tipo];
  let index = lista.indexOf(id);

  if (index === -1) {
    lista.push(id);
  } else {
    lista.splice(index, 1);
  }

  guardarFavoritos(usuario);
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
  actualizarCorazon(id, tipo);
}

function actualizarCorazon(id, tipo) {
  let usuario = getUsuarioActivo();
  let esFavorito = usuario && usuario.favoritos && usuario.favoritos[tipo].includes(id);
  let corazon = document.getElementById('heart-' + id);
  if (corazon) {
    corazon.style.color = esFavorito ? "red" : "gray";
  }
}
