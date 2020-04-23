import { ServiceProvider } from '@quartz/core'
import { container, ResourceApi } from '@quartz/core'
import { DataViewApi } from '../Api/DataViewApi'
import { AdminApi } from '../Api/AdminApi'
import { DataResolver } from '../Services/DataResolver'
import { Dictionary } from '../Services/Dictionary'
import _ from 'lodash'
var yaml = require('js-yaml');
import { Utils } from '../Helpers/Utils'

import { Attributes, Relations, Manager } from '@quartz/core'

export class DataViewServiceProvider extends ServiceProvider {
  register () {

    container.set('data-view', new Dictionary)
    
    container.set('$quartz.attributes', _.merge(Attributes, Relations));
    container.set('$quartz.attributeResolvers', {
      'BaseAttribute': 'q-attr-base',
      'TextAttribute': 'q-attr-text',
      'LongTextAttribute': 'q-attr-textarea',
      'EmailAttribute': 'q-attr-text',
      'PasswordAttribute': 'q-attr-secret',
      'BooleanAttribute': 'q-attr-checkbox',
      'EnumAttribute': 'q-attr-select',
      'YamlAttribute': 'q-attr-yaml',
      'HtmlAttribute': 'q-attr-html',
      'DateAttribute': 'q-attr-date',
      'DateTimeAttribute': 'q-attr-datetime',
      'BelongsToAttribute': 'q-attr-belongs-to',
      'MorphToAttribute': 'q-attr-morph-to',
      'NumberAttribute': 'q-attr-text',
      'ClassNameAttribute': 'q-attr-select',
      'FileAttribute': 'q-attr-file',
      'UuidAttribute': 'q-attr-text',
      'ArrayAttribute': 'q-attr-json',
      'MorphToMany': 'q-attr-morph-to-many',
      'BelongsToMany': 'q-attr-belongs-to-many',
      'ObjectAttribute': 'q-attr-json',
      'HtmlAttribute': 'q-attr-html',
      'DataNameAttribute': 'q-attr-text',
      'autocomplete': 'q-attr-autocomplete',
    });

    this.registerComponent("DataViewPageShow", require('../../components/PageShow').default)
    this.registerComponent("DataViewPageIndex", require('../../components/PageIndex').default)
    this.registerComponent("DataViewResourceUpsert", require('../../components/ResourceUpsert').default)
    this.registerComponent("DataViewResourceDelete", require('../../components/ResourceRemove').default)
    this.registerComponent("DataViewResourceShowOrCreate", require('../../components/ResourceShowOrCreate').default)
    this.registerComponent("DataViewResourceShow", require('../../components/ResourceShow').default)
    this.registerComponent("DataViewDataIteratorTable", require('../../components/DataIteratorTable').default)
    this.registerComponent("DataViewDataIteratorCalendar", require('../../components/DataIteratorCalendar').default)
    this.registerComponent("DataViewDataCameraBarcode", require('../../components/DataCameraBarcode').default)
    this.registerComponent("DataViewAttributeInput", require('../../components/AttributeInput').default)
    this.registerComponent("DataViewAttributeShow", require('../../components/AttributeShow').default)

    this.registerComponent("DataViewResourceExecute", require('../../components/ResourceExecute').default)
    this.registerComponent("DataViewPageForm", require('../../components/PageForm').default)

    this.addLang({
      'en': require('../../../lang/en.json'),
      'it': require('../../../lang/it.json')
    })

    container.get('template').extendFilter('mapByKey', (value, args) => {
      if (!value) {
        value = []
      }
      
      return value.map(i => _.get(i, args[0]))
    })
    
    container.get('template').extendFunction('values', (obj, fields) => {
      
      if (!fields) {
        fields = []
      }

      return fields.map( i => {
        return _.get(obj, i)
      })
    })

    container.get('template').extendFunction('data', (value) => {
      let view = container.get('data-view').getViewByName(value + ".resource.show");
      let manager = new DataResolver().createManager(view);
      return manager;
    })

    container.get('template').extendFunction('hasData', (value) => {
      try {
        let view = container.get('data-view').getViewByName(value + ".resource.show");

        return true;
      } catch (e) {
        return false;
      }
    })

  }

  boot() {

    container.set('$quartz.view.components', []);
    container.set('$quartz.view.services', []);
    container.set('$quartz.view.routes', []);

    return this.reload('')

  }

  reload (query) {

    this.api = new DataViewApi();
    let adminApi = new AdminApi();
    this.dictionary = container.get('data-view')

    return adminApi.index().then(response => {
      
      let lang = container.get('settings').get('language', 'en')
      this.addLang({[lang]: {"$quartz": { data: response.body.lang}}})

      // return this.dictionary.addData(JSON.parse(response.bodyText).data);
      return this.dictionary.addData(response.body.data);
    }).then(response => {
      return this.api.index({query: query, show: 9999}).then(response => {

        let views = this.dictionary.addViews(response.body.data);


        _.map(views, item => {

          if (item.type === 'component') {
            this.registerDataViewComponent(item);
          }

          if (item.type === 'service') {
            this.registerDataViewService(item);
          }

          if (item.type === 'routes') {
            this.registerDataViewRoutes(item);
          }
        })

      })
    }).catch(response => {
      
    })
  }

  registerDataViewService(item) {

    item.tags = ['data'];
    let cont = container.get('$quartz.view.services');
    
    cont.push(item)
  }

  registerDataViewRoutes(item) {

    let cont = container.get('$quartz.view.routes');

    cont.push(item)

    item.config.map(route => {
      route.component = {
        data() {
          return {
            view: null
          }
        },
        template: `<${Utils.nameToComponent(route.component)} :rawView='view'/>`,
        mounted () {
          this.view = (new Dictionary).getViewByName(item.name)
        },
      }

      this.addRoutes(route.container, {
        name: route.name,
        path: route.path,
        component: route.component
      });
    });
    //
  }

  registerDataViewComponent(item) {

    let cont = container.get('$quartz.view.components');

    if (!item.config.extends) {
      return;
    }

    if (item.parent_id) {
      return
    }

    this.registerComponent(Utils.nameToComponent(item.name), {
      data() {
        return {
          view: null
        }
      },
      template: `<${Utils.nameToComponent(item.config.extends)} :rawView='view' v-if='view' v-bind="$attrs"/>`,
      mounted () {
        this.view = (new Dictionary).getViewByName(item.name)
      },
    })

    let index = cont.findIndex(i => { return i.name === item.name})

    if (index !== -1) {
      cont[index] = item;
    } else {
      cont.push(item)
    }

    return item;
  }
}