<template>
  <q-page-index :config="manager" v-bind="$attrs">
    <template slot='body' slot-scope="scope">
       <index :config="manager" v-bind="$attrs"/>
    </template>
  </q-page-index>
</template>

<script>

import Index from '../Resource/index'
import { DataResolver } from '../../app/Services/DataResolver'

export default {
  components: {
    Index
  },
  props: ['view'],
  data() {
    return {
      manager: null
    }
  },
  created() {

    let resolver = new DataResolver();

    console.log(this.view)

    if (this.view.config.options.data) {
      this.manager = resolver.createManager(this.view);
    }

    this.manager
  }
}
</script>
