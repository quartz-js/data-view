<template>
  <q-page-index :config="manager" v-bind="$attrs">
    <template slot='body' slot-scope="scope">
      <component v-for="section in sections" :is="toComponent(section.extends)" :resource="scope.resource" v-bind="$attrs"/>
    </template>
  </q-page-index>
</template>

<script>

import { DataResolver } from '../app/Services/DataResolver'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common
  ],
  data() {
    return {
      sections: []
    }
  },
  created() {
    this.createManager()

    this.sections = this.view.config.options.sections
  }
}
</script>
