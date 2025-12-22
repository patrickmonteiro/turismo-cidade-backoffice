<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Turismo Cidade </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <q-item v-for="route in menuRoutes" :key="route.path" :to="route.path" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon :name="route.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ route.title }}</q-item-label>
            <q-item-label caption>{{ route.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface MenuRoute {
  path: string;
  title: string;
  caption: string;
  icon: string;
}

const menuRoutes: MenuRoute[] = [
  {
    path: '/',
    title: 'Home',
    caption: 'Página inicial',
    icon: 'home',
  },
  {
    path: '/workspaces',
    title: 'Workspaces',
    caption: 'Listar workspaces',
    icon: 'business',
  },
  {
    path: '/workspaces/novo',
    title: 'Novo Workspace',
    caption: 'Cadastrar workspace',
    icon: 'add_circle',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
