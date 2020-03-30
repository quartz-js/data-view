<template>
  <div>
    {{ rawView.id }}
  </div>
</template>
<script>
export default {
  props: {
    rawView: {
      type: Object
    }
  },
  created() {
  }
}
</script>