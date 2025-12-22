<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 800px; margin: 0 auto">
      <h4 class="q-mt-none q-mb-md">Cadastro de Workspace</h4>

      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          v-model="form.ibgeId"
          label="IBGE ID *"
          hint="Código IBGE do município"
          outlined
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
        />

        <q-input
          v-model="form.name"
          label="Nome *"
          hint="Nome identificador do workspace"
          outlined
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
        />

        <q-input
          v-model="form.title"
          label="Título *"
          hint="Título de exibição"
          outlined
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']"
        />

        <q-input
          v-model="form.about"
          label="Sobre"
          type="textarea"
          rows="3"
          hint="Breve descrição sobre o destino"
          outlined
        />

        <q-input
          v-model="form.description"
          label="Descrição"
          type="textarea"
          rows="5"
          hint="Descrição detalhada do destino"
          outlined
        />

        <q-uploader
          label="Logo"
          outlined
          accept="image/*"
          max-file-size="2097152"
          :max-files="1"
          @rejected="onFileRejected"
          style="width: 100%"
        >
          <template v-slot:header="scope">
            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
              <q-btn
                v-if="scope.queuedFiles.length > 0"
                icon="clear_all"
                @click="scope.removeQueuedFiles"
                round
                dense
                flat
              >
                <q-tooltip>Limpar</q-tooltip>
              </q-btn>
              <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
              <div class="col">
                <div class="q-uploader__title">Upload da Logo</div>
                <div class="q-uploader__subtitle">
                  {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                </div>
              </div>
              <q-btn
                v-if="scope.canAddFiles"
                type="a"
                icon="add_box"
                round
                dense
                flat
              >
                <q-uploader-add-trigger />
                <q-tooltip>Selecionar arquivo</q-tooltip>
              </q-btn>
            </div>
          </template>

          <template v-slot:list="scope">
            <q-list separator>
              <q-item v-for="file in scope.files" :key="file.name">
                <q-item-section>
                  <q-item-label class="full-width ellipsis">
                    {{ file.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                  </q-item-label>
                </q-item-section>

                <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                  <img :src="file.__img.src" />
                </q-item-section>

                <q-item-section top side>
                  <q-btn
                    class="gt-xs"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete"
                    @click="scope.removeFile(file)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-uploader>

        <div class="q-gutter-sm">
          <div class="text-subtitle2">Paleta de Cores</div>
          <div class="row q-gutter-sm items-start">
            <div v-for="(_, index) in form.colorPalette" :key="index">
              <q-input
                v-model="form.colorPalette[index]"
                :label="`Cor ${index + 1}`"
                style="width: 200px"
                outlined
                :rules="['anyColor']"
              >
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color v-model="form.colorPalette[index]" />
                    </q-popup-proxy>
                  </q-icon>
                  <q-btn
                    flat
                    round
                    dense
                    icon="close"
                    size="sm"
                    @click="removeColor(index)"
                  />
                </template>
              </q-input>
            </div>
            <q-btn
              outline
              icon="add"
              color="primary"
              @click="addColor"
              label="Adicionar Cor"
            />
          </div>
        </div>

        <div class="q-gutter-sm">
          <div class="text-subtitle2">Imagens Hero</div>
          <q-uploader
            label="Imagens Hero"
            outlined
            multiple
            accept="image/*"
            max-file-size="2097152"
            @rejected="onFileRejected"
            style="width: 100%"
          >
            <template v-slot:header="scope">
              <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                <q-btn
                  v-if="scope.queuedFiles.length > 0"
                  icon="clear_all"
                  @click="scope.removeQueuedFiles"
                  round
                  dense
                  flat
                >
                  <q-tooltip>Limpar todas</q-tooltip>
                </q-btn>
                <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                <div class="col">
                  <div class="q-uploader__title">Upload de Imagens Hero</div>
                  <div class="q-uploader__subtitle">
                    {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
                  </div>
                </div>
                <q-btn
                  v-if="scope.canAddFiles"
                  type="a"
                  icon="add_box"
                  round
                  dense
                  flat
                >
                  <q-uploader-add-trigger />
                  <q-tooltip>Adicionar imagens</q-tooltip>
                </q-btn>
              </div>
            </template>

            <template v-slot:list="scope">
              <q-list separator>
                <q-item v-for="file in scope.files" :key="file.name">
                  <q-item-section>
                    <q-item-label class="full-width ellipsis">
                      {{ file.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section v-if="file.__img" thumbnail class="gt-xs">
                    <img :src="file.__img.src" />
                  </q-item-section>

                  <q-item-section top side>
                    <q-btn
                      class="gt-xs"
                      size="12px"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="scope.removeFile(file)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-uploader>
        </div>

        <div class="q-mt-md">
          <q-btn label="Salvar" type="submit" color="primary" />
          <q-btn label="Limpar" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

interface WorkspaceForm {
  ibgeId: string;
  name: string;
  title: string;
  about: string;
  description: string;
  colorPalette: string[];
}

const router = useRouter();
const $q = useQuasar();

const form = ref<WorkspaceForm>({
  ibgeId: '',
  name: '',
  title: '',
  about: '',
  description: '',
  colorPalette: ['#1a5278'],
});

function addColor() {
  form.value.colorPalette.push('#000000');
}

function removeColor(index: number) {
  form.value.colorPalette.splice(index, 1);
}

function onFileRejected() {
  $q.notify({
    color: 'negative',
    message: 'Arquivo rejeitado. Verifique o tipo e tamanho (máx 2MB)',
    icon: 'warning',
  });
}

function onSubmit() {
  $q.notify({
    color: 'positive',
    message: 'Workspace cadastrado com sucesso!',
    icon: 'check',
  });

  // Aqui você faria upload dos arquivos e chamada para API
  console.log('Form data:', form.value);

  // Redirecionar para lista
  void router.push('/workspaces');
}

function onReset() {
  form.value = {
    ibgeId: '',
    name: '',
    title: '',
    about: '',
    description: '',
    colorPalette: ['#1a5278'],
  };
}
</script>
