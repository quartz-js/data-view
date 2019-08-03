import { ServiceProvider } from '@quartz/core'
import { container, ResourceApi } from '@quartz/core'
import { DataViewApi } from '../Api/DataViewApi'
import { DataResolver } from '../Services/DataResolver'
import _ from 'lodash'
var yaml = require('js-yaml');
import { Utils } from '../Helpers/Utils'

import { Attributes, Relations, Manager } from '@quartz/core'

export class DataViewServiceProvider extends ServiceProvider {
  register () {

    container.set('$quartz.attributes', _.merge(Attributes, Relations));
    container.set('$quartz.attributeResolvers', {
      'TextAttribute': 'q-text',
      'LongTextAttribute': 'q-textarea',
      'EmailAttribute': 'q-text',
      'PasswordAttribute': 'q-secret',
      'BooleanAttribute': 'q-switch',
      'EnumAttribute': 'q-select',
      'YamlAttribute': 'q-yaml',
      'HtmlAttribute': 'q-html',
      'DateTimeAttribute': 'q-datetime',
      'BelongsToAttribute': 'q-belongs-to',
      'MorphToAttribute': 'q-morph-to',
      'NumberAttribute': 'q-text',
      'ClassNameAttribute': 'q-select',
      'FileAttribute': 'q-file',
      'UuidAttribute': 'q-text',
      'MorphToMany': 'q-morph-to-many',
      'BelongsToMany': 'q-belongs-to-many',
      'ObjectAttribute': 'q-json',
      'HtmlAttribute': 'q-html',
    });

    this.registerComponent("DataViewPageShow", require('../../components/PageShow').default)
    this.registerComponent("DataViewPageIndex", require('../../components/PageIndex').default)
    this.registerComponent("DataViewResourceCreate", require('../../components/ResourceCreate').default)
    this.registerComponent("DataViewResourceUpdate", require('../../components/ResourceUpdate').default)
    this.registerComponent("DataViewResourceDelete", require('../../components/ResourceRemove').default)
    this.registerComponent("DataViewResourceCreateOrUpdate", require('../../components/ResourceCreateOrUpdate').default)
    this.registerComponent("DataViewResourceShowOrCreate", require('../../components/ResourceShowOrCreate').default)
    this.registerComponent("DataViewResourceShow", require('../../components/ResourceShow').default)
    this.registerComponent("DataViewResourceIndex", require('../../components/ResourceIndex').default)
    this.registerComponent("DataViewAttributeInput", require('../../components/AttributeInput').default)
    this.registerComponent("DataViewAttributeShow", require('../../components/AttributeShow').default)

    this.addLang({
      'en': require('../../../lang/en.json'),
      'it': require('../../../lang/it.json')
    })
  }

  boot() {

    if (!container.get('user')) {
      return;
    }

    let api = new DataViewApi(container.get('settings').get('language', 'en'));
    let resolver = new DataResolver();
    return api.admin().then(response => {
      let lang = container.get('settings').get('language', 'en')
      this.addLang({[lang]: {"$quartz": { data: response.body.lang}}})
      return resolver.addData(JSON.parse(response.bodyText).data);
    }).then(response => {

      container.set('$quartz.view.components', []);
      container.set('$quartz.view.services', []);
      container.set('$quartz.view.routes', []);

      return api.index({query: '', show: 9999}).then(response => {


        resolver.addViews(response.body.data);

        response.body.data.map(item => {


          item.priority = 1;
          item.config = item.processed

          item = this.parseItemDataView(item)

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
        template: `<${Utils.nameToComponent('data-view-' + route.component)}/>`
      }

      this.addRoutes('app', route);
    });
    //
  }

  onRegisterDataView (item) {
    if (item.config.extends === 'data-view-resource-show') {

      let data = item.config.options.data;

      this.registerDataViewComponent({
        name: data + '-resource-create-or-update',
        config: {
          label: item.config.label,
          icon: item.config.icon,
          extends: 'data-view-resource-create-or-update',
          permissions: [data + '.create',data + '.update'],
          update: data + '-resource-update',
          create: data + '-resource-create'
        }
      });
      this.registerDataViewComponent({
        name: data + '-resource-show-or-create',
        config: {
          label: item.config.label,
          icon: item.config.icon,
          extends: 'data-view-resource-show-or-create',
          permissions: [data + '.show',data + '.create',data + '.update'],
          show: data + '-resource-show',
          create: data + '-resource-create-or-update'
        }
      });
    }
  }

  registerDataViewComponent(item) {

    let cont = container.get('$quartz.view.components');

    if (!item.config.extends) {
      return;
    }

    this.onRegisterDataView(item);

    this.registerComponent(Utils.nameToComponent('data-view-' + item.name), {
      data() {
        return {
          view: null
        }
      },
      template: `<${Utils.nameToComponent(item.config.extends)} :rawView='view' v-if='view' v-bind="$attrs"/>`,
      mounted () {
        this.view = item
      },
    })

    cont.push(item)
  }

  parseItemDataView (item) {

    if (item.config.icon) {
      item.config.icon = this.parseUrlResource(item.config.icon)
    }

    return item
  }

  parseUrlResource (url) {
    try {
      new URL(url)

      return url;
    } catch (e) {
      return new URL(container.get('config').app.api.url).origin + url
    }
  }
}