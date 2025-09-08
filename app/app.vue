<script setup lang="ts">
import { useSupabaseClientApp } from './utils/supabase'
import { normalizeForSearch } from './utils/format'

const ncms = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref<string | null>(null)
const page = ref(1)
const rowsPerPage = 200
const pageCount = ref(1)
const query = ref('')



async function getNcms() {
  loading.value = true
  errorMessage.value = null
  const supabase = useSupabaseClientApp()
  const fromIndex = (page.value - 1) * rowsPerPage
  const toIndex = fromIndex + rowsPerPage - 1
  const normalized = normalizeForSearch(query.value)
  const filter = normalized ? `.or(codigo.ilike.%${normalized}%,descricao.ilike.%${normalized}%)` : ''
  const [{ count: total, error: countError }, { data, error }] = await Promise.all([
    supabase
      .from('tabela_ncm')
      .select('*', { count: 'exact', head: true })
      .or(`codigo.ilike.%${normalized}%,descricao.ilike.%${normalized}%`),
    supabase
      .from('tabela_ncm')
      .select('*')
      .order('id', { ascending: true })
      .or(`codigo.ilike.%${normalized}%,descricao.ilike.%${normalized}%`)
      .range(fromIndex, toIndex)
  ])

  if (error || countError) {
    errorMessage.value = error?.message || countError?.message || 'Erro na busca'
    ncms.value = []
  } else {
    ncms.value = data || []
    pageCount.value = Math.max(1, Math.ceil((total || 0) / rowsPerPage))
  }
  loading.value = false

}

onMounted(() => {
  getNcms()
})

watch(page, () => {
  getNcms()
})

watch(query, () => {
  page.value = 1
  getNcms()
})

useHead({
  title: 'Tabela Fiscal - NCM',
  meta: [
    { name: 'description', content: 'Tabela Fiscal' }
  ]
})

</script>

<template>
  <UApp class="flex flex-col items-center justify-center h-screen">
    <AppHeader />
    <div class="flex flex-row gap-4 w-[100vw]">
      <GoogleAdContainer class="basis-2/10" />
      <div class=" flex flex-col gap-4 basis-6/10">
        <SearchBar v-model:query="query" />
        <UAlert v-if="errorMessage" color="error" :title="'Erro ao buscar dados'" :description="errorMessage" />
        <UAlert v-if="!loading && !errorMessage && ncms.length === 0" color="info" :title="'Nenhum dado encontrado'"
          description="Se o erro persistir por favor recarregue a página" />
        <AppTable :data="ncms" :loading="loading" />
        <div class="flex items-center justify-end py-3">
          <SimplePagination v-model:page="page" :page-count="pageCount" />
        </div>
      </div>
      <GoogleAdContainer class="basis-2/10" />
    </div>
  </UApp>
</template>

