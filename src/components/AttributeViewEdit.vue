<template>
	<div>
		<v-btn text icon color="primary" @click="form = true"><v-icon>edit</v-icon></v-btn>
		<q-form v-model="form">
      <div class="content text-left" v-if="form" style='overflow-y:auto; max-height: 100%'>
	      <h3 class='title'>Configuration: {{ attribute.manager().name }}.{{ attribute.name }}</h3>
	      <p class='mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis, mauris vel efficitur mollis, erat leo efficitur erat, ut aliquet augue erat sit amet mauris. Nunc rutrum, est id mattis laoreet, sem nibh placerat neque, nec sodales purus felis ac nunc. Mauris auctor faucibus arcu, sed lobortis enim. </p>
	      <v-divider class='mb-5'></v-divider>

	      <v-select
	      	outlined
	      	v-model="area"
	        :items="items"
	      ></v-select>
	      <p v-if="area === 'global'">You will change the attribute in all views that this is invoked. Note that global configuration are overwritten by local one [ID: {{ read(area, 'id') }}]</p>
	      <p v-if="area === 'local'">Apply the change only in this scope [ID: {{ read(area, 'id') }}]</p>

        <h3 class='subtitle-1 mt-5'>Wording</h3>

        <v-text-field 
        	:label="$t('$quartz.data-view.options.name')" 
        	:value="read(area, 'options.name')" 
        	@input="put(area, 'options.name', $event)" 
        />

	      <v-select
	      	outlined
        	:value="read(area, 'options.type')" 
        	@input="put(area, 'options.type', $event)" 
	        :items="types"
	      ></v-select>

        <v-text-field 
        	:label="$t('$quartz.data-view.hint')" 
        	:value="read(area, 'options.hint')" 
        	@input="put(area, 'options.hint', $event)" 
        />

        <v-text-field 
        	:label="$t('$quartz.data-view.default')" 
        	:value="read(area, 'options.default')" 
        	@input="put(area, 'options.default', $event)" 
        />

        <h3 class='subtitle-1 mt-5'>Options</h3>

        <v-checkbox 
        	hide-details 
        	:label="$t('$quartz.data-view.options.hide')" 
        	:value="read(area, 'options.hide')" 
        	@change="put(area, 'options.hide', !!$event)"
        />

        <v-checkbox 
        	hide-details 
        	:label="$t('$quartz.data-view.options.required')" 
        	:value="read(area, 'options.required')" 
        	@change="put(area, 'options.required', !!$event)"
        />

        <h3 class='subtitle-1 mt-5'>Yaml</h3>

        <q-form-yaml class='my-3' :value="get(area)" @input="update(area, $event)"></q-form-yaml>

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
	            @click="save(get(area))"
	            content-icon='add'
	            :content-text="$t('$quartz.core.save')"
	          />
	      </div>
	    </div>
		</q-form>
  </div>
</template>
<script>

const YAWN = require('yawn-yaml/cjs')

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
	      'Uuid',
	      'Array',
	      'MorphToMany',
	      'BelongsToMany',
	      'Object',
	      'Html',
			],
			form: false,
			loading: false
		}
	},
	methods: {
		update(area, $event) {
			if (area === 'local') {
				this.attribute.view.local = $event
			} else {
				this.attribute.view.global = $event
			}
		},
		get(area) {
			return area === 'local' ? this.attribute.view.local : this.attribute.view.global
		},
		read (area, path) {
			return _.get(new YAWN(this.get(area)).toJSON(), path)
		},
		put (area, path, value) {
			let yawn = new YAWN(this.get(area));
			let json = yawn.toJSON()
			_.set(json, path, value)
			yawn.json = json
			this.update(area, yawn.yaml)
		},
		save(area){
      this.loading = true;

      return this.$container.get('data-view').newApiByName('data-view').update(this.read(area, 'id'), {
        config: this.get(area)
      }).then(response => {
      	return Promise.resolve(1)
      }).finally(response => {
        this.loading = false;
      })
		}
	}
}
</script>