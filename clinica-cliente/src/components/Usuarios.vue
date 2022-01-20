<template>
    <v-app id="inspire">
        <h1 style="margin-top:40px;">Listado de usuarios</h1>

        <v-data-table :headers="headers" :items="listaUsuarios" class="elevation-1" style="width:90%; margin:auto; margin-top:30px;">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-dialog v-model="dialogCrear" max-width="500px">                        
                        <template v-slot:activator="{ on, attrs }">
                            <v-spacer></v-spacer>
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Crear
                            </v-btn>
                        </template>

                        <v-card ref="formCrear">
                            <v-card-title>
                                <span class="text-h5">Crear usuario</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>                                        
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="email"
                                            v-model="editedItem.email"
                                            label="Email"
                                            :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="nombre"
                                            v-model="editedItem.nombre"
                                            label="Nombre"
                                            :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="password"
                                            v-model="editedItem.password"
                                            label="Password"
                                            :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="telefono"
                                            v-model="editedItem.telefono"
                                            label="Telefono"
                                            :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select
                                            ref="tipo"
                                            v-model="editedItem.tipo"
                                            :items="tiposUsuario"
                                            label="Tipo de usuario"
                                            :rules="[rules.required]"
                                            ></v-select>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeCrear">
                                    CANCELAR
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="saveCrear">
                                    ACEPTAR
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    
                    <v-dialog v-model="dialog" max-width="500px">                        

                        <v-card ref="form">
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="id"
                                            v-model="editedItem.id"
                                            label="Id usuario"                                    
                                            readonly
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="email"
                                            v-model="editedItem.email"
                                            label="Email"
                                            :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="nombre"
                                            v-model="editedItem.nombre"
                                            label="Nombre"
                                            :rules="[rules.required]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field
                                            ref="telefono"
                                            v-model="editedItem.telefono"
                                            label="Telefono"
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
                            <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar este usuario?</v-card-title>
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
                <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>

            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                    Reset
                </v-btn>
            </template>
        </v-data-table>
    </v-app>
</template>

<script>
import global from '../App.vue';
import axios from 'axios';
export default {
    name: "Usuarios",
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Crear Usuario' : 'Editar Usuario'
        },
        form () {
            return {
                id: this.editedItem.id,
                email: this.editedItem.email,
                nombre: this.editedItem.nombre,
                telefono: this.editedItem.telefono,
            }
        },
        formCrear () {
            return {
                email: this.editedItem.email,
                nombre: this.editedItem.nombre,
                password: this.editedItem.password,
                telefono: this.editedItem.telefono,
                tipo: this.editedItem.tipo
            }
        },
    },
    data: () => ({ 
        listaUsuarios:[],
        rules: {
            required: value => !!value || 'Required.',
        },
        formHasErrors: false,
        formCrearHasErrors: false,
        dialog: false,
        dialogCrear: false,
        dialogDelete: false,
        headers: [
            { text: 'ID', align: 'start', value: 'id', sortable: false },
            { text: 'Email', value: 'email', sortable: false },
            { text: 'Nombre', value: 'nombre', sortable: false },
            { text: 'Teléfono', value: 'telefono', sortable: false },
            { text: 'Password', value: 'password', sortable: false, align: ' d-none'},
            { text: 'Tipo', value: 'tipo', sortable: false, align: ' d-none'},
            { text: 'Acción', value: 'accion', sortable: false },
        ],
        tiposUsuario: ['administrador', 'fisio', 'recepcionista', 'usuario'],
        editedIndex: -1,
        editedItem: {
            id: 0,
            email: '',
            nombre: '',
            password: '',
            telefono: '',
            tipo: ''
        },
        defaultItem: {
            id: 0,
            email: '',
            nombre: '',
            password: '',
            telefono: '',
            tipo: ''
        },
    }),
    methods: {
            initialize(){
                if (!this.currentUser) {
                    this.$router.push('/');
                }else{
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    let urlListarUsuarios = global.serverSrc+"/clinica/usuarios";
                    axios.get(urlListarUsuarios).then(response => {
                        this.listaUsuarios = response.data;
                    })
                }
            },
            editItem (item) {
                this.editedIndex = this.listaUsuarios.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                this.editedIndex = this.listaUsuarios.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            deleteItemConfirm () {
                // Borrar usuario
                if (!this.currentUser) {
                    this.$router.push('/');
                }else{
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    let urlEliminarUsuario = global.serverSrc+"/clinica/usuarios/" + this.editedItem.id;
                    axios.delete(urlEliminarUsuario).then(response => {                        
                        if(response.status == 204){                        
                            this.listaUsuarios.splice(this.editedIndex, 1);
                        }
                        this.closeDelete();
                    })
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
                    if (!this.form[f]) this.formHasErrors = true
                    this.$refs[f].validate(true)
                })

                if(!this.formHasErrors){
                    
                    if (this.editedIndex > -1) {
                        Object.assign(this.listaUsuarios[this.editedIndex], this.editedItem)
                    } else {
                        this.listaUsuarios.push(this.editedItem)
                    }    

                    if (!this.currentUser) {
                        this.$router.push('/');
                    }else{
                        let json = {
                            "email" : this.editedItem.email,
                            "nombre" : this.editedItem.nombre,
                            "telefono": this.editedItem.telefono
                        };

                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                        let urlModificarUsuario = global.serverSrc+"/clinica/usuarios/" + this.editedItem.id;                        
                        axios.put(urlModificarUsuario, json).then(response => {
                            console.log(response);                      
                        })
                    }
                    this.close();
                }
            },
            saveCrear () {            
                this.formCrearHasErrors = false

                Object.keys(this.formCrear).forEach(f => {
                    if (!this.formCrear[f]) this.formCrearHasErrors = true
                    this.$refs[f].validate(true)
                })

                if(!this.formCrearHasErrors){                  
                    if (!this.currentUser) {
                        this.$router.push('/');
                    }else{
                        let json = {
                            "email" : this.editedItem.email,
                            "password": this.editedItem.password,
                            "nombre" : this.editedItem.nombre,
                            "tipo": this.editedItem.tipo,
                            "telefono": this.editedItem.telefono
                        };

                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                        let urlCrearUsuario = global.serverSrc+"/clinica/registroTrabajador";
                        axios.post(urlCrearUsuario, json).then(response => {
                            console.log(response);
                            this.editedItem.id = response.data.id; 
                            this.editedItem.email = response.data.email;
                            this.editedItem.nombre = response.data.nombre;
                            this.editedItem.tipo = response.data.tipo;                                                       
                            if (this.editedIndex > -1) {
                                Object.assign(this.listaUsuarios[this.editedIndex], this.editedItem)
                            } else {
                                this.listaUsuarios.push(this.editedItem)
                            }
                            this.closeCrear();
                        })
                    }
                }
            },
            close () {
                this.dialog = false
                this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
                })
            },
            closeCrear () {
                this.dialogCrear = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)                  
                    this.editedIndex = -1
                })
            },
    },
    mounted:function(){
        if (!this.currentUser || this.currentUser.tipo != "administrador") {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarUsuarios = global.serverSrc+"/clinica/usuarios";
            axios.get(urlListarUsuarios).then(response => {
                this.listaUsuarios = response.data;
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