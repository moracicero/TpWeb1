document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));


  const nombreUsuario = document.getElementById("nombre-usuario");
  const emailInput = document.getElementById("email");
  const contraseniaInput = document.getElementById("ingresar-contrasenia");
  const repetirContraseniaInput = document.getElementById(
    "repetir-contrasenia"
  );
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


  if (usuario) {
    nombreUsuario.textContent = usuario.nombre || "Usuario sin nombre";
    emailInput.value = usuario.email || "";

   
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
  }


  function validarPassword(password) {
    const regex =
      /^(?=(?:.*[A-Za-z]){2,})(?=(?:.*\d){2,})(?=(?:.*[!@#$%^&*()_+[\]{};':",.<>?\\|`~\-=/]){2,}).{8,}$/;
    return regex.test(password);
  }

  function validarTarjeta(numero) {
    if (!/^\d{16}$/.test(numero)) return false;
    const suma = numero
      .slice(0, -1)
      .split("")
      .reduce((acc, n) => acc + parseInt(n), 0);
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
    const metodo = document.querySelector(
      'input[name="tarjeta-cupon-transferencia"]:checked'
    )?.value;

    let valido = true;

    if (password || repetir) {
      if (password !== repetir || !validarPassword(password)) {
        valido = false;
      }
    }

    if (metodo === "tarjeta") {
      if (
        !validarTarjeta(numeroTarjeta.value) ||
        !validarCodigo(codigoSeguridad.value)
      ) {
        valido = false;
      }
    } else if (metodo === "cupon") {
      if (!pagoFacil.checked && !rapipago.checked) {
        valido = false;
      }
    }

    btnGuardar.disabled = !valido;
  }


  [
    contraseniaInput,
    repetirContraseniaInput,
    numeroTarjeta,
    codigoSeguridad,
    pagoFacil,
    rapipago,
    tarjetaRadio,
    cuponRadio,
    transferenciaRadio,
  ].forEach((el) => el.addEventListener("input", validarFormulario));

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const metodo = document.querySelector(
      'input[name="tarjeta-cupon-transferencia"]:checked'
    )?.value;

    const nuevoUsuario = {
      ...usuario,
      email: emailInput.value,
      metodoPago: metodo,
    };

   
    if (contraseniaInput.value) {
      nuevoUsuario.contrasenia = contraseniaInput.value;
      delete nuevoUsuario.password; 
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

   
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));

  
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const index = usuarios.findIndex((u) => u.usuario === nuevoUsuario.usuario); 

    if (index !== -1) {
      usuarios[index] = nuevoUsuario;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    alert("Datos actualizados correctamente.");
  });

  btnCancelar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que querés cancelar la suscripción?")) {
      localStorage.removeItem("usuario");
      window.location.href = "index.html";
    }
  });

  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.href = "index.html";
    });
  }

  // Validación inicial
  validarFormulario();
});

