<template>
    <div>
        <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <img src="static/logo.png" width="112" height="28">
                </a>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                
            </div>
        </nav>
        <section class="section">
            <div class="container">
                <input class="input" type="tags" v-model="enteredPackage" placeholder="Text input">
                <button class="button" type="button" v-on:click="handleSubmit" >Search</button>
                <!-- <button type="button" v-on:click="handleDownload" >Download</button> -->
                <button class="button" type="button" v-if="zipReady" v-on:click="handleDownload" >Download</button>

            </div>
            <div> {{ packagesList }}</div>
        </section>
    </div>
</template>

<script>
import { getAllDependecies, downloadFiles, createZip } from "../utils/fetcher";
import saveAs from 'file-saver';


export default {
  name: "HelloWorld",
  data() {
       return {
          enteredPackage: '',
          packagesList: [],
          files: [],
          zipReady: false,
          download: ''
        }
    },
  methods: {
    handleSubmit: async function() {
      this.packagesList = await getAllDependecies(this.enteredPackage);
      this.files = await downloadFiles(this.packagesList);
      this.download = await createZip(this.files)
      this.zipReady = true;
    },
    handleDownload: async function() {
      saveAs(this.download, "download.zip")
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
