import axios from 'axios'

const globalAction = {
    methods: {
        async getSource(url, params){
           try {
               const response = await axios.get(url, { params })
               return response
           } catch (error) {
               if (error) return error
           }
       }
    }
}

export default globalAction