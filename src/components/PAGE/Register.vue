<template>
  <div class="register-container">
    <div class="register-box">
      <h2>Registro</h2>
      <div class="input-group">
        <input v-model="name" placeholder="Nombre" />
        <input v-model="lastname" placeholder="Apellido" />
        <input v-model="email" type="email" placeholder="Correo" />
        <input v-model="phone" placeholder="Teléfono" />
        <input v-model="date" type="date" placeholder="Fecha de nacimiento" />
        <input v-model="username" placeholder="Usuario" />
        <input v-model="password" type="password" placeholder="Contraseña" />
      </div>
      <button @click="register">Registrarse</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
      <p class="login-link">¿Ya estás registrado? <a href="#" @click="goToLogin">Inicia sesión</a></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const router = useRouter();

const username = ref('');
const password = ref('');
const name = ref('');
const lastname = ref('');
const email = ref('');
const phone = ref('');
const date = ref('');
const errorMsg = ref('');
const successMsg = ref('');

const register = async () => {
  try {
    const formattedDate = new Date(date.value).toLocaleDateString('en-GB');

    const response = await fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        lastname: lastname.value,
        email: email.value,
        phone: phone.value,
        username: username.value,
        password: password.value,
        date: formattedDate,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      successMsg.value = data.msg;
      errorMsg.value = '';
      Swal.fire('Cuenta creada con éxito', '', 'success');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const errorData = await response.json();
      errorMsg.value = errorData.msg || 'Error en el registro';
      successMsg.value = '';
      Swal.fire('Error', errorData.msg || 'Error en el registro', 'error');
    }
  } catch (error) {
    errorMsg.value = 'Error en el registro';
    successMsg.value = '';
    Swal.fire('Error', 'Error en el registro', 'error');
  }
};



const goToLogin = () => {
  router.push('/login');
};
</script>



<style scoped>
@import "../../Registro.scss";
</style>
