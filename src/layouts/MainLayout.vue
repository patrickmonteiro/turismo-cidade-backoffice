<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="q-mr-sm" />

        <q-avatar size="40px" class="q-mr-md">
          <img src="/logo.png" alt="Logo" />
        </q-avatar>

        <q-toolbar-title class="text-weight-bold">
          Turismo Cidade
          <div class="text-caption text-weight-light" style="font-size: 0.7rem; opacity: 0.9;">
            Backoffice
          </div>
        </q-toolbar-title>

        <q-space />

        <!-- Workspace Info -->
        <div class="q-mr-md text-caption text-center gt-sm">
          <div class="text-weight-medium">Workspace Ativo</div>
          <div style="opacity: 0.8;">{{ currentWorkspace }}</div>
        </div>

        <!-- User Menu -->
        <q-btn flat round dense icon="account_circle" class="q-mr-xs">
          <q-menu auto-close>
            <q-list style="min-width: 200px">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="person" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Meu Perfil</q-item-label>
                  <q-item-label caption>Gerenciar conta</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Sair</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="280" :breakpoint="1024">
      <!-- Drawer Header -->
      <div class="q-pa-md text-center gradient-primary" style="min-height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="drawer-logo-container q-mb-sm">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div class="text-white text-weight-bold text-h6">Turismo Cidade</div>
        <div class="text-white text-caption" style="opacity: 0.9;">Gestão de Destinos</div>
      </div>

      <!-- Menu Navigation -->
      <q-scroll-area class="fit" style="height: calc(100% - 150px);">
        <q-list padding>
          <q-item-label header>
            <q-icon name="explore" size="xs" class="q-mr-xs" />
            Navegação
          </q-item-label>

          <q-item v-for="route in menuRoutes" :key="route.path" :to="route.path" clickable v-ripple exact>
            <q-item-section avatar>
              <q-icon :name="route.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ route.title }}</q-item-label>
              <q-item-label caption>{{ route.caption }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header>
            <q-icon name="settings" size="xs" class="q-mr-xs" />
            Configurações
          </q-item-label>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="palette" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Personalização</q-item-label>
              <q-item-label caption>Cores e temas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="help_outline" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ajuda</q-item-label>
              <q-item-label caption>Central de suporte</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
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

const currentWorkspace = ref('Turismo Cidade');

const menuRoutes: MenuRoute[] = [
  {
    path: '/',
    title: 'Dashboard',
    caption: 'Visão geral',
    icon: 'dashboard',
  },
  {
    path: '/workspaces',
    title: 'Workspaces',
    caption: 'Gerenciar destinos',
    icon: 'language',
  },
  {
    path: '/workspaces/novo',
    title: 'Novo Workspace',
    caption: 'Criar destino',
    icon: 'add_location',
  },
  {
    path: '/users',
    title: 'Usuários',
    caption: 'Gerenciar usuários',
    icon: 'people',
  },
  {
    path: '/users/novo',
    title: 'Novo Usuário',
    caption: 'Cadastrar usuário',
    icon: 'person_add',
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

<style scoped>
.drawer-logo-container {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.drawer-logo-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
