<template>
    <v-app id="inspire">
        
        <v-container fluid>
            <v-card-actions class="px-3 pb-8">                
                <v-spacer></v-spacer>
                <v-btn right color="pink" dark @click.stop="drawer = !drawer">Cuenta</v-btn>
            </v-card-actions>

            <v-toolbar class="pl-0 mt-n7" flat>
                <h4>{{ this.totalFisios }}</h4>
                <h4 class="grey--text text--lighten-1 ml-2">Fisioterapeutas encontrados</h4>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-row no-gutters>
                <v-col v-for="fisio in listaFisios" :key="fisio.id" cols="12" sm="3">
                  
                  <a :href="$router.resolve({name:'DetallesFisio', params: {idFisio:fisio.id}}).href" style="text-decoration: none;">
                    <v-card class="pa-2" outlined tile>
                        <img :src="getImgUrl(fisio.imagen)" width="196" height="280" >
                        <br/>
                        <h4 class="text-center mt-3">{{fisio.nombre}}</h4>
                        <br/>
                    </v-card>
                  </a>
                  
                </v-col>
            </v-row>
        </v-container>

        <v-container>
            <div class="d-flex flex-column justify-space-between align-center">
                <template>
                    <div class="text-center">
                        <v-pagination  v-model="page" :length="totalPaginas" @input="cambio">
                        </v-pagination>
                    </div>
                </template>
            </div>
        </v-container>

        <v-navigation-drawer v-model="drawer" absolute temporary right>
            <template v-slot:prepend>
                <v-list-item two-line>
                    <v-list-item-avatar>
                        <img src="https://randomuser.me/api/portraits/women/81.jpg" >
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>
                            {{currentUser.nombre}}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>

            <v-divider></v-divider>
            <v-list-item-content>
                <v-list-item-title>
                    {{currentUser.email}}
                </v-list-item-title>
                <v-list-item-title>
                    {{currentUser.dni}}
                </v-list-item-title>
                <v-list-item-title>
                    {{currentUser.email}}
                </v-list-item-title>
                <v-list-item-title>
                    {{currentUser.email}}
                </v-list-item-title>
            </v-list-item-content>
            <div>
                <v-btn color="red" dark @click="logout">Logout</v-btn>
            </div>
        </v-navigation-drawer>
    </v-app>
</template>

<script>
import axios from 'axios';
export default {
    name: "Home",
    computed:{
        currentUser() {
            return this.$store.state.user;
        }
    },
    methods: {
        cambio(value){
            console.log("click");
            this.pagina = value - 1;
            console.log(value);
            let urlListarFisios = "http://localhost:3000/clinica/fisios?page=" + this.pagina + "&size=4";
            axios.get(urlListarFisios).then(response => {
                this.listaFisios = response.data;
                this.respuesta = this.listaFisios.pop();
            }) 
        },
        getImgUrl(img) {
            return require('../assets/'+ img)
        },
        logout(){
            localStorage.removeItem('token');
            this.$store.commit('logout');
            this.$router.push('/');
            this.$router.go();
        }
    },
    data: () => ({ 
        // user: JSON.parse(localStorage.user),
        drawer: null, 
        listaFisios:null,
        pagina:0,
        repuesta:null,
        totalPaginas:0,
        totalFisios:null,
        tab:null
    }),
    mounted:function(){
        if (!this.currentUser) {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarFisios = "http://localhost:3000/clinica/fisios?page=" + this.pagina + "&size=4";
            axios.get(urlListarFisios).then(response => {
                this.listaFisios = response.data;
                console.log(response.data);
                this.respuesta = this.listaFisios.pop();
                this.totalPaginas = Math.ceil(this.respuesta.total_registros/this.respuesta.resultados_pagina);
                this.totalFisios = this.respuesta.total_registros;
            })
        }
    },
    handlePageChange(value) {
      this.pagina = value;
      this.next();
    },
    next:function(){
      this.pagina = this.pagina++;
      let urlListarFisios = "http://localhost:3000/clinica/fisios?page=" + this.pagina + "&size=4";
        axios.get(urlListarFisios).then(response => {
            this.listaFisios = response.data;
            this.respuesta = this.listaFisios.pop();
            this.totalPaginas = Math.round(this.respuesta.total_registros/this.respuesta.resultados_pagina);
        }) 
    }
  }
</script>