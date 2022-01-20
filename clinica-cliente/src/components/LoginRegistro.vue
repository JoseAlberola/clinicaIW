<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-14">
                        <h1 id="mih1" class="text-center display-2 blue--text text--blue">Inicia sesión</h1>
                        <br/>
                        <br/>
                        <v-form v-on:submit.prevent="login">
                          <v-text-field
                            label="Dirección de correo"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="blue"
                            required
                            :rules="rules.name"
                            v-model="email"
                          />
                          <br/>
                          <v-text-field
                            id="password"
                            label="Contraseña"
                            name="password"
                            prepend-icon="lock"
                            type="password"
                            color="blue"
                            required
                            :rules="rules.name"
                            v-model="password"
                          />
                        </v-form>
                        <h3 class="text-center mt-4">{{mensajeLogin}}</h3>
                      </v-card-text>
                      <div class="text-center mt-4">
                        <v-btn v-on:click="login" :class="{'shake' : animated}" class="white--text" rounded color="blue" :disabled="!formLoginIsValid">SIGN IN</v-btn>
                      </div>
                      <div class="text-center mt-4">
                      </div>

                    </v-col>
                    <v-col cols="12" md="4" class="blue">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Hola, amigo!</h1>
                        <br/>
                        <h5 class="text-center">
                          Introduce tus datos personales para entrar en la clínica
                        </h5>
                        <br/>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step++">SIGN UP</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
                <v-window-item :value="2">
                  <v-row class="fill-height">
                    <v-col cols="12" md="4" class="blue">
                      <v-card-text class="white--text mt-12">
                        <h1 class="text-center display-1">Bienvenido de nuevo!</h1>
                        <br/>
                        <h5 class="text-center">
                          Inicia sesión con tus datos personales para mantenerte conectado
                        </h5>
                        <br/>
                      </v-card-text>
                      <div class="text-center">
                        <v-btn rounded outlined dark @click="step--">Sign in</v-btn>
                      </div>
                    </v-col>

                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="text-center display-2 blue--text text--blue">Crear cuenta</h1>
                        <br/>          
                        <v-form v-on:submit.prevent="registro">
                          <v-text-field
                            label="Dirección de correo"
                            name="Email"
                            prepend-icon="email"
                            type="text"
                            color="blue"
                            required
                            :rules="rules.name"
                            v-model="email"
                          />
                          <v-text-field
                            label="Nombre"
                            name="Name"
                            prepend-icon="person"
                            type="text"
                            color="blue"
                            required 
                            :rules="rules.name"
                            v-model="nombre"
                          />
                          <v-text-field
                            id="password"
                            label="Contraseña"
                            name="password"
                            prepend-icon="lock"
                            type="password"
                            color="blue"
                            required
                            :rules="rules.name"
                            v-model="password"
                          />
                          <v-text-field
                            id="telefono"
                            label="Telefono"
                            name="telefono"
                            prepend-icon="phone"
                            type="text"
                            color="blue"
                            required
                            :rules="rules.name"
                            v-model="telefono"
                          />
                        </v-form>
                        <h3 class="text-center mt-4">{{mensajeRegistro}}</h3>
                      </v-card-text>
                      <div class="text-center mt-n5">
                        <br/>
                        <v-btn v-on:click="registro" :class="{'shake' : animated}" class="white--text" rounded color="blue" :disabled="!formRegistroIsValid">SIGN UP</v-btn>
                      </div>
                      <div class="text-center mt-4">
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import global from '../App.vue';
import axios from 'axios';
export default {
  data: function(){
    return{
      step: 1,
      animated: false,
      rules:{
        name: [val => (val || '').length > 0 || 'Este campo es obligatorio'],
      },
      mensajeLogin:"",
      mensajeRegistro:"",
      email: "",
      nombre:"",
      password: "",
      telefono: "",
      imagen: ""
    }
  },
  props: {
    source: String
  },
  computed: {
    formLoginIsValid () {
      return (this.email && this.password)
    },
    formRegistroIsValid () {
      return (this.email && this.password && this.nombre)
    }
  },
  methods: {
    login(){
      let json = {
        "email" : this.email,
        "password" : this.password
      };
      axios.post(global.serverSrc+'/clinica/login', json)
      .then(response => {
        if (response.data.accessToken) {
          var user = response.data
          localStorage.setItem("token", response.data.accessToken);
          this.$store.commit('login', user);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;
          
          if(response.data.tipo == "administrador"){
            this.$router.push('/usuarios');    
          }else if(response.data.tipo == "fisio"){
            this.$router.push('/homeFisio');
          }else if(response.data.tipo == "usuario"){
            this.$router.push('/PanelUsuario');
          }else{
            this.$router.push('/PanelRecepcionista');
          }
          
        }
      }).catch(() => {
          this.mensajeLogin = "Login incorrecto";
          const self = this;
          self.animated = true;
          setTimeout(() => {
            self.animated = false;
          }, 1000)
      });
    },
    registro(){
      let json = {
        "email" : this.email,
        "password" : this.password,
        "nombre" : this.nombre,
        "telefono" : this.telefono
      };
      axios.post(global.serverSrc+'/clinica/registro', json)
      .then(response => {      
        if (response.status == 201) {         
          this.step--;
        }
      }).catch(() => {
          this.mensajeRegistro = "Registro incorrecto";
          const self = this;
          self.animated = true;
          setTimeout(() => {
            self.animated = false;
          }, 1000)
      });
    }
  }
};
</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }
  body{
    background: linear-gradient(120deg,#2980b9, #8e44ad);
    height: 100vh;
    overflow: hidden;
  }
  .shake {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
  
  }
  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
</style>