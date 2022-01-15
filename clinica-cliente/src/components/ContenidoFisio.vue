<template>
  <div class="text-center mt-3" style = "padding-top: 10px;">
            <div id="app">
                <v-app id="inspire">
                    <v-content>
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
                    </v-content>
                </v-app>
            </div>
        </div>
</template>


<script>
import Datepicker from 'vuejs-datepicker';

  export default {
    data: () => ({
        date: new Date(),
        picker: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    }),
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
    },
  }
</script>


