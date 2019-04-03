<template>
  <q-resource-create v-bind="$attrs" :config="manager">
    <template slot='create' slot-scope="scope">
      <component v-for="attribute in attributes" :is="toComponent(attribute.extends)" :resource="scope.resource" v-bind="$attrs"/>
    </template>
  </q-resource-create>
</template>
<script>
  
import { Utils } from '../app/Helpers/Utils'
import { Common } from '../mixins/Common'

export default {
  mixins: [
    Common
  ],
  data() {
    return {
      attributes: []
    }
  },
  created() {
    this.createManager()
    this.attributes = this.view.config.attributes

    console.log(this.view.config)
  }
}
</script>