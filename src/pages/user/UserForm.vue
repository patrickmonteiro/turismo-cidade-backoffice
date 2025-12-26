<template>
  <q-page padding>
    <div>
      <span class="text-h4">
        {{ isEditMode ? 'Editar Usuário' : 'Cadastro de Usuário' }}
      </span>

      <q-form @submit="onSubmit" @reset="onReset" class="q-col-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="form.name" label="Nome *" hint="Nome completo do usuário" outlined lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.email" label="E-mail *" type="email" hint="E-mail do usuário" outlined lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Campo obrigatório',
                (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'E-mail inválido'
              ]" />
          </div>

          <div class="col-12 col-md-6">
            <q-select v-model="form.role" :options="roleOptions" label="Função *" outlined emit-value map-options
              hint="Função do usuário no sistema" lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']" />
          </div>

          <div class="col-12 col-md-6" v-if="!isEditMode">
            <q-input v-model="form.password" label="Senha *" :type="isPwd ? 'password' : 'text'"
              hint="Senha de acesso do usuário" outlined lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Campo obrigatório',
                (val) => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres'
              ]">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6" v-if="!isEditMode">
            <q-input v-model="form.confirmPassword" label="Confirmar Senha *" :type="isConfirmPwd ? 'password' : 'text'"
              hint="Digite a senha novamente" outlined lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Campo obrigatório',
                (val) => val === form.password || 'As senhas não coincidem'
              ]">
              <template v-slot:append>
                <q-icon :name="isConfirmPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isConfirmPwd = !isConfirmPwd" />
              </template>
            </q-input>
          </div>
        </div>

        <div class="q-mt-md">
          <q-btn label="Salvar" type="submit" color="primary" :loading="loading" />
          <q-btn label="Limpar" type="reset" color="primary" flat class="q-ml-sm" :disable="loading" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { userService } from 'src/services/userService';

interface UserForm {
  name: string;
  email: string;
  role: string;
  password?: string;
  confirmPassword?: string;
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
  name: '',
  email: '',
  role: 'user',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const isPwd = ref(true);
const isConfirmPwd = ref(true);

async function onSubmit() {
  try {
    loading.value = true;

    const payload: Record<string, string> = {
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
    };

    // Incluir senha apenas no modo de criação
    if (!isEditMode.value && form.value.password) {
      payload.password = form.value.password;
    }

    if (isEditMode.value && userId.value) {
      await userService.update(userId.value, payload);
      $q.notify({
        color: 'positive',
        message: 'Usuário atualizado com sucesso!',
        icon: 'check',
      });
    } else {
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
  void loadUser();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
