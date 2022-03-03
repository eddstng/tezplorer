<template>
  <v-app>
    <template>
      <!-- <Operations /> -->
      <Tokens />
    </template>
  </v-app>
</template>

<script>
// import Operations from './components/Operations';
import Tokens from './components/Tokens';
export default {
  components: {
    Tokens
  },
  data() {
    return {
      render: true
    };
  }
};
</script>
