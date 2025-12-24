<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Turismo Cidade </q-toolbar-title>

        <q-btn flat round icon="logout" @click="handleLogout">
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
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
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';

interface MenuRoute {
  path: string;
  title: string;
  caption: string;
  icon: string;
}

const router = useRouter();
const $q = useQuasar();
const { clearAuth } = useAuth();

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

function handleLogout() {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente sair?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    clearAuth();
    $q.notify({
      color: 'positive',
      message: 'Logout realizado com sucesso!',
      icon: 'check',
    });
    void router.push('/login');
  });
}
</script>
