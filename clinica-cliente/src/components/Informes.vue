<template>
    <v-card style="margin-top:-20px;">
    <v-tabs
      v-model="tab"
      background-color="#2C3E50"
      dark
    >
      <v-tab
        v-for="item in items"
        :key="item.tab"
      >
        {{ item.tab }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item.tab"
      >
        <div v-if="item.tab=='Usuarios'">
            <div>
                <h2 style="margin-top:40px;">Informes de clientes</h2>
                <v-data-table :headers="headers" :items="listaClientes" class="elevation-1" style="width:70%; margin:auto; margin-top:30px;">                    
                </v-data-table>
            </div>
        </div>
        <div v-if="item.tab=='Fisioterapeutas'">
            <div>
                <h2 style="margin-top:40px;">Informes de fisioterapeutas</h2>
                <v-data-table :headers="headers" :items="listaFisios" class="elevation-1" style="width:70%; margin:auto; margin-top:30px;">
                </v-data-table>
            </div>
        </div>        
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
    name: "Informes",
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
    },
    data: () => ({ 
        tab: null,
        items: [
          { tab: 'Usuarios'},
          { tab: 'Fisioterapeutas'}
        ],
        headers: [
          { text: 'Email', align: 'start', value: 'email', sortable: true },
          { text: 'Número de reservas', value: 'reservas', sortable: true, align: 'center' }         
        ],
        listaClientes:[],
        listaFisios:[],
    }),
    methods: {
        
    },
    mounted:function(){
        if (!this.currentUser) {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlInformeClientes = "http://localhost:3000/clinica/informes/clientes";
            axios.get(urlInformeClientes).then(response => {
                this.listaClientes = response.data;
            })
            let urlInformeFisios = "http://localhost:3000/clinica/informes/fisios";
            axios.get(urlInformeFisios).then(response => {
                this.listaFisios = response.data;
                console.log(this.listaFisios)
            })
        }
    },    
  }
</script>