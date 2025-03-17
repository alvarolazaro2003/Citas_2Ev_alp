<template>
  <div class="fondo-pantalla">
    <div class="crear-cita-container">
      <h2>Crear Cita</h2>
      <div>
        <select v-model="centroSeleccionado">
          <option value="" disabled>Seleccione un centro de salud</option>
          <option v-for="centro in centrosDisponibles" :key="centro.name" :value="centro.name">
            {{ centro.name }}
          </option>
        </select>

        <!-- Calendario -->
        <DatePicker v-model="fechaCita" :min-date="new Date()" :disabled-dates="citasOcupadas" />

        <button @click="crearCita">Crear Cita</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DatePicker from '@vuepic/vue-datepicker';
import Swal from 'sweetalert2';  // Importar SweetAlert2
import '@vuepic/vue-datepicker/dist/main.css';

const router = useRouter();
const centroSeleccionado = ref('');
const fechaCita = ref(null);
const citasOcupadas = ref([]);

// Centros de salud disponibles
const centrosDisponibles = [
  { name: 'Centro de Salud Madrid Norte', address: 'Calle de la Salud, 123, Madrid' },
  { name: 'Centro Médico Madrid Sur', address: 'Avenida de la Medicina, 456, Madrid' }
];

// Convertir fecha al formato del servidor
const formatoFecha = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const dia = d.getDate().toString().padStart(2, '0');
  const mes = (d.getMonth() + 1).toString().padStart(2, '0');
  const año = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, '0');
  return `${dia}/${mes}/${año} ${horas}:00:00`;
};

// Crear una nueva cita
const crearCita = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No estás autenticado. Inicia sesión.');

    if (!fechaCita.value) throw new Error('Debes seleccionar una fecha');

    // Verificar si la fecha ya está ocupada
    if (citasOcupadas.value.some(cita => cita.getTime() === fechaCita.value.getTime())) {
      throw new Error('La fecha seleccionada ya está ocupada');
    }

    const fechaFormateada = formatoFecha(fechaCita.value);
    const respuesta = await fetch('http://127.0.0.1:5000/date/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        center: centroSeleccionado.value,
        date: fechaFormateada,
      }),
    });

    if (!respuesta.ok) {
      const datosError = await respuesta.json();
      throw new Error(datosError.msg || 'Error al crear la cita');
    }

    const datos = await respuesta.json();
    Swal.fire({
      icon: 'success',
      title: 'Cita creada',
      text: datos.msg,
    });

    setTimeout(() => router.push('/citas'), 2000);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Hubo un error',
    });
  }
};

// Volver a la página de citas
const volverACitas = () => {
  router.push('/citas');
};
</script>

<style lang="scss" scoped>
@import "/src/assets/crearcitas.scss";
</style>
