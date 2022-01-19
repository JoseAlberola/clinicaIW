<template>
  <div class="text-center mt-3" style = "padding-top: 10px;">
            <div id="app">
                <v-app id="inspire">
                    <v-content>
                    <h2 id="mih1" style="color:#1E88E5">Mi horario </h2>
                    
                    <div style="margin-top:30px;">
                        <v-layout justify-center>
                        <h4 id="mih1">Seleccione una fecha </h4>
                        </v-layout>
                        <v-layout justify-center>
                        <v-icon>mdi-calendar</v-icon>
                        <datepicker v-model="date"  popover-align="center"
                                @selected="fechaSeleccionada"
                            >
                            </datepicker>
                        </v-layout>
                    </div>

                    <div id="divOculto" onload="cargarDiv();" style="margin-left:33%;margin-top:30px;position:absolute;">
                        
                        <div style="">
                            <template>

                                <v-dialog v-model="dialog" max-width="500px">                        
                                        <v-card ref="form">
                                           <v-card-title>
                                                <span class="text-h5">Reservar máquina</span>
                                            </v-card-title> 
                                            <v-card-text>
                                                <ul id="v-for-object" class="demo">
                                                    <li v-for="maquina in maquinas" :key="maquina.id">
                                                        <div style="text-align:left; font-size: 20px; padding-top:10px; position:absolute;">
                                                            {{maquina.nombre}}
                                                        </div>
                                                        <div id="botonReserva" style="text-align:right; padding-bottom:10px;padding-top:10px;">
                                                            <v-btn class="mr-2" depressed  @click="reservarMaquina(maquina)">Reservar</v-btn>
                                                        </div>
                                                        
                                                    </li>
                                                </ul>
                                            </v-card-text>
                                        </v-card>
                                    </v-dialog>



                                    <v-dialog v-model="dialogSala" max-width="500px">                        
                                        <v-card ref="form">
                                           <v-card-title>
                                                <span class="text-h5">Reservar sala</span>
                                            </v-card-title> 
                                            <v-card-text>
                                                <ul id="v-for-object" class="demo">
                                                    <li v-for="sala in salas" :key="sala.id">
                                                        <div style="text-align:left; font-size: 20px; padding-top:10px; position:absolute;">
                                                            {{sala.nombre}}
                                                        </div>
                                                        <div id="botonReserva" style="text-align:right; padding-bottom:10px;padding-top:10px;">
                                                            <v-btn class="mr-2" depressed  @click="reservarSala(sala)">Reservar</v-btn>
                                                        </div>
                                                        
                                                    </li>
                                                </ul>
                                            </v-card-text>
                                        </v-card>
                                    </v-dialog>


                                <v-data-table
                                    :headers="headers"
                                    :items="horas"
                                    hide-default-footer
                                    hide-default-header
                                    class="elevation-1"
                                    disable-pagination
                                >

                                    






                                    <template v-slot:item.accion="{ item }">
                                        <v-btn class="mr-2" depressed  @click="abrirDialogMaquina(item)"
                                        >Reservar máquina</v-btn>
                                        <v-btn class="mr-2" depressed  @click="abrirDialogSala(item)"
                                        >Reservar sala</v-btn>
                                        <v-btn depressed color="error" @click="bloquear(item)"
                                        >Bloquear</v-btn>
                                    </template>
                                </v-data-table>
                            </template>
                        </div>
                    </div>
                    
                    </v-content>
                </v-app>
            </div>
        </div>
</template>


