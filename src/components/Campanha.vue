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
                    <v-toolbar-title>Campanhas</v-toolbar-title>
                    <v-divider
                            class="mx-4"
                            inset
                            vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="800px">
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark class="mb-2" v-on="on" @click="newGrupo(1)">Nova Campanha</v-btn>
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
                                            <v-text-field v-model="editedItem.name" label="Nome Campanha"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                          <label>Data Inicio</label></br>
                                          <input type="date" name="starts_at" v-model="starts_at"/>
                                        </v-col>
                                        <v-col  cols="12" sm="12" md="12">
                                            <label>Data Fim</label></br>
                                            <input type="date" name="ends_at" v-model="ends_at"/>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-select
                                                    v-model="e6"
                                                    :items="states"
                                                    :menu-props="{ maxHeight: '500' }"
                                                    label="Grupos de cidades"
                                                    multiple
                                                    hint="Por favor selecionar os grupos"
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
        name: "Campanha",
        data: () => ({
            dialog: false,
            cidades :[],
            headers: [
                { text: '#', value: 'id', sortable: true },
                {
                    text: 'Campanha',
                    align: 'left',
                    value: 'name',
                },

                { text: 'Data Cadastro', value: 'created_at', sortable: true },
                { text: 'Data Inicio', value: 'starts_at', sortable: true },
                { text: 'Data Fim', value: 'ends_at', sortable: true },
                { text: 'Data Alteracao', value: 'updated_at', sortable: true },
                { text: 'Actions', value: 'action', sortable: false },
            ],
            desserts: [],
            starts_at:'',
            ends_at:'',
            editedIndex: -1,
            editedItem: {
                name: '',
                id:''
            },
            defaultItem: {
                name: '',
                id: ''
            },
            e6: [],
            e7: [],
            states: [],

        }),

        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Nova Campanha' : 'Editar Campanha'
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
            getGrupoCampanhas: function () {
                const baseURIGrid = 'http://localhost:8000/api/campanha'
                this.$http.get(baseURIGrid)
                    .then((result) => {
                        this.desserts = result.data
                    })
            },
            initialize () {
                this.getGrupoCampanhas();

            },
            editItem (item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.getCarregarCidade(item.id)
                this.dialog = true
            },
            deleteItem (item) {

                if(confirm('Deseja realmente excluir este registro?')){

                    this.$http.delete('http://localhost:8000/api/campanha/'+item.id,
                        {
                            "headers":{'Content-Type': 'application/json'}
                        }).then((response) => {
                        if(response.data.status == true){
                            this.message('Registro Excluido com Sucesso!')
                            this.getGrupoCampanhas()
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
                const baseURI = 'http://localhost:8000/api/campanha/'
                if (this.editedIndex > -1) {
                    this.$http.put(baseURI+this.editedItem.id, {
                            name:this.editedItem.name,grupo:this.e6,starts_at:this.starts_at,ends_at:this.ends_at,
                            _method: 'PUT'
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((response) => {
                        if(response){
                            alert('Cadastro autalizado com sucesso!')
                            this.getCarregarCampanhaAll()
                        }
                        this.getGrupoCampanhas()
                    }).catch((e) => {

                        console.log(e);
                        this.getGrupoCampanhas()
                    });


                } else {
                    this.$http.post(baseURI, {
                            name:this.editedItem.name,grupo:this.e6,starts_at:this.starts_at,ends_at:this.ends_at
                        },
                        {headers: {
                                'Content-Type': 'application/json'
                            }
                        },
                    )
                        .then((response) => {
                            if(response.data.id){
                                this.message('Campanha cadastrada com Sucesso!')
                            }else{
                                if (response.data.ok == false){
                                    alert(response.data.msg)

                                }

                            }
                            this.getGrupoCampanhas()
                        })
                        .catch((e) =>{
                            console.log('erro');
                            this.message('Ops :( \nOcorreu um erro ao tentar cadastar este registro!\n Tente novamente mais tarde.')
                            this.getGrupoCampanhas();
                        });

                }
                this.close()
            },
            message(text){
                alert(text)
            },
            getCarregarCidade(campanha){
                const baseURIGrid = 'http://localhost:8000/api/campanha/'+campanha
                if(this.getCarregarCampanhaAll()){
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
            getCarregarCampanhaAll(){
                const baseURIGrid = 'http://localhost:8000/api/grupo/'
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
                this.getCarregarCampanhaAll()
                this.e6 = []
            }

        },
    }
</script>

<style scoped>

</style>