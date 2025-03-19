<template>
  <div class="q-pa-md">
    <q-table title="Tablas Nomina" :rows="tablas" :columns="columns" row-key="tabla_sql">
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
  </div>
</template>

<script setup lang="ts">
interface Tabla {
  nombre: string
  tabla_sql: string
}

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

const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'left' as const,
    field: (row: Tabla) => row.nombre,
    sortable: true,
  },
  {
    name: 'tabla',
    align: 'left' as const,
    label: 'Tabla',
    field: (row: Tabla) => row.tabla_sql,
    sortable: true,
  },
  {
    name: 'acciones',
    label: 'Acciones',
    align: 'center' as const,
    field: '',
    sortable: false,
  },
]

// Funciones para las acciones
function verRelacion(tabla: Tabla) {
  console.log('Ver relación de:', tabla.nombre)
  // Lógica para ver la relación
}

function importarDatos(tabla: Tabla) {
  console.log('Importar datos de:', tabla.nombre)
  // Lógica para importar datos
}
</script>
