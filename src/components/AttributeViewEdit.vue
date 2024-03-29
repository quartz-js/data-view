<template>
  <div>aaa<q-form v-model="form">
    <div class="content text-left" v-if="form" style='overflow-y:auto; max-height: 100%'>
      <q-select
        outlined
        v-model="area"
        :items="items"
      ></q-select>
      <h3 class='title'>Configuration: {{ attribute.manager().name }}.{{ attribute.name }} [ID: {{ get(area).id }}]</h3>

      <p v-if="area === 'global'">You will change the attribute in all views that this is invoked. Note that global configuration are overwritten by local one [ID: {{ get(area).id }}]</p>
      <p v-if="area === 'local'">Apply the change only in this scope </p>

      <v-divider class='mb-5'></v-divider>
      <h3 class='subtitle-1 mt-5'>General</h3>

      <q-text-field 
        :label="$t('$quartz.data-view.options.name.label')" 
        :hint="$t('$quartz.data-view.options.name.hint')" 
        :value="read(area, 'options.name')" 
        @input="put(area, 'options.name', $event)" 
        class="mb-2"
      />

      <!--<q-select
        v-if="area === 'global'"
        outlined
        :label="$t('$quartz.data-view.options.type.label')" 
        :hint="$t('$quartz.data-view.options.type.hint')" 
        :value="read(area, 'options.type')" 
        @input="put(area, 'options.type', $event)" 
        :items="types"
        disabled
      ></q-select>-->

      <q-text-field 
        :label="$t('$quartz.data-view.options.hint.label')" 
        :value="read(area, 'options.hint')"
        :hint="$t('$quartz.data-view.options.hint.hint')" 
        @input="put(area, 'options.hint', $event)" 
        class="mb-2"
      />

      <q-text-field 
        :label="$t('$quartz.data-view.options.default.label')" 
        :value="read(area, 'options.default')" 
        :hint="$t('$quartz.data-view.options.default.hint')" 
        @input="put(area, 'options.default', $event)" 
        class="mb-2"
      />

      <h3 class='subtitle-1 mt-5'>Options</h3>

      <q-checkbox 
        hide-details 
        :label="$t('$quartz.data-view.options.hide.label')" 
        :value="read(area, 'options.hide')" 
        :hint="$t('$quartz.data-view.options.hide.hint')" 
        @change="put(area, 'options.hide', !!$event)"
        class="my-2"
      />

      <q-checkbox 
        hide-details 
        :label="$t('$quartz.data-view.options.required.label')" 
        :value="read(area, 'options.required')" 
        :hint="$t('$quartz.data-view.options.required.hint')" 
        @change="put(area, 'options.required', !!$event)"
        class="my-2"
      />

      <h3 class='subtitle-1 mt-5'>Advanced</h3>

      <q-checkbox 
        hide-details 
        :label="$t('$quartz.data-view.options.yaml.label')" 
        :hint="$t('$quartz.data-view.options.yaml.hint')" 
        @change="advanced = !!$event"
        class="my-2"
      />

      <q-form-yaml class='my-3' :class="{'hidden': !advanced}" :value="get(area).content" @input="update(area, $event)"></q-form-yaml>

      <router-link :to="`/data-view/${attribute.raw.id}`" target='_blank'>View external</router-link>

      <div class='text-right mt-5'>

        <q-btn
          @click="form = false" 
          v-bind="$attrs"
          content-icon='close'
          :content-text="$t('$quartz.core.cancel')"
        />

        <q-btn
          :loading="loading"
          :disabled="loading"
          color="primary" 
          @click="save(area)"
          content-icon='add'
          :content-text="$t('$quartz.core.save')"
        />

      </div>
    </div>
  </q-form>
</div>
</template>
<script>

import { Yaml } from '../app/Yaml'

export default {
  props: {
    attribute: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      area: 'global',
      items: [
        {
          text: 'Global configuration',
          value: 'global'
        },
        {
          text: 'Local configuration',
          value: 'local'
        }
      ],
      types: [
        'Base',
        'Id',
        'Uuid',
        'Text',
        'LongText',
        'Email',
        'Password',
        'Boolean',
        'Enum',
        'Yaml',
        'Html',
        'DateTime',
        'BelongsTo',
        'MorphTo',
        'Number',
        'ClassName',
        'File',
        'Array',
        'MorphToMany',
        'BelongsToMany',
        'Object',
      ],
      advanced: false,
      form: true,
      loading: false
    }
  },
  methods: {
    update(area, $event) {
      if (area === 'local') {
        this.attribute.view.local.content = $event
      } else {
        this.attribute.view.global.content = $event
      }
    },
    get(area) {
      return area === 'local' ? this.attribute.view.local : this.attribute.view.global
    },
    read (area, path) {
      return Yaml.get(this.get(area).content, path)
    },
    put (area, path, value) {
      this.update(area, Yaml.put(this.get(area).content, path, value))
    },
    save(area){
      this.loading = true;

      return this.$container.get('data-view').newApiByName('data-view').update(this.get(area).id, {
        config: this.get(area).content
      }).then(response => {
        this.loading = false;
        this.form = false
      })
    }
  }
}
</script>