<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row items-stretch">
        <!-- Lado Esquerdo - Logo (Desktop) -->
        <div class="col-12 col-md-6 bg-primary flex flex-center">
          <div class="q-pa-xl text-center">
            <q-img src="/logo.png" style="max-width: 400px; width: 100%; border-radius: 50%;" />
            <div class="text-h4 text-white q-mt-lg">Turismo Cidade</div>
            <div class="text-subtitle1 text-white">Backoffice</div>
          </div>
        </div>

        <!-- Lado Direito - Formulário -->
        <div class="col-12 col-md-6 flex flex-center">
          <div class="q-pa-xl" style="max-width: 400px; width: 100%">
            <div class="text-h5 q-mb-md text-center">Entrar</div>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input v-model="form.email" label="E-mail *" type="email" outlined lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input v-model="form.password" label="Senha *" :type="isPwd ? 'password' : 'text'" outlined lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <div class="row items-center justify-between">
                <q-checkbox v-model="rememberMe" label="Lembrar-me" />
                <q-btn flat color="primary" label="Esqueceu a senha?" size="sm" />
              </div>

              <q-btn label="Entrar" type="submit" color="primary" class="full-width" size="lg" :loading="loading" />
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { authService } from 'src/services/authService';
import { useAuth } from 'src/composables/useAuth';

interface LoginForm {
  email: string;
  password: string;
  workspaceId: string;
}

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const { setToken, setWorkspaceId } = useAuth();

const form = ref<LoginForm>({
  email: 'patrick@gmail.com',
  password: '@@Patrick@@',
  workspaceId: 'f1fa780d-0ef5-4de1-9953-8d1164809c92'
});

const isPwd = ref(true);
const rememberMe = ref(false);
const loading = ref(false);

async function onSubmit() {
  try {
    loading.value = true;

    // Chamada para API de autenticação
    const response = await authService.login({
      email: form.value.email,
      password: form.value.password,
      workspaceId: form.value.workspaceId
    });

    // Armazena o token nos cookies
    if (response.token) {
      setToken(response.token);
    }

    // Se houver workspaceId na resposta, armazena
    if (response.workspaceId) {
      setWorkspaceId(response.workspaceId);
    }

    $q.notify({
      color: 'positive',
      message: 'Login realizado com sucesso!',
      icon: 'check',
    });

    // Redirecionar para a página anterior ou home
    const redirect = (route.query.redirect as string) || '/';
    void router.push(redirect);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : 'Erro ao fazer login. Verifique suas credenciais.',
      icon: 'warning',
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
}
</style>
