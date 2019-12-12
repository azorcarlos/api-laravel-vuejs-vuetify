<template>
  <v-app>
    <nav-bar-vue/>
    <v-content>
      <router-view></router-view>
    </v-content>
    <footer-vue/>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import NavBarVue from './components/NavBarVue';
import FooterVue from './components/FooterVue';

export default {
  name: 'App',

  components: {
    HelloWorld,NavBarVue,FooterVue
  },

  data: () => ({
    //
  }),
};
</script>
