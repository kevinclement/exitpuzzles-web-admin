<template>
  <control-tnt></control-tnt>
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
