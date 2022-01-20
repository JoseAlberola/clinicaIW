<template>
  <div>
    <v-form v-on:submit.prevent="pagar" style="width:40%; margin:auto; margin-top:40px">
      <v-text-field
        id="owner"
        label="Nombre de titular"
        name="owner"        
        type="text"
        color="blue"
        required
        :rules="rules.name"
        v-model="owner"
      />
      <br/>
      <v-text-field
        id="number"
        label="Número de cuenta (16 digitos)"
        name="number"
        type="text"
        color="blue"
        required
        :rules="rules.name"
        v-model="number"
      />
      <br/>
      <v-text-field
        id="ccv"
        label="CCV (3 digitos)"
        name="ccv"
        type="text"
        color="blue"
        required
        :rules="rules.name"
        v-model="ccv"
      />
      <br/>
      <v-text-field
        id="expiry"
        label="Expiración (mm/aaaa)"
        name="expiry"
        type="text"
        color="blue"
        required
        :rules="rules.name"
        v-model="expiry"
      />
    </v-form>
    <div class="text-center mt-4">
      <v-btn v-on:click="pagar" :class="{'shake' : animated}" class="white--text" rounded color="blue" :disabled="!formLoginIsValid">PAGAR</v-btn>
    </div>
  </div>
</template>

<script>
import global from '../App.vue';
import axios from 'axios';
export default {
    name: "Pagar",
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
        formLoginIsValid () {
          return (this.owner && this.number && this.ccv && this.expiry)
        },
    },
    data: () => ({
        owner: "",
        number:"",
        ccv: "",
        expiry: "",
        animated: false,
        rules:{
          name: [val => (val || '').length > 0 || 'Este campo es obligatorio'],
        },
    }),
    methods: {
      esNumero(num){
        return !isNaN(num);
      },
      validarExp(exp){
        var resultado = true;
        var mes = exp.substr(0, 2);
        var anyo = exp.substr(3, 4);
        var barra = exp.charAt(2);        
        if(exp.length != 7 || barra != '/' || !this.esNumero(mes) || !this.esNumero(anyo)){
          resultado = false;
        }
        return resultado;
      },
      validarNumeroTarjeta(num){
        return this.esNumero(num) && num.length == 16;
      },
      validarCCV(num){        
        return this.esNumero(num) && num.length == 3;
      },
      obtenerReferencia(){
        var n1 = Math.floor(Math.random() * (10 - 0) + 0);
        var n2 = Math.floor(Math.random() * (10 - 0) + 0);
        var n3 = Math.floor(Math.random() * (10 - 0) + 0);
        var n4 = Math.floor(Math.random() * (10 - 0) + 0);
        var n5 = Math.floor(Math.random() * (10 - 0) + 0);
        var n6 = Math.floor(Math.random() * (10 - 0) + 0);
        var resultado = "";
        return resultado + n1 + n2 + n3 + n4 + n5 + n6 + "x";
      },
      pagar(){
        if(this.validarExp(this.expiry) && this.validarNumeroTarjeta(this.number) && this.validarCCV(this.ccv) ){
          
          let bodyAuth = {
            "apiKey": "92de6f3a-d9a8-474c-a764-2a92e3fbbd46"
          };

          let tokenTPV = "";

          axios.post('https://tpvviw.tk/api/v1/auth/authtoken', bodyAuth)
            .then(response => {
              console.log(response.data.authToken);
              tokenTPV = response.data.authToken;
              var numeroReferencia = this.obtenerReferencia();

              let bodyPay = {
                "amount": 50,
                "concept": "Reserva clinica fisioterapeuta",
                "reference": numeroReferencia,
                "creditCard": {
                  "owner": this.owner,
                  "number": this.number,
                  "ccv": this.ccv,
                  "expiry": this.expiry   
                }
              };

              axios.defaults.headers.common['Authorization'] = 'Bearer ' + tokenTPV;
              axios.post('https://tpvviw.tk/api/v1/payments/', bodyPay)
                .then(response2 => {
                  // Reservar
                  var idPago = response2.data.id;
                  if(response2.data.status == "ACCEPTED"){
                    let jsonReserva = {
                      "fisio": this.$route.params.emailFisio,
                      "usuario": this.$route.params.emailUsuario,
                      "Fecha": this.$route.params.fecha,
                      "hora": this.$route.params.hora,
                      "pago": idPago,
                      "referencia": numeroReferencia
                    };
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;

                    axios.post(global.serverSrc+'clinica/reservar', jsonReserva)
                      .then(response => {
                          console.log(response);
                          document.location.href="/panelUsuario";
                      }).catch(function(error) {
                          console.log('Hubo un problema' + error.message);
                      });                                   
                  }else{
                    alert("Error en el pago.");
                  }
                }).catch(function(error) {
                  console.log('Hubo un problema' + error.message);
                });

            }).catch(function(error) {
              console.log('Hubo un problema' + error.message);
            });
        }else{
          alert("Datos introducidos erróneos.");
        }
      }
    },
    mounted:function(){
      if (!this.currentUser || this.currentUser.tipo != "usuario") {
        this.$router.push('/');
      }
    },    
  }
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