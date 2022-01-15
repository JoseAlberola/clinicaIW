<template>
    <v-container>
        <v-layout column>
            <v-flex  class="display-2 text-xs-center my-5">Sobre Nosotros</v-flex>
            <v-flex>
                <div class="headline mt-3">Nuestro Equipo</div>
                <img src="../assets/equipo.jpg">
                <p class="subheading mt-3">Nuestro equipo, compuesto por los mejores fisioterapeutas de la ciudad, está siempre dispuesto a atenderte.
                    No dudes en consultar cualquier problema que tengas, seguro que nuestro personal te puede ayudar.
                </p>
            </v-flex>
            <v-flex>
                <div class="headline mt-3">Horario</div>
                <p class="subheading mt-3">Lunes-Domingo.</p>
                <p class="subheading mt-3">10:00-19:00, horario ininterrumpido.</p>
                <div class="headline mt-3" style="bottom: 20px">Dónde Estamos</div>
            </v-flex>
            <v-flex style="top: 25px">     
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3129.3381544011318!2d-0.4936412851676549!3d38.34115468245354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6236493074d5ef%3A0xa0cf107c27f7cf0d!2sFisioterapia%20Alicante%20Centro%20Italia%204!5e0!3m2!1ses!2ses!4v1641850637734!5m2!1ses!2ses" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </v-flex>
            <v-flex>
                <div class="headline mt-3" id="contacto">Contacta con nosotros</div>
                <p class="subheading mt-3">SI necesitas contactar con nostros, puedes hacerlo a tráves de las siguientes formas.</p>
                <p class="subheading mt-3">Teléfono: 698587412.</p>
                <p class="subheading mt-3">Correo: info@clinicaiw.es</p>
                <p class="subheading mt-3">Facebook: ClinicaIW Alicante</p>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'HomeDetails',
    components: {
        
    }
};
</script>

<style scoped>
.map-responsive{

    overflow:hidden;

    padding-bottom:56.25%;

    position:relative;

    height:0;

}

.map-responsive iframe{

    left:50%;

    top:20px;

    height:100%;

    width:100%;

    position:absolute;

}
</style>