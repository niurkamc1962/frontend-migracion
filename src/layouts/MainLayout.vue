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
      <!-- Contenedor para el formulario centrado -->
      <div v-if="!ipStore.ip_server" class="row justify-center q-pt-xl">
        <q-card flat bordered class="form-card">
          <q-card-section>
            <div class="text-h6 text-center q-mb-md">Configuración de conexión al servidor</div>
            <q-separator class="q-mb-md" />
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
          </q-card-section>
        </q-card>
      </div>

      <!--  Contenedor para la vista de módulos -->
      <div v-if="ipStore.ip_server && $route.name === 'index'" class="full-width q-pa-xl">
        <q-card flat bordered class="my-card">
          <q-img src="/siscont-2018.jpg" class="card-image" alt="Siscont" />
          <q-card-section class="card-content">
            <div class="text-h4 text-primary q-mb-md">Siscont - ERPNext</div>
            <div class="text-body1">
              Sistema integral de gestión empresarial que incluye:
              <ul class="q-mt-sm">
                <li>Módulo de Administración</li>
                <li>Módulo General</li>
                <li>Contabilidad General</li>
                <li>Contabilidad de Costo (incluye consolidación)</li>
                <li>Estados Financieros (incluye consolidación)</li>
                <li>Activos fijos</li>
                <li>Cobros y pagos</li>
                <li>Inventarios y Útiles y herramientas.</li>
                <li>Control de Almacén (escenarios internos y externos)</li>
                <li>Nómina y Cálculo de Sistemas de Pagos</li>
                <li>Gestión Comercial. Ventas de Productos y Servicios. (Plataforma WEB)</li>
                <li>Gestión Comercial. Compras. (Plataforma WEB)</li>
                <li>Gestión de Inversiones (Plataforma WEB)</li>
                <li>Módulo Gerencial (Plataforma WEB)</li>
                <li>Módulo Presupuesto (Plataforma WEB)</li>
                <li>Herramienta de Consolidación de inventarios (Plataforma WEB)</li>
              </ul>
            </div>
            <!-- Version fuera del flex principal -->
            <div class="text-caption version-text">
              Versión 2.1 - Desarrollado por Tecnomática © {{ currentYear }}
            </div>
          </q-card-section>
        </q-card>
      </div>

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
      // Mostrando loading mientras se realiza la conexión con el servidor de BD
      $q.loading.show({
        message: 'Autenticando con el servidor de BD ...',
      })
      try {
        const params = {
          host: ip_server.value,
          database: db_name.value,
          password: db_password.value,
        }
        const url_api = `${process.env.VUE_APP_API_BASE_URL}/conectar-params`
        const respuesta = await axios.post(url_api, params)

        // Ocultando el loading antes de mostrar notificaciones
        $q.loading.hide()

        // Validar si la respuesta contiene datos (indicador de éxito)
        if (respuesta.data && respuesta.data.table_count > 0) {
          // Actualizando los valores en el store solo si es exitosa
          ipStore.setIpServer(ip_server.value)
          ipStore.setDbName(db_name.value)
          ipStore.setDbPassword(db_password.value)

          // Redireccionando según la opción seleccionada
          if (ipStore.selectedOption) {
            const routeName = ipStore.selectedOption
            if (routeName !== 'index') {
              await router.push({ name: routeName })
            } else {
              // Si la opción es salir entonces redirecciona a index
              ipStore.resetIpServer()
              await router.push({ name: 'index' })
            }
          }
          $q.notify({ color: 'positive', message: 'Conexión exitosa' })
        } else {
          $q.notify({
            color: 'negative',
            message: 'No se encontraron tablas en la base de datos o conexión fallida.',
          })
        }
      } catch (error) {
        console.error(error)
        $q.loading.hide()
        $q.notify({
          color: 'negative',
          message: 'Ocurrió un error al intentar conectar con el servidor.',
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
// Estilo para el formulario centrado
.form-card
  width: 100%
  max-width: 500px
  padding: 20px
  margin: 20px

// Estilo para la vista de módulos
.full-width
  width: 100%

.my-card
  width: 100%
  margin: 40px 0
  min-height: 300px
  padding: 20px
  display: flex
  gap: 20px
  @media (max-width: 768px)
    flex-direction: column

.card-image
  flex: 0 0 40%
  max-height: 300px
  object-fit: contain

.card-content
  flex: 1

.version-text
  width: 100%
  margin-top: 20px

// Estilos adicionales para mejorar el formulario
.q-form
  min-width: 300px

.text-h6
  font-weight: 600
</style>
