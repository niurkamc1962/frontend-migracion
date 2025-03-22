<template>
  <div class="q-pa-md">
    <q-tree
      :nodes="treeData"
      node-key="label"
      default-expand-all
      class="q-mt-md"
      v-if="treeData.length > 0"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Definir las props
const props = defineProps<{
  relations: Array<{
    tabla_padre: string
    columna_padre: string
    tabla_hija: string
    columna_hija: string
  }>
}>()

// Definir el tipo para el objeto relacionPorTablaHija
type RelacionesPorTablaHija = {
  [key: string]: {
    label: string
    children: Array<{ label: string }>
  }
}

// Transformar las relaciones en una estructura compatible con q-tree
const treeData = computed(() => {
  const tree: Array<{ label: string; children: Array<{ label: string }> }> = []

  // Agrupar las relaciones por tabla_hija
  const relacionesPorTablaHija = props.relations.reduce<RelacionesPorTablaHija>((acc, relacion) => {
    // Inicializar el objeto de forma segura
    acc[relacion.tabla_hija] = acc[relacion.tabla_hija] || {
      label: `${relacion.tabla_hija} (${relacion.columna_hija})`,
      children: [],
    }

    // Asegurar a TypeScript que acc[relacion.tabla_hija] este definido para que no muestre mensaje error
    acc[relacion.tabla_hija]!.children.push({
      label: `${relacion.tabla_padre} (${relacion.columna_padre})`,
    })
    return acc
  }, {})

  // Convertir objeto a array usando Object.entries
  Object.entries(relacionesPorTablaHija).forEach(([, value]) => {
    tree.push(value)
  })

  return tree
})
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
