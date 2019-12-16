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
                    <v-toolbar-title>Grupo Cidades</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="800px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on" @click="newGrupo(1)">Novo Grupo</v-btn>
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
                                            <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
                                        </v-col>
                                         <v-col cols="12" sm="12" md="12">
                                            <v-select
                                                    v-model="e6"
                                                    :items="states"
                                                    :menu-props="{ maxHeight: '500' }"
                                                    label="Cidades"
                                                    multiple
                                                    hint="Selecionar as Cidades"
                                                    persistent-hint
                                                    counter
                                                    prefix

                                            ></v-select>
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
        name: "CidadeGrupo",
        data: () => ({
            dialog: false,
            cidades :[],
            headers: [
                { text: '#', value: 'id', sortable: true },
                {
                    text: 'Grupo Cidade',
                    align: 'left',
                    value: 'name',
                },

                { text: 'Data Cadastro', value: 'created_at', sortable: true },
                { text: 'Data Alteracao', value: 'updated_at', sortable: true },
                { text: 'Actions', value: 'action', sortable: false },
            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                name: '',
                id:''
            },
            defaultItem: {
                name: '',
                id: ''
            },
            e6: [1],
            e7: [],
            states: [],

        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Novo Grupos' : 'Editar Grupo'
            },
        },

        watch: {
            dialog (val) {
                val || this.close()
            }
        },

        created () {
            this.initialize()
        },

        methods: {
            getGrupoCidades: function () {
                const baseURIGrid = 'http://localhost:8000/api/grupo'
                this.$http.get(baseURIGrid)
                    .then((result) => {
                        this.desserts = result.data
                    })
            },
            initialize () {
                this.getGrupoCidades();

            },
            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.getCarregarCidade(item.id)
                this.dialog = true
            },
            deleteItem (item) {

                if(confirm('Deseja realmente excluir este registro?')){

                    this.$http.delete('http://localhost:8000/api/grupo/'+item.id,
                        {
                            "headers":{'Content-Type': 'application/json'}
                        }).then((response) => {
                        if(response.data.status == true){
                            this.message('Registro Excluido com Sucesso!')
                            this.getGrupoCidades()
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
                const baseURI = 'http://localhost:8000/api/grupo/'
                if (this.editedIndex > -1) {
                    this.$http.put(baseURI+this.editedItem.id, {
                            name:this.editedItem.name,cidade:this.e6,
                            _method: 'PUT'
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                        if(response){
                            alert('Cadastro autalizado com sucesso!')
                            this.getCarregarCidadeAll()
                        }
                        this.getGrupoCidades()
                    }).catch((e) => {

                        console.log(e);
                        this.getGrupoCidades()
                    });


                } else {
                    this.$http.post(baseURI, {
                            name:this.editedItem.name,cidade:this.e6,
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
                            this.getGrupoCidades()
                        })
                        .catch((e) =>{
                            console.log('erro');
                            this.message('Ops :( \nOcorreu um erro ao tentar cadastar este registro!\n Tente novamente mais tarde.')
                            this.getGrupoCidades();
                        });

                }
                this.close()
            },
            message(text){
                alert(text)
            },
            getCarregarCidade(grupo){
                const baseURIGrid = 'http://localhost:8000/api/grupo/'+grupo
                if(this.getCarregarCidadeAll()){
                    this.$http.get(baseURIGrid)
                        .then((result) => {
                           let valuesCidades=[]
                            result.data.forEach(function(value,index){
                                valuesCidades.push(value.id);
                            })
                            this.e6 = valuesCidades
                        })

                }

            },
            getCarregarCidadeAll(){
                const baseURIGrid = 'http://localhost:8000/api/cidade/'
                let cidadesArray=[]
                this.$http.get(baseURIGrid)
                    .then((result) => {
                        result.data.forEach(function(value,index){
                            cidadesArray.push({'text':value.name,'value':value.id});

                        })
                        this.states = cidadesArray
                    })
                return true;
              },
            newGrupo(value){
                this.getCarregarCidadeAll()
                this.e6 = []
            }

        },
    }
</script>

<style scoped>

</style>