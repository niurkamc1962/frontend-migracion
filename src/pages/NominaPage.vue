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
          <q-btn color="secondary" label="Generar JSON" @click="generarJSON(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Diálogo para mostrar las relaciones -->
    <q-dialog v-model="mostrarDialogo" :style="dialogStyles">
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
              <TreeDiagram :relations="relaciones" />
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
import { ref, computed } from 'vue'
import axios, { type AxiosError } from 'axios' // <-- Importar tipo_campo AxiosError
import { useQuasar } from 'quasar'
import TreeDiagram from 'src/components/TreeDiagram.vue' // Importando el componente

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
  campos: Campo[]
  nombre_doctype: string
}

// Definiendo interfaz para Campo
interface Campo {
  nombre_campo: string
  tipo_campo: string
  obligatorio: boolean
  nombre_campo_erp: string
  tipo_campo_erp: string
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
  {
    nombre: 'Trabajadores',
    nombre_doctype: 'employees',
    tabla_sql: 'SCPTRABAJADORES',
    campos: [
      {
        nombre_campo: 'CPTrabConsecutivoID',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: 'entity_number',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CPTrabNombre',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: 'first_name',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CPTrabPriApellido',
        tipo_campo: 'last_name',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CPTrabSegApellido',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabSexo',
        tipo_campo: 'char',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CategId',
        tipo_campo: 'int',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CargId',
        tipo_campo: 'int',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabFechaAlta',
        tipo_campo: 'datetime',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabFechaBaja',
        tipo_campo: 'datetime',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabFormaCobro',
        tipo_campo: 'char',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabTmagnMN',
        tipo_campo: 'char',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabCorreo',
        tipo_campo: 'varchar',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TrabCPVacaciones',
        tipo_campo: 'smallint',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Categorias Ocupacional',
    tabla_sql: 'SNOCATEGOCUP',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'CategODescripcion',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Cargos',
    tabla_sql: 'SNOCARGOS',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'CargDescripcion',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Tipo Trabajador',
    tabla_sql: 'SNOTIPOTRABAJADOR',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'TipTrabDescripcion',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Tipo Retenciones',
    tabla_sql: 'SCPCONRETPAGAR',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'CPCRetDescripcion',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CRetDeudaCon',
        tipo_campo: 'decimal',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'ClcuIDCuenta',
        tipo_campo: 'smallint',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CRetPPrioridad',
        tipo_campo: 'smallint',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CRetPPenAlimenticia',
        tipo_campo: 'smallint',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'CRetPConPlazos',
        tipo_campo: 'smallint',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Pensionadas',
    tabla_sql: 'SNOMANTPENS',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'MantPensCiPens',
        tipo_campo: 'varchar',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'MantPensNombre',
        tipo_campo: 'varchar',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'MantPensPriApe',
        tipo_campo: 'varchar',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'MantPensSegApe',
        tipo_campo: 'varchar',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'MantPensDir',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'MantPensFormPag',
        tipo_campo: 'char',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'MantPensTMagn',
        tipo_campo: 'char',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Tasas de Destajo',
    tabla_sql: 'SNONOMENCLADORTASASDESTAJO',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'TasaDDescripcion',
        tipo_campo: 'varchar',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
      {
        nombre_campo: 'TasaDTasa',
        tipo_campo: 'decimal',
        obligatorio: false,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  {
    nombre: 'Colectivos',
    tabla_sql: 'SNONOMENCLADORCOLECTIVOS',
    nombre_doctype: '',
    campos: [
      {
        nombre_campo: 'ColecDescripcion',
        tipo_campo: 'char',
        obligatorio: true,
        nombre_campo_erp: '',
        tipo_campo_erp: '',
      },
    ],
  },
  // { nombre: 'Submayor Vacaciones', tabla_sql: 'SNOSMVACACIONES', campos: [] },
  // { nombre: 'Pensionados', tabla_sql: 'SCPMAESTRORETENCION', campos: [] },
  // { nombre: 'Submayor Salarios No reclamados', tabla_sql: 'SNOSMREINTEGRONR', campos: [] },
  // { nombre: 'SC-4-08', tabla_sql: 'SNOSMREINTEGRONR', campos: [] },
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

  // Verificando el tipo_campo de dato de tabla.tabla_sql
  console.log('tipo_campo de tabla_sql: ', typeof tabla.tabla_sql)

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

async function generarJSON(tabla: Tabla) {
  console.log('Importar datos de:', tabla.nombre)
  const fields = tabla.campos.map((campo) => ({
    nombre_campo: campo.nombre_campo,
    tipo_campo: campo.tipo_campo,
    obligatorio: campo.obligatorio,
    nombre_campo_erp: campo.nombre_campo_erp,
    tipo_campo_erp: campo.tipo_campo_erp,
  }))

  const params = {
    host: ipStore.ip_server,
    database: ipStore.db_name,
    password: ipStore.db_password,
  }

  const url_api = `${process.env.VUE_APP_API_BASE_URL}/table-data/${tabla.tabla_sql}`

  // Contruyendo el objeto JSON manualmente
  const payload = {
    params: params,
    fields: fields,
  }

  // Haciendo la solicitud segun la API
  console.log('URL: ', url_api)
  console.log('payload: ', payload)

  try {
    const response = await axios.post(url_api, payload)
    console.log('Datos importados correctamente:', response.data)

    $q.notify({
      type: 'positive',
      message: `Datos de ${tabla.nombre} importados exitosamente.`,
    })
  } catch (error) {
    console.error('Error al importar datos:', error)

    $q.notify({
      type: 'negative',
      message: `Error al importar datos de ${tabla.nombre}.`,
    })
  }
}

// Calcular dinámicamente el tamaño del diálogo
const dialogStyles = computed(() => {
  const baseWidth = 600
  const baseHeight = 400
  const numRelaciones = relaciones.value.length

  const width = Math.min(1200, baseWidth + numRelaciones * 50) // Ajusta el factor multiplicativo según sea necesario
  const height = Math.min(800, baseHeight + numRelaciones * 40) // Ajusta el factor multiplicativo según sea necesario

  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})
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
