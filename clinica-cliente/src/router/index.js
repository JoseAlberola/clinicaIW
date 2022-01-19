import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegistro from '../components/LoginRegistro.vue'
import DetallesFisio from '../components/DetallesFisio.vue'
import ContenidoAdmin from '../components/ContenidoAdmin.vue'
import ContenidoFisio from '../components/ContenidoFisio.vue'
import Reservar from '../components/Reservar.vue'
import Home from '../views/Home.vue'
import Usuario from '../components/Home.vue'
import RecepcionistaReserva from '../components/RecepcionistaReserva.vue'
import PanelUsuario from '../components/PanelUsuario.vue'
import PanelRecepcionista from '../components/PanelRecepcionista.vue'
import Usuarios from '../components/Usuarios.vue'
import FestivosAdmin from '../components/FestivosAdmin.vue'
import Informes from '../components/Informes.vue'

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
      path: '/homeAdmin',
      name: 'ContenidoAdmin',
      component: ContenidoAdmin
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
]
  
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
  
export default router