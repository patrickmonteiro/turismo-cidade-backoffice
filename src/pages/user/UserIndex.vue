<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row items-center justify-between">
          <div>
            <h4 class="q-my-none text-white">
              <q-icon name="people" size="sm" class="q-mr-sm" />
              Usuários
            </h4>
            <p class="q-mb-none q-mt-sm text-white" style="opacity: 0.9;">
              Gerencie usuários e suas permissões de acesso
            </p>
          </div>
          <q-btn
            to="/users/novo"
            label="Novo Usuário"
            icon="person_add"
            color="white"
            text-color="primary"
            unelevated
            class="btn-tourism"
          />
        </div>
      </div>

      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        @row-click="onRowClick"
        class="cursor-pointer card-tourism"
        :grid="$q.screen.lt.md"
        :card-container-class="$q.screen.lt.md ? 'q-col-gutter-md' : ''"
      >
        <!-- Grid Mode (Mobile) -->
        <template v-slot:item="props">
          <div class="col-12 col-sm-6">
            <q-card class="card-tourism card-hover q-mb-md" @click="onRowClick($event, props.row)">
              <q-card-section>
                <!-- Avatar e Nome -->
                <div class="row items-center q-mb-md">
                  <q-avatar size="60px" color="primary" text-color="white" class="q-mr-md">
                    <div class="text-h5">{{ props.row.name.charAt(0).toUpperCase() }}</div>
                  </q-avatar>
                  <div class="col">
                    <div class="text-h6 text-weight-bold">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-7">{{ props.row.email }}</div>
                  </div>
                </div>

                <!-- Info -->
                <q-separator class="q-my-sm" />

                <div class="q-gutter-sm">
                  <!-- Função -->
                  <div class="row items-center justify-between">
                    <span class="text-caption text-grey-7">Função:</span>
                    <q-badge :color="getRoleColor(props.row.role)" class="q-px-md">
                      {{ getRoleLabel(props.row.role) }}
                    </q-badge>
                  </div>

                  <!-- Workspace ID -->
                  <div class="row items-center">
                    <q-icon name="business" size="xs" class="q-mr-xs" color="grey-6" />
                    <span class="text-caption text-grey-7">Workspace:</span>
                    <span class="text-caption text-weight-medium q-ml-xs ellipsis">
                      {{ props.row.workspaceId }}
                    </span>
                  </div>

                  <!-- Data de Criação -->
                  <div class="row items-center">
                    <q-icon name="schedule" size="xs" class="q-mr-xs" color="grey-6" />
                    <span class="text-caption text-grey-7">Criado em:</span>
                    <span class="text-caption text-weight-medium q-ml-xs">
                      {{ formatDate(props.row.createdAt) }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <q-separator class="q-my-sm" />
                <div class="row items-center justify-between">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    icon="content_copy"
                    label="Copiar ID"
                    color="primary"
                    @click.stop="copyUuid(props.row.id)"
                  />
                  <q-btn
                    flat
                    dense
                    size="sm"
                    icon="edit"
                    label="Editar"
                    color="primary"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

        <!-- Table Mode (Desktop) -->
        <template v-slot:body-cell-id="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <q-btn flat dense round size="sm" icon="content_copy" @click.stop="copyUuid(props.row.id)">
                <q-tooltip>Copiar UUID</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-badge :color="getRoleColor(props.row.role)">
              {{ getRoleLabel(props.row.role) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell-updatedAt="props">
          <q-td :props="props">
            {{ formatDate(props.row.updatedAt) }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar, copyToClipboard } from 'quasar';
import type { QTableColumn } from 'quasar';
import { userService } from 'src/services/userService';

const router = useRouter();

interface User {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const $q = useQuasar();

const columns: QTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'role',
    label: 'Função',
    field: 'role',
    align: 'center',
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Criado em',
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'updatedAt',
    label: 'Atualizado em',
    field: 'updatedAt',
    align: 'left',
    sortable: true,
  },
];

const users = ref<User[]>([]);
const loading = ref(false);

async function loadUsers() {
  try {
    loading.value = true;
    const response = await userService.getAll();
    users.value = Array.isArray(response) ? response : [];
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : 'Erro ao carregar usuários',
      icon: 'warning',
    });
  } finally {
    loading.value = false;
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('pt-BR');
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    admin: 'red',
    manager: 'orange',
    user: 'blue',
  };
  return colors[role] || 'grey';
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    user: 'Usuário',
  };
  return labels[role] || role;
}

function onRowClick(_evt: Event, row: User) {
  void router.push(`/users/${row.id}`);
}

async function copyUuid(uuid: string) {
  try {
    await copyToClipboard(uuid);
    $q.notify({
      color: 'positive',
      message: 'UUID copiado para a área de transferência',
      icon: 'check',
      position: 'top',
      timeout: 1500,
    });
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Erro ao copiar UUID',
      icon: 'warning',
      position: 'top',
    });
  }
}

onMounted(() => {
  void loadUsers();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
