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
        <div>
            
        </div>
        <h1 class="text-center mt-3" style = "padding-top: 10px; " >{{fisio.nombre}}</h1>
            <br/>
            <h3 class="text-center mt-3" >{{fisio.email}} (Email)</h3> <br/>
        <div style="text-align: left;  margin-left:120px;">

        </div>
        <div class="text-center mt-3" style = "padding-top: 10px; ">
             <datepicker v-model="date" 
                @selected="fechaSeleccionada"
             ></datepicker>
        </div>
    </div>
    


</template>
<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
export default {
    name: "DetallesFisio",
    components: {
        Datepicker
    },
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
        /*franjasDispobibles: function(franjas) {
            var result = [];
            
            if(this.citas==null){
                return franjas;
            }else if(this.citas.length == 0){
                return franjas;
            }else{
                var encontrada;
                for(var i=0; i<franjas.length;i++){
                    encontrada = false;
                    for(var x=0; x<this.citas.length;x++){
                        if(franjas[i]==this.citas[x].hora){
                            encontrada = true;
                        }  
                    }
                    if(encontrada==false){
                        result.add(franjas[i]);
                    }  
                }
                
                return result;
            }

        } */
    },
    methods: {
        getImgUrl(img) {
            return require('../assets/'+ img)
        },
        fechaSeleccionada(date) {
            //Metodo donde vamos a consultar las citas disponibles para un dia

            //Convertimos el formato de la fecha de Date a formato YYYY-MM-DD para sql
            var pad = function(num) { return ('00'+num).slice(-2) };
            var fecha = date.getUTCFullYear()+ '-' +pad(date.getUTCMonth() + 1)  + '-' + pad(date.getUTCDate());
            console.log(date);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlCitas= "http://localhost:3000/clinica/citas/" + this.fisio.email +"/"+fecha;
            axios.get(urlCitas).then(response => {
                this.citas = response;
            })
            this.currentTab = null;
            this.activeTabName = null;

            //LISTAMOS LAS CITAS DISPONIBLES

            
            var tabla = document.querySelector("body");
            console.log(tabla);
            if(this.citas==null || this.citas.length == 0) {
                for(var z=0; z<this.franjas.length;z++){
                    var nCita = document.createElement("table");
                    nCita.innerHTML += '<tr><th>' + this.franjas[z] + '</th> <th> <button v-on:click="reservar">Reservar</button> </th></tr>';
                    tabla.append(nCita);
                }
            }else{
                var encontrada;
                
                
                for(var i=0; i<this.franjas.length;i++){
                    encontrada = false;
                    for(var x=0; x<this.citas.length;x++){
                        if(this.franjas[i]==this.citas[x].hora){
                            encontrada = true;
                        }  
                    }
                    if(encontrada==false){  //Si no lo hemos encontrado lo añadimos
                        var nuevaCita = document.createElement("tr");
                        nuevaCita.innerHTML += '<tr><th>' + this.franjas[i] + '</th></tr>';
                        tabla.append(nuevaCita);
                    }  
                }
                
            
            }



        }, reservar(Event){
            console.log(Event);
            console.log("hjagslkfh");
        }
    },
    data () {
      return {
        franjas: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        fisio:null,
        respuesta:null,
        citas: null,
        date: new Date()
      }
    },
    mounted:function(){
        if (!this.currentUser) {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlDetallesFisio = "http://localhost:3000/clinica/fisios/" + this.$route.params.idFisio;
            axios.get(urlDetallesFisio).then(response => {
                this.fisio = response.data[0];
            })
            this.currentTab = null;
            this.activeTabName = null;
        }
    }
}


</script>
<style>

</style>