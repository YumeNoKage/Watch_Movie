import axios from 'axios'

const globalAction = {
    methods: {
        async getSource(url, params){
            let session = localStorage.getItem('session')
            if (session) {
                axios.defaults.params['session_id'] = session
            }
            try {
                const response = await axios.get(url, { params })
                return response
            } catch (error) {
                if (error) return error
            }
        },
        async getAuthToken(url, params){
           try {
               const response = await axios.get(url, { params })
               return response
           } catch (error) {
               if (error) return error
           }
        },
        async postSource(url, data){
            let session = localStorage.getItem('session')
            if (session) {
                axios.defaults.params['session_id'] = session
            }
            try {
                const response = await axios.post(url,
                    data,
                    {headers: { 'Content-Type': 'application/json;charset=utf-8'},}, 
                )
                return response
            } catch (error) {
                if (error) return error
            }
        },
        async deleteSource(url, data){
            let session = localStorage.getItem('session')
            if (session) {
                axios.defaults.params['session_id'] = session
            }
            try {
                const response = await axios.delete(url,
                    data,
                    {headers: { 'Content-Type': 'application/json;charset=utf-8'},}, 
                )
                return response
            } catch (error) {
                if (error) return error
            }
        }
    }
}

export default globalAction