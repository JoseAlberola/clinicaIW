<template>
<v-app id="inspire">
		<div class="wrapper">
			<div class="left">
            <img :src="getImgUrl(fisio.imagen)" alt="fisio" width="300px">
				<h2>{{fisio.nombre}}</h2>
				<div class="info">
					<h3>Información de contacto</h3>
					<div class="info_data">
						<div class="data">
							<h3>Email</h3>
							<p>{{fisio.email}}</p>
						</div>
					</div>
                    
                </div>
            </div>
            <div class="right" id="citas">
                    <div class="text-center mt-3" style = "padding-top: 10px;">
                    <div id="app">
                        <h3>Seleccione fecha: </h3>
                        <v-app id="inspire">
                            <v-content>
                            <v-layout justify-center>
                            <v-icon>mdi-calendar</v-icon>
                            <datepicker v-model="date"  popover-align="center"
                                    @selected="fechaSeleccionada"
                                >
                                </datepicker>
                            </v-layout>
                            </v-content>
                        </v-app>
                    </div>

            </div>
        </div>
        
        

        </div>
    
    

    </v-app>
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
                                                document.location.href="/panelUsuario";
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
        date: new Date()
      }
    },
    mounted:function(){
        if (!this.currentUser || this.currentUser.tipo != "usuario") {
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

	@import url('https://fonts.googleapis.com/css?family=Josefin+Sans&display=swap');

	*{
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		list-style: none;
		font-family: 'Josefin Sans', sans-serif;
	}

	body{
		background-color: #f3f3f3;
	}

	.wrapper{
		position: relative;
		top: 60%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 80%;
		display: flex;
		box-shadow: 0 1px 20px 0 rgba(69,90,100,.08);
	}

	.wrapper .left{
		width: 35%;
		background: linear-gradient(to right, #42a5f5,#42a5f5);
		padding: 30px 25px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		text-align: center;
		color: black;
	}

	.wrapper .left img{
		border-radius: 5px;
		margin-bottom: 10px;
	}

	.wrapper .left h4{
		margin-bottom: 10px;
	}

	.wrapper .left p{
		font-size: 12px;
	}

	.wrapper .right{
		width: 65%;
		background: #fff;
		padding: 30px 25px;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	.wrapper .right .info,
	.wrapper .right .projects{
		margin-bottom: 25px;
	}

	.wrapper .right .info h3,
	.wrapper .right .projects h3{
		margin-bottom: 15px;
		padding-bottom: 5px;
		border-bottom: 1px solid #e0e0e0;
		color: #353c4e;
		text-transform: uppercase;
		letter-spacing: 5px;
	}

	.wrapper .right .info_data,
	.wrapper .right .projects_data{
		display: flex;
		justify-content: space-between;
	}

	.wrapper .right .info_data .data,
	.wrapper .right .projects_data .data{
		width: 45%;
	}

	.wrapper .right .info_data .data h4,
	.wrapper .right .projects_data .data h4{
		color: #353c4e;
		margin-bottom: 5px;
	}

	.wrapper .right .info_data .data p,
	.wrapper .right .projects_data .data p{
		font-size: 13px;
		margin-bottom: 10px;
		color: #000000;
	}

	.wrapper .social_media ul li{
		width: 45px;
		height: 45px;
		background: linear-gradient(to right,#01a9ac,#01dbdf);
		margin-right: 10px;
		border-radius: 5px;
		text-align: center;
		line-height: 45px;
	}

	.wrapper .social_media ul li a{
		color :#fff;
		display: block;
		font-size: 18px;
	}

    #app {
        margin-bottom: 20px;
    }

</style>