<style scoped>
    .hover-card:hover {
        transform: scale(1.1, 1.1) !important;
    }
</style>
<template>
    <div class="container">
        <div class="row justify-content-end position-sticky top-0" style="z-index:1000">
            <div class="search-movie col-lg-4 col-md-6 col-sm-12 py-5 d-flex mt-5">
                <form class="d-flex w-100" @submit.prevent="searchMovie()" role="search">
                    <input v-model="filter.query" class="form-control me-2 rounded-3 border-0 bg-light" type="search" placeholder="Search Movie" aria-label="Search">
                    <button class="btn btn-primary rounded-3" type="submit">Search</button>
                </form>
            </div>
        </div>
        <div>
            <div class="d-flex mt-3 mb-5 d-inline-flex flex-wrap">
                <div style="width: fit-content" class="mb-3" v-for="cat in Object.keys(category)" :key="cat">
                    <button :class="`border-0 rounded-pill px-3 py-2 mx-3 hover-shadow cursor-pointed ${url.includes(cat) ? 'bg-primary text-white' : 'bg-dark-50'}`" @click="changeCategories(cat)">{{category[cat]}}</button>
                </div>
            </div>
        </div>
        <Loading class="row justify-content-center pt-5 mt-5" v-if="on_loading"/>
        <div v-else-if="data.length > 0">
            <div class="row">
                <div class="col-lg-2 col-md-4 col-sm-12 mb-5" v-for="(data, i) in data" :key="i">
                    <a :href="`/detail/${data.id}`" class="text-decoration-none cursor-pointed">
                        <div class="hover-shadow h-100 rounded-4 hover-card mx-auto" style="max-width: 200px">
                            <div class="card border-0 bg-light h-100 rounded-4 mx-auto">
                                <img :src="getUrlImage(data.poster_path, 'small')" class="card-img-top rounded-4" :alt="data.title">
                                <div class="card-body h-100">
                                    <h6 class="card-title fw-semibold text-secondary">{{data.title}}</h6>
                                    <h6 class="card-title text-secondary">{{$moment(data.release_date).format("yyyy MMM Do")}}</h6>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            <div class="my-4">
                <vue-awesome-paginate v-if="pagination.total_pages > 1" class="mx-auto" style="width:fit-content" :total-items="pagination.total_pages" :items-per-page="5" :max-pages-shown="5" :current-page="pagination.page" :on-click="clickPaginaton"/>
            </div>
        </div>
        <div class="pt-5" v-else-if="data.length == 0 && on_loading == false">
            <h4 class="text-center pt-5">
                Oppss ... what you were looking for was not found
            </h4>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                on_loading: true,
                data: null,
                pagination: null,
                url: '/movie/popular',
                filter: {
                    category: 'popular',
                    page: 1,
                    query: null,
                },
                category:{
                    // latest: 'Latest',
                    now_playing: 'Now Playing',
                    popular: 'popular',
                    top_rated: 'Top Rated',
                    upcoming: 'upcoming'
                }
            }
        },

        watch: {
            filter:{
                deep:true,
                handler: function(new_value, old_value) {
                    this.$router.push({query: new_value})
                }
            }
        },

        methods: {
            searchMovie(){
                if(this.filter.query == null || this.filter.query == ''){
                    this.url = '/movie/popular',
                    this.filter.category = 'popular'
                } else {
                    this.url = '/search/movie'; 
                    this.filter.page = null;
                    this.filter.category = null;
                }

                this.getSourceMovie(this.url, this.filter);
            },

            changeCategories(cat) {
                this.filter.query = null; 
                this.filter.page = 1; 
                this.filter.category = cat
                this.url = `/movie/${cat}`; 

                this.on_loading = true
                this.getSourceMovie(this.url)
            },

            clickPaginaton(page){
                this.filter.page = page;
                this.on_loading = true
                this.getSourceMovie(this.url, this.filter)
            },

            async getSourceMovie(url, query) {
                // check if filter query not empty, then load animation will be true
                if (this.filter.query) this.on_loading = true

                let data = await this.getSource(url, query);
                
                // if status response 200 / success, data will to store
                if (data.status == 200) {
                    this.data = data.data.results
                    this.pagination = {
                        page : data.data.page ?? data.page,
                        total_pages : data.data.total_pages,
                        total:data.data.total_results
                    }
                    this.filter.page = data.data.page ?? data.page
                } else {
                    console.log(data.status, data.statusText)
                }

                this.on_loading = false
            }
        },

        mounted(){
            this.filter.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1
            this.filter.category = this.$route.query.query ? null : this.$route.query.category ?? 'popular'
            this.filter.query = this.$route.query.query ?? null
            
            if (this.filter.query == null || this.filter.query == '') {
                this.url = `/movie/${this.filter.category}`
            } else {
                this.url = 'search/movie/'
            }

            this.getSourceMovie(this.url, this.filter)
        }
    }
</script>