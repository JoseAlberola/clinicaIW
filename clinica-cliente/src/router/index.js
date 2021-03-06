import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegistro from '../components/LoginRegistro.vue'
import DetallesFisio from '../components/DetallesFisio.vue'
import ContenidoFisio from '../components/ContenidoFisio.vue'
import Reservar from '../components/Reservar.vue'
import Home from '../views/Home.vue'
import Usuario from '../components/Home.vue'
import RecepcionistaReserva from '../components/RecepcionistaReserva.vue'
import PanelUsuario from '../components/PanelUsuario.vue'
import PanelFisio from '../components/PanelFisio.vue'
import PanelRecepcionista from '../components/PanelRecepcionista.vue'
import Usuarios from '../components/Usuarios.vue'
import FestivosAdmin from '../components/FestivosAdmin.vue'
import Informes from '../components/Informes.vue'
import Pagar from '../components/Pagar.vue'

Vue.use(VueRouter)

const routes = [
    {
      path: '/login',
      name: 'LoginRegistro',
      component: LoginRegistro
    },
    {
      path: '/home',
      name: 'Usuario',
      component: Usuario
    },
    {
      path: '/fisios/:idFisio',
      name: 'DetallesFisio',
      component: DetallesFisio
    },
    {
      path: '/homeFisio',
      name: 'ContenidoFisio',
      component: ContenidoFisio
    },
    {
      path: '/reservar',
      name: 'ReservarUsuario',
      component: Reservar
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/recepcionista/reservar',
      name: 'reservaRecepcionista',
      component: RecepcionistaReserva
    },
    {
      path: '/panelUsuario',
      name: PanelUsuario,
      component: PanelUsuario

    },
    {
      path: '/panelFisio',
      name: PanelFisio,
      component: PanelFisio

    },
    {
      path: '/panelRecepcionista',
      name: PanelRecepcionista,
      component: PanelRecepcionista
    },
    {
      path: '/usuarios',
      name: Usuarios,
      component: Usuarios

    },
    {
      path: '/festivos',
      name: FestivosAdmin,
      component: FestivosAdmin

    },
    {
      path: '/informes',
      name: Informes,
      component: Informes
    },
    {
      path: '/pagar/:emailFisio/:emailUsuario/:fecha/:hora',
      name: Pagar,
      component: Pagar
    },
]
  
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
  
export default router