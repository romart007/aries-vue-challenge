<template>
  <form @submit="emitUpdate">
    <h1 class="font-bold tracking-tight text-gray-900 sm:text-lg mb-2">Options</h1>

    <TransitionGroup class="grid grid-cols-2 gap-4 my-4 rounded" name="list" tag="ul">
      <OptionsForm
        v-for="(option, index) in localOptions"
        :key="index"
        :index="index + 1"
        :option="option"
        :showCloseIcon="localOptions.length > 1"
        @remove-option="removeOption(index)"
        @update-option="updateOption(index, $event)"
      />
    </TransitionGroup>

    <div class="flex justify-between">
      <button type="submit" class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Analyze</button>
      <button
      class="flex items-center ml-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        type="button"
        :disabled="localOptions.length > maxOptions"
        @click="addOption"
      >
      <svg width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
      </svg>
      New
      </button>
    </div>
    <section>
</section>

  </form>
</template>

<script>

import OptionsForm from "./OptionsForm.vue";

export default {
  name: "OptionsController",
  components: {
    OptionsForm,
  },
  props: {
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localOptions: JSON.parse(JSON.stringify(this.options)),
      maxOptions: 4,
    };
  },
  methods: {
    addOption() {
      if (this.localOptions.length < 4) {
        this.localOptions.push({
          strikePrice: 0,
          type: "",
          bid: 0,
          ask: 0,
          longShort: "",
          expiration_date: new Date(),
        },);
      }
    },
    removeOption(index) {
      if(this.localOptions.length === 1) return;

      this.localOptions.splice(index, 1);
    },
    updateOption(index, payload) {
      this.$set(this.localOptions[index], payload.key, payload.value);
    },
    emitUpdate(ev) {
      ev.preventDefault();

      this.$emit("update-options", this.localOptions);
    },
  },
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}</style>