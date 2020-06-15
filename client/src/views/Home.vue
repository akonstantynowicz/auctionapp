<template>
  <div>
    <div class="page">
      <Auctions />
    </div>
  </div>
</template>

<script>
import Auctions from '../components/AuctionsComponent.vue'

export default {
  name: 'App',
  components: {
    Auctions
  }
}
</script>

<style lang="scss">
$grey: rgb(190, 216, 202);
$lightTeal: rgb(53, 133, 121);

.page{
  background-image:radial-gradient($grey,$lightTeal);
}
</style>
