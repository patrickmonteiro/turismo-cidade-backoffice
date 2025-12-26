<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row items-stretch login-page">
        <!-- Lado Esquerdo - Logo e Branding (Desktop) -->
        <div class="col-12 col-md-6 gradient-primary flex flex-center gradient-overlay login-left">
          <div class="q-pa-xl text-center">
            <div class="logo-container shadow-tourism-lg q-mb-lg">
              <q-img src="/logo.png" fit="contain" />
            </div>

            <div class="text-h3 text-white q-mt-lg text-weight-bold">
              Turismo Cidade
            </div>
            <div class="text-h6 text-white q-mt-sm" style="opacity: 0.95; font-weight: 300;">
              Backoffice
            </div>

            <div class="q-mt-xl text-white text-body1" style="max-width: 400px; margin: 0 auto; opacity: 0.9;">
              Gerencie destinos turísticos, atrações e experiências únicas para seus visitantes.
            </div>

            <!-- Features -->
            <div class="q-mt-xl q-gutter-md">
              <div class="row items-center justify-center text-white q-mb-sm">
                <q-icon name="check_circle" size="sm" class="q-mr-sm" />
                <span>Gestão completa de destinos</span>
              </div>
              <div class="row items-center justify-center text-white q-mb-sm">
                <q-icon name="check_circle" size="sm" class="q-mr-sm" />
                <span>Controle de atrações turísticas</span>
              </div>
              <div class="row items-center justify-center text-white">
                <q-icon name="check_circle" size="sm" class="q-mr-sm" />
                <span>Analytics e relatórios</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Lado Direito - Formulário -->
        <div class="col-12 col-md-6 flex flex-center login-right">
          <div class="q-pa-xl login-form-container" style="max-width: 450px; width: 100%">
            <!-- Header -->
            <div class="text-center q-mb-xl">
              <div class="text-h4 text-gradient q-mb-sm">Bem-vindo!</div>
              <div class="text-body2 text-grey-7">Entre com suas credenciais para acessar o sistema</div>
            </div>

            <!-- Form -->
            <q-form @submit="onSubmit" class="q-gutter-lg">
              <q-input
                v-model="form.email"
                label="E-mail"
                type="email"
                outlined
                lazy-rules
                class="input-tourism"
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="form.password"
                label="Senha"
                :type="isPwd ? 'password' : 'text'"
                outlined
                lazy-rules
                class="input-tourism"
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row items-center justify-between">
                <q-checkbox v-model="rememberMe" label="Lembrar-me" color="primary" />
                <q-btn flat color="primary" label="Esqueceu a senha?" size="sm" class="text-weight-medium" />
              </div>

              <q-btn
                label="Entrar"
                type="submit"
                class="full-width btn-tourism btn-gradient"
                size="lg"
                :loading="loading"
                unelevated
              />
            </q-form>

            <!-- Footer -->
            <div class="text-center q-mt-xl text-grey-6 text-caption">
              <q-icon name="lock" size="xs" class="q-mr-xs" />
              Seus dados estão protegidos
            </div>
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
  workspaceId: '240982c2-04f9-491e-a978-1bacbe19c43a'
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
.login-page {
  min-height: 100vh;
}

.logo-container {
  width: 200px;
  height: 200px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-left {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    top: -100px;
    right: -100px;
    border-radius: 50%;
  }

  &::before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
    bottom: -50px;
    left: -50px;
    border-radius: 50%;
  }
}

.login-right {
  background: linear-gradient(180deg, #ffffff 0%, #f8fcfd 100%);
}

.login-form-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .login-left {
    min-height: 50vh;
  }

  .logo-container {
    width: 150px;
    height: 150px;
    padding: 20px;
  }
}
</style>
