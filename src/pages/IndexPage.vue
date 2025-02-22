<template>
  <q-page class="items-center row justify-evenly">
    <div class="items-start q-pa-md row q-gutter-md">
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="items-center row no-wrap">
            <div class="col">
              <div class="text-h6">Herramienta para la exportacion de SqlServer hacia MariaDB</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="items-center row no-wrap">
          <div class="col-auto">
            Especifique la ip donde se encuentra la Base de Datos de Siscont
          </div>
        </q-card-section>
        <q-form @submit.prevent="enviarIPServer">
          <q-input
            name="ip"
            placeholder="xxx.xxx.xxx.xxx"
            v-model="ip_server"
            label="Host"
            :rules="[(val) => !!val || 'La IP es requerida']"
          />
          <!-- <q-input name="puerto" placeholder="xxxx" v-model="port_server" label="Puerto" />
          <q-input
            name="database"
            placeholder="Nombre de la base de datos"
            v-model="database_server"
            label="Base de datos"
          />
          <q-input name="user" placeholder="Usuario" v-model="user_server" label="Usuario" />
          <q-input
            name="password"
            type="password"
            placeholder="Contraseña"
            v-model="password_server"
            label="Contraseña"
          /> -->
          <!-- Agrega un botón de submit -->
          <q-btn type="submit" color="primary">Enviar</q-btn>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router' // para redireccionar
import { useQuasar } from 'quasar' // para mostrar notificacion

const ip_server = ref('')
// const port_server = ref('')
// const database_server = ref('')
// const user_server = ref('')
// const password_server = ref('')
const router = useRouter()
const $q = useQuasar()

async function enviarIPServer() {
  try {
    const params = {
      host: ip_server.value,
      // port: parseInt(port_server.value), // Convierte a entero
      // database: database_server.value, // Agrega la variable de la base de datos
      // user: user_server.value,
      // password: password_server.value,
    }
    const respuesta = await axios.post('/conectar-params', params)
    console.log(respuesta.data)

    // Verificando si la conexion fue exitosa
    if (respuesta.data.status === 'success') {
      // redirige a ModulosPage.vue
      await router.push({ name: 'ModulosPage' })
      // Muestra notificación positiva si se conectó correctamente
      $q.notify({
        color: 'positive',
        message: 'Conexión exitosa.',
      })
    } else if (respuesta.data.status === 'error') {
      // Maneja cualquier otro status que indique un error

      $q.notify({
        color: 'negative',
        message: respuesta.data.message || 'Ocurrió un error al conectar.',
      })
    } else {
      $q.notify({
        color: 'negative',
        message: 'Respuesta desconocida del servidor.',
        icon: 'report_problem',
      })
    }
    // Maneja la respuesta según sea necesario
  } catch (error) {
    console.error(error)

    // Muestra un diálogo de error si ocurre una excepción
    $q.dialog({
      message: 'Ocurrió un error al intentar conectar con el servidor.',
      color: 'negative',
    })
  }
}
</script>

<style lang="sass" scoped>
.my-card
  width: 90%
  max-width: 800px
  margin:20px
  min-height: 300px
</style>
