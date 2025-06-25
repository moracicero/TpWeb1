document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const confirmarBtn = document.querySelector(".btn");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const emailInput = document.getElementById("email");
  const usuarioInput = document.getElementById("nombre-usuario");
  const contraseniaInput = document.getElementById("contrasenia");
  const repetirInput = document.getElementById("repetir-contrasenia");
  const tarjetaInput = document.getElementById("numeroTarjeta");
  const codigoInput = document.getElementById("codigoSeguridad");

  // Crear contenedores de error
  const crearMensajeError = (input) => {
    let msg = document.createElement("span");
    msg.style.color = "red";
    msg.style.fontSize = "0.8rem";
    msg.classList.add("error-msg");
    input.insertAdjacentElement("afterend", msg);
    return msg;
  };

  const errores = {
    nombre: crearMensajeError(nombreInput),
    apellido: crearMensajeError(apellidoInput),
    email: crearMensajeError(emailInput),
    usuario: crearMensajeError(usuarioInput),
    contrasenia: crearMensajeError(contraseniaInput),
    repetir: crearMensajeError(repetirInput),
    tarjeta: crearMensajeError(tarjetaInput),
    codigo: crearMensajeError(codigoInput),
  };

  const validarNombreApellido = (valor) =>
    /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor.trim());
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarUsuario = (user) => /^[a-zA-Z0-9]+$/.test(user);
  const validarContrasenia = (pass) =>
    /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[^A-Za-z\d]){2,}).{8,}$/.test(
      pass
    );
  const validarCodigo = (codigo) => /^[1-9]{3}$/.test(codigo);
  const validarTarjeta = (num) => {
    if (!/^\d{16}$/.test(num)) return false;
    const suma = [...num.slice(0, 15)].reduce((a, b) => a + parseInt(b), 0);
    const ultimo = parseInt(num[15]);
    return (
      (suma % 2 === 0 && ultimo % 2 === 1) ||
      (suma % 2 === 1 && ultimo % 2 === 0)
    );
  };

  const metodoPagoRadios = document.getElementsByName("metodoPago");
  const datosTarjetaDiv = document.getElementById("datosTarjeta");

  function actualizarVisibilidadTarjeta() {
    const metodoSeleccionado = [...metodoPagoRadios].find(r => r.checked)?.value;
    datosTarjetaDiv.style.display = metodoSeleccionado === "tarjeta" ? "block" : "none";
  }

  metodoPagoRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      actualizarVisibilidadTarjeta();
      actualizarEstado(); // volver a validar
    });
  });

  actualizarVisibilidadTarjeta(); // al cargar

  const actualizarEstado = () => {
    let esValido = true;

    if (!validarNombreApellido(nombreInput.value)) {
      errores.nombre.textContent = "Solo letras.";
      esValido = false;
    } else errores.nombre.textContent = "";

    if (!validarNombreApellido(apellidoInput.value)) {
      errores.apellido.textContent = "Solo letras.";
      esValido = false;
    } else errores.apellido.textContent = "";

    if (!validarEmail(emailInput.value)) {
      errores.email.textContent = "Email inválido.";
      esValido = false;
    } else errores.email.textContent = "";

    if (!validarUsuario(usuarioInput.value)) {
      errores.usuario.textContent = "Solo letras y números.";
      esValido = false;
    } else errores.usuario.textContent = "";

    if (!validarContrasenia(contraseniaInput.value)) {
      errores.contrasenia.textContent =
        "Mínimo 8 caracteres, 2 letras, 2 números y 2 símbolos.";
      esValido = false;
    } else errores.contrasenia.textContent = "";

    if (repetirInput.value !== contraseniaInput.value) {
      errores.repetir.textContent = "Las contraseñas no coinciden.";
      esValido = false;
    } else errores.repetir.textContent = "";

    const metodoSeleccionado = [...metodoPagoRadios].find(r => r.checked)?.value;
    if (metodoSeleccionado === "tarjeta") {
      if (!validarCodigo(codigoInput.value)) {
        errores.codigo.textContent = "Debe ser 3 dígitos distintos de 0.";
        esValido = false;
      } else errores.codigo.textContent = "";

      if (!validarTarjeta(tarjetaInput.value)) {
        errores.tarjeta.textContent =
          "Tarjeta inválida (regla de par/impar no se cumple).";
        esValido = false;
      } else errores.tarjeta.textContent = "";
    } else {
      errores.codigo.textContent = "";
      errores.tarjeta.textContent = "";
    }

    confirmarBtn.style.pointerEvents = esValido ? "auto" : "none";
    confirmarBtn.style.opacity = esValido ? 1 : 0.5;

    return esValido;
  };

  form.addEventListener("input", actualizarEstado);

  confirmarBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!actualizarEstado()) return;

    const nuevoUsuario = {
      nombre: nombreInput.value,
      apellido: apellidoInput.value,
      email: emailInput.value,
      usuario: usuarioInput.value,
      contrasenia: contraseniaInput.value,
    };

    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    const yaExiste = usuariosGuardados.some(
      (u) => u.usuario === nuevoUsuario.usuario
    );

    if (yaExiste) {
      errores.usuario.textContent = "El usuario ya existe.";
      return;
    }

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
    alert("¡Registro exitoso!");
    window.location.href = "index.html";
  });

  const cancelarBtn = document.querySelectorAll(".btn")[1];
  cancelarBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "index.html";
  });

  actualizarEstado();
});

