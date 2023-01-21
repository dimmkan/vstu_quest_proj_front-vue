<template>
    <Header/>
    <MainLayout/>
    <Footer/>
</template>

<script>
  import Header from "./components/Header.vue";
  import MainLayout from "./components/MainLayout.vue";
  import Footer from "./components/Footer.vue";

  export default {
  name: 'App',

  components: {
    Header,
    MainLayout,
    Footer,
  },
};
</script>

<style scoped>
</style>
