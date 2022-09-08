<template>
  <div class="main-parent">
    <div class="position-sticky top-0" style="z-index: 1000">
      <Header/>
    </div>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<script>
  import Header from '../src/components/Layouts/Header.vue'

	export default{
		components:{Header},
  	}

</script>
  