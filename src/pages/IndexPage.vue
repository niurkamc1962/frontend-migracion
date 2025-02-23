<template>
  <q-page class="items-center row justify-evenly">
    <div class="items-start q-pa-md row q-gutter-md">
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="items-center row no-wrap">
            <div class="col">
              <div class="text-h6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam at aperiam, eligendi
                illum eveniet sapiente optio id, voluptates officiis assumenda, vero accusamus
                deleniti eum odio maiores vel cumque ratione ullam.
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="items-center row no-wrap">
          <div class="col-auto">
            Especifique la ip donde se encuentra la Base de Datos de Siscont
          </div>
        </q-card-section>
        <q-form @submit.prevent="enviarIPServer">
          <div class="col"></div>
          <div class="col"></div>
          <q-input
            name="ip"
            placeholder="xxx.xxx.xxx.xxx"
            v-model="ip_server"
            label="Host"
            :rules="[(val) => !!val || 'La IP es requerida']"
            class="q-mb-md"
          />
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
import { useIpStore } from 'src/stores/ipStore' // importando el store

const ip_server = ref('')
const ipStore = useIpStore()

const router = useRouter()
const $q = useQuasar()

async function enviarIPServer() {
  try {
    const params = {
      host: ip_server.value,
    }

    const url_api = `${process.env.VUE_APP_API_BASE_URL}`
    console.log(`${url_api}/conectar-params`)

    const respuesta = await axios.post(
      `${process.env.VUE_APP_API_BASE_URL}/conectar-params`,
      params,
    )
    console.log('respuesta: ', respuesta)
    // Verificando si la conexion fue exitosa
    if (respuesta.data.status === 'success') {
      // almacena la IP en el estado global
      ipStore.setIpServer(ip_server.value)
      // redirige a ModulosPage.vue
      await router.push({ name: 'modulos' })
      // Muestra notificación positiva si se conectó correctamente
      $q.notify({
        color: 'positive',
        message: 'Conexión exitosa.',
      })
    } else if (respuesta.data.status === 'error') {
      // Mensaje error
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

    // Muestra un mensaje de error si ocurre una excepción
    $q.notify({
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
  margin:40px auto  // aumenta el margen superior e inferior y centra horizontal
  min-height: 300px
  padding: 20px  // Anade pagging interno para mas espacio
</style>
