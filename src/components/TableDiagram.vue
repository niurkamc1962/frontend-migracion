<template>
  <div class="diagram-container" ref="networkContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Network } from 'vis-network'
import 'vis-network/styles/vis-network.css'

// Definir la interfaz para las relaciones
interface Relation {
  tabla_padre: string
  tabla_hija: string
}

// Definir la interfaz para los nodos y aristas
interface Node {
  id: string
  label?: string
}

interface Edge {
  from: string
  to: string
}

// Referencia al contenedor del diagrama
const networkContainer = ref<HTMLElement | null>(null)

// Definir las props con tipado
const props = defineProps<{
  relations: Relation[]
}>()

// Función para crear la red
const createNetwork = (relations: Relation[]) => {
  if (!networkContainer.value) return

  const nodes: Node[] = []
  const edges: Edge[] = []
  const nodeSet = new Set<string>()

  relations.forEach((relacion) => {
    if (!nodeSet.has(relacion.tabla_padre)) {
      nodes.push({ id: relacion.tabla_padre, label: relacion.tabla_padre })
      nodeSet.add(relacion.tabla_padre)
    }
    if (!nodeSet.has(relacion.tabla_hija)) {
      nodes.push({ id: relacion.tabla_hija, label: relacion.tabla_hija })
      nodeSet.add(relacion.tabla_hija)
    }
    edges.push({ from: relacion.tabla_padre, to: relacion.tabla_hija })
  })

  const data = {
    nodes: nodes,
    edges: edges,
  }

  const options = {
    layout: {
      hierarchical: {
        direction: 'UD', // Up-Down direction
        sortMethod: 'directed',
      },
    },
    edges: {
      arrows: {
        to: { enabled: true },
      },
    },
  }

  new Network(networkContainer.value, data, options)
}

// Observar cambios en las relaciones
watch(
  () => props.relations,
  (newRelations) => {
    if (newRelations && newRelations.length > 0) {
      createNetwork(newRelations)
    }
  },
  { immediate: true },
)

// Inicializar el diagrama cuando el componente se monta
onMounted(() => {
  if (props.relations && props.relations.length > 0) {
    createNetwork(props.relations)
  }
})
</script>

<style scoped>
.diagram-container {
  width: 100%;
  height: 500px; /* Ajusta la altura según tus necesidades */
}
</style>
