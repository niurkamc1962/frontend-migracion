<template>
  <div class="q-pa-md">
    <q-table
      title="Tablas Nomina"
      :rows="tablas"
      :columns="columns"
      row-key="tabla_sql"
      class="q-mt-md custom-table"
      :pagination="pagination"
    >
      <!-- Slot personalizado para las acciones -->
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            label="Relación con tablas"
            @click="verRelacion(props.row)"
            class="q-mr-sm"
          />
          <q-btn color="secondary" label="Importar Datos" @click="importarDatos(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para mostrar las relaciones -->
    <q-dialog v-model="mostrarDialogo">
      <q-layout view="Lhh lpR fff" container class="bg-white text-dark">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Diagrama de Relaciones</q-toolbar-title>
            <q-space />
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="q-pa-md">
            <div v-if="relaciones.length > 0">
              <TableDiagram :relations="relaciones" />
            </div>
            <div v-else>Sin relaciones para mostrar.</div>
          </q-page>
        </q-page-container>

        <q-footer class="bg-grey-3">
          <q-toolbar>
            <q-toolbar-title>Pie de página</q-toolbar-title>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios, { type AxiosError } from 'axios' // <-- Importar tipo AxiosError
import { useQuasar } from 'quasar'
import TableDiagram from 'components/TableDiagram.vue' // Importando el componente

// Para obtener los parametros de conexion que se almacenan en ipStore
import { useIPStore } from 'src/stores/ipStore'
const ipStore = useIPStore()

const $q = useQuasar()

// definiendo estado para almacenar las relaciones
const relaciones = ref<Relacion[]>([])

// Definiendo estado para controlar la ventana modal
const mostrarDialogo = ref(false)

// Definiendo la interfaz para las tablas sql
interface Tabla {
  nombre: string
  tabla_sql: string
}

// Definiendo la interfaz para la Relacion entre las tablas
interface Relacion {
  tabla_padre: string
  columna_padre: string
  tabla_hija: string
  columna_hija: string
}

// Definiendo las tablas que se relacionan con NOMINA en Siscont
const tablas: Tabla[] = [
  { nombre: 'Trabajadores', tabla_sql: 'SCPTRABAJADORES' },
  { nombre: 'Categorias Ocupacional', tabla_sql: 'SNOCATEGOCUP' },
  { nombre: 'Cargos', tabla_sql: 'SNOCARGOS' },
  { nombre: 'Tipo Trabajador', tabla_sql: 'SNOTIPOTRABAJADOR' },
  { nombre: 'Tipo Retenciones', tabla_sql: 'SCPCONRETPAGAR' },
  { nombre: 'Maestro Retenciones', tabla_sql: 'SCPMAESTRORETENCION' },
  { nombre: 'Pensionados', tabla_sql: 'SNOMANTPENS' },
  { nombre: 'Tasas de Destajo', tabla_sql: 'SNONOMENCLADORTASADESTAJO' },
  { nombre: 'Colectivos', tabla_sql: 'SNONOMENCLADORCOLECTIVOS' },
  { nombre: 'Submayor Vacaciones', tabla_sql: 'SNOSMVACACIONES' },
  { nombre: 'Submayor Salarios No reclamados', tabla_sql: 'SNOSMREINTEGRONR' },
  { nombre: 'SC-4-08', tabla_sql: 'SNOSMREINTEGRONR' },
]

// Definiendo las columnas
const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'left' as const,
    field: (row: Tabla) => row.nombre,
    sortable: true,
    headerClasses: 'my-header-class',
    classes: 'my-body-class',
  },
  {
    name: 'tabla',
    align: 'left' as const,
    label: 'Tabla',
    field: (row: Tabla) => row.tabla_sql,
    sortable: true,
    headerClasses: 'my-header-class',
    classes: 'my-body-class',
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center' as const,
    field: '',
    sortable: false,
    headerClasses: 'my-header-class',
    classes: 'my-body-class',
  },
]

// Definienco la paginacion personalizada
const pagination = {
  rowsPerPage: 15, // numero inicial para listar  por paginas
  rowsNumber: tablas.length,
}

// Funciones para  obtener la relacion de la tabla
async function verRelacion(tabla: Tabla) {
  console.log('Ver relación de:', tabla.nombre, 'y la tabla_sql: ', tabla.tabla_sql)

  // Verificando el tipo de dato de tabla.tabla_sql
  console.log('Tipo de tabla_sql: ', typeof tabla.tabla_sql)

  if (typeof tabla.tabla_sql !== 'string') {
    console.error('tabla.tabla_sql no es un string.')
    // Muestra un mensaje de error al usuario
    $q.notify({
      color: 'negative',
      message: 'Error: El nombre de la tabla no es válido.',
    })
    return // Sale de la función si no es un string
  }

  // Parametros de la conexion desde el store
  const params = {
    host: ipStore.ip_server,
    database: ipStore.db_name,
    password: ipStore.db_password,
  }
  // URL de la API
  const url_api = `${process.env.VUE_APP_API_BASE_URL}/table-relation/${tabla.tabla_sql}`
  // Haciendo la solicitud segun la API
  console.log('URL: ', url_api)
  console.log('parametros: ', params)

  try {
    // Haciendo la solicitud segun la API
    const response = await axios.post(url_api, params)

    // Verificar la estructura de la respuesta
    if (Array.isArray(response.data)) {
      const relacionesValidas = response.data.every((relacion) => {
        return (
          relacion.tabla_padre &&
          relacion.columna_padre &&
          relacion.tabla_hija &&
          relacion.columna_hija
        )
      })

      if (relacionesValidas) {
        relaciones.value = response.data // Almacenando las relaciones
        mostrarDialogo.value = true // Mostrando el diálogo
      } else {
        console.error('La respuesta del backend no tiene la estructura esperada')
      }
    } else {
      console.error('La respuesta del backend no es un array')
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ detail?: string }>
      if (axiosError.response) {
        console.error('Código de estado:', axiosError.response.status)
        console.error('Datos de respuesta:', axiosError.response.data)

        if (axiosError.response.status === 422) {
          console.error('Error de validación:', axiosError.response.data?.detail)
          // Mostrar notificación al usuario
          $q.notify({
            type: 'negative',
            message: `Error de validación: ${axiosError.response.data?.detail || 'Datos inválidos'}`,
          })
        }
      }
    } else {
      console.error('Error desconocido:', error)
    }
  }
}

function importarDatos(tabla: Tabla) {
  console.log('Importar datos de:', tabla.nombre)
  // Lógica para importar datos
}
</script>

<style>
.my-header-class {
  font-size: 16px !important;
  font-weight: bold !important;
}

.my-body-class {
  font-size: 14px !important;
}
</style>