<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';

  export default {
    data: () => ({
        date: new Date(),
        fecha: null,
        dialog: false,
        dialogSala: false,
        maquinas: null,
        salas: null, 
        idReserva: null,
        horaCita: null, 
        citas: null,
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
         headers: [
          {
            text: '',
            align: 'start',
            value: 'name',
          },
          { text: '', value: 'reserva'},
          { text: 'Acción', value: 'accion', sortable: false },
          
        ],
        headersMaquina: [
          { text: 'nombre',align: 'start', value: 'nombre'},
          { text: 'Acción', value: 'accion', sortable: false },
          
        ],
        horas: [
            { name: '10:00', reserva:''},
            { name: '11:00', reserva:''},
            { name: '12:00', reserva:''},
            { name: '13:00', reserva:''},
            { name: '14:00', reserva:''},
            { name: '15:00', reserva:''},
            { name: '16:00', reserva:''},
            { name: '17:00', reserva:''},
            { name: '18:00', reserva:''},
            { name: '19:00', reserva:''},
            { name: '20:00', reserva:''},
        ]
    }),
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
    },
    components: {
        Datepicker
    },
    methods: {
      logout(){
            localStorage.removeItem('token');
            this.$store.commit('logout');
            this.$router.push('/');
            this.$router.go();
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
                var pad = function(num) { return ('00'+num).slice(-2) };
                this.fecha = date.getUTCFullYear()+ '-' +pad(date.getUTCMonth() + 1)  + '-' + pad(date.getUTCDate());
                console.log(this.fecha);
                let urlCitas= "http://localhost:3000/clinica/citas/" + this.$store.state.user.email +"/"+this.fecha;
                axios.get(urlCitas).then(response => {
                    if(response.data === "dia festivo"){
                            window.alert("El dia elegido la clinica esta cerrada, por favor eliga un nuevo dia");
                    }
                    this.citas = response.data;
                    console.log(response);
                    console.log(this.fecha);
                    var x = document.getElementById("divOculto");
                    x.style.display = "block";

                    for(var j = 0; j<this.horas.length; j++){
                        this.horas[j].reserva = "Sin reserva";
                    }

                    for(var i = 0; i< this.citas.length; i++){
                        for(j = 0; j<this.horas.length; j++){
                            var partes = this.horas[j].name.split(":");
                            if(this.citas[i].hora == partes[0]){
                                this.horas[j].reserva = this.citas[i].emailcliente;
                                console.log("Es igual!");
                            }
                        }
                    }

                })
            }
        },
        bloquear(item){
            console.log(item);
            if(item.reserva == "Sin reserva"){
                console.log(this.fecha);
                var partes = item.name.split(":");
                let json = {
                    "fisio": this.$store.state.user.email,
                    "usuario": this.$store.state.user.email,
                    "Fecha": this.fecha,
                    "hora": partes[0],
                };
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

                axios.post('http://localhost:3000/clinica/reservar', json)
                    .then(response => {
                        console.log(response);
                        item.reserva = this.$store.state.user.email;
                     }).catch(function(error) {
                        console.log('Hubo un problema' + error.message);
                     });

            } else {
                window.alert("Ya hay una reserva a esa hora"); 
            }
        },
        abrirDialogMaquina(item){
            if(item.reserva == "Sin reserva"){
                window.alert("No hay reserva para esa hora"); 
            } else{
                if(item.reserva == this.$store.state.user.email){
                    window.alert("La hora está bloqueada"); 
                } else{
                    this.horaCita = item.name.split(":")[0];
                    this.dialog = true;
                    let urlCitas= "http://localhost:3000/clinica/maquinas";
                    axios.get(urlCitas).then(responseMaquina => {
                        this.maquinas = responseMaquina.data;
                        console.log(this.maquinas);
                    })
                }
            }
        },
        abrirDialogSala(item){
            if(item.reserva == "Sin reserva"){
                window.alert("No hay reserva para esa hora"); 
            } else{
                if(item.reserva == this.$store.state.user.email){
                    window.alert("La hora está bloqueada"); 
                } else{
                    this.horaCita = item.name.split(":")[0];
                    this.dialogSala = true;
                    let urlCitas= "http://localhost:3000/clinica/salas";
                    axios.get(urlCitas).then(responseSala => {
                        this.salas = responseSala.data;
                        console.log(this.salas);
                    })
                }
            }
        },
        close () {
            this.dialog = false;
        },
        closeSala () {
            this.dialogSala = false;
        },
        reservarMaquina(maquina){
            let urlMaquina= "http://localhost:3000/clinica/reservaMaquina/" + maquina.id +"/"+this.fecha;
            axios.get(urlMaquina).then(response => {
                    if(response.data.length == 0){
                        for(var i = 0; i< this.citas.length; i++){
                            if(this.citas[i].hora == this.horaCita){
                                this.idReserva = this.citas[0].id;
                            }
                        }


                        let json = {
                            "fisio": this.$store.state.user.email,
                            "idReserva": this.idReserva,
                            "idMaquina": maquina.id,
                        };
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

                        axios.post('http://localhost:3000/clinica/reservarMaquina', json)
                            .then(response => {
                                console.log(response);
                                window.alert("Se ha realizado la reserva de la máquina " + maquina.nombre + " correctamente.");
                            }).catch(function(error) {
                                console.log('Hubo un problema' + error.message);
                            });

                    } else{
                        window.alert("La máquina ya se encuentra reservada a esta hora.");
                    }
            })
        },
        reservarSala(sala){
            let urlSala= "http://localhost:3000/clinica/reservaSala/" + sala.id +"/"+this.fecha;
            axios.get(urlSala).then(response => {
                    if(response.data.length == 0){
                        for(var i = 0; i< this.citas.length; i++){
                            if(this.citas[i].hora == this.horaCita){
                                this.idReserva = this.citas[0].id;
                            }
                        }

                        let json = {
                            "fisio": this.$store.state.user.email,
                            "idReserva": this.idReserva,
                            "idSala": sala.id,
                        };
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

                        axios.post('http://localhost:3000/clinica/reservarSala', json)
                            .then(response => {
                                console.log(response);
                                window.alert("Se ha realizado la reserva de la sala " + sala.nombre + " correctamente.");
                            }).catch(function(error) {
                                console.log('Hubo un problema' + error.message);
                            });

                    } else{
                        window.alert("La sala ya se encuentra reservada a esta hora.");
                    }
            })
        }
    },
    mounted:function(){
            if (!this.currentUser || this.currentUser.tipo != "fisio") {
                this.$router.push('/');
            }
            var x = document.getElementById("divOculto");
            console.log(x.style.display);
            x.style.display = "none";
            
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogSala (val) {
        val || this.closeSala()
      },
    },
  }
</script>

<style>
.v-main__wrap{
    height:700px;
}
</style>


