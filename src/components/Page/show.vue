<template>
  <q-page-show v-bind="$attrs">
    <template slot='tabs' slot-scope="scope">
      <v-tab>{{ $t('$quartz.core.overview') }}</v-tab>
      <v-tab-item :transition="false" :reverse-transition="false">
        <show :resource="scope.resource" v-bind="$attrs"/>
      </v-tab-item>
    </template>
    <template slot='actions' slot-scope="scope">
    </template>
  </q-page-show>
</template>

<script>

import Show from '../Resource/show'

export default {
  components: {
    Show,
  }
}
</script>