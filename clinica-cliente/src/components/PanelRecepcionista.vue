<template>
  <v-app id="inspire">
		<div class="wrapper">
			<div class="left">
				<img src="https://i1.wp.com/mundowin.com/wp-content/uploads/2019/06/windows-computer-user-profile.png?w=832&ssl=1" alt="user" width="300px">
				<h2>{{this.$store.state.user.nombre}}</h2>
				<div class="info">
					<h3>Información de contacto</h3>
					<div class="info_data">
						<div class="data">
							<h3>Email</h3>
							<p>{{this.$store.state.user.email}}</p>
						</div>
						<div class="data">
						<h3>Teléfono</h3>
							<p>{{this.$store.state.user.telefono}}</p>
						</div>
						
                    </div>
				</div>
					<v-layout justify-center>
						<v-icon >mdi-calendar</v-icon>
                       <datepicker v-model="date"  popover-align="center" style=" text-align: center;"></datepicker>
                    </v-layout>
					<v-flex>
						<v-btn style="margin-bottom: 15px" color="primary" @click="crearFestivo">
							Crear dia festivo
						</v-btn>
					</v-flex>
			</div>
			<div class="right">
				
			
			<div class="projects">
                    <h3>Gestionar citas</h3>
						<v-flex>
                            <v-btn style="margin-bottom: 15px" color="primary" @click="nuevaCita">
								Crear nueva cita
                            </v-btn>
						</v-flex>
                        <select id="cliente" style="margin-bottom: 15px;border: 1px solid; text-align: center;">
                            <option  v-for="i in listaClientes" v-bind:value="i.email" :key="i.email">{{ i.nombre }}</option>
                        </select>
                        <div>
                            <v-flex>
                                <v-btn style="margin-bottom: 15px" color="primary" @click="buscarCitas">
                                    Listar Citas
                                </v-btn>
							</v-flex>
                        </div>

					<h3>Citas Usuario</h3>
							<v-data-table :headers="headers" :items="listarCitas" class="elevation-1" style="width:90%; margin:auto;">
								<template v-slot:top>
									<v-toolbar flat>
									<v-dialog v-model="dialog" max-width="500px">                      
										<v-card ref="form">


										<v-card-text>
											<v-container>
											<v-row>
												<v-col cols="12" sm="6" md="4">
													<v-text-field
														ref="fecha"
														v-model="editedItem.idcategoria"
														label="fecha"                                    
														readonly
														>
													</v-text-field>
												</v-col>
												<v-col cols="12" sm="6" md="4">
													<v-text-field
														ref="hora"
														v-model="editedItem.nombre"
														label="hora"
														:rules="[rules.required]">
													</v-text-field>
												</v-col>
												<v-col cols="12" sm="6" md="4">
													<v-text-field
														ref="emailfisio"
														v-model="editedItem.nombre"
														label="emailfisio"
														:rules="[rules.required]">
													</v-text-field>
												</v-col>                    
											</v-row>
											</v-container>
										</v-card-text>

										</v-card>
									</v-dialog>
									
									
									</v-toolbar>
								</template>
								
            
								<template v-slot:item.accion="{item}">
									<v-btn color="blue darken-1" text @click="closeDelete(item)">CANCELAR</v-btn>
								</template>
								</v-data-table>
				</div>
			</div>
		</div>
  </v-app>
</template>

