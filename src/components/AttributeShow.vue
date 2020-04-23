<template>
  <component :is="attribute.showComponent" :resource="resource" :attribute="attribute" :errors="errors"/>
</template>
<script>

import { Attributes } from '@quartz/core'

export default {
  props: ['resource', 'manager', 'attribute', 'errors'],
  methods: {
  },
}
</script>