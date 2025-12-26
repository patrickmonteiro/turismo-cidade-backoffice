<template>
  <q-page padding>
    <div>
      <span class="text-h4">
        {{ isEditMode ? 'Editar Workspace' : 'Cadastro de Workspace' }}
      </span>

      <q-form @submit="onSubmit" @reset="onReset" class="q-col-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input v-model="form.ibgeId" label="IBGE ID *" hint="Código IBGE do município" outlined lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.name" label="Nome *" hint="Nome identificador do workspace" outlined lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.title" label="Título *" hint="Título de exibição" outlined lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo obrigatório']" />
          </div>

          <div class="col-12 col-md-6">
            <q-input v-model="form.about" label="Sobre" type="textarea" rows="1" hint="Breve descrição sobre o destino"
              outlined />
          </div>

          <div class="col-12">
            <q-input v-model="form.description" label="Descrição" type="textarea" rows="5"
              hint="Descrição detalhada do destino" outlined />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="q-col-gutter-sm">
              <div class="text-subtitle2">Paleta de Cores</div>
              <div class="row q-gutter-sm items-center">
                <div v-for="(_, index) in form.colorPalette" :key="index">
                  <q-input v-model="form.colorPalette[index]" :label="`Cor ${index + 1}`" style="width: 200px" outlined
                    :rules="['anyColor']">
                    <template v-slot:prepend>
                      <div class="color-preview" :style="{ backgroundColor: form.colorPalette[index] }" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="colorize" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-color v-model="form.colorPalette[index]" />
                        </q-popup-proxy>
                      </q-icon>
                      <q-btn flat round dense icon="close" size="sm" @click="removeColor(index)" />
                    </template>
                  </q-input>
                </div>
                <q-btn outline icon="add" color="primary" @click="addColor" label="Adicionar Cor" />
              </div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="q-gutter-sm">
              <div class="text-subtitle2">Logo</div>
              <q-file v-model="logoFile" label="Selecionar imagem da logo" outlined accept="image/*"
                max-file-size="2097152" @rejected="onFileRejected" @update:model-value="onLogoSelected">
                <template v-slot:prepend>
                  <q-icon name="image" />
                </template>
              </q-file>

              <div v-if="logoPreview" class="q-mt-sm">
                <q-card flat bordered>
                  <q-img :src="logoPreview" style="max-height: 200px" fit="contain" />
                  <q-card-actions align="right">
                    <q-btn flat dense icon="delete" color="negative" @click="removeLogo">
                      Remover
                    </q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="q-gutter-sm">
              <div class="text-subtitle2">Imagens Hero</div>
              <q-file v-model="heroFiles" label="Selecionar imagens hero" outlined multiple accept="image/*"
                max-file-size="2097152" @rejected="onFileRejected" @update:model-value="onHeroImagesSelected">
                <template v-slot:prepend>
                  <q-icon name="collections" />
                </template>
              </q-file>

              <div v-if="heroPreviews.length > 0" class="q-mt-sm">
                <div class="column q-gutter-sm">
                  <q-card v-for="(preview, index) in heroPreviews" :key="index" flat bordered>
                    <q-img :src="preview" style="height: 150px" fit="cover" />
                    <q-card-actions align="right">
                      <q-btn flat dense icon="delete" color="negative" @click="removeHeroImage(index)">
                        Remover
                      </q-btn>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
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
import { workspaceService } from 'src/services/workspaceService';

interface WorkspaceForm {
  ibgeId: string;
  name: string;
  title: string;
  about: string;
  description: string;
  logoUrl?: string;
  colorPalette: string[];
  heroImages?: string[];
}

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const workspaceId = computed(() => route.params.id as string | undefined);
const isEditMode = computed(() => !!workspaceId.value);

const form = ref<WorkspaceForm>({
  ibgeId: '',
  name: '',
  title: '',
  about: '',
  description: '',
  logoUrl: '',
  colorPalette: ['#1a5278'],
  heroImages: [],
});

const loading = ref(false);

// Logo
const logoFile = ref<File | null>(null);
const logoPreview = ref<string>('');

// Hero Images
const heroFiles = ref<File[]>([]);
const heroPreviews = ref<string[]>([]);

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

// Logo handlers
function onLogoSelected(file: File | null) {
  if (!file) {
    logoPreview.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    logoPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  logoFile.value = null;
  logoPreview.value = '';
  form.value.logoUrl = '';
}

// Hero Images handlers
function onHeroImagesSelected(files: File[] | File | null) {
  if (!files) return;

  const fileArray = Array.isArray(files) ? files : [files];

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      heroPreviews.value.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
}

function removeHeroImage(index: number) {
  heroPreviews.value.splice(index, 1);

  // Remove from heroFiles array as well
  if (Array.isArray(heroFiles.value)) {
    heroFiles.value.splice(index, 1);
  }

  // Remove from form heroImages if it's a URL
  if (form.value.heroImages && form.value.heroImages[index]) {
    form.value.heroImages.splice(index, 1);
  }
}

async function onSubmit() {
  try {
    loading.value = true;

    // TODO: Implementar upload de arquivos (logo e heroImages) antes de criar/atualizar o workspace
    // Por enquanto, vamos criar/atualizar o workspace sem as imagens

    const payload = {
      ibgeId: form.value.ibgeId,
      name: form.value.name,
      title: form.value.title,
      about: form.value.about,
      description: form.value.description,
      logoUrl: form.value.logoUrl || '',
      colorPalette: form.value.colorPalette,
      heroImages: form.value.heroImages || [],
    };

    if (isEditMode.value && workspaceId.value) {
      await workspaceService.update(workspaceId.value, payload);
      $q.notify({
        color: 'positive',
        message: 'Workspace atualizado com sucesso!',
        icon: 'check',
      });
    } else {
      await workspaceService.create(payload);
      $q.notify({
        color: 'positive',
        message: 'Workspace cadastrado com sucesso!',
        icon: 'check',
      });
    }

    // Redirecionar para lista
    void router.push('/workspaces');
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : isEditMode.value ? 'Erro ao atualizar workspace' : 'Erro ao cadastrar workspace',
      icon: 'warning',
    });
  } finally {
    loading.value = false;
  }
}

function onReset() {
  form.value = {
    ibgeId: '',
    name: '',
    title: '',
    about: '',
    description: '',
    logoUrl: '',
    colorPalette: ['#1a5278'],
    heroImages: [],
  };

  // Clear file inputs and previews
  logoFile.value = null;
  logoPreview.value = '';
  heroFiles.value = [];
  heroPreviews.value = [];
}

async function loadWorkspace() {
  if (!workspaceId.value) return;

  try {
    loading.value = true;
    const workspace = await workspaceService.getById(workspaceId.value);

    form.value = {
      ibgeId: workspace.ibgeId || '',
      name: workspace.name || '',
      title: workspace.title || '',
      about: workspace.about || '',
      description: workspace.description || '',
      logoUrl: workspace.logoUrl || '',
      colorPalette: workspace.colorPalette || ['#1a5278'],
      heroImages: workspace.heroImages || [],
    };

    // Load existing images as previews
    if (workspace.logoUrl) {
      logoPreview.value = workspace.logoUrl;
    }

    if (workspace.heroImages && workspace.heroImages.length > 0) {
      heroPreviews.value = [...workspace.heroImages];
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: typeof error === 'string' ? error : 'Erro ao carregar workspace',
      icon: 'warning',
    });
    void router.push('/workspaces');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadWorkspace();
});
</script>

<style scoped>
.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
