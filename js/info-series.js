document.addEventListener("DOMContentLoaded", () => {
  const datos = DATA_PELISYSERIES;
  const titulo = new URLSearchParams(window.location.search).get("titulo");

  const serie = datos.find(
    s => s.titulo.trim().toLowerCase() === titulo.trim().toLowerCase() && s.tipo === "serie"
  );

  if (!serie) {
    document.querySelector("main").innerHTML = "<p style='padding: 2rem;'>Serie no encontrada.</p>";
    throw new Error("No se encontró la serie.");
  }

  document.getElementById("titulo").textContent = serie.titulo;
  document.getElementById("año").textContent = serie.año || "Desconocido";
  document.getElementById("genero").textContent = Array.isArray(serie.genero) ? serie.genero.join(", ") : serie.genero;
  document.getElementById("resumen").textContent = serie.resumen || "Descripción no disponible.";

  // Imagen y tráiler
  const img = document.getElementById("imagen");
  img.src = serie.imagen;
  img.alt = serie.titulo;
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    if (serie.trailer) {
      window.open(serie.trailer, "_blank");
    } else {
      alert("Tráiler no disponible.");
    }
  });

  const btnTrailer = document.getElementById("verTrailer");
  if (btnTrailer) {
    btnTrailer.addEventListener("click", () => {
      if (serie.trailer) {
        window.open(serie.trailer, "_blank");
      } else {
        alert("Tráiler no disponible.");
      }
    });
  }

  // Actores
  const listaActores = document.getElementById("actores");
  listaActores.innerHTML = "";

  if (Array.isArray(serie.elenco)) {
    serie.elenco.forEach(actor => {
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

  // Temporadas y capítulos
  const selTemporada = document.getElementById("temporadas");
  const selCapitulo = document.getElementById("capitulos");

  serie.temporadas.forEach((temp, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Temporada ${i + 1}`;
    selTemporada.appendChild(option);
  });

  selTemporada.addEventListener("change", () => {
    const index = selTemporada.value;
    selCapitulo.innerHTML = "";
    if (serie.temporadas[index]) {
      const caps = serie.temporadas[index].capitulos;
      caps.forEach((cap, i) => {
        const option = document.createElement("option");
        option.value = i;
        if (typeof cap === "string") {
          option.textContent = `${cap}`;
        } else {
          option.textContent = `${cap.titulo}`;
        }
        selCapitulo.appendChild(option);
      });
    }
  });

  selTemporada.dispatchEvent(new Event("change"));

  document.getElementById("verCapitulo").addEventListener("click", () => {
    const tIndex = selTemporada.value;
    const cIndex = selCapitulo.value;
    const cap = serie.temporadas[tIndex].capitulos[cIndex];

    if (typeof cap === "object" && cap.enlace) {
      window.open(cap.enlace, "_blank");
    } else {
      alert("Capítulo no disponible.");
    }
  });

  // Carrusel de recomendaciones
  const contenedor = document.getElementById("recomendaciones");
  const similares = datos.filter(p => p.tipo === "serie" && p.titulo !== serie.titulo);
  similares.slice(0, 10).forEach(sim => {
    const card = document.createElement("a");
    card.classList.add("card");
    card.href = `info-series.html?titulo=${encodeURIComponent(sim.titulo)}`;
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
