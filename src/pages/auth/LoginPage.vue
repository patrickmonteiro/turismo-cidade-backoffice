<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row items-stretch">
        <!-- Lado Esquerdo - Logo (Desktop) -->
        <div class="col-12 col-md-6 bg-primary flex flex-center">
          <div class="q-pa-xl text-center">
            <q-img src="/logo-transparency.png" style="max-width: 400px; width: 100%" />
            <div class="text-h4 text-white q-mt-lg">Turismo Cidade</div>
            <div class="text-subtitle1 text-white">Backoffice</div>
          </div>
        </div>

        <!-- Lado Direito - Formulário -->
        <div class="col-12 col-md-6 flex flex-center">
          <div class="q-pa-xl" style="max-width: 400px; width: 100%">
            <div class="text-h5 q-mb-md text-center">Entrar</div>

            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.login"
                label="Login *"
                outlined
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                v-model="form.password"
                label="Senha *"
                :type="isPwd ? 'password' : 'text'"
                outlined
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row items-center justify-between">
                <q-checkbox v-model="rememberMe" label="Lembrar-me" />
                <q-btn flat color="primary" label="Esqueceu a senha?" size="sm" />
              </div>

              <q-btn
                label="Entrar"
                type="submit"
                color="primary"
                class="full-width"
                size="lg"
              />
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

interface LoginForm {
  login: string;
  password: string;
}

const router = useRouter();
const $q = useQuasar();

const form = ref<LoginForm>({
  login: '',
  password: '',
});

const isPwd = ref(true);
const rememberMe = ref(false);

function onSubmit() {
  // Aqui você faria a chamada para API de autenticação
  console.log('Login:', form.value);
  console.log('Remember me:', rememberMe.value);

  $q.notify({
    color: 'positive',
    message: 'Login realizado com sucesso!',
    icon: 'check',
  });

  // Redirecionar para home
  void router.push('/');
}
</script>

<style scoped>
.q-page {
  min-height: 100vh;
}
</style>
