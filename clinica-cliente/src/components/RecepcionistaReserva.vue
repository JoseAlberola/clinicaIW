<template>
    
        <div class="text-center mt-3" style = "padding-top: 10px;">
        
            <div id="app">
                <v-app id="inspire">
                
                    <v-content>
                    <v-layout justify-center>
                    <v-icon>mdi-calendar</v-icon>
                       <datepicker v-model="date"  popover-align="center"
                            
                        >
                        </datepicker>
                    </v-layout>
                    <select >
                        <option :value="i" v-for="i in listaFisios" :key="i.id">{{ i.nombre }}</option>
                    </select>
                    </v-content>
                </v-app>

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
            var actualDate = new Date();
            if(date < actualDate ){
                window.alert("Elige fecha posterior a la actual por favor"); 
                 //Primero borramos las citas disponibles mostradas si estan
                var citasError = document.querySelectorAll(".botonReserva");
                //console.log(citasListadas);
                for(var k = 0; k < citasError.length ; k++){
                    citasError[k].remove();
                }   
            }else{
                 //Primero borramos las citas disponibles mostradas si estan
                var citasListadas = document.querySelectorAll(".botonReserva");
                //console.log(citasListadas);
                for(var i = 0; i < citasListadas.length ; i++){
                    citasListadas[i].remove();
                }
            
                    this.citas = [];
                    //Metodo donde vamos a consultar las citas disponibles para un dia

                    //Convertimos el formato de la fecha de Date a formato YYYY-MM-DD para sql
                    var pad = function(num) { return ('00'+num).slice(-2) };
                    var fecha = date.getUTCFullYear()+ '-' +pad(date.getUTCMonth() + 1)  + '-' + pad(date.getUTCDate());
                    //console.log(date);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    let urlCitas= "http://localhost:3000/clinica/citas/" + this.fisio.email +"/"+fecha;
                    axios.get(urlCitas).then(response => {
                        
                        var tabla = document.querySelector("body");

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
                                
                                var fisio = this.fisio.email;
                                var usuario = this.currentUser.email;
                            
                                nCita.onclick = function(event){
                                    
                                    
                                    let json = {
                                        "fisio": fisio,
                                        "usuario": usuario,
                                        "Fecha": fecha,
                                        "hora": event.target.getAttribute("data-hora")
                                    };
                                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

                                    axios.post('http://localhost:3000/clinica/reservar', json)
                                        .then(response => {
                                            console.log(response);
                                            document.location.href="/";
                                        }).catch(function(error) {
                                            console.log('Hubo un problema' + error.message);
                                        });

                                
                            }
                            nDiv.appendChild(nCita);
                            tabla.append(nDiv);
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
        listaFisios:null
      }
    },
    mounted:function(){
        if (!this.currentUser) {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarFisios = "http://localhost:3000/clinica/listadofisios";
            axios.get(urlListarFisios).then(response => {
                this.listaFisios = response.data;
                console.log(this.listaFisios);
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