<template>
  <q-page-show :config="manager" v-bind="$attrs">
    <template slot='tabs' slot-scope="scope">
      <v-tab v-for="(section, key) in sections">{{ key }}</v-tab>
      <v-tab-item v-for="(section, keys) in sections"><component :is="toComponent(section.extends)" :resource="scope.resource" v-bind="$attrs"/></v-tab-item>
    </template>
    <template slot='actions' slot-scope="scope">
    </template>
  </q-page-show>
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
