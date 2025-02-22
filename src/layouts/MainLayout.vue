<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="text-white bg-primary" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-h6"> Siscont - ERPNext </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer reveal bordered class="text-white bg-grey-8">
      <q-toolbar class="items-center justify-center row">
        <q-toolbar-title class="text-center">
          Tecnomatica &copy; {{ currentYear }}
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const currentYear = ref(new Date().getFullYear())
    return { currentYear }
  },
})
</script>
