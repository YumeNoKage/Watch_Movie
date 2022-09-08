const globalFunction = {
    methods: {
        getUrlImage(url, size = 'original'){
            if (size == 'small') {
                return import.meta.env.VITE_API_IMAGE_SMALL + url
            } else if (size == 'original'){
                return import.meta.env.VITE_API_IMAGE_ORIGINAL + url
            }
        },
    }
}

export default globalFunction