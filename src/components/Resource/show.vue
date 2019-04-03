<template>
  <q-resource-show v-bind="$attrs">
    <template slot="show" slot-scope="scope">
      <q-show-text :resource="scope.resource" :attribute="scope.config.getAttribute('name')"/>
      <q-show-text :resource="scope.resource" :attribute="scope.config.getAttribute('description')"/>
      <q-show-text :resource="scope.resource" :attribute="scope.config.getAttribute('starts_at')"/>
      <q-show-text :resource="scope.resource" :attribute="scope.config.getAttribute('ends_at')"/>
      <q-show-text :resource="scope.resource" :attribute="scope.config.getAttribute('enabled')"/>
    </template>
  </q-resource-show>
</template>