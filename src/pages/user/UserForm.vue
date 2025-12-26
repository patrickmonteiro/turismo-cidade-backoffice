<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="page-header q-mb-lg">
        <h4 class="q-my-none text-white">
          <q-icon :name="isEditMode ? 'edit' : 'person_add'" size="sm" class="q-mr-sm" />
          {{ isEditMode ? 'Editar Usuário' : 'Cadastro de Usuário' }}
        </h4>
        <p class="q-mb-none q-mt-sm text-white" style="opacity: 0.9;">
          {{ isEditMode ? 'Atualize as informações do usuário' : 'Preencha os dados para criar um novo usuário' }}
        </p>
      </div>

      <!-- Form Card -->
      <q-card class="card-tourism">
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="row q-col-gutter-md q-pa-sm">
              <!-- Workspace -->
              <div class="col-12 col-md-6">
                <q-select v-model="form.workspaceId" :options="workspaceOptions" option-value="value"
                  option-label="label" emit-value map-options label="Workspace *" hint="Selecione o workspace/destino"
                  outlined lazy-rules :loading="loadingWorkspaces"
                  :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']">
                  <template v-slot:prepend>
                    <q-icon name="language" />
                  </template>
                </q-select>
              </div>

              <!-- Nome -->
              <div class="col-12 col-md-6">
                <q-input v-model="form.name" label="Nome Completo *" hint="Nome completo do usuário" outlined lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']">
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>

              <!-- E-mail -->
              <div class="col-12 col-md-6">
                <q-input v-model="form.email" label="E-mail *" type="email" hint="E-mail de acesso do usuário" outlined
                  lazy-rules :rules="[
                    (val) => (val && val.length > 0) || 'Campo obrigatório',
                    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="mail" />
                  </template>
                </q-input>
              </div>

              <!-- Função -->
              <div class="col-12 col-md-6">
                <q-select v-model="form.role" :options="roleOptions" label="Função *" outlined emit-value map-options
                  hint="Função do usuário no sistema" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']">
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-select>
              </div>

              <!-- Senha (apenas no modo criação) -->
              <div class="col-12 col-md-6" v-if="!isEditMode">
                <q-input v-model="form.password" label="Senha *" :type="isPwd ? 'password' : 'text'"
                  hint="Mínimo de 6 caracteres" outlined lazy-rules :rules="[
                    (val) => (val && val.length > 0) || 'Campo obrigatório',
                    (val) => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres'
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
              </div>

              <!-- Confirmar Senha (apenas no modo criação) -->
              <div class="col-12 col-md-6" v-if="!isEditMode">
                <q-input v-model="form.confirmPassword" label="Confirmar Senha *"
                  :type="isConfirmPwd ? 'password' : 'text'" hint="Digite a senha novamente" outlined lazy-rules :rules="[
                    (val) => (val && val.length > 0) || 'Campo obrigatório',
                    (val) => val === form.password || 'As senhas não coincidem'
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="lock_clock" />
                  </template>
                  <template v-slot:append>
                    <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isConfirmPwd = !isConfirmPwd" />
                  </template>
                </q-input>
              </div>
            </div>

            <!-- Actions -->
            <q-separator class="q-my-md" />
            <div class="row q-gutter-sm">
              <q-btn label="Salvar" type="submit" color="primary" icon="save" :loading="loading" unelevated
                class="btn-tourism" />
              <q-btn label="Limpar" type="reset" color="grey-7" icon="refresh" flat :disable="loading" />
              <q-btn label="Cancelar" color="grey-7" icon="close" flat :disable="loading"
                @click="router.push('/users')" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { userService } from 'src/services/userService';
import { workspaceService } from 'src/services/workspaceService';

interface UserForm {
  workspaceId: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  confirmPassword?: string;
}

interface WorkspaceOption {
  label: string;
  value: string;
}

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const userId = computed(() => route.params.id as string | undefined);
const isEditMode = computed(() => !!userId.value);

const roleOptions = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Gerente', value: 'manager' },
  { label: 'Usuário', value: 'user' },
];

const form = ref<UserForm>({
  workspaceId: '',
  name: '',
  email: '',
  role: 'user',
  password: '',
  confirmPassword: '',
});

const workspaceOptions = ref<WorkspaceOption[]>([]);
const loading = ref(false);
const loadingWorkspaces = ref(false);
const isPwd = ref(true);
const isConfirmPwd = ref(true);

async function loadWorkspaces() {
  try {
    loadingWorkspaces.value = true;
    const workspaces = await workspaceService.getAll();

    workspaceOptions.value = Array.isArray(workspaces)
      ? workspaces.map((ws: { id: string; name: string; title: string }) => ({
        label: `${ws.name} - ${ws.title}`,
        value: ws.id,
      }))
      : [];
  } catch {
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar workspaces',
      icon: 'warning',
    });
  } finally {
    loadingWorkspaces.value = false;
  }
}

async function onSubmit() {
  try {
    loading.value = true;

    if (isEditMode.value && userId.value) {
      // UpdateUserInput - sem password
      const payload = {
        workspaceId: form.value.workspaceId,
        name: form.value.name,
        email: form.value.email,
        role: form.value.role,
      };

      await userService.update(userId.value, payload);
      $q.notify({
        color: 'positive',
        message: 'Usuário atualizado com sucesso!',
        icon: 'check',
      });
    } else {
      // CreateUserInput - com password
      const payload = {
        workspaceId: form.value.workspaceId,
        name: form.value.name,
        email: form.value.email,
        password: form.value.password || '',
        role: form.value.role,
      };

      await userService.create(payload);
      $q.notify({
        color: 'positive',
        message: 'Usuário cadastrado com sucesso!',
        icon: 'check',
      });
    }

    // Redirecionar para lista
    void router.push('/users');
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : isEditMode.value ? 'Erro ao atualizar usuário' : 'Erro ao cadastrar usuário',
      icon: 'warning',
    });
  } finally {
    loading.value = false;
  }
}

function onReset() {
  form.value = {
    workspaceId: '',
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  };
}

async function loadUser() {
  if (!userId.value) return;

  try {
    loading.value = true;
    const user = await userService.getById(userId.value);

    form.value = {
      workspaceId: user.workspaceId || '',
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
    };
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : 'Erro ao carregar usuário',
      icon: 'warning',
    });
    void router.push('/users');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadWorkspaces();
  void loadUser();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
