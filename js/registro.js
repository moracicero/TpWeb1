document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const confirmarBtn = document.querySelector("button[type='submit']");
  const cancelarBtn = document.querySelector(".cancelar");

  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const emailInput = document.getElementById("email");
  const usuarioInput = document.getElementById("nombre-usuario");
  const contraseniaInput = document.getElementById("contrasenia");
  const repetirInput = document.getElementById("repetir-contrasenia");
  const tarjetaInput = document.getElementById("numeroTarjeta");
  const codigoInput = document.getElementById("codigoSeguridad");

  const metodoTarjeta = document.getElementById("tarjeta");
  const metodoCupon = document.getElementById("cupon");
  const metodoTransferencia = document.getElementById("tranferencia");

  const pagoFacil = document.getElementById("pago-facil");
  const rapipago = document.getElementById("rapipago");

  // Mostrar errores
  const crearMensajeError = (input) => {
    const msg = document.createElement("span");
    msg.style.color = "white";
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

  let errorCupon = document.createElement("span");
  errorCupon.style.color = "white";
  errorCupon.style.fontSize = "0.8rem";
  errorCupon.classList.add("error-msg");
  metodoCupon.parentElement.insertAdjacentElement("afterend", errorCupon);

  // Validaciones
  const validarNombreApellido = (valor) => /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor.trim());
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarUsuario = (user) => /^[a-zA-Z0-9]+$/.test(user);
  const validarContrasenia = (pass) => {
    if (pass.length < 8) return false;
    const letras = (pass.match(/[A-Za-z]/g) || []).length;
    const numeros = (pass.match(/\d/g) || []).length;
    const simbolos = (pass.match(/[^A-Za-z0-9]/g) || []).length;
    return letras >= 2 && numeros >= 2 && simbolos >= 2;
  };
  const validarCodigo = (codigo) => /^[1-9]{3}$/.test(codigo);
  const validarTarjeta = (num) => {
    if (!/^\d{16}$/.test(num)) return false;
    const suma = [...num.slice(0, 15)].reduce((a, b) => a + parseInt(b), 0);
    const ultimo = parseInt(num[15]);
    return (suma % 2 === 0 && ultimo % 2 === 1) || (suma % 2 === 1 && ultimo % 2 === 0);
  };

  // Cambios entre métodos de pago
  const actualizarEstado = () => {
    let esValido = true;
    errorCupon.textContent = "";

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
      errores.contrasenia.textContent = "Mínimo 8 caracteres, 2 letras, 2 números y 2 símbolos.";
      esValido = false;
    } else errores.contrasenia.textContent = "";

    if (repetirInput.value !== contraseniaInput.value) {
      errores.repetir.textContent = "Las contraseñas no coinciden.";
      esValido = false;
    } else errores.repetir.textContent = "";

    if (metodoTarjeta.checked) {
      if (!validarCodigo(codigoInput.value)) {
        errores.codigo.textContent = "Debe ser 3 dígitos distintos de 0.";
        esValido = false;
      } else errores.codigo.textContent = "";

      if (!validarTarjeta(tarjetaInput.value)) {
        errores.tarjeta.textContent = "Tarjeta inválida.";
        esValido = false;
      } else errores.tarjeta.textContent = "";
    } else {
      errores.codigo.textContent = "";
      errores.tarjeta.textContent = "";
    }

    if (metodoCupon.checked) {
      if (!(pagoFacil.checked ^ rapipago.checked)) {
        errorCupon.textContent = "Elegí una opción: Pago Fácil o Rapipago.";
        esValido = false;
      }
    }

    confirmarBtn.disabled = !esValido;
    confirmarBtn.style.opacity = esValido ? 1 : 0.5;
    return esValido;
  };

  // Comportamiento para seleccionar una sola opción
  pagoFacil.addEventListener("change", () => {
    if (pagoFacil.checked) {
      rapipago.checked = false;
    }
    actualizarEstado();
  });

  rapipago.addEventListener("change", () => {
    if (rapipago.checked) {
      pagoFacil.checked = false;
    }
    actualizarEstado();
  });

  // Cambios entre métodos de pago
  const actualizarCamposMetodoPago = () => {
    tarjetaInput.disabled = true;
    codigoInput.disabled = true;
    pagoFacil.disabled = true;
    rapipago.disabled = true;

    tarjetaInput.value = "";
    codigoInput.value = "";
    pagoFacil.checked = false;
    rapipago.checked = false;

    if (metodoTarjeta.checked) {
      tarjetaInput.disabled = false;
      codigoInput.disabled = false;
    } else if (metodoCupon.checked) {
      pagoFacil.disabled = false;
      rapipago.disabled = false;
    }

    actualizarEstado();
  };

  metodoTarjeta.addEventListener("change", actualizarCamposMetodoPago);
  metodoCupon.addEventListener("change", actualizarCamposMetodoPago);
  metodoTransferencia.addEventListener("change", actualizarCamposMetodoPago);

  // Validar cada vez que se escribe
  form.addEventListener("input", actualizarEstado);

  // Enviar
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!actualizarEstado()) return;

    const metodoSeleccionado = document.querySelector(
      'input[name="tarjeta-cupon-transferencia"]:checked'
    )?.value;

    const nuevoUsuario = {
      nombre: nombreInput.value,
      apellido: apellidoInput.value,
      email: emailInput.value,
      usuario: usuarioInput.value,
      contrasenia: contraseniaInput.value,
      favoritos: [],
      metodoPago: metodoSeleccionado,
    };

    if (metodoSeleccionado === "tarjeta") {
      nuevoUsuario.numeroTarjeta = tarjetaInput.value;
      nuevoUsuario.codigoSeguridad = codigoInput.value;
    } else if (metodoSeleccionado === "cupon") {
      if (pagoFacil.checked) {
        nuevoUsuario.formaPago = ["pago-facil"];
      } else if (rapipago.checked) {
        nuevoUsuario.formaPago = ["rapipago"];
      }
    }

    let usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    const yaExiste = usuariosGuardados.some((u) => u.usuario === nuevoUsuario.usuario);
    if (yaExiste) {
      errores.usuario.textContent = "El usuario ya existe.";
      return;
    }

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    alert("¡Registro exitoso!");
    window.location.href = "index.html";
  });

  cancelarBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "index.html";
  });

  // Estado inicial
  actualizarCamposMetodoPago();
});
