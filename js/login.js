document.addEventListener("DOMContentLoaded", function () {
  const usuarioInput = document.getElementById("nombre");
  const contraseniaInput = document.getElementById("contrasenia");
  const iniciarBtn = document.getElementById("btn-iniciar");
  const errorMsg = document.createElement("p");

  errorMsg.style.color = "red";
  errorMsg.style.fontSize = "0.9rem";
  errorMsg.style.textAlign = "center";

  const form = document.querySelector(".login-form");
  form.appendChild(errorMsg);

  const actualizarEstadoBoton = () => {
    iniciarBtn.disabled = !(
      usuarioInput.value.trim() && contraseniaInput.value.trim()
    );
  };

  usuarioInput.addEventListener("input", actualizarEstadoBoton);
  contraseniaInput.addEventListener("input", actualizarEstadoBoton);

  iniciarBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarioInput.value.trim();
    const pass = contraseniaInput.value;

    const encontrado = usuarios.find(
      (u) => u.usuario === usuario && u.contrasenia === pass
    );

    if (encontrado) {
      errorMsg.textContent = "";
      alert("¡Inicio de sesión exitoso!");
      window.location.href = "home.html"; // Cambia el nombre si tu página es otra
    } else {
      errorMsg.textContent = "Usuario o contraseña incorrectos.";
    }
  });

  // Desactivar el botón al cargar
  iniciarBtn.disabled = true;
});
