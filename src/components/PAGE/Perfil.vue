<template>
  <div class="fondo-pantalla">
    <div class="contenedor-perfil">
      <div class="caja-perfil">
        <h2>Perfil de Usuario</h2>

        <div v-if="mensajeError" class="error">{{ mensajeError }}</div>  

        <div v-else>   
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

          <div v-if="modoEdicion">  
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

          <button v-if="!modoEdicion" @click="editarPerfil">Editar perfil</button>  
          <button v-if="modoEdicion" @click="guardarPerfil">Guardar cambios</button> 

          <button @click="volverInicio">Volver al inicio</button>  
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const datosPerfil = ref({  
  usuario: '',
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
});

const mensajeError = ref('');   
const modoEdicion = ref(false);  

const obtenerPerfil = async () => {  
  try {
    const respuesta = await fetch('http://127.0.0.1:5000/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
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
    } else {
      const datosError = await respuesta.json();
      mensajeError.value = datosError.msg || 'Error al obtener el perfil';
    }
  } catch (error) {
    mensajeError.value = 'Error al obtener el perfil'; 
  }
};

const guardarPerfil = async () => {  
  try {
    const respuesta = await fetch('http://127.0.0.1:5000/currentUser', {
      method: 'PATCH', 
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
      modoEdicion.value = false;
      router.push('/verperfil'); 
    } else {
      const datosError = await respuesta.json();
      mensajeError.value = datosError.msg || 'Error al guardar los cambios';
    }
  } catch (error) {
    mensajeError.value = 'Error al guardar los cambios';
  }
};

const editarPerfil = () => { 
  modoEdicion.value = true;
};

const volverInicio = () => { 
  router.push('/citas'); 
};

onMounted(() => {
  obtenerPerfil();
});
</script>

<style scoped>
@import '/src/assets/perfil.scss'
</style>
