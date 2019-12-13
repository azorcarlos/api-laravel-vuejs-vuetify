<template>
    <div>
        <v-data-table
                :headers="headers"
                :items="desserts"
                sort-by="calories"
                class="elevation-1"
        >
            <template v-slot:top>
                <!-- Titulo tabela  -->
                <v-toolbar flat color="white">
                    <v-toolbar-title>Cidades</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Nova Cidade</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <!-- Formulário  -->
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.state" label="Estado"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
                <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item)"
                >
                    edit
                </v-icon>
                <v-icon
                        small
                        @click="deleteItem(item)"
                >
                    delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Recarregar ....</v-btn>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    export default {
        name: "Cidade",
        data: () => ({
            dialog: false,
            headers: [
                {
                    text: 'Cidade',
                    align: 'left',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Estado', value: 'state' },
                { text: 'Actions', value: 'action', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                state: '',
                id:''
            },
            defaultItem: {
                name: '',
                state: ''
            },
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nova Cidade' : 'Editar Cidade'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        created () {
            this.initialize()
        },

        methods: {
            initialize () {
                this.getCidades();

            },

            editItem (item) {

                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                const baseURI = 'http://localhost:8000/api/cidade/'+item.id
                if(confirm('Deseja realmente excluir este item?') && this.desserts.splice(index, 1)){
                    this.$http.delete(baseURI, {headers: {
                            'Content-Type': 'application/json',
                            'Accept':'application/json'
                    }});
                }

            },
            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            save () {
                const baseURI = 'http://localhost:8000/api/cidade/'
                if (this.editedIndex > -1) {

                    //Atualizar
                    this.$http.put(baseURI+this.editedItem.id, {
                        name:this.editedItem.name,state:this.editedItem.state,
                        _method: 'PUT'
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept':'application/json'
                        }
                    },
                    ).then(function (response) {
                        this.getCidades();
                        console.log(response);
                    }).catch(function (error) {
                        console.log(error);
                    });

                    Object.assign(this.desserts[this.editedIndex], this.editedItem)
                } else {

                    this.$http.post(baseURI+this.editedItem.id, {
                            name:this.editedItem.name,state:this.editedItem.state,
                        },
                        {headers: {
                                'Content-Type': 'application/json',
                                'Accept':'application/json'
                            }
                        },
                          )
                        .then(function (response) {
                           this.getCidades();
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                      this.getCidades();
                     //this.desserts.push(this.editedItem)
                }
                this.getCidades()
                this.close()
            },

            getCidades: function () {
                const baseURI = 'http://localhost:8000/api/cidade'
                this.$http.get(baseURI)
                    .then((result) => {
                        this.desserts = result.data
                    })
            }
        },
    }
</script>

<style scoped>

</style>