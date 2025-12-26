<template>
  <div class="page-header">
    <div class="row items-center justify-between">
      <div>
        <h4 class="q-my-none text-white">
          <q-icon v-if="icon" :name="icon" size="sm" class="q-mr-sm" />
          {{ title }}
        </h4>
        <p v-if="subtitle" class="q-mb-none q-mt-sm text-white" style="opacity: 0.9;">
          {{ subtitle }}
        </p>
      </div>
      <q-btn
        v-if="buttonLabel"
        :to="buttonTo"
        :label="buttonLabel"
        :icon="buttonIcon"
        color="white"
        text-color="primary"
        unelevated
        class="btn-tourism"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  buttonLabel?: string
  buttonIcon?: string
  buttonTo?: string
}>()
</script>
