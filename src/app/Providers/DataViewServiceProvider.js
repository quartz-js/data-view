import { ServiceProvider } from '@railken/quartz-core'
import { container, ResourceApi } from '@railken/quartz-core'
import { DataViewApi } from '../Api/DataViewApi'
import { DataResolver } from '../Services/DataResolver'
import _ from 'lodash'
var yaml = require('js-yaml');
import { Utils } from '../Helpers/Utils'

import { Attributes, Manager } from '@railken/quartz-core'

export class DataViewServiceProvider extends ServiceProvider {
  register () {

    this.registerComponent("DataViewPageShow", require('../../components/PageShow').default)
    this.registerComponent("DataViewPageIndex", require('../../components/PageIndex').default)
    this.registerComponent("DataViewResourceCreate", require('../../components/ResourceCreate').default)
    this.registerComponent("DataViewResourceUpdate", require('../../components/ResourceUpdate').default)
    this.registerComponent("DataViewResourceShow", require('../../components/ResourceShow').default)
    this.registerComponent("DataViewResourceIndex", require('../../components/ResourceIndex').default)
    this.registerComponent("DataViewAttributeInput", require('../../components/AttributeInput').default)
    this.registerComponent("DataViewAttributeShow", require('../../components/AttributeShow').default)
  }

  boot() {

    if (!container.get('user')) {
      return;
    }

    let api = new DataViewApi();
    let resolver = new DataResolver();
    return api.admin().then(response => {
      return resolver.ini(response.body.data);
    }).then(response => {


      container.set('$quartz.view.components', []);
      container.set('$quartz.view.services', []);
      container.set('$quartz.view.routes', []);

      return api.index({query: '', show: 9999}).then(response => {

        response.body.data.map(item => {

          item.priority = 1;
          item.config = yaml.load(item.config)

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

  registerDataViewComponent(item) {

    let cont = container.get('$quartz.view.components');

    this.registerComponent(Utils.nameToComponent('data-view-' + item.name), {
      data() {
        return {
          view: null
        }
      },
      template: `<${Utils.nameToComponent(item.config.extends)} :view='view' v-if='view' v-bind="$attrs"/>`,
      mounted () {
        this.view = item
      }
    })

    cont.push(item)
  }
}