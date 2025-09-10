<script setup lang="ts">
definePageMeta({
    layout: false
})

throw createError({
    statusCode: 404,
    statusMessage: 'Página não encontrada'
})
</script>

<template>
    <div></div>
</template>
