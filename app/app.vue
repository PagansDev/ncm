<script setup lang="ts">
import { useSupabaseClientApp } from './utils/supabase'
import { normalizeForSearch } from './utils/format'
import { useNCMData } from './composables/useNCMData'

const ncms = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref<string | null>(null)
const page = ref(1)
const rowsPerPage = 200
const pageCount = ref(1)
const query = ref('')
const modalOpen = ref(true)
const { setFullData, setFilteredData } = useNCMData()
const { loadStoredContext } = useNCMContext()

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

    setFilteredData(ncms.value)
  }
  loading.value = false
}

async function loadFullNCMData() {
  const supabase = useSupabaseClientApp()
  try {
    const { data, error } = await supabase
      .from('tabela_ncm')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Erro ao carregar dados completos:', error)
      return
    }

    if (data) {
      setFullData(data)
    }
  } catch (err) {
    console.error('Erro ao carregar dados completos:', err)
  }
}

onMounted(async () => {
  const hasStoredContext = await loadStoredContext()

  if (!hasStoredContext) {
    await loadFullNCMData()
  }

  await getNcms()
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
        <div class="flex items-center justify-between py-3">
          <!-- modal -->
          <UModal v-model:open="modalOpen" title="Como usar a Tabela de NCMs"
            description="Aprenda as principais funcionalidades da ferramenta.">
            <UButton label="Abrir Instruções" color="secondary" variant="outline" class="cursor-pointer" />

            <template #body>
              <div class="space-y-6 p-6">
                <div class="space-y-4">
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <UIcon name="i-lucide-search" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">Busca Simples</h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Digite o código NCM ou parte da descrição do produto. A busca funciona com acentos e
                        maiúsculas/minúsculas.
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <UIcon name="i-lucide-layers" class="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">Organização por Categorias</h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Grupos principais:</strong> Categorias amplas como "Animais vivos"<br>
                        <strong>Subcategorias:</strong> Divisões específicas como "Peixes vivos"<br>
                        <strong>Produtos específicos:</strong> Códigos finais para cada produto
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                        <UIcon name="i-lucide-copy" class="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">Copiar Código</h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Clique no ícone ao lado do código para copiá-lo automaticamente para usar em outros lugares.
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                        <UIcon name="i-lucide-database" class="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">Carregamento Rápido</h4>
                      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        As informações são salvas no seu navegador para carregar mais rápido nas próximas vezes.
                      </p>
                    </div>
                  </div>
                </div>


                <div class="flex justify-end pt-2">
                  <UButton color="secondary" variant="ghost" class="cursor-pointer"  @click="modalOpen = false">Entendi, começar a usar</UButton>
                </div>
              </div>
            </template>
          </UModal>
          <SimplePagination v-model:page="page" :page-count="pageCount" />
        </div>
      </div>
      <GoogleAdContainer class="basis-2/10" />
    </div>
  </UApp>
</template>