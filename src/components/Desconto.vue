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
                    <v-toolbar-title>Desconto</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on">Novo Desconto</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <!-- Formulário  -->
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="editedItem.name" label="Nome Desconto"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-text-field v-model="editedItem.products" label="Produto"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="4" md="4">
                                            <v-text-field v-model="editedItem.price" label="R$"></v-text-field>
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
                        color="success"
                        @click="editItem(item)"
                >
                    edit
                </v-icon>
                <v-icon
                        small
                        color="primary"
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
        name: "Desconto",
        data: () => ({
            dialog: false,
            headers: [
                {
                    text: 'Desconto',
                    align: 'left',
                    sortable: false,
                    value: 'name',
                },
                { text: 'Produto', value: 'products' },
                { text: 'Valor', value: 'price' },
                { text: 'Actions', value: 'action', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                products: '',
                price: '',
                id:''
            },
            defaultItem: {
                name: '',
                products: '',
                price: '',
                id:''
            },
        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Novo Desconto' : 'Editar Desconto'
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
            getDesconto: function () {
                const baseURIGrid = 'http://localhost:8000/api/desconto'
                this.$http.get(baseURIGrid)
                    .then((result) => {
                        this.desserts = result.data
                    })
            },
            initialize () {
                this.getDesconto();

            },
            editItem (item) {

                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem (item) {

                const index = this.desserts.indexOf(item)
                if(confirm('Deseja realmente excluir este registro?')){

                    this.$http.delete('http://localhost:8000/api/desconto/'+item.id,
                        {
                            "headers":{'Content-Type': 'application/json'}
                        }).then((response) => {
                        if(response.data.status == true){
                            this.message('Registro Excluido com Sucesso!')
                            this.getDesconto()
                        }else{
                            console.log(response.data);
                        }
                    }).catch(e =>{
                        console.log(e);
                        this.message('Ops :( \nOcorreu um erro ao tentar excluir este registro!\n Tente novamente mais tarde.')
                    });
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
                const baseURI = 'http://localhost:8000/api/desconto/'
                if (this.editedIndex > -1) {
                    this.$http.put(baseURI+this.editedItem.id, {
                            name:this.editedItem.name,products:this.editedItem.products,price:this.editedItem.price,
                            _method: 'PUT'
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                        if(response){
                            alert('Cadastro autalizado com sucesso!')
                        }
                        this.getDesconto()
                    }).catch((e) => {

                        console.log(e);
                        this.getDesconto()
                    });


                } else {
                    this.$http.post(baseURI, {
                            name:this.editedItem.name,products:this.editedItem.products,price:this.editedItem.price,
                        },
                        {headers: {
                                'Content-Type': 'application/json'
                            }
                        },
                    )
                        .then((response) => {
                            if(response.id){
                                this.message('Cidade cadastrada com Sucesso!')
                            }
                            this.getDesconto()
                        })
                        .catch((e) =>{
                            console.log('erro');
                            this.message('Ops :( \nOcorreu um erro ao tentar cadastar este registro!\n Tente novamente mais tarde.')
                            this.getDesconto();
                        });

                }
                this.close()
            },
            message(text){
                alert(text)
            }

        },
    }
</script>

<style scoped>

</style>