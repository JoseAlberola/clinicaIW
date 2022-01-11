import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegistro from '../components/LoginRegistro.vue'
import DetallesFisio from '../components/DetallesFisio.vue'
import ContenidoAdmin from '../components/ContenidoAdmin.vue'
import Reservar from '../components/Reservar.vue'
import Home from '../views/Home.vue'
import Usuario from '../components/Home.vue'
import RecepcionistaReserva from '../components/RecepcionistaReserva.vue'
import PanelUsuario from '../components/PanelUsuario.vue'

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

    }
]
  
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
  
export default router