<template>
    <v-container fluid fill-height class="home-hero" style="max-height: 100vh;">
        <v-layout justify-center align-center column pa-5>
            <div class="display-4 font-weight-black white--text text-xs-center">Chetón de clínica</div>
            <div class="display-4 font-weight-black white--text text-xs-center mb-3">Pa el cuerpo</div>
            <div class="display-1 font-weight-bold white--text text-xs-center">Que haces taca, y ya no duele.</div>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'HomeHero'
};
</script>

<style scoped>
.home-hero {
    background: url('https://gacetamedica.com/wp-content/uploads/2020/09/GettyImages-1223737139.jpg');
    background-size: cover;
    width: 100%;
    height: 100%;
}
</style>