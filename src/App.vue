<template>
  <div id="app">
    <!-- <img src="./assets/logo.png" /> -->
    <h1>{{ msg }}</h1>
    <Home v-if="!isLogin"></Home>
    <Editor v-if="isLogin" :user="userData"></Editor>
  </div>
</template>

<script>
import Home from "./components/Home.vue";
import Editor from "./components/Editor.vue";
export default {
  name: "app",
  data() {
    return {
      isLogin: false,
      userData: null,
      msg: "Welcome to Your MyMarkdown"
    };
  },
  components: {
    Home: Home,
    Editor: Editor
  },
  created: function() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        this.isLogin = true;
        this.userData = user;
      } else {
        this.isLogin = false;
        this.userData = null;
      }
    });
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
