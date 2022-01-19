<template>
    <v-app>
        <v-toolbar color="blue darken-1" dark app>
            <v-app-bar-nav-icon color="white lighten-1" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <v-toolbar-title>Clínica de Fisioterapia IW</v-toolbar-title>
            <v-spacer></v-spacer>
            <div v-if="!this.currentUser" class="hidden-sm-and-down">
                <v-btn flat color="blue lighten-1" a v-bind:href="'/login'">Iniciar Sesión</v-btn>
            </div>
            <div v-else>
                <v-btn flat color="blue lighten-1" @click="logout">Cerrar Sesión</v-btn>
            </div>
        </v-toolbar>

        <v-navigation-drawer app v-model="drawer" temporary>
            <v-list nav dense>
                <v-list-item-group
                v-model="group"
                active-class="blue lighten-1--text text--accent-4"
                >
                <v-list-item @click="volverInicio">
                    <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Home</v-list-item-title>
                </v-list-item>

                <v-list-item @click="irPerfil">
                    <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title >Mi perfil</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="this.currentUser && this.currentUser.tipo=='administrador'" @click="irUsuarios">
                    <v-list-item-icon>
                    <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Usuarios</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="this.currentUser && this.currentUser.tipo=='administrador'" @click="irFestivos">
                    <v-list-item-icon>
                    <v-icon >mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Festivos</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="this.currentUser && this.currentUser.tipo=='administrador'" @click="irInformes">
                    <v-list-item-icon>
                    <v-icon >mdi-folder-open</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Informes</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="this.currentUser && this.currentUser.tipo=='fisio'" @click="irHorario">
                    <v-list-item-icon>
                    <v-icon >mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Horario</v-list-item-title>
                </v-list-item>

                <v-list-item @click="irReservar">
                    <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Reservar</v-list-item-title>
                </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </v-app>
</template>

<script>
export default {
    name: 'AppNavigation',
    computed:{
        currentUser() {
            return this.$store.state.user;
        },
    },
    data() {
        return {
            drawer: false
        };
    },
    methods: {
        logout(){
            localStorage.removeItem('token');
            this.$store.commit('logout');
            this.$router.push('/');
            this.$router.go();
        },
        volverInicio(){
            this.$router.push('/');
        },
        irPerfil(){
            this.$router.push('/panelUsuario');
        },
        irReservar(){
            this.$router.push('/home');
        },
        irUsuarios(){
            this.$router.push('/usuarios');
        },
        irFestivos(){
            this.$router.push('/festivos');
        },
        irInformes(){
            this.$router.push('/informes');
        },
        irHorario(){
            this.$router.push('/homeFisio');
        }
    }
};
</script>

<style scoped>
</style>