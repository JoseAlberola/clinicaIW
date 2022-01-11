<template>
  <v-app id="inspire">
		<div class="wrapper">
			<div class="left">
				<img src="https://i.imgur.com/cMy8V5j.png" alt="user" width="100">
				<h4>{{this.$store.state.user.nombre}}</h4>
				
			</div>
			<div class="right">
				<div class="info">
					<h3>Información de contacto</h3>
					<div class="info_data">
						<div class="data">
							<h4>Email</h4>
							<p>{{this.$store.state.user.email}}</p>
						</div>
						<div class="data">
						<h4>Teléfono</h4>
							<p>{{this.$store.state.user.telefono}}</p>
					</div>
					</div>
				</div>
			
			<div class="projects">
					<h3>Mis citas</h3>
					<div class="projects_data">
						<div class="data">
						<div>
							<v-btn flat color="blue lighten-1" @click="logout">Cerrar Sesión</v-btn>
						</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  name: 'PanelUsuario',
  computed:{
    currentUser() {
      return this.$store.state.user;
    },
    form () {
      return {
        idcategoria: this.editedItem.idcategoria,
        nombre: this.editedItem.nombre,
      }
    },
  },
  data: () => ({ 
    // user: JSON.parse(localStorage.user), 
    listaCategorias:[],
    rules: {
      required: value => !!value || 'Required.',
    },
    formHasErrors: false,
    dialog: false,
    dialogDelete: false,
    headers: [
        { text: 'ID', align: 'start', sortable: false, value: 'idcategoria', },
        { text: 'Nombre', value: 'nombre', sortable: false },
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

    deleteItem (item) {
      this.editedIndex = this.listaCategorias.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      // Borrar categoria
      if (!this.currentUser) {
          this.$router.push('/');
      }else{
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          let urlEliminarCategoria = "http://localhost:3000/biblioteca/categorias/" + this.editedItem.idcategoria;
          axios.delete(urlEliminarCategoria).then(response => {
              console.log(response);
              if(response.status == 204){
                  this.listaCategorias.splice(this.editedIndex, 1);
              }
          })
          this.closeDelete();
      }
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      })
    },
    save () {            
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
            console.log(f)
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
    close () {
        this.dialog = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        })
    },
	logout(){
            console.log(this.$store.state.user);
    }
  },
  mounted:function(){
    if (!this.currentUser) {
      this.$router.push('/');
    }else{
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
      let urlListarCategorias = "http://localhost:3000/biblioteca/categorias";
      axios.get(urlListarCategorias).then(response => {
          this.listaCategorias = response.data;
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
		background: linear-gradient(to right,#01a9ac,#01dbdf);
		padding: 30px 25px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		text-align: center;
		color: #fff;
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