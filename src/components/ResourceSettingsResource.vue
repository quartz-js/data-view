<template>
  <div>
      <v-data-table
      :headers="table.headers"
      :items="table.items"
      hide-default-footer
    >
      <template v-slot:body="{ items }">
        <tbody v-for="(item, index) in items" :key="item.id" >
          <tr v-bind:class="{'disable': typeof item.show !== 'undefined'}" @click="changeStatusExpandable(index, !canExpand(index))">
            <td>{{ index }} - {{ table.keys[index] }}</td>
            <td class="text-right">
              <v-layout align-center>
                <span v-if="canExpand(index)" @click="changeStatusExpandable(index, false)"><q-btn color="primary" text icon><i class="fas fa-eye"></i></q-btn></span>
                <span class='disable' v-if="!canExpand(index)" @click="changeStatusExpandable(index, true)"><q-btn color="primary" text icon><i class="fas fa-eye-slash"></i></q-btn></span>
                <q-btn icon v-bind:class="{'hidden': !canMoveDown(index)}" @click="moveDown(index)"><v-icon>arrow_drop_down</v-icon></q-btn>
                <q-btn icon v-bind:class="{'hidden': !canMoveUp(index)}" @click="moveUp(index)"><v-icon>arrow_drop_up</v-icon></q-btn>
              </v-layout>
            </td>
          </tr>
          <tr v-if="canExpand(index)"v-bind:class="{'disable': loading}">
            <td colspan='2' class='py-4' >
              <v-slider
                class="mt-3"
                :label="$t('$quartz.data-view.size')" 
                :value="item.options && item.options.size ? item.options.size : 12"
                step="1"
                min="0"
                max="12"
                thumb-size="22"
                thumb-label="always"
                @change="changeText(['options', 'size'], index, $event)"
                ticks
              ></v-slider>
              <v-text-field :label="$t('$quartz.data-view.label')" :value="item.options && item.options.label ? item.options.label : table.keys[index]" @change="changeText(['options', 'label'], index, $event)" />
              <v-checkbox hide-details :label="$t('$quartz.data-view.hide')" :input-value="item.options && item.options.hide" @change="changeText(['options', 'hide'], index, $event)" />

              <q-form-yaml class='my-3' :value="dumpYaml(item)" @input="updateYaml(index, $event)"></q-form-yaml>

              <q-btn color="error" @click="remove(index)" :loading="loading">{{ $t('$quartz.core.remove') }}</q-btn>
              <q-btn color="primary" @click="update().then(i => changeStatusExpandable(index, false))" :loading="loading">{{ $t('$quartz.core.save') }}</q-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>

    <q-form-yaml class='my-3' v-model="yaml"></q-form-yaml>

    <q-btn color="primary" @click="updateConfig()" :loading="loading">{{ $t('$quartz.core.save') }}</q-btn>

  </div>
</div>
</template>
<script>
import ResourceSettingsCommon from './ResourceSettingsCommon'

export default {
  mixins: [ResourceSettingsCommon],
}
</script>