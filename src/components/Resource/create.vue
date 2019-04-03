<template>
  <q-resource-create v-bind="$attrs">
    <template slot='create' slot-scope="scope">
      <q-text v-model="scope.resource" :attribute="scope.config.getAttribute('name')" :errors="scope.errors"/>
      <q-textarea v-model="scope.resource" :attribute="scope.config.getAttribute('description')" :errors="scope.errors"/>
      <q-datetime v-model="scope.resource" :attribute="scope.config.getAttribute('starts_at')" :errors="scope.errors"/>
      <q-datetime v-model="scope.resource" :attribute="scope.config.getAttribute('ends_at')" :errors="scope.errors"/>
      <q-switch v-model="scope.resource" :attribute="scope.config.getAttribute('enabled')" :errors="scope.errors"/>
    </template>
  </q-resource-create>
</template>