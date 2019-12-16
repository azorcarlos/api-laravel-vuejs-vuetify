<template>
    <v-card height="150">
        <v-footer
                color="info"
                dark
                absolute
                class="font-weight-medium"
        >
            <v-col
                    style="color: white;font-size: 10px;"
                    class="text-center"
                    cols="12"
            >
                {{ new Date().getFullYear() }} — <strong>m2</strong>
            </v-col>
        </v-footer>
    </v-card>
</template>
<script>
    export default {
        name: "FooterVue"
    }
</script>

<style scoped>

</style>