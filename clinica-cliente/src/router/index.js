import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegistro from '../components/LoginRegistro.vue'
import DetallesFisio from '../components/DetallesFisio.vue'
import Contenido from '../components/Contenido.vue'
import ContenidoAdmin from '../components/ContenidoAdmin.vue'
import Reservar from '../components/Reservar.vue'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      name: 'LoginRegistro',
      component: LoginRegistro
    },
    {
      path: '/home',
      name: 'Contenido',
      component: Contenido
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
    }
]
  
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
  
export default router