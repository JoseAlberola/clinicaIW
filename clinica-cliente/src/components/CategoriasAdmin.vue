<template>
  <v-app id="inspire">
    <h1 style="margin-top:40px;">Listado de categorias</h1>
    <v-data-table :headers="headers" :items="listaCategorias" class="elevation-1" style="width:90%; margin:auto;">
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialog" max-width="500px">                      
            <v-card ref="form">
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                      ref="idcategoria"
                      v-model="editedItem.idcategoria"
                      label="Id categoría"                                    
                      readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                      ref="nombre"
                      v-model="editedItem.nombre"
                      label="Nombre"
                      :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>                          
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  CANCELAR
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  ACEPTAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <v-dialog v-model="dialogDelete" max-width="650px">
            <v-card>
              <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar esta categoría?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">CANCELAR</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">ACEPTAR</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      
      <template v-slot:item.accion="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import axios from 'axios';
export default {
  name: 'CategoriasAdmin',
  computed:{
    currentUser() {
      return this.$store.state.user;
    },
    formTitle () {
      return this.editedIndex === -1 ? 'Crear Categoría' : 'Editar Categoría'
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
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
}
</script>