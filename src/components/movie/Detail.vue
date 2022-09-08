<style scoped>
    .header{
        min-height: 70vh;
        width: 100%;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .header::before{
        content: attr(tagline);
        font-size: 5rem;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        margin-top:4.1rem;
        min-height: 70.3vh;
        /* height: 100%; */
        width: 100%;
        position: absolute;
        top:0;
        background-color: #000;
        background-repeat: unset;
        background-size: cover;
        opacity: 0.7;
    }

    @media only screen and (max-width:768px){
        .header{
            min-height: 100vh;
            width: 100%;
        }
        .header::before{
            min-height: 100vh;
            width: 100%;
            font-size: 2rem;
        }
    }
</style>
<template>
    <div>
        <Loading class="row justify-content-center pt-5 mt-5" v-if="on_loading"/>
        <div v-else-if="data != null && on_loading == false">
            <div class="header w-100" :tagline="data.tagline" :style="`background-image: url(${getUrlImage(data.backdrop_path, 'original')})`">
                <div class="container align-content-center position-relative" style="min-height: 70vh">
                    <div class="pt-5">
                        <div class="row pt-3 pt-lg-5 pt-md-4">
                            <div class="col-lg-3 col-md-6 col-sm-12">
                                <div class="card w-100 rounded-4 mx-auto" style="max-width: 300px">
                                    <img :src="`${getUrlImage(data.poster_path, 'original')}`" class="card-img-top rounded-4">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <img width="40" v-if="data.production_companies[0]?.logo_path" :src="getUrlImage(data.production_companies[0]?.logo_path, 'small')" alt="logo">
                                            <p class="ms-2 mb-0 text-secondary fw-semibold">{{data.production_companies[0]?.name}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-9 col-md-6 col-sm-12 mt-5 mt-lg-0">
                                <h1 class="fw-semibold text-white">{{data.title}} ({{$moment(data.release_date).format('YYYY')}})</h1>
                                <h2 class=" text-white">{{data.original_title}}</h2>
                                <div class=" d-inline-flex flex-wrap">
                                    <div class="text-white me-3 bg-secondary rounded-pill px-3 mb-2" v-for="genre in data.genres" :key="genre">{{genre.name}}</div>
                                </div>
                                <h5 class="fw-semibold text-white mb-2 mt-4">Overview</h5>
                                <h6 class="text-white" style="max-width: 600px">{{data.overview}}</h6>

                                <h5 class="fw-semibold text-white mb-2 mt-4">Rating</h5>
                                <div class="d-flex text-white align-middle">
                                    <div class="me-3 d-block text-center">
                                        <img width="30" src="../../assets/star.svg" alt="star">
                                        <div>{{rating}}</div>
                                    </div> 
                                    <input class="form-range col-lg-2 col-md-3 col-sm-6 w-auto mt-1" @change="modal.description = null;modal.status = null;updateRating()" data-bs-toggle="modal" data-bs-target="#notifModal" type="range" name="points" min="0.50" max="10" step="0.50" v-model="rating"/>
                                    <div class="ms-3">
                                        <button @click="modal.description = null; modal.status = null; resetRating()" class="btn btn-sm rounded-3" data-bs-toggle="modal" data-bs-target="#notifModal"><img width="20" src="../../assets/reset.svg" alt="reset"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pt-5" v-else-if="data == null && on_loading == false">
            <h4 class="text-center pt-5">
                Oppss ... what you were looking for was not found
            </h4>
        </div>

        <div class="modal fade" id="notifModal" data-bs-backdrop="static" tabindex="-1" aria-labelledby="notifModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div :class="`modal-content border-0 rounded-4 ${modal.status < 210 && modal.status != null ? 'bg-success' : ''} ${modal.status > 210 && modal.status != null ? 'bg-success' : ''}`">
                    <div class="modal-header border-0">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h5 class="text-center text-white" v-if="modal.description">
                            {{modal.description}}
                        </h5>
                        <div v-else>
                            <Loading class="row justify-content-center"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            on_loading: true,
            data: null,
            id: null,
            rating: 0.5,
            modal:{
                status: null,
                description: null,
            }

        }
    },

    methods: {
        async getDetailMovie(){
            let session = localStorage.getItem('session')
            let data = await this.getSource(`/movie/${this.id}`, {'session_id': session})
            if (data.status == 200) {
                this.data = data.data
                this.on_loading = false
            }
        },

        async getToken(){
            const params = new URLSearchParams(window.location.search)

            if (this.$cookies.get('request_token') != params.get('request_token') && params.get('approved') != 'true') {
                const response = await this.getAuthToken('/authentication/token/new')

                if (response.data.success) {
                    this.$cookies.set('request_token',response.data.request_token, response.data.expires_at)
                    window.location.replace(`https://www.themoviedb.org/authenticate/${response.data.request_token}?redirect_to=${window.location.href}`).focus()
                    return false
                } else {
                    console.log(response)
                }
            } else if (localStorage.getItem('session')){
                return true
            }
        },

        async updateRating(){
            const token = await this.getToken()
            
            if (token) {
                let data = await this.postSource(`/movie/${this.id}/rating`, {'value': this.rating })
                
                this.modal.status = data.status
                this.modal.description = data.data.status_message
            }
        },

        async resetRating(){
            const token = await this.getToken()

            if (token) {
                let data = await this.deleteSource(`/movie/${this.id}/rating`)
                
                this.modal.status = data.status
                this.modal.description = data.data.status_message
                this.rating = 0.5
            }
        },
        
        async mounted(){
            if(!localStorage.getItem("session")){
                const new_session = await this.getAuthToken('/authentication/session/new', {'request_token' : this.$cookies.get('request_token')})
                
                if (new_session.data.success) {
                    localStorage.setItem('session', new_session.data.session_id)
                    return true
                } else {
                    return false
                }
            }
        }
    },

    mounted(){
        this.id = this.$route.params.id
        
        this.getDetailMovie()
    }
}
</script>