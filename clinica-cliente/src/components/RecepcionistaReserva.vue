<template>
    
        <div class="text-center mt-3" style = "padding-top: 10px;">
        
            <div id="app">
                <v-app id="inspire">
                
                    <v-content>
                    <v-layout justify-center>
                    <h2>Reservar cita </h2>
                    </v-layout>
                    <v-layout justify-center>
                    <v-icon >mdi-calendar</v-icon>
                       <datepicker v-model="date"  popover-align="center" style=" text-align: center;"></datepicker>
                    </v-layout>
                    <v-layout justify-center>
                       &nbsp; Seleccionar fisio:  &nbsp;  
                        <select @change="elegirFisio" id="fisio" style="margin-bottom: 15px;border: 1px solid; text-align: center;" >
                            <option  v-for="i in listaFisios" v-bind:value="i.email" :key="i.email">{{ i.nombre }}</option>
                        </select>
                        &nbsp;&nbsp;&nbsp;
                        Seleccionar cliente: &nbsp;
                        <select @change="elegirFisio" id="cliente" style="margin-bottom: 15px;border: 1px solid; text-align: center;" >
                            <option  v-for="i in listaClientes" v-bind:value="i.email" :key="i.email">{{ i.nombre }}</option>
                        </select>
                    </v-layout>

                    <div>
                        
                        <v-flex>
                            <v-btn style="margin-bottom: 15px" color="primary" @click="buscarCitas">
                                Listar Citas disponibles
                            </v-btn>
						</v-flex>
                    </div>
                    <div id="citas">
                    </div>
                    
                    </v-content>
                </v-app>

            </div>
        </div>
       


</template>
<script>
import global from '../App.vue';
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
        fechaSeleccionada( f ) {
            this.date = f;
            
        },elegirFisio() {
            //console.log(e);
            //console.log(document.getElementById('fisio').value);
        },
        buscarCitas(){
            

            var actualDate = new Date();
            if(this.date < actualDate ){
                window.alert("Elige fecha posterior a la actual por favor"); 
                 //Primero borramos las citas disponibles mostradas si estan
                var citasError = document.querySelectorAll(".botonReserva");
                for(var k = 0; k < citasError.length ; k++){
                    citasError[k].remove();
                }   

            }else{
                var mail = document.getElementById('fisio').value;
                
                //Primero borramos las citas disponibles mostradas si estan
                var citasListadas = document.querySelectorAll(".botonReserva");
                
                for(var i = 0; i < citasListadas.length ; i++){
                    citasListadas[i].remove();
                }
            
                    this.citas = [];
                    //Metodo donde vamos a consultar las citas disponibles para un dia
                    //Convertimos el formato de la fecha de Date a formato YYYY-MM-DD para sql
                    var pad = function(num) { return ('00'+num).slice(-2) };
                    var fecha = this.date.getUTCFullYear()+ '-' +pad(this.date.getUTCMonth() + 1)  + '-' + pad(this.date.getUTCDate());
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    let urlCitas = global.serverSrc+"/clinica/citas/" + mail +"/"+fecha;
                    axios.get(urlCitas).then(response => {
                        if(response.data === "dia festivo"){
                            window.alert("El dia elegido la clinica esta cerrada, por favor eliga un nuevo dia");
                        }else{
                             var tabla = document.querySelector("#citas");

                            for(var c=0; c < response.data.length; c++){

                                this.citas.push(response.data[c].hora);
                                
                            }

                            //BUcle de las franajs
                            for(var z=0; z<this.franjas.length;z++){
                                
                                var encontrada = false;

                                for(var x=0; x<this.citas.length;x++){
                                    
                                    
                                    if(this.franjas[z]===this.citas[x]){
                                        
                                        encontrada = true;
                                    }
                                }
                                if(encontrada==false){  //Si no lo hemos encontrado lo añadimos
                                    
                                    var nDiv = document.createElement("div");
                                    nDiv.style.margin = "auto";
                                    nDiv.style.width = "45%";
                                    nDiv.style.textAlign = "center";
                                    nDiv.classList.add('botonReserva');
                                    var nCita = document.createElement("Button");
                                    nCita.setAttribute("data-hora", this.franjas[z]);
                                    nCita.innerHTML = this.franjas[z] + ":00 Reservar";
                                    
                                    var fisio = mail;
                                    //var usuario = this.currentUser.email;
                                    var usuario = document.getElementById('cliente').value;
                                    var recep = this.currentUser.email;

                                    nCita.onclick = function(event){
                                        
                                        let json = {
                                            "fisio": fisio,
                                            "usuario": usuario,
                                            "Fecha": fecha,
                                            "hora": event.target.getAttribute("data-hora"),
                                            "recepcionista": recep
                                        };
                                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

                                        axios.post(global.serverSrc+'/clinica/reservarRecepcionista', json)
                                            .then(response => {
                                                //console.log(response);
                                                response;
                                                document.location.href="/panelRecepcionista";
                                            }).catch(function(error) {
                                                console.log('Hubo un problema' + error.message);
                                            });

                                    
                                }
                                nDiv.appendChild(nCita);
                                tabla.append(nDiv);
                            }

                        }
                       
                        }
                        
                    })
                    this.currentTab = null;
                    this.activeTabName = null;

                    

                   

            }
        }
    },
    data () {
      return {
        franjas: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        fisio:null,
        respuesta:null,
        citas: [],
        date: new Date(),
        listaFisios:null,
        listaClientes:null
      }
    },
    mounted:function(){
        if (!this.currentUser) {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarFisios = global.serverSrc+"/clinica/listadofisios";
            axios.get(urlListarFisios).then(response => {
                this.listaFisios = response.data;
                //console.log(this.listaFisios);
            })

            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarClientes = global.serverSrc+"/clinica/listadoclientes";
            axios.get(urlListarClientes).then(response => {
                this.listaClientes = response.data;
                //console.log(this.listaClientes);
            })



            this.currentTab = null;
            this.activeTabName = null;
        }
    }
    
}

</script>
<style>
    #citas {
        margin-top: 20px;
        margin-bottom: 15px;
    }
    .layout {
        margin-top: 10px;
    }
 .v-application--wrap {
    min-height: 0px;
  }
  .vdp-datepicker *{
      text-align: center;
  }

</style>