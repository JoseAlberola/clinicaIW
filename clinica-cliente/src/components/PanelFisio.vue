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
					
						<h3>Modificar Datos Usuario</h3>
						<div display:inline-block style="margin-bottom: 15px">
							<input type="text" id="cambioemail" value="Introduce Nuevo Email">
							<button type="button" @click="cambiarEmail" style="border: solid 1px">Actualizar</button>
						</div>
						<div display:inline-block style="margin-bottom: 15px">
							<input type="text" id="cambiotelefono" value="Introduce Nuevo Telefono" style="top: 20px" >
							<button type="button" @click="cambiarTelefono" style="border: solid 1px">Actualizar</button>
						</div>
						<div display:inline-block style="margin-bottom: 15px">
							<input type="text" id="cambionombre" value="Introduce Nuevo Nombre">
							<button type="button" @click="cambiarNombre" style="border: solid 1px">Actualizar</button>
						</div>
				</div>
				</div>
			</div>
			
		</div>
  </v-app>
</template>

<script>
import global from '../App.vue';
import axios from 'axios';
export default {
  name: 'PanelUsuario',
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
    listaCategorias:[],
	listarCitas:[],
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
          let urlEliminarCategoria = global.serverSrc+"/biblioteca/categorias/" + this.editedItem.idcategoria;
          axios.delete(urlEliminarCategoria).then(response => {
              //console.log(response);
              if(response.status == 204){
                  this.listaCategorias.splice(this.editedIndex, 1);
              }
          })
          this.closeDelete();
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
			let urlCancelarReserva = global.serverSrc+"/clinica/cancelarReserva/" + this.$store.state.user.email + "/" + item.fecha + "/" + item.hora.substring(0,2);
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
              let urlModificarCategoria = global.serverSrc+"/biblioteca/categorias/" + this.editedItem.idcategoria;
              axios.put(urlModificarCategoria, json).then(response => {
                  response;                      
              })
          }
          this.close();
        }
    },
	cambiarEmail(){
		if (!this.currentUser) {
          this.$router.push('/');
		}else{
		
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
		var emailactual = this.$store.state.user.email;
		var emailnuevo = document.getElementById("cambioemail").value;
		this.$store.state.user.email = emailnuevo
		let urlCambiarEmail = global.serverSrc+"/clinica/cambiarEmail/" + emailactual + "/" + emailnuevo;
		//console.log(urlCambiarEmail );
		axios.put(urlCambiarEmail ).then(response => {
			//console.log(response);

			if(response.status == 204){
				//console.log(this.$store.state.user.email);
				this.$store.state.user.email = emailnuevo;
				window.alert("Email Cambiado a " + emailnuevo + ". Pruebe a iniciar sesión de nuevo por favor.");
				localStorage.removeItem('token');
				this.$store.commit('logout');
				this.$router.push('/');
				this.$router.go();	
			}else{
				this.$store.state.user.email = emailactual;
				window.alert("No se puede cambiar el email else");
			}
		}).catch(function (error) {
			error;
			//console.log("Catch error");
			//console.log(error);
			window.alert("No se puede cambiar el email");
			location.reload();
			}
		)
		}
	},
	cambiarTelefono(){
		if (!this.currentUser) {
          this.$router.push('/');
		}else{
		
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
		var emailactual = this.$store.state.user.email;
		var telefononuevo = document.getElementById("cambiotelefono").value;
		let urlCambiarTelefono = global.serverSrc+"/clinica/cambiarTelefono/" + emailactual + "/" + telefononuevo;
		//console.log(urlCambiarTelefono );
		axios.put(urlCambiarTelefono ).then(response => {
			//console.log(response);
			if(response.status == 204){
				this.$store.state.user.telefono = telefononuevo;
				//console.log(this.$store.state.user.telefono);
				this.$store.state.user.telefono = telefononuevo;
				window.alert("Telefono cambiado a " + telefononuevo + ". Pruebe a iniciar sesión de nuevo por favor.");
				localStorage.removeItem('token');
				this.$store.commit('logout');
				this.$router.push('/');
				this.$router.go();	
			}else{
				this.$store.state.user.telefono
				window.alert("No se puede cambiar el telefono");
			}
		})
		}
	},
	cambiarNombre(){
		//console.log("Prueba");
		if (!this.currentUser) {
          this.$router.push('/');
		}else{
		
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
		var emailactual = this.$store.state.user.email;
		var nombrenuevo = document.getElementById("cambionombre").value;
		let urlCambiarNombre = global.serverSrc+"/clinica/cambiarNombre/" + emailactual + "/" + nombrenuevo;
		//console.log(urlCambiarNombre);
		axios.put(urlCambiarNombre ).then(response => {
			//console.log(response);
			if(response.status == 204){
				this.$store.state.user.nombre = nombrenuevo;
				//console.log(this.$store.state.user.nombre);
				window.alert("Nombre cambiado a " + nombrenuevo + ". Pruebe a iniciar sesión de nuevo por favor.");
				localStorage.removeItem('token');
				this.$store.commit('logout');
				this.$router.push('/');
				this.$router.go();	
			}else{
				window.alert("No se puede cambiar el nombre");
			}
		})
		}
	}
  },
	mounted:function(){
	if (!this.currentUser || this.currentUser.tipo != "fisio") {
        this.$router.push('/');
	}else{
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
		//console.log("Prueba");
		let urlListarCitas = global.serverSrc+"/clinica/citasUsuario/" + this.$store.state.user.email;
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
</style>