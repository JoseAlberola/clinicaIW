<template>
    <v-app id="inspire">
        <h1 style="margin-top:40px;">Días festivos</h1>

        <v-data-table :headers="headers" :items="listaFestivos" class="elevation-1" style="width:90%; margin:auto; margin-top:30px;">
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
                                <span class="text-h5">Crear día festivo</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>                                        
                                        <v-col cols="12" sm="12" md="12">                                                                                      
                                            <label style="margin-right:30px; color:black; font-size:15px">Fecha</label>
                                            <input
                                            ref="fecha"
                                            type="date"                                             
                                            v-model="editedItem.fecha"
                                            required
                                            :rules="[rules.required]"
                                            popover-align="center" 
                                            style=" text-align: center;">                                            
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
                                        <v-col cols="12" sm="12" md="12">     
                                            <label style="margin-right:30px; color:black; font-size:15px">Fecha</label>
                                            <input
                                            ref="fecha"
                                            type="date" 
                                            v-model="editedItem.fecha"
                                            required
                                            :rules="[rules.required]"
                                            popover-align="center" 
                                            style=" text-align: center;">                                            
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
                            <v-card-title class="text-h5">¿Estás seguro de que quieres eliminar este día festivo?</v-card-title>
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
    name: "FestivosAdmin",
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
        formTitle () {
            return this.editedIndex === -1 ? 'Crear día festivo' : 'Editar día festivo'
        },
        form () {
            return {
                fecha: this.editedItem.fecha
            }
        },
        formCrear () {
            return {
                fecha: this.editedItem.fecha
            }
        },
    },
    data: () => ({ 
        listaFestivos:[],
        rules: {
            required: value => !!value || 'Required.',
        },
        formHasErrors: false,
        formCrearHasErrors: false,
        dialog: false,
        dialogCrear: false,
        dialogDelete: false,
        headers: [
            { text: 'Fecha  (aaaa-mm-dd)', align: 'start', value: 'fecha', sortable: true },            
            { text: 'Acción', value: 'accion', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
            fecha: "",
        },
        defaultItem: {
            fecha: "",
        },
    }),
    methods: {
        initialize(){
            if (!this.currentUser) {
                this.$router.push('/');
            }else{
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                let urlListarFestivos = global.serverSrc+"/clinica/festivos";
                axios.get(urlListarFestivos).then(response => {
                    this.listaFestivos = response.data;
                    this.formatearFecha(this.listaFestivos);
                })
            }
        },
        editItem (item) {
            this.editedIndex = this.listaFestivos.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.defaultItem = Object.assign({}, item)           
            this.dialog = true
        },

        deleteItem (item) {
            this.editedIndex = this.listaFestivos.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },

        deleteItemConfirm () {
            // Borrar festivo
            if (!this.currentUser) {
                this.$router.push('/');
            }else{
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                let urlEliminarFestivo = global.serverSrc+"/clinica/festivos/" + this.editedItem.fecha;
                axios.delete(urlEliminarFestivo).then(response => {                        
                    if(response.status == 204){                        
                        this.listaFestivos.splice(this.editedIndex, 1);
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
                if (this.$refs[f]._value == "") this.formHasErrors = true
            })

            if(!this.formHasErrors){

                if (this.editedIndex > -1) {
                    Object.assign(this.listaFestivos[this.editedIndex], this.editedItem)
                } else {
                    this.listaFestivos.push(this.editedItem)
                }    

                if (!this.currentUser) {
                    this.$router.push('/');
                }else{
                    let json = {
                        "fecha" : this.editedItem.fecha
                    };

                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    let urlModificarFestivo = global.serverSrc+"/clinica/festivos/" + this.defaultItem.fecha;                        
                    axios.put(urlModificarFestivo, json).then(response => {
                        console.log(response);                              
                    })
                }
                this.close();
            }
        },
        saveCrear () {            
            this.formCrearHasErrors = false

            Object.keys(this.formCrear).forEach(f => {
                if (this.$refs[f]._value == "") this.formCrearHasErrors = true
            })

            if (!this.formCrearHasErrors) {

                if (!this.currentUser) {
                    this.$router.push('/');
                }else{
                    
                    let json = {
                        "dia": this.editedItem.fecha
                    };

                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
                    let urlCrearFestivo = global.serverSrc+"/clinica/crearFestivo";
                    axios.post(urlCrearFestivo, json).then(response => {
                        console.log(response); 
                        if (this.editedIndex > -1) {
                            Object.assign(this.listaFestivos[this.editedIndex], this.editedItem)
                        } else {
                            this.listaFestivos.push(this.editedItem)
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
        formatearFecha (listaFestivos) {
            var i;
            for(i = 0; i < listaFestivos.length; i++){
                var d = new Date(listaFestivos[i].fecha),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;
                var fecha = [year,month,day].join('-');

                listaFestivos[i].fecha = fecha;
            }
        }
    },
    mounted:function(){
        if (!this.currentUser || this.currentUser.tipo != "administrador") {
            this.$router.push('/');
        }else{
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
            let urlListarFestivos = global.serverSrc+"/clinica/festivos";
            axios.get(urlListarFestivos).then(response => {
                this.listaFestivos = response.data;
                this.formatearFecha(this.listaFestivos);
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