<template>
  <div class="flex justify-end mb-6 relative">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Search by name or id number"
      class="w-2/5 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
    />
    <button
      class="absolute right-2 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
      @click="performSearch"
    >
      <img
        src="@/assets/magnifying-glass-solid.svg"
        alt="Search"
        class="h-6 w-6"
      />
    </button>
  </div>
</template>