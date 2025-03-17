<template>
  <div class="contenedor-login">
    <div class="formulario-login">
      <h2>Inicia Sesión</h2>
      <form @submit.prevent="iniciarSesion">
        <div class="contenedor-input">
          <label for="usuario">Nombre de usuario</label>
          <input id="usuario" v-model="usuario" type="text" required />
        </div>
        <div class="contenedor-input">
          <label for="contrasena">Contraseña</label>
          <input id="contrasena" v-model="contrasena" type="password" required />
        </div>
        <button type="submit" class="boton-login">Iniciar sesión</button>
      </form>
      <p class="texto-registro">¿Aún no tienes cuenta? <span @click="irARegistrar" class="enlace-registro">Regístrate</span></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const router = useRouter();
const usuario = ref('');
const contrasena = ref('');
let tiempoInactividad;

// Función para cerrar sesión por inactividad
const cerrarSesion = () => {
  Swal.fire('Sesión cerrada', 'No hubo actividad durante 5 segundos', 'info');
  localStorage.removeItem('token'); // Elimina el token del almacenamiento local
  router.push('/'); // Redirige a la página principal o de inicio de sesión
};

// Función para reiniciar el temporizador de inactividad
const reiniciarTemporizador = () => {
  clearTimeout(tiempoInactividad); // Borra el temporizador anterior
  tiempoInactividad = setTimeout(cerrarSesion, 5000); // Inicia un nuevo temporizador de 5 segundos
};

// Función para iniciar sesión
const iniciarSesion = async () => {
  try {
    const respuesta = await fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: usuario.value, password: contrasena.value }),
    });

    if (!respuesta.ok) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    const datos = await respuesta.json();
    localStorage.setItem('token', datos.access_token);
    Swal.fire('Inicio de sesión exitoso', 'Bienvenido', 'success');
    router.push('/citas');

    // Inicia el temporizador de inactividad
    reiniciarTemporizador();

    // Detecta eventos de interacción del usuario y reinicia el temporizador
    document.addEventListener('mousemove', reiniciarTemporizador);
    document.addEventListener('keydown', reiniciarTemporizador);
    document.addEventListener('click', reiniciarTemporizador);
  } catch (error) {
    Swal.fire('Error', error.message || 'Hubo un error', 'error');
  }
};

// Función para ir a la página de registro
const irARegistrar = () => {
  router.push('/registrarse');
};
</script>

<style scoped>
@import "/src/assets/login.scss";
</style>
