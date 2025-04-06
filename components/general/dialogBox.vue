<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-full"
    v-if="show"
  >
    <div
      class="bg-white text-center rounded-lg shadow-xl w-3/5 mx-4 overflow-hidden relative"
    >
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        aria-label="Close dialog"
      >
        <font-awesome-icon icon="times" class="h-5 w-5 text-gray-600" />
      </button>
      <div class="grid grid-flow-col gap-5">
        <div class="py-10 pl-10 pr-5">
          <div class="flex justify-end">
            <font-awesome-icon
              @click="$emit('toggleFavIds', pokemon?.id)"
              :icon="
                includes(isFavourite, pokemon?.id)
                  ? ['fas', 'heart']
                  : ['far', 'heart']
              "
              class="h-6 w-6 transition-colors cursor-pointer"
              :class="
                includes(isFavourite, pokemon?.id)
                  ? 'text-red-400'
                  : 'hover:text-red-400'
              "
            />
          </div>
          <img
            :src="pokemon?.sprites?.front_default"
            :alt="pokemon?.name"
            class="w-full object-contain mx-auto"
            loading="lazy"
          />
          <h2 class="text-2xl font-bold capitalize">{{ pokemon?.name }}</h2>
          <p class="text-lg">#{{ pokemon?.id?.toString().padStart(4, "0") }}</p>
        </div>
        <div class="row-span-2 col-span-2 bg-slate-50 p-10">
          <div class="text-left text-xl font-semibold mb-4">Stats</div>
          <table class="w-full">
            <tbody>
              <tr
                v-for="stat in displayedStats"
                :key="stat?.name"
                class="odd:bg-white even:bg-gray-50"
              >
                <td class="px-4 py-3 text-left font-medium text-gray-700 w-1/2">
                  {{ stat?.label }}
                </td>
                <td class="px-4 py-3 text-right">
                  {{ stat?.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { find, map, includes, filter } from "lodash";

defineEmits(["close", "toggleFavIds"]);

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  pokemonId: {
    type: Number,
    default: null,
  },
  isFavourite: {
    type: Array,
    default: () => [],
  },
});

const pokemon = ref({});

// Fetch pokemon data when id changes
watch(
  () => props.pokemonId,
  async (newId) => {
    if (newId) {
      await fetchPokemonData(newId);
    }
  },
  { immediate: true }
);

const fetchPokemonData = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    pokemon.value = await response.json();
  } catch (err) {
    console.error("Failed to fetch Pokémon:", err);
  }
};

// Format stats for display
const displayedStats = computed(() => {
  const p = pokemon?.value || {};
  return [
    { label: "Height", value: `${(p.height || 0) / 10}m` },
    { label: "Weight", value: `${(p.weight || 0) / 10}kg` },
    ...(p.stats || []).map((stat) => ({
      label: (stat.stat?.name || "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      value: stat.base_stat || 0,
    })),
  ];
});
</script>

<style scoped>
/* Add any custom animations here if needed */
</style>