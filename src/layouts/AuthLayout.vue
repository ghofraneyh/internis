<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100"
  >
    <div class="w-1/2 max-w-lg px-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "AuthLayout",
});
</script>

<style scoped></style>
