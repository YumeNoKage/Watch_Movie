<template>
    <div>
        <div :class="`spinner-grow ${color}`" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>

<script>
    export default{
        props: {
            color:{
                default: "text-primary",
                type: String
            }
        }
    }
</script>
