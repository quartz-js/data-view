<template>
  <div v-if="show">
    <div v-for="(text, key) in value">
      <q-btn-input color='info' style='margin: 10px 0 !important' block :text='false' :content-text="'debug ' + key" :hideText='false' @click="debug = debug != key ? key : -1"/>
      <div v-if="debug === key">
        <pre>{{ text }}</pre>
      </div>
    </div>
  </div>
</template>
<script>

import { Attributes } from '@quartz/core'

export default {
  props: ['value'],
  data() {
    return {
      debug: -1,
      show: false
    }
  },
  created() {
    this.show = localStorage.getItem('debug')
  }
}
</script>