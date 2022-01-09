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
        <div class="text-center mt-3" style = "padding-top: 10px;">
            <div id="app">
                <v-app id="inspire">
                    <v-content>
                    <v-layout justify-center>
                       <datepicker v-model="date"  popover-align="center"
                            @selected="fechaSeleccionada"
                            @input="fechaSeleccionada2"
                        ></datepicker>
                    </v-layout>
                    </v-content>
                </v-app>
            </div>
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
            var divs = tabla.getElementsByTagName("divs");
            while(divs.length > 1){
                var contador = 1;
                divs[contador].remove();
                contador++;
            }
            
            //console.log(tabla);
            if(this.citas==null || this.citas.length == 0) {
                for(var z=0; z<this.franjas.length;z++){
                    var nDiv = document.createElement("div");
                    nDiv.style.margin = "auto";
                    nDiv.style.width = "45%";
                    nDiv.style.textAlign = "center";
                    var nCita = document.createElement("Button");
                    nCita.innerHTML = this.franjas[z] + ":00 Reservar";
                    nCita.onclick = function(){
                        fetch("https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles=madrid")
                            .then( (respuesta) => {
                                if(respuesta.ok){
                                    respuesta.json()
                                    .then( function(data){
                                            var datos = JSON.stringify(data.query);
                        
                                            //Comprobar si nos devuelve informacion
                                            var indiceExiste = datos.indexOf('"pages":');
                                            var negativoPositivo = datos.slice(indiceExiste + 10, indiceExiste + 11);
                                            if(negativoPositivo == '-'){
                                                console.log("mal");
                                            }
                        
                                            var indiceDescripcion = datos.indexOf('"extract":');
                                            var finalDescripcion = datos.indexOf('"}}');
                                            var descripcion = datos.slice(indiceDescripcion + 11, finalDescripcion);
                                            var descripcionSitio = descripcion;
                                            var regex = /\[[0-9]+\]/g;
                                            var resultado = descripcionSitio.replace(regex, "");
                                            var regex2 = /\\{1}[n]?/g;
                                            resultado = resultado.replace(regex2, "");                        
                                            console.log(resultado);
                                        }    
                                    );
                                }else{
                                    console.log("mal");
                                }
                            }).catch(function(error) {
                                console.log('Hubo un problema con la petición Fetch:' + error.message);
                            });
                    }
                    nDiv.appendChild(nCita);
                    tabla.append(nDiv);
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
        }
    },fechaSeleccionada2(date) {
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
            var divs = tabla.getElementsByTagName("divs");
            while(divs.length > 1){
                var contador = 1;
                divs[contador].remove();
                contador++;
            }
            //console.log(tabla);
            if(this.citas==null || this.citas.length == 0) {
                for(var z=0; z<this.franjas.length;z++){
                    var nDiv = document.createElement("div");
                    nDiv.style.margin = "auto";
                    nDiv.style.width = "45%";
                    nDiv.style.textAlign = "center";
                    var nCita = document.createElement("Button");
                    nCita.innerHTML = this.franjas[z] + ":00 Reservar";
                    nCita.onclick = function(){
                        fetch("https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles=madrid")
                            .then( (respuesta) => {
                                if(respuesta.ok){
                                    respuesta.json()
                                    .then( function(data){
                                            var datos = JSON.stringify(data.query);
                        
                                            //Comprobar si nos devuelve informacion
                                            var indiceExiste = datos.indexOf('"pages":');
                                            var negativoPositivo = datos.slice(indiceExiste + 10, indiceExiste + 11);
                                            if(negativoPositivo == '-'){
                                                console.log("mal");
                                            }
                        
                                            var indiceDescripcion = datos.indexOf('"extract":');
                                            var finalDescripcion = datos.indexOf('"}}');
                                            var descripcion = datos.slice(indiceDescripcion + 11, finalDescripcion);
                                            var descripcionSitio = descripcion;
                                            var regex = /\[[0-9]+\]/g;
                                            var resultado = descripcionSitio.replace(regex, "");
                                            var regex2 = /\\{1}[n]?/g;
                                            resultado = resultado.replace(regex2, "");                        
                                            console.log(resultado);
                                        }    
                                    );
                                }else{
                                    console.log("mal");
                                }
                            }).catch(function(error) {
                                console.log('Hubo un problema con la petición Fetch:' + error.message);
                            });
                    }
                    nDiv.appendChild(nCita);
                    tabla.append(nDiv);
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
 .v-application--wrap {
    min-height: 0px;
  }
  .vdp-datepicker *{
      text-align: center;
  }
</style>