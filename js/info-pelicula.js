document.addEventListener("DOMContentLoaded", () => {
  const datos = DATA_PELISYSERIES;
  const titulo = new URLSearchParams(window.location.search).get("titulo");

  const pelicula = datos.find(
    p => p.titulo.trim().toLowerCase() === titulo.trim().toLowerCase() && p.tipo === "pelicula"
  );

  if (!pelicula) {
    document.querySelector("main").innerHTML = "<p style='padding: 2rem;'>Película no encontrada.</p>";
    throw new Error("No se encontró la película.");
  }

  document.getElementById("titulo").textContent = pelicula.titulo;
  document.getElementById("año").textContent = pelicula.año || "Desconocido";
  document.getElementById("genero").textContent = Array.isArray(pelicula.genero) ? pelicula.genero.join(", ") : pelicula.genero;
  document.getElementById("resumen").textContent = pelicula.resumen || "Descripción no disponible.";

  // Imagen y tráiler
  const img = document.getElementById("imagen");
  img.src = pelicula.imagen;
  img.alt = pelicula.titulo;
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    if (pelicula.trailer) {
      window.open(pelicula.trailer, "_blank");
    } else {
      alert("Tráiler no disponible.");
    }
  });

  const btnTrailer = document.getElementById("verTrailer");
  if (btnTrailer) {
    btnTrailer.addEventListener("click", () => {
      if (pelicula.trailer) {
        window.open(pelicula.trailer, "_blank");
      } else {
        alert("Tráiler no disponible.");
      }
    });
  }

 // Actores
  const listaActores = document.getElementById("actores");
  listaActores.innerHTML = "";

  if (Array.isArray(pelicula.elenco)) {
    pelicula.elenco.forEach(actor => {
      if (actor.nombre && actor.link) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = actor.link;
        a.target = "_blank";
        a.textContent = actor.nombre;
        a.style.color = "black"; // para que se vean en negro
        li.appendChild(a);
        listaActores.appendChild(li);
      }
    });
  }


 // Carrusel de recomendaciones
  const contenedor = document.getElementById("recomendaciones");
  const similares = datos.filter(p => p.tipo === "pelicula" && p.titulo !== pelicula.titulo);
  similares.slice(0, 10).forEach(sim => {
    const card = document.createElement("a");
    card.classList.add("card");
    card.href = `info-pelicula.html?titulo=${encodeURIComponent(sim.titulo)}`;
    card.innerHTML = `
      <img src="${sim.imagen}" alt="${sim.titulo}">
      <p>${sim.titulo}</p>
    `;
    contenedor.appendChild(card);
  });

  // Flechas del carrusel
  const btnPrev = document.getElementById("prevBtn");
  const btnNext = document.getElementById("nextBtn");
  const carrusel = document.querySelector(".recomendaciones");

  if (btnPrev && btnNext && carrusel) {
    btnPrev.addEventListener("click", () => {
      carrusel.scrollBy({ left: -200, behavior: "smooth" });
    });

    btnNext.addEventListener("click", () => {
      carrusel.scrollBy({ left: 200, behavior: "smooth" });
    });
  }
});