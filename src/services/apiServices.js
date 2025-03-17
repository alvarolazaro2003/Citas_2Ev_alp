// src/services/apiService.js

const API_URL = 'http://192.168.1.112:5000';

const apiService = {
  // Obtener citas de un usuario
  async obtenerCitasUsuario() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No estás autenticado. Por favor, inicia sesión primero.');

      const response = await fetch(`${API_URL}/date/getByUser`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener las citas');

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Obtener todas las citas
  async obtenerTodasCitas() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No estás autenticado. Por favor, inicia sesión primero.');

      const response = await fetch(`${API_URL}/dates`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al obtener las citas');

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Cancelar cita
  async cancelarCita(cita) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No estás autenticado. Por favor, inicia sesión primero.');

      const response = await fetch(`${API_URL}/date/delete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Iniciar sesión
  async iniciarSesion(usuario, contrasena) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usuario, password: contrasena }),
      });

      if (!response.ok) throw new Error('Usuario o contraseña incorrectos');

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Obtener perfil
  async obtenerPerfil() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No estás autenticado. Por favor, inicia sesión primero.');

      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al obtener el perfil');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Guardar perfil (actualización con PATCH)
  async guardarPerfil(datosPerfil) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No estás autenticado. Por favor, inicia sesión primero.');

      const response = await fetch(`${API_URL}/currentUser`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: datosPerfil.nombre,
          lastname: datosPerfil.apellido,
          email: datosPerfil.correo,
          phone: datosPerfil.telefono,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al guardar los cambios');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Registro de usuario
  async register(userData) {
    try {
      const formattedDate = new Date(userData.date).toLocaleDateString('en-GB');

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          phone: userData.phone,
          username: userData.username,
          password: userData.password,
          date: formattedDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Hubo un error');
    }
  },

  // Cerrar sesión
  async cerrarSesion() {
    localStorage.removeItem('token');
  },
};

export default apiService;
