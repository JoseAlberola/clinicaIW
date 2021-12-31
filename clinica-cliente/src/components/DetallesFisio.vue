<template>
    <div>
        <div style="position:absolute; padding-left:40px; padding-top:40px; ">
            <a :href="$router.resolve({name:'Contenido'}).href" style="text-decoration: none;">
                <v-btn color="red" dark >Atrás</v-btn>
            </a>
        </div>
        <div style = "padding-top: 60px; ">
            <img :src="getImgUrl(fisio.imagen)" width="240" height="343"  >
        </div>
        <h1 class="text-center mt-3" style = "padding-top: 10px; " >{{fisio.nombre}}</h1>
            <br/>
            <h3 class="text-center mt-3" >{{fisio.email}} (Email)</h3> <br/>
        <div style="text-align: left;  margin-left:120px;">

        </div>

    </div>
</template>
<script>
import axios from 'axios';

export default {
    name: "DetallesFisio",
    computed:{
        currentUser() {
            return this.$store.state.user;
        }
    },
    methods: {
        getImgUrl(img) {
            return require('../assets/'+ img)
        }
    },
    data () {
      return {
        fisio:null,
        respuesta:null
      }
    },
    mounted:function(){
        if (!this.currentUser) {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlDetallesFisio = "http://localhost:3000/clinica/fisios/" + this.$route.params.idFisio;
            axios.get(urlDetallesFisio).then(response => {
                this.fisio = response.data;
            })
            this.currentTab = null;
            this.activeTabName = null;
        }
    }
}
</script>