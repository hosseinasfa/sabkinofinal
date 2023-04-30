<template>
  <div class="row q-col-gutter-xs">
    <div class="col-12 col-sm-6">
      <q-select filled v-model="model" :options="options" label="استان" />
    </div>
    <div class="col-12 col-sm-6">
      <q-select filled v-model="model" :options="options" label="شهر" />
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        model: null,
        options: [
          'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
        ]
      }
    }
  }

</script>
