<template>
  <v-app>
    <template>
      <Operations />
    </template>
  </v-app>
</template>

<script>
import Operations from './components/Operations';
export default {
  components: {
    Operations
  },
  data() {
    return {
      render: true
    };
  }
};
</script>
