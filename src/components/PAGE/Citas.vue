<template>
  <div class="fondo-pantalla">
    <div class="citas-container">
      <div class="header">
        <h2>Citas</h2>

        <button @click="verPerfil" class="profile-button">Ver mi Perfil</button>
        <button @click="mostrarModal = true" class="logout-button">Cerrar Sesión</button>
      </div>

      <button @click="router.push('/crearcitas')" class="create-button">Crear Cita</button>

      <p v-if="mensajeError" class="error">{{ mensajeError }}</p>
      <p v-if="mensajeTodoBien" class="success">{{ mensajeTodoBien }}</p>

      <div v-if="!mensajeError && misCitas.length > 0">
        <h3>Mis Citas</h3>
        <ul>
          <li v-for="(cita, index) in misCitas" :key="cita.id">
            <p><strong>Centro Médico:</strong> {{ cita.center }}</p>
            <p><strong>Fecha:</strong> {{ cita.date }}</p>
            <button @click="cancelarCita(cita)" class="cancel-button">Cancelar Cita</button>
          </li>
        </ul>
      </div>
      <p v-if="!mensajeError && misCitas.length === 0">No tienes citas.</p>

      <div v-if="!mensajeError && todasCitas.length > 0">
        <h3>Todas las Citas</h3>
        <ul>
          <li v-for="(cita, index) in todasCitas" :key="cita.id">
            <p><strong>Centro Médico:</strong> {{ cita.center }}</p>
            <p><strong>Fecha:</strong> {{ cita.date }}</p>
          </li>
        </ul>
      </div>
      <p v-if="!mensajeError && todasCitas.length === 0">No hay ninguna cita creada por otro usuario.</p>

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
const misCitas = ref([]); 
const todasCitas = ref([]); 
const mensajeError = ref('');
const mensajeTodoBien = ref('');
const mostrarModal = ref(false);

const obtenerCitasUsuario = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
    }

    const response = await fetch('http://127.0.0.1:5000/date/getByUser', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    misCitas.value = data;

  } catch (error) {
    mensajeError.value = error.message || 'Hubo un error';
  }
};

const obtenerTodasCitas = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No estás autenticado. Por favor, inicia sesión primero.');
    }

    const response = await fetch('http://127.0.0.1:5000/dates', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    todasCitas.value = data;

  } catch (error) {
    mensajeError.value = error.message || 'Hubo un error';
  }
};

const cancelarCita = async (cita) => {
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
        center: cita.center,
        date: cita.date,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Error al cancelar la cita');
    }

    mensajeTodoBien.value = 'Cita cancelada con éxito';
    obtenerCitasUsuario();

  } catch (error) {
    mensajeError.value = error.message || 'Hubo un error';
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/');
};

const verPerfil = () => {
  router.push('/verperfil');
};

onMounted(obtenerCitasUsuario);
onMounted(obtenerTodasCitas);

</script>

<style lang="scss" scoped>
@import '/src/assets/citas.scss';
</style>
