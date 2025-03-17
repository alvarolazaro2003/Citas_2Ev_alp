<template>
  <div class="fondo-pantalla">
    <div class="contenedor-perfil">
      <div class="caja-perfil">
        <h2>Perfil de Usuario</h2>

        <div v-if="mensajeError" class="error">{{ mensajeError }}</div>  <!-- Mensaje de error si ocurre algún problema -->

        <div v-else>    <!-- Mostrar la información del perfil (modo no edicion)-->
          <div class="informacion-perfil" v-if="!modoEdicion">
            <div class="elemento-perfil">
              <strong>Nombre:</strong>
              <span>{{ datosPerfil.nombre }}</span>
            </div>
            <div class="elemento-perfil">
              <strong>Apellido:</strong>
              <span>{{ datosPerfil.apellido }}</span>
            </div>
            <div class="elemento-perfil">
              <strong>Usuario:</strong>
              <span>{{ datosPerfil.usuario }}</span>
            </div>
            <div class="elemento-perfil">
              <strong>Correo:</strong>
              <span>{{ datosPerfil.correo }}</span>
            </div>
            <div class="elemento-perfil">
              <strong>Teléfono:</strong>
              <span>{{ datosPerfil.telefono }}</span>
            </div>
          </div>

          <div v-if="modoEdicion">   <!-- Mostrar la información del perfil (modo edicion)-->
            <div class="elemento-perfil">
              <label for="nombre">Nombre:</label>
              <input v-model="datosPerfil.nombre" id="nombre" type="text" />
            </div>
            <div class="elemento-perfil">
              <label for="apellido">Apellido:</label>
              <input v-model="datosPerfil.apellido" id="apellido" type="text" />
            </div>
            <div class="elemento-perfil">
              <label for="correo">Correo:</label>
              <input v-model="datosPerfil.correo" id="correo" type="email" />
            </div>
            <div class="elemento-perfil">
              <label for="telefono">Teléfono:</label>
              <input v-model="datosPerfil.telefono" id="telefono" type="text" />
            </div>
          </div>

          <button v-if="!modoEdicion" @click="editarPerfil">Editar perfil</button>  <!-- Botón para activar el modo edición -->
          <button v-if="modoEdicion" @click="guardarPerfil">Guardar cambios</button> <!-- Botón para guardar los cambios -->

          <button @click="volverInicio">Volver al inicio</button>  <!-- Botón para volver al inicio -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const datosPerfil = ref({   // Contiene los datos del perfil del usuario
  usuario: '',
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
});

const mensajeError = ref('');   // Mensaje de error, si ocurre alguno
const modoEdicion = ref(false);  // Modo edición (true: activado, false: desactivado)

const obtenerPerfil = async () => {  // Función para obtener el perfil del usuario
  try {
    const respuesta = await fetch('http://127.0.0.1:5000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Obtenemos el Token de autenticación
      },
    });

    if (respuesta.ok) {
      const datos = await respuesta.json();   // Obtenemos los datos del perfil (Si todo ha ido bien)
      datosPerfil.value = {
        usuario: datos.username,
        nombre: datos.name,
        apellido: datos.lastname,
        correo: datos.email,
        telefono: datos.phone,
      };
    } else {
      const datosError = await respuesta.json();
      mensajeError.value = datosError.msg || 'Error al obtener el perfil';
    }
  } catch (error) {
    mensajeError.value = 'Error al obtener el perfil'; // Mensaje de error si ocurre algún problema
  }
};

const guardarPerfil = async () => {  // Función para guardar los cambios (actualización con PATCH)
  try {
    const respuesta = await fetch('http://127.0.0.1:5000/currentUser', {
      method: 'PATCH', // Método PATCH para actualizar parcialmente los datos del perfil
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: datosPerfil.value.nombre,
        lastname: datosPerfil.value.apellido,
        email: datosPerfil.value.correo,
        phone: datosPerfil.value.telefono,
      }),
    });

    if (respuesta.ok) {
      const datos = await respuesta.json();
      datosPerfil.value = {
        usuario: datos.username,
        nombre: datos.name,
        apellido: datos.lastname,
        correo: datos.email,
        telefono: datos.phone,
      };
      modoEdicion.value = false; // Desactivar el modo edición después de guardar los cambios
      router.push('/verperfil'); // Redirigir al perfil después de guardar los cambios
    } else {
      const datosError = await respuesta.json();
      mensajeError.value = datosError.msg || 'Error al guardar los cambios';
    }
  } catch (error) {
    mensajeError.value = 'Error al guardar los cambios';
  }
};

const editarPerfil = () => { // Función para activar el modo edición
  modoEdicion.value = true;
};

const volverInicio = () => { // Función para volver al inicio
  router.push('/citas'); // Redirigir al inicio
};

onMounted(() => {
  obtenerPerfil();
});
</script>

<style scoped>
@import '/src/assets/perfil.scss'
</style>
