import { ServiceProvider } from '@railken/quartz-core'
import { container, ResourceApi } from '@railken/quartz-core'
import { DataViewApi } from '../Api/DataViewApi'
import { DataResolver } from '../Services/DataResolver'
import _ from 'lodash'
var yaml = require('js-yaml');

import { Attributes, Manager } from '@railken/quartz-core'

export class DataViewServiceProvider extends ServiceProvider {
  register () {

    this.registerComponent("DataViewPageShow", require('../../components/Page/show').default)
    this.registerComponent("DataViewPageIndex", require('../../components/Page/index').default)
    this.registerComponent("DataViewResourceCreate", require('../../components/Resource/create').default)
    this.registerComponent("DataViewResourceUpdate", require('../../components/Resource/update').default)
    this.registerComponent("DataViewResourceShow", require('../../components/Resource/show').default)
    this.registerComponent("DataViewResourceIndex", require('../../components/Resource/index').default)
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
        template: `<${this.nameToComponent('data-view-' + route.component)}/>`
      }

      this.addRoutes('app', route);
    });
    //
  }

  registerDataViewComponent(item) {

    let cont = container.get('$quartz.view.components');

    this.registerComponent(this.nameToComponent('data-view-' + item.name), {
      data() {
        return {
          view: null
        }
      },
      template: `<${this.nameToComponent(item.config.extends)} :view='view' v-if='view'/>`,
      mounted () {
        this.view = item
      }
    })

    cont.push(item)
  }

  nameToComponent(name){
    return _.upperFirst(_.camelCase(name.replace(/\./g, '-')))
  }
}