document.addEventListener("DOMContentLoaded", function () {
  const usuarioInput = document.getElementById("nombre");
  const contraseniaInput = document.getElementById("contrasenia");
  const iniciarBtn = document.getElementById("btn-iniciar");
  const errorMsg = document.createElement("p"); //	Crea un párrafo vacío

  errorMsg.style.color = "red";
  errorMsg.style.fontSize = "0.9rem";
  errorMsg.style.textAlign = "center";

  const form = document.querySelector(".login-form");
  form.appendChild(errorMsg); //Lo pone debajo del formulario

  const actualizarEstadoBoton = () => {
    iniciarBtn.disabled = !(
      usuarioInput.value.trim() && contraseniaInput.value.trim()
    );
  };

  //Sirve para escuchar eventos (como clics, escritura en campos, carga de página).Cuando el usuario escribe en el campo, se ejecuta una función.
  usuarioInput.addEventListener("input", actualizarEstadoBoton);
  contraseniaInput.addEventListener("input", actualizarEstadoBoton);

  iniciarBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Traemos del localStorage una lista de usuarios guardados como texto, y la convertimos a un array para poder usarla.
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarioInput.value.trim(); //.trim() Quita los espacios al principio y final de un texto.
    const pass = contraseniaInput.value;

    //Busca si existe un usuario con esos datos.
    // u representa..Cada elemento del array usuarios
    const encontrado = usuarios.find(
      (u) => u.usuario === usuario && u.contrasenia === pass
    );

    if (encontrado) {
      //al estar regristrado
      errorMsg.textContent = ""; //.textContent Cambia el texto que se ve en un elemento HTML.
      localStorage.setItem("usuario", JSON.stringify(encontrado)); //guarda usuario en inic sesi
      alert("¡Inicio de sesión exitoso!");
      window.location.href = "home.html";
    } else {
      //si no esta registrado,le pone el texto cuando hay un error
      errorMsg.textContent = "Usuario o contraseña incorrectos.";
    }
  });

  // Desactivar el botón al cargar
  iniciarBtn.disabled = true;
});

