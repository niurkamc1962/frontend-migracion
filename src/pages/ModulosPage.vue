<template>
  <q-page class="items-center row justify-evenly">
    <div class="items-start q-pa-md row q-gutter-md">
      <div class="items-center row no-wrap">
        <div class="text-h6">Modulos de Siscont para la exportacion de los datos a JSON</div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useIpStore } from 'src/stores/ipStore'

const ipStore = useIpStore()

console.log('ipStore: ', ipStore)
</script>

<style lang="sass" scoped></style>
