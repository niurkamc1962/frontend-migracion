<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="text-white bg-primary" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-h6"> Siscont - ERPNext </q-toolbar-title>

        <q-space />

        <div v-if="ipStore.ip_server">
          <div class="q-pa-md">
            <div class="q-gutter-md row items-start">
              <q-select
                filled
                v-model="ipStore.selectedOption"
                :options="options"
                label="Modulos"
                label-color="white"
                style="width: 250px"
                color="primary"
                @update:model-value="handleOptionChange"
              />
            </div>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="items-start q-pa-md row q-gutter-md">
        <q-card v-if="!ipStore.ip_server" flat bordered class="my-card">
          <q-card-section>
            <div class="items-center row no-wrap">
              <div class="col">
                <div class="text-h6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident ea, rerum
                  debitis voluptate eius voluptatibus cumque iure explicabo nam obcaecati libero
                  repudiandae enim ullam, consectetur illum laudantium nemo facere voluptates!
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="items-center row no-wrap">
            <div class="row q-gutter-md">
              Especifique los datos del servidor:
              <q-form @submit.prevent="enviarIPServer">
                <q-input
                  name="ip"
                  placeholder="xxx.xxx.xxx.xxx"
                  v-model="ip_server"
                  label="IP SQLServer"
                  :rules="[(val) => !!val || 'La ip es requerida']"
                  class="col-4"
                />
                <q-input
                  name="dbname"
                  placeholder="Nombre de la base de datos"
                  v-model="db_name"
                  label="Nombre DB"
                  :rules="[(val) => !!val || 'El nombre de la base de datos es requerido']"
                  class="col-4"
                />
                <q-input
                  name="password"
                  placeholder="Contraseña"
                  v-model="db_password"
                  label="Contraseña"
                  type="password"
                  :rules="[(val) => !!val || 'La contraseña es requerida']"
                  class="col-4"
                />
                <q-btn type="submit" color="primary" class="col-4">Enviar</q-btn>
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- <div v-if="ipStore.selectedOption" class="text-h6 q-mt-md">
        Opcion seleccionada: {{ ipStore.selectedOption }}
      </div> -->
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="text-white primary">
      <q-toolbar class="items-center justify-center row">
        <q-toolbar-title class="text-center">
          Tecnomática &copy; {{ currentYear }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useIPStore } from 'src/stores/ipStore'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const currentYear = ref(new Date().getFullYear())

    const ipStore = useIPStore()
    const $q = useQuasar()
    const router = useRouter()

    const ip_server = ref('')
    const db_name = ref('')
    const db_password = ref('')
    const selectedOption = ref<string | null>(null)
    const menuVisible = ref(false)

    const toggleMenu = () => {
      menuVisible.value = !menuVisible.value
    }

    const options = computed(() => [
      { label: 'Modulo Nomina', value: 'nomina', routeName: 'nomina' },
      { label: 'Modulo 2', value: 'modulo2', routeName: 'modulo2' },
      { label: 'Modulo 3', value: 'modulo3', routeName: 'modulo3' },
      { label: 'Modulo 4', value: 'modulo4', routeName: 'modulo4' },
      { label: 'Salir', value: 'salir', routeName: 'index' },
    ])

    const enviarIPServer = async () => {
      // mostrando loading mientras se realiza la conexion con el servidor de BD
      $q.loading.show({
        message: 'Autenticando con el servidor de BD ...',
      })
      try {
        // Actualizando los valores en el store
        ipStore.setIpServer(ip_server.value)
        ipStore.setDbName(db_name.value)
        ipStore.setDbPassword(db_password.value)

        const params = {
          host: ip_server.value,
          database: db_name.value,
          password: db_password.value,
        }
        const url_api = `${process.env.VUE_APP_API_BASE_URL}/conectar-params`
        const respuesta = await axios.post(url_api, params)

        // Ocultando el loading antes de pasar al notify
        $q.loading.hide()

        if (respuesta.data.status === 'success') {
          ipStore.setIpServer(ip_server.value)
          // Redireccionando segun la opcion seleccionada
          if (ipStore.selectedOption) {
            console.log('ipstore: ', ipStore)
            const routeName = ipStore.selectedOption
            if (routeName != 'index') {
              await router.push({ name: routeName })
            } else {
              // si la opcion es salir entonces redirecciona a index
              ipStore.resetIpServer()
              await router.push({ name: 'index' })
            }
          }
          $q.notify({ color: 'positive', message: 'Conexion exitosa' })
        } else {
          $q.notify({
            color: 'negative',
            message: respuesta.data.message || 'Ocurrio error al conectar con el servidor de BD',
          })
        }
      } catch (error) {
        console.log(error)
        $q.loading.hide()
        $q.notify({
          color: 'negative',
          message: 'Ocurrio error al intentar conectar con el servidor',
        })
      }
    }

    // funcion para manejar la opcion seleccionada
    const handleOptionChange = async (selectedOption: {
      label: string
      value: string
      routeName: string
    }) => {
      const routeName = selectedOption.routeName
      if (routeName === 'index') {
        ipStore.resetIpServer()
        await router.push({ name: routeName })
      } else {
        // Redireccionando a la pagina del Modulo para el tratamiento a las Tablas
        await router.push({ name: routeName })
      }
      menuVisible.value = false // Cerrando el menú después de seleccionar
    }

    return {
      currentYear,
      ipStore,
      ip_server,
      db_name,
      db_password,
      toggleMenu,
      selectedOption,
      options,
      handleOptionChange,
      enviarIPServer,
      menuVisible,
    }
  },
})
</script>

<style lang="sass" scoped>
.my-card
  width: 90%
  max-width: 800px
  margin:40px auto  // aumenta el margen superior e inferior y centra horizontal
  min-height: 300px
  padding: 20px  // Anade pagging interno para mas espacio
</style>
