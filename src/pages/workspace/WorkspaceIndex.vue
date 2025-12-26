<template>
  <q-page padding>
    <div class="q-pa-md">
      <PageHeader
        title="Workspaces"
        subtitle="Gerencie seus destinos turísticos e suas configurações"
        icon="language"
        button-label="Novo Workspace"
        button-icon="add_location"
        button-to="/workspaces/novo"
      />

      <q-table :rows="workspaces" :columns="columns" row-key="id" flat :loading="loading" @row-click="onRowClick"
        class="cursor-pointer card-tourism" :grid="$q.screen.lt.md"
        :card-container-class="$q.screen.lt.md ? 'q-col-gutter-md' : ''">
        <!-- Grid Mode (Mobile) -->
        <template v-slot:item="props">
          <div class="col-12 col-sm-6">
            <q-card class="card-tourism card-hover q-mb-md" @click="onRowClick($event, props.row)">
              <q-card-section>
                <!-- Logo e Nome -->
                <div class="row items-center q-mb-md">
                  <q-avatar size="60px" class="q-mr-md">
                    <q-img v-if="props.row.logoUrl" :src="props.row.logoUrl" />
                    <q-icon v-else name="language" size="lg" color="primary" />
                  </q-avatar>
                  <div class="col">
                    <div class="text-h6 text-weight-bold">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-7">{{ props.row.title }}</div>
                  </div>
                </div>

                <!-- Info -->
                <q-separator class="q-my-sm" />

                <div class="q-gutter-xs">
                  <div class="row items-center">
                    <q-icon name="fingerprint" size="xs" class="q-mr-xs" color="grey-6" />
                    <span class="text-caption text-grey-7">IBGE:</span>
                    <span class="text-caption text-weight-medium q-ml-xs">{{ props.row.ibgeId }}</span>
                  </div>

                  <div v-if="props.row.about" class="q-mt-sm">
                    <div class="text-caption text-grey-7">Sobre:</div>
                    <div class="text-body2">{{ props.row.about }}</div>
                  </div>

                  <!-- Paleta de Cores -->
                  <div v-if="props.row.colorPalette && props.row.colorPalette.length" class="q-mt-sm">
                    <div class="text-caption text-grey-7 q-mb-xs">Cores:</div>
                    <div class="row q-gutter-xs">
                      <div v-for="(color, index) in props.row.colorPalette" :key="index"
                        :style="{ backgroundColor: color }" class="color-box" />
                    </div>
                  </div>

                  <!-- Hero Images -->
                  <div v-if="props.row.heroImages && props.row.heroImages.length" class="q-mt-sm">
                    <div class="text-caption text-grey-7 q-mb-xs">Imagens:</div>
                    <div class="row q-gutter-xs">
                      <q-img v-for="(image, index) in props.row.heroImages.slice(0, 3)" :key="index" :src="image"
                        style="height: 50px; width: 70px" class="rounded-borders" />
                    </div>
                  </div>

                  <!-- Data -->
                  <div class="row items-center q-mt-sm">
                    <q-icon name="schedule" size="xs" class="q-mr-xs" color="grey-6" />
                    <span class="text-caption text-grey-7">{{ formatDate(props.row.createdAt) }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <q-separator class="q-my-sm" />
                <div class="row items-center justify-between">
                  <q-btn flat dense size="sm" icon="content_copy" label="Copiar ID" color="primary"
                    @click.stop="copyUuid(props.row.id)" />
                  <q-btn flat dense size="sm" icon="edit" label="Editar" color="primary" />
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
import { useQuasar, copyToClipboard } from 'quasar';
import type { QTableColumn } from 'quasar';
import { workspaceService } from 'src/services/workspaceService';
import PageHeader from 'src/components/PageHeader.vue';

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
    name: 'colorPalette',
    label: 'Paleta de Cores',
    field: 'colorPalette',
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