<script>
import axios from 'axios';
import Datepicker from 'vuejs-datepicker';
export default {
  name: 'PanelUsuario',
	components: {
		Datepicker
	},
  computed:{
    currentUser() {
      return this.$store.state.user;
    },
    form () {
      return {
			fecha: this.editedItem.idcategoria,
			nombre: this.editedItem.nombre,
      }
    },
  },
  data: () => ({ 
    // user: JSON.parse(localStorage.user), 
	date: new Date(),
    listaCategorias:[],
	listarCitas:[],
    listaClientes:null,
    rules: {
      required: value => !!value || 'Required.',
    },
    formHasErrors: false,
    dialog: false,
    dialogDelete: false,
    headers: [
        { text: 'Fecha', align: 'start', sortable: false, value: 'fecha'},
        { text: 'Hora', value: 'hora', sortable: false },
        { text: 'Fisio', value: 'emailfisio', sortable: false },
		{ text: 'Acción', value: 'accion', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
        idcategoria: 0,
        nombre: ''
    },
    defaultItem: {
        idcategoria: 0,
        nombre: '',
    },
  }),
  methods:{
    editItem (item) {
      this.editedIndex = this.listaCategorias.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItemConfirm () {
      // Borrar categoria
      if (!this.currentUser) {
          this.$router.push('/');
      }else{
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          let urlEliminarCategoria = "http://localhost:3000/biblioteca/categorias/" + this.editedItem.idcategoria;
          axios.delete(urlEliminarCategoria).then(response => {
              //console.log(response);
              if(response.status == 204){
                  this.listaCategorias.splice(this.editedIndex, 1);
              }
          })
          this.closeDelete();
      }
    },
	nuevaCita(){
		document.location.href="/recepcionista/reservar";
	},crearFestivo(){
		var actualDate = new Date();
		if(this.date < actualDate ){
			window.alert("Elige fecha posterior a la actual por favor"); 
		}else{
			var pad = function(num) { return ('00'+num).slice(-2) };
			var fecha = this.date.getUTCFullYear()+ '-' +pad(this.date.getUTCMonth() + 1)  + '-' + pad(this.date.getUTCDate());
						
			let json = {
				"dia": fecha
			};
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

			axios.post('http://localhost:3000/clinica/crearFestivo', json)
			.then(response => {
				if(response.data === "dia festivo"){
					window.alert("El dia elegido ya esta dado de alta como festivo");
				}else if(response.data === "dia con citas"){
					window.alert("No se puede marcar como festivo el dia, debido a que ya hay citas programadas ese dia");
				}else{
					window.alert("Dia festivo creado con exito");
				}
			}).catch(function(error) {
				console.log('Hubo un problema' + error.message);
			});
		}

	},
    closeDelete (item) {
      if (!this.currentUser) {
          this.$router.push('/');
      }else{
		//console.log(item);
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
		var d = new Date(),
					month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();
				if (month.length < 2) 
					month = '0' + month;
				if (day.length < 2) 
					day = '0' + day;
				var fecha2 = [year,month,day].join('-');
		//console.log(item.fecha);
		//console.log(fecha2);
		if(item.fecha < fecha2 ){
            window.alert("Elige fecha posterior a la actual por favor"); 
        }else{
			let urlCancelarReserva = "http://localhost:3000/clinica/cancelarReserva/" + document.getElementById('cliente').value + "/" + item.fecha + "/" + item.hora.substring(0,2);
			//console.log(urlCancelarReserva);
			axios.delete(urlCancelarReserva).then(response => {
				//console.log(response);
				if(response.status == 204){
					location.reload();
					window.alert("Cita eliminada");

				}else{
					window.alert("No se pudo eliminar la cita. Citas pasadas no se puede eliminar");
				}
			})
		}
      }
    },
    save () {            
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
            //console.log(f)
            if (!this.form[f]) this.formHasErrors = true
            this.$refs[f].validate(true)
        })

        if(!this.formHasErrors){
            
          if (this.editedIndex > -1) {
              Object.assign(this.listaCategorias[this.editedIndex], this.editedItem)
          } else {
              this.listaCategorias.push(this.editedItem)
          }    

          if (!this.currentUser) {
              this.$router.push('/');
          }else{
              let json = {
                  "nombre" : this.editedItem.nombre,
              };

              axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
              let urlModificarCategoria = "http://localhost:3000/biblioteca/categorias/" + this.editedItem.idcategoria;
              axios.put(urlModificarCategoria, json).then(response => {
                  console.log(response);                        
              })
          }
          this.close();
        }
    },
    buscarCitas(){
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
        //console.log("Prueba");
        //console.log(document.getElementById('cliente').value);

        let urlListarCitas = "http://localhost:3000/clinica/citasUsuario/" + document.getElementById('cliente').value;
        //console.log(urlListarCitas);
        axios.get(urlListarCitas).then(response => {
        this.listarCitas = response.data;
        var i;
        for(i = 0; i< this.listarCitas.length; i++){

            var d = new Date(this.listarCitas[i].fecha),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            var fecha = [year,month,day].join('-');

            //console.log(this.listarCitas[i].fecha);
            //console.log(fecha)
            this.listarCitas[i].fecha = fecha;
            this.listarCitas[i].hora = this.listarCitas[i].hora + ":00";
        }
        })
    }
  },
	mounted:function(){
	if (!this.currentUser) {
		this.$router.push('/');
	}else{
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarClientes = "http://localhost:3000/clinica/listadoclientes";
            axios.get(urlListarClientes).then(response => {
                this.listaClientes = response.data;
                //console.log(this.listaClientes);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                //console.log("Prueba");
                //console.log(document.getElementById('cliente').value);
                if(this.listaClientes.length > 0){
                    let urlListarCitas = "http://localhost:3000/clinica/citasUsuario/" + this.listaClientes[0].email;
                    //console.log(urlListarCitas);
                    axios.get(urlListarCitas).then(response => {
                    this.listarCitas = response.data;
                    var i;
                    for(i = 0; i< this.listarCitas.length; i++){
                        //var d = new Date(this.listarCitas[i].fecha);
                        //console.log(d);
                        var d = new Date(this.listarCitas[i].fecha),
                            month = '' + (d.getMonth() + 1),
                            day = '' + d.getDate(),
                            year = d.getFullYear();
                        if (month.length < 2) 
                            month = '0' + month;
                        if (day.length < 2) 
                            day = '0' + day;
                        var fecha = [year,month,day].join('-');

                        //console.log(this.listarCitas[i].fecha);
                        //var pad = function(num) { return ('00'+num).slice(-2) };
                        //var fecha = d.getUTCFullYear()+ '-' +pad(d.getUTCMonth() + 1)  + '-' + pad(d.getUTCDate());
                        //console.log(fecha)
                        this.listarCitas[i].fecha = fecha;
                        this.listarCitas[i].hora = this.listarCitas[i].hora + ":00";
                    }
                    })
                }else{
                    let urlListarCitas = "http://localhost:3000/clinica/citasUsuario/";
                    //console.log(urlListarCitas);
                    axios.get(urlListarCitas).then(response => {
                    this.listarCitas = response.data;
                    var i;
                    for(i = 0; i< this.listarCitas.length; i++){
                        //var d = new Date(this.listarCitas[i].fecha);
                        //console.log(d);
                        var d = new Date(this.listarCitas[i].fecha),
                            month = '' + (d.getMonth() + 1),
                            day = '' + d.getDate(),
                            year = d.getFullYear();
                        if (month.length < 2) 
                            month = '0' + month;
                        if (day.length < 2) 
                            day = '0' + day;
                        var fecha = [year,month,day].join('-');

                        //console.log(this.listarCitas[i].fecha);
                        //var pad = function(num) { return ('00'+num).slice(-2) };
                        //var fecha = d.getUTCFullYear()+ '-' +pad(d.getUTCMonth() + 1)  + '-' + pad(d.getUTCDate());
                        //console.log(fecha)
                        this.listarCitas[i].fecha = fecha;
                        this.listarCitas[i].hora = this.listarCitas[i].hora + ":00";
                    }
                    })
                }
            })
		
		}
        



            this.currentTab = null;
            this.activeTabName = null;
	}
}
</script>

<style scoped>
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
	.vdp-datepicker *{
		text-align: center;
	}

</style>