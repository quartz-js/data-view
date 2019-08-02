<template>
  <v-data-table
    :headers="table.headers"
    :items="table.items"
    hide-actions
  >
    <template v-slot:items="props">
      <tr v-bind:class="{'disable': typeof props.item.show !== 'undefined'}">
        <td>{{ table.keys[props.index] }}</td>
        <td class="text-xs-right">
          <v-layout align-center>
            <span v-if="canExpand(props.index)" @click="changeStatusExpandable(props.index, false)"><v-btn color="primary" flat icon><i class="fas fa-eye"></i></v-btn></span>
            <span class='disable' v-if="!canExpand(props.index)" @click="changeStatusExpandable(props.index, true)"><v-btn color="primary" flat icon><i class="fas fa-eye-slash"></i></v-btn></span>
            <v-btn icon v-bind:class="{'hidden': !canMoveDown(props.index)}" @click="moveDown(props.index)"><v-icon>arrow_drop_down</v-icon></v-btn>
            <v-btn icon v-bind:class="{'hidden': !canMoveUp(props.index)}" @click="moveUp(props.index)"><v-icon>arrow_drop_up</v-icon></v-btn>
          </v-layout>
        </td>
      </tr>
      <tr v-if="canExpand(props.index)" v-bind:class="{'disable': loading}">
        <td colspan='2' class='py-4'>
          <v-checkbox hide-details :label="$t('$quartz.data-view.show')" :input-value="typeof props.item.show == 'undefined'" @change="changeShow(props.index, $event)"></v-checkbox>

          <q-form-yaml class='my-3' :value="dumpYaml(props.item)" @input="updateYaml(props.index, $event)"></q-form-yaml>

          <v-btn dark color="red" @click="remove(props.index)" :loading="loading">{{ $t('$quartz.core.remove') }}</v-btn>
          <v-btn color="primary" @click="update()" :loading="loading">{{ $t('$quartz.core.save') }}</v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</div>
</template>
<script>
import ResourceSettingsCommon from './ResourceSettingsCommon'

export default {
  mixins: [ResourceSettingsCommon],
}
</script>