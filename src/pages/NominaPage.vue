<template>
  <div>
    <div v-if="ipStore.selectedOption" class="text-h6 q-mt-md">
      NominaPage opcion seleccionada: {{ ipStore.selectedOption }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIPStore } from 'src/stores/ipStore' // importando el store

const ipStore = useIPStore()
</script>
