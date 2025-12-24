<template>
  <q-page padding>
    <div class="q-pa-md">
      <h4 class="q-mt-none q-mb-md">Workspaces</h4>

      <q-table :rows="workspaces" :columns="columns" row-key="id" flat bordered :loading="loading"
        @row-click="onRowClick" class="cursor-pointer">
        <template v-slot:body-cell-colorPalette="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <div v-for="(color, index) in props.row.colorPalette" :key="index" :style="{ backgroundColor: color }"
                class="color-box" />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-heroImages="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-img v-for="(image, index) in props.row.heroImages" :key="index" :src="image"
                style="height: 40px; width: 60px" class="rounded-borders" />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-logoUrl="props">
          <q-td :props="props">
            <q-img v-if="props.row.logoUrl" :src="props.row.logoUrl" style="height: 40px; width: 40px"
              class="rounded-borders" />
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
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import { workspaceService } from 'src/services/workspaceService';

const router = useRouter();

interface Workspace {
  id: string;
  ibgeId: string;
  name: string;
  title: string;
  about: string;
  description: string;
  logoUrl: string;
  colorPalette: string[];
  heroImages: string[];
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
    name: 'ibgeId',
    label: 'IBGE ID',
    field: 'ibgeId',
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
    name: 'title',
    label: 'Título',
    field: 'title',
    align: 'left',
    sortable: true,
  },
  {
    name: 'about',
    label: 'Sobre',
    field: 'about',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'logoUrl',
    label: 'Logo',
    field: 'logoUrl',
    align: 'center',
  },
  {
    name: 'colorPalette',
    label: 'Paleta de Cores',
    field: 'colorPalette',
    align: 'left',
  },
  {
    name: 'heroImages',
    label: 'Imagens Hero',
    field: 'heroImages',
    align: 'left',
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

const workspaces = ref<Workspace[]>([]);
const loading = ref(false);

async function loadWorkspaces() {
  try {
    loading.value = true;
    const response = await workspaceService.getAll();
    workspaces.value = Array.isArray(response) ? response : [];
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : 'Erro ao carregar workspaces',
      icon: 'warning',
    });
  } finally {
    loading.value = false;
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('pt-BR');
}

function onRowClick(_evt: Event, row: Workspace) {
  void router.push(`/workspaces/${row.id}`);
}

onMounted(() => {
  void loadWorkspaces();
});
</script>

<style scoped>
.color-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
