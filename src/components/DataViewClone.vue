<template>
  <div class="pa-5">
    <h3 class='title'>Create a new DataView</h3>
    <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis in arcu at pellentesque. Sed at porta odio. Vivamus sollicitudin euismod justo id ornare. Suspendisse a metus orci. Cras tempor finibus metus, nec dictum enim sollicitudin sit amet. Vestibulum et suscipit lacus. Nam vestibulum tempus dolor.</p>
    <v-divider class='mb-5'></v-divider>
    <q-select
      label="Component"
      v-model="item"
      placeholder="Pick the component to clone from"
      :items="items"
      item-text="name"
      return-object
      class="mt-5"
    />
    <q-form-yaml v-if="item" v-model="config" class="mt-5"/>
    <q-text-field
      label="Name"
      v-model="name"
      placeholder="Please insert a new name"
      class="mt-5"
    />
    <div class="text-right mt-5">
      <q-btn color="primary" content-icon="add" content-text="create" @click="clone()" :disabled="!item || !name" />
    </div>
  </div>
</template>
<script>

import { Dictionary } from '../app/Services/Dictionary'

export default {
  data() {
    return {
      name: null,
      items: [],
      item: null,
      config: null
    }
  },
  props: {
    tag: {
      type: String
    }
  },
  watch: {
    item: {
      handler: function() {
        this.config = this.$container.get('yaml').dump(this.item.config)
      }
    }
  },
  created() {
    this.dictionary = new Dictionary();
      
    this.items = Object.values(this.dictionary.getViewByTag(this.tag));
  },
  methods: {
    clone() {
      let api = this.dictionary.newApiByName('data-view');
      
      api.create({
        name: this.name,
        type: this.item.type,
        tag: this.tag,
        config: this.config
      }).then(response => {
        this.dictionary.addViews([response.body.data])
        return this.$emit('success', response.body.data)
      }).catch(error => {
        return this.$emit('error')
      })

    }
  }
}
</script>