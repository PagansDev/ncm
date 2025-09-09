<script setup lang="ts">
</script>

<template>
    <div class="
    flex
    justify-between
    items-center
    p-4
    border-b
    border-gray-200
    fixed 
    top-0
    left-0
    w-[100dvw]
    h-24
    bg-emerald-500
    ">
        <img src="/TFlogo.png" alt="Tabela Fiscal Logo" class="h-20 w-auto rounded-2xl" />
        <div class="flex flex-row gap-2 items-center">
            <h1 class="text-2xl font-bold">Tabela Fiscal</h1>
            <a href="https://www.linkedin.com/in/pagansdev/" target="_blank">
                <p class="text-sm">By PagansDev</p>
            </a>
        </div>

        <div class="flex items-center gap-3">
            <ColorModeButton />
        </div>

    </div>
</template>
