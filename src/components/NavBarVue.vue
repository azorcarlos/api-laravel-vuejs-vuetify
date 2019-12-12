<template>
    <v-app-bar
            app
            color="info"
            dark
    >
        <div class="d-flex align-center" >
            <div text to="/cidade"><v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="http://www.m2center.com.br/images/assets/logo.png"
                    transition="scale-transition"
                    width="60"


            /></div>
        </div>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-btn text to="/cidade">Cidade</v-btn>
            <v-btn text to="campanha">Campanhas</v-btn>
            <v-btn text to="desconto">Desconto</v-btn>
        </v-toolbar-items>
        <v-btn
                to="/"
                text
        >
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
    export default {
        name: "NavBarVue"
    }
</script>

<style scoped>

</style>