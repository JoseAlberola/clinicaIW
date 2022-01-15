import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegistro from '../components/LoginRegistro.vue'
import DetallesFisio from '../components/DetallesFisio.vue'
import Contenido from '../components/Contenido.vue'
import ContenidoAdmin from '../components/ContenidoAdmin.vue'
import ContenidoFisio from '../components/ContenidoFisio.vue'


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
      path: '/homeFisio',
      name: 'ContenidoFisio',
      component: ContenidoFisio
    }
]
  
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
  
export default router