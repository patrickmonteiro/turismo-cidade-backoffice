<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="page-header">
        <div class="row items-center justify-between">
          <div>
            <h4 class="q-my-none text-white">
              <q-icon name="dashboard" size="sm" class="q-mr-sm" />
              Dashboard
            </h4>
            <p class="q-mb-none q-mt-sm text-white" style="opacity: 0.9;">
              Visão geral do sistema
            </p>
          </div>
          <div class="text-white text-caption">
            <q-icon name="schedule" size="xs" class="q-mr-xs" />
            {{ currentDate }}
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row q-col-gutter-md q-mb-lg">
        <!-- Cidades Cadastradas -->
        <div class="col-12 col-md-4">
          <q-card class="card-tourism card-hover stat-card">
            <q-card-section>
              <div class="row items-center q-mb-md">
                <div class="stat-icon gradient-primary">
                  <q-icon name="location_city" size="lg" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="text-caption text-grey-7 text-weight-medium">CIDADES CADASTRADAS</div>
                </div>
              </div>
              <div class="stat-number text-gradient">
                {{ stats.workspaces }}
              </div>
              <div class="row items-center justify-between q-mt-md">
                <div class="text-caption text-positive">
                  <q-icon name="trending_up" size="xs" />
                  +12% este mês
                </div>
                <q-btn flat dense size="sm" label="Ver todos" color="primary" to="/workspaces" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Total de Usuários -->
        <div class="col-12 col-md-4">
          <q-card class="card-tourism card-hover stat-card">
            <q-card-section>
              <div class="row items-center q-mb-md">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);">
                  <q-icon name="people" size="lg" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="text-caption text-grey-7 text-weight-medium">TOTAL DE USUÁRIOS</div>
                </div>
              </div>
              <div class="stat-number" style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                {{ stats.users }}
              </div>
              <div class="row items-center justify-between q-mt-md">
                <div class="text-caption text-positive">
                  <q-icon name="trending_up" size="xs" />
                  +5% este mês
                </div>
                <q-btn flat dense size="sm" label="Ver todos" color="primary" to="/users" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Pontos Turísticos -->
        <div class="col-12 col-md-4">
          <q-card class="card-tourism card-hover stat-card">
            <q-card-section>
              <div class="row items-center q-mb-md">
                <div class="stat-icon" style="background: linear-gradient(135deg, #26bec9 0%, #1a5278 100%);">
                  <q-icon name="place" size="lg" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="text-caption text-grey-7 text-weight-medium">PONTOS TURÍSTICOS</div>
                </div>
              </div>
              <div class="stat-number" style="background: linear-gradient(135deg, #26bec9 0%, #1a5278 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                {{ stats.touristSpots }}
              </div>
              <div class="row items-center justify-between q-mt-md">
                <div class="text-caption text-positive">
                  <q-icon name="trending_up" size="xs" />
                  +18% este mês
                </div>
                <q-btn flat dense size="sm" label="Ver todos" color="primary" disabled />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-card class="card-tourism">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="flash_on" class="q-mr-sm" color="primary" />
                Ações Rápidas
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-6 col-md-3">
                  <q-btn
                    unelevated
                    class="full-width btn-tourism"
                    color="primary"
                    icon="add_location"
                    label="Nova Cidade"
                    to="/workspaces/novo"
                  />
                </div>
                <div class="col-6 col-md-3">
                  <q-btn
                    unelevated
                    class="full-width btn-tourism"
                    color="secondary"
                    icon="person_add"
                    label="Novo Usuário"
                    to="/users/novo"
                  />
                </div>
                <div class="col-6 col-md-3">
                  <q-btn
                    unelevated
                    class="full-width btn-tourism"
                    color="accent"
                    icon="place"
                    label="Novo Ponto"
                    disabled
                  />
                </div>
                <div class="col-6 col-md-3">
                  <q-btn
                    unelevated
                    class="full-width btn-tourism"
                    color="info"
                    icon="assessment"
                    label="Relatórios"
                    disabled
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card class="card-tourism gradient-primary" style="height: 100%;">
            <q-card-section class="text-white">
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="wb_sunny" class="q-mr-sm" />
                Bem-vindo!
              </div>
              <p class="q-mb-sm" style="opacity: 0.95;">
                Sistema de gestão de turismo está operacional.
              </p>
              <div class="q-mt-md">
                <q-linear-progress
                  size="8px"
                  :value="0.75"
                  color="white"
                  track-color="rgba(255,255,255,0.2)"
                  rounded
                />
                <div class="text-caption q-mt-sm" style="opacity: 0.9;">
                  75% dos recursos configurados
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { workspaceService } from 'src/services/workspaceService';
import { userService } from 'src/services/userService';

interface Stats {
  workspaces: number;
  users: number;
  touristSpots: number;
}

const stats = ref<Stats>({
  workspaces: 0,
  users: 0,
  touristSpots: 0,
});

const currentDate = ref('');

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

async function loadStats() {
  try {
    // Carregar workspaces
    const workspaces = await workspaceService.getAll();
    stats.value.workspaces = Array.isArray(workspaces) ? workspaces.length : 0;

    // Carregar usuários
    const users = await userService.getAll();
    stats.value.users = Array.isArray(users) ? users.length : 0;

    // Pontos turísticos (simulado por enquanto)
    stats.value.touristSpots = 247;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
}

onMounted(() => {
  currentDate.value = formatDate();
  void loadStats();
});
</script>

<style scoped>
.stat-card {
  height: 100%;
  transition: all 0.3s ease;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}

@media (max-width: 768px) {
  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
