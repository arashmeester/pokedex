<template>
  <div class="min-h-screen p-6">
    <div>
      <h1 class="text-3xl font-bold text-red-600">Pokédex</h1>
    </div>

    <hr class="border-gray-300 my-6" />
    <div class="flex justify-end mb-6 relative">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by name or id number"
        class="w-2/5 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
        @keyup.enter="performSearch(searchTerm)"
      />
      <button
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 focus:outline-none hover:scale-110 transition-transform"
        @click="performSearch(searchTerm)"
        aria-label="Search"
      >
        <font-awesome-icon
          icon="magnifying-glass"
          class="h-6 w-6 text-gray-500 hover:text-amber-400"
        />
      </button>
    </div>

    <dialog-box
      :show="selectedPokemon.show"
      :pokemonId="selectedPokemon.id"
      :isFavourite="isFavourite"
      @close="selectedPokemon.show = false"
      @toggleFavIds="toggleFavIds"
    />

    <!-- Pokémon List -->
    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
      <div
        v-for="pokemon in filteredPokemon"
        :key="pokemon?.id"
        class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
        @click="showDetails(pokemon?.id)"
      >
        <div class="flex justify-end">
          <font-awesome-icon
            @click="toggleFavIds(pokemon.id)"
            :icon="
              includes(isFavourite, pokemon.id)
                ? ['fas', 'heart']
                : ['far', 'heart']
            "
            class="h-6 w-6 transition-colors"
            :class="
              includes(isFavourite, pokemon.id)
                ? 'text-red-400'
                : 'hover:text-red-400'
            "
          />
        </div>
        <h2 class="font-bold text-lg capitalize">{{ pokemon?.name }}</h2>
        <p class="text-gray-500">
          {{ pokemon?.id.toString().padStart(4, "0") }}
        </p>
      </div>
    </div>

    <!-- Load More Button -->
    <div class="text-center mt-5">
      <button
        @click="loadMore"
        class="mt-6 px-4 py-2 bg-amber-400 rounded hover:bg-amber-600 transition"
      >
        Load more
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { find, map, includes, filter } from "lodash";
import { useLocalStorage } from "~/composables/useLocalStorage";
import DialogBox from "@/components/general/dialogBox.vue";

const pokemonList = ref([]);
const selectedPokemon = ref({});
const displayedCount = ref(10);
const searchTerm = ref("");
let filteredPokemon = ref([]);
const isFavourite = useLocalStorage("favourites", []);

// Fetch Pokémon data
onMounted(async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");
  const data = await response.json();

  pokemonList.value = data.results.map((p, index) => ({
    name: p.name,
    id: index + 1,
    show: false,
  }));

  filteredPokemon.value = pokemonList.value.slice(0, displayedCount.value);
});

// Load more Pokémon
const loadMore = () => {
  displayedCount.value += 10;

  filteredPokemon.value = pokemonList.value.slice(0, displayedCount.value);
};

const toggleFavIds = (id) => {
  if (includes(isFavourite.value, id))
    isFavourite.value = filter(isFavourite.value, (item) => item != id);
  else isFavourite.value.push(id);
};

const performSearch = (keyword) => {
  if (!keyword?.trim()) {
    filteredPokemon.value = pokemonList.value.slice(0, displayedCount.value);
    return;
  }

  const term = keyword.toLowerCase().trim();
  filteredPokemon.value = pokemonList.value.filter((p) => {
    return (
      p.name?.toLowerCase().includes(term) || p.id?.toString().includes(term)
    );
  });
};

const showDetails = (id) => {
  filteredPokemon.value = map(filteredPokemon.value, (item) => {
    return {
      ...item,
      show: item.id == id ? true : false,
    };
  });

  selectedPokemon.value = find(filteredPokemon.value, { id: id });
};
</script>

<style scoped>
</style>