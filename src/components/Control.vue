<template>
  <v-container fluid>
      <control-tnt></control-tnt>
      <control-morse></control-morse>
    </div>
  </v-container>
</template>

<script>
import TNT from '@/components/Control.TNT'
import Morse from '@/components/Control.Morse'

export default {
  components: {
    'control-tnt': TNT,
    'control-morse': Morse
  }
}
</script>

<style scoped>

</style>
