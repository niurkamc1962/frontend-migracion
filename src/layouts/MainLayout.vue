<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="text-white bg-primary" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-h6"> Siscont - ERPNext </q-toolbar-title>

        <q-space />
        <div v-if="ip_server" class="text-h6 text-white">Conectado a: {{ ip_server }}</div>
        <q-btn @click="toggleMenu" flat icon="menu" />
      </q-toolbar>
      <q-menu v-model="menuVisible">
        <q-list>
          <q-item @click="optionSelected('opcion1')">Opcion 1</q-item>
          <q-item @click="optionSelected('opcion2')">Opcion 2</q-item>
          <q-item @click="optionSelected('opcion3')">Opcion 3</q-item>
        </q-list>
      </q-menu>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="text-white primary">
      <q-toolbar class="items-center justify-center row">
        <q-toolbar-title class="text-center">
          Tecnomatica &copy; {{ currentYear }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useIpStore } from 'src/stores/ipStore'

export default defineComponent({
  setup() {
    const currentYear = ref(new Date().getFullYear())

    const ipStore = useIpStore()
    const menuVisible = ref(false)

    const toggleMenu = () => {
      menuVisible.value = !menuVisible.value
    }

    const optionSelected = (option: string) => {
      // Aqui manegar la opcion seleccionada
      switch (option) {
        case 'opcion1':
          console.log('Opcion 1 ')
          break
        case 'opcion2':
          console.log('Opcion 2 ')
          break
        case 'opcion3':
          console.log('Opcion 3 ')
          break
        case 'opcion4':
          console.log('Opcion 4')
          break
        default:
          console.log('Opcion no valida')
      }

      menuVisible.value = false // cerrando el menu despues de seleccionar
    }
    return {
      currentYear,
      ip_server: computed(() => ipStore.ip_server),
      toggleMenu,
      optionSelected,
      menuVisible,
    }
  },
})
</script>
