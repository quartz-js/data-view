<template>
  <q-resource-index v-bind="$attrs">
    <template slot='top' slot-scope="scope">
      <create v-bind="$attrs"/>
    </template>
    <template slot='actions' slot-scope="scope">
      <edit :resource="scope.resource" v-bind="$attrs"/>
    </template>
  </q-resource-index>
</template>

<script>

import Create from './create'
import Update from './update'

export default {
  components: {
    Create,
    Update
  }
}
</script>
