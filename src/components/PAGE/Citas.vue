<!-- Correcto funciona -->
<template>
  <div class="fondo-pantalla">

    <div class="citas-container">
    <div class="header">
      <h2>Mis Citas</h2>

      <button @click="verPerfil" class="profile-button">Ver mi Perfil</button> <!-- Botón para ver el perfil -->   
      <button @click="mostrarModal = true" class="logout-button">Cerrar Sesión</button> <!-- Botón para cerrar sesión -->
    </div>

    <button @click="router.push('/crearcitas')" class="create-button">Crear Cita</button> <!-- Botón para ir a la página de creación de citas -->

    <p v-if="mensajeError" class="error">{{ mensajeError }}</p> <!-- Mostrar mensaje de error -->
    <p v-if="mensajeTodoBien" class="success">{{ mensajeTodoBien }}</p> <!-- Mostrar mensaje de que todo va bien -->

    <!-- Mostrar las citas existentes -->
    <div v-if="!mensajeError && citas.length > 0">
      <ul>
        <li v-for="(cita, index) in citas" :key="cita.id">
          <p><strong>Centro Medico:</strong> {{ cita.center }}</p>
          <p><strong>Fecha:</strong> {{ cita.date }}</p>
          <button @click="cancelarCita(cita)" class="cancel-button">Cancelar Cita</button> <!-- Botón para cancelar la cita -->
        </li>
      </ul>
    </div>
    <p v-if="!mensajeError && citas.length === 0">No tienes citas.</p> <!-- Muestra el mensaje si no hay citas -->

    <!-- Modal de confirmación -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <p>¿Estás seguro de que quieres cerrar sesión?</p>
        <button @click="cerrarSesion" class="confirm-button">Sí</button>
        <button @click="mostrarModal = false" class="cancel-button">No</button>
      </div>
    </div>
  </div>


  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const citas = ref([]); // Array para almacenar las citas
const mensajeError = ref(''); // Guarda el mensaje de error
const mensajeTodoBien = ref(''); // Guarda el mensaje de error
const mostrarModal = ref(false); // Estado para mostrar el modal

const obtenerCitasUsuario = async () => {   // Función para obtener las citas de un usuario
  try {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage

    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
    }

    const response = await fetch('http://127.0.0.1:5000/date/getByUser', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Enviar el token en el encabezado Authorization
      },
    });

    const data = await response.json(); // Convertir la respuesta a JSON
    citas.value = data;  // Asignamos las citas obtenidas a la variable 'citas'

  } catch (error) {
    mensajeError.value = error.message || 'Hubo un error'; // Mostrar el mensaje de error si ocurre algo
  }
};


const obtenerTodasCitas = async () => {
  try {
    const token = localStorage.getItem('token');  // Obtener el token del localStorage

    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
    }

    const response = await fetch('http://127.0.0.1:5000/dates', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Enviar el token en el encabezado Authorization
      },
    });

    const data = await response.json(); // Convertir la respuesta a JSON
    citas.value = data;  // Asignamos las citas obtenidas a la variable 'citas'

  } catch (error) {
    mensajeError.value = error.message || 'Hubo un error'; // Mostrar el mensaje de error si ocurre algo
  }
};


const cancelarCita = async (cita) => {   // Función para cancelar una cita
  try {
    const token = localStorage.getItem('token');  

    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
    }

    const response = await fetch('http://127.0.0.1:5000/date/delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        center: cita.center,  // Enviamos el centro de la cita
        date: cita.date,    // Enviamos la fecha de la cita
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Error al cancelar la cita');
    }

    mensajeTodoBien.value = 'Cita cancelada con éxito';
    obtenerCitasUsuario();  // Volvemos a obtener las citas después de cancelar una

  } catch (error) {
    mensajeError.value = error.message || 'Hubo un error';
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/'); // Redirige a la página de inicio
};

const verPerfil = () => { // Función para redirigir al perfil
  router.push('/verperfil');
};

onMounted(obtenerCitasUsuario);
onMounted(obtenerTodasCitas);

</script>

<style lang="scss" scoped>
@import '/src/assets/citas.scss';


</style>