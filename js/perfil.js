document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (!usuario) {
    alert("No hay sesión iniciada.");
    window.location.href = "index.html";
    return;
  }

  // Elementos
  const nombreUsuario = document.getElementById("nombre-usuario");
  const emailInput = document.getElementById("email");
  const contraseniaInput = document.getElementById("ingresar-contrasenia");
  const repetirContraseniaInput = document.getElementById("repetir-contrasenia");
  const numeroTarjeta = document.getElementById("numeroTarjeta");
  const codigoSeguridad = document.getElementById("codigoSeguridad");
  const pagoFacil = document.getElementById("pago-facil");
  const rapipago = document.getElementById("rapipago");
  const tarjetaRadio = document.getElementById("tarjeta");
  const cuponRadio = document.getElementById("cupon");
  const transferenciaRadio = document.getElementById("tranferencia");
  const btnGuardar = document.getElementById("btn-guardar");
  const btnCancelar = document.getElementById("btn-cancelar");
  const cerrarSesionBtn = document.getElementById("cerrar-sesion");

  // Mostrar datos
  nombreUsuario.textContent = usuario.nombre || "Usuario sin nombre";
  emailInput.value = usuario.email || "";

  // Cartel de ayuda para contraseña
  const mensajePass = document.createElement("span");
  mensajePass.style.fontSize = "0.8rem";
  mensajePass.style.color = "white";
  mensajePass.textContent = "Mínimo 8 caracteres, 2 letras, 2 números y 2 símbolos.";
  contraseniaInput.insertAdjacentElement("afterend", mensajePass);

  if (usuario.metodoPago === "tarjeta") {
    tarjetaRadio.checked = true;
    numeroTarjeta.value = usuario.numeroTarjeta || "";
    codigoSeguridad.value = usuario.codigoSeguridad || "";
  } else if (usuario.metodoPago === "cupon") {
    cuponRadio.checked = true;
    if (usuario.formaPago?.includes("pago-facil")) pagoFacil.checked = true;
    if (usuario.formaPago?.includes("rapipago")) rapipago.checked = true;
  } else if (usuario.metodoPago === "tranferencia") {
    transferenciaRadio.checked = true;
  }

  // Validaciones auxiliares
  function validarPassword(password) {
    const letras = (password.match(/[A-Za-z]/g) || []).length;
    const numeros = (password.match(/\d/g) || []).length;
    const simbolos = (password.match(/[^A-Za-z0-9]/g) || []).length;
    return password.length >= 8 && letras >= 2 && numeros >= 2 && simbolos >= 2;
  }

  function validarTarjeta(numero) {
    if (!/^\d{16}$/.test(numero)) return false;
    const suma = numero.slice(0, -1).split("").reduce((acc, n) => acc + parseInt(n), 0);
    const ultimo = parseInt(numero[15]);
    return (
      (suma % 2 === 0 && ultimo % 2 === 1) ||
      (suma % 2 === 1 && ultimo % 2 === 0)
    );
  }

  function validarCodigo(codigo) {
    return /^[1-9]{3,4}$/.test(codigo);
  }

  function validarFormulario() {
    const password = contraseniaInput.value.trim();
    const repetir = repetirContraseniaInput.value.trim();
    const metodo = document.querySelector('input[name="tarjeta-cupon-transferencia"]:checked')?.value;

    let valido = true;

    if (password || repetir) {
      if (password !== repetir || !validarPassword(password)) {
        valido = false;
      }
    }

    if (metodo === "tarjeta") {
      if (!validarTarjeta(numeroTarjeta.value) || !validarCodigo(codigoSeguridad.value)) {
        valido = false;
      }
      numeroTarjeta.disabled = false;
      codigoSeguridad.disabled = false;
      pagoFacil.checked = false;
      rapipago.checked = false;
      pagoFacil.disabled = true;
      rapipago.disabled = true;
    } else if (metodo === "cupon") {
      if (!(pagoFacil.checked ^ rapipago.checked)) {
        valido = false;
      }
      numeroTarjeta.value = "";
      codigoSeguridad.value = "";
      numeroTarjeta.disabled = true;
      codigoSeguridad.disabled = true;
      pagoFacil.disabled = false;
      rapipago.disabled = false;
    } else {
      numeroTarjeta.value = "";
      codigoSeguridad.value = "";
      pagoFacil.checked = false;
      rapipago.checked = false;
      numeroTarjeta.disabled = true;
      codigoSeguridad.disabled = true;
      pagoFacil.disabled = true;
      rapipago.disabled = true;
    }

    btnGuardar.disabled = !valido;
  }

  // Para asegurar que solo una opción entre pago-fácil y rapipago esté activa
  pagoFacil.addEventListener("change", () => {
    if (pagoFacil.checked) rapipago.checked = false;
    validarFormulario();
  });
  rapipago.addEventListener("change", () => {
    if (rapipago.checked) pagoFacil.checked = false;
    validarFormulario();
  });

  [
    contraseniaInput,
    repetirContraseniaInput,
    emailInput,
    numeroTarjeta,
    codigoSeguridad,
    tarjetaRadio,
    cuponRadio,
    transferenciaRadio,
  ].forEach((el) => el.addEventListener("input", validarFormulario));

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const metodo = document.querySelector('input[name="tarjeta-cupon-transferencia"]:checked')?.value;

    const nuevoUsuario = {
      ...usuario,
      email: emailInput.value,
      metodoPago: metodo,
    };

    if (contraseniaInput.value) {
      nuevoUsuario.contrasenia = contraseniaInput.value;
    }

    if (metodo === "tarjeta") {
      nuevoUsuario.numeroTarjeta = numeroTarjeta.value;
      nuevoUsuario.codigoSeguridad = codigoSeguridad.value;
      delete nuevoUsuario.formaPago;
    } else if (metodo === "cupon") {
      nuevoUsuario.formaPago = [];
      if (pagoFacil.checked) nuevoUsuario.formaPago.push("pago-facil");
      if (rapipago.checked) nuevoUsuario.formaPago.push("rapipago");
      delete nuevoUsuario.numeroTarjeta;
      delete nuevoUsuario.codigoSeguridad;
    } else {
      delete nuevoUsuario.numeroTarjeta;
      delete nuevoUsuario.codigoSeguridad;
      delete nuevoUsuario.formaPago;
    }

    // Verificar si hubo cambios
    if (JSON.stringify(nuevoUsuario) === JSON.stringify(usuario)) {
      alert("⚠️ No realizaste ningún cambio.");
      return;
    }

    localStorage.setItem("usuarioSesionIniciada", JSON.stringify(nuevoUsuario));

    const index = usuarios.findIndex((u) => u.usuario === nuevoUsuario.usuario);
    if (index !== -1) {
      usuarios[index] = nuevoUsuario;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    alert("Datos actualizados correctamente.");
  });

 btnCancelar.addEventListener("click", () => {
  if (confirm("¿Seguro que querés cancelar los cambios?")) {
    window.location.href = "home.html"; // o a donde quieras volver
  }
});


  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioSesionIniciada");
      window.location.href = "index.html";
    });
  }

  validarFormulario();
});
