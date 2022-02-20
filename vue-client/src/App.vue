<template>
  <v-app>
    <template>
      <Home />
    </template>
  </v-app>
</template>

<script>
import Home from './components/Home';
export default {
  components: {
    Home
  },
  data() {
    return {
      render: true
    };
  }
};
</script>
