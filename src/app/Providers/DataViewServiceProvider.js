import { ServiceProvider } from '@railken/quartz-core'
import { container, ResourceApi } from '@railken/quartz-core'
import { DataViewApi } from '../Api/DataViewApi'
import { DataResolver } from '../Services/DataResolver'
import Vue from 'vue'
var yaml = require('js-yaml');

import { Attributes, Manager } from '@railken/quartz-core'

export class DataViewServiceProvider extends ServiceProvider {
  register() {

    let api = new DataViewApi();
    let resolver = new DataResolver();
    api.admin().then(response => {
      resolver.ini(response.body.data);
    }).then(response => {


      container.set('$quartz.view.components', []);
      container.set('$quartz.view.services', []);
      container.set('$quartz.view.routes', []);

      return api.index({query: '', show: 9999}).then(response => {
        console.log(response.body.data);

        response.body.data.map(item => {

          item.priority = 1;
          item.config = yaml.load(item.config)

          if (item.type === 'component') {
            this.registerComponent(item);
          }

          if (item.type === 'service') {
            this.registerService(item);
          }

          if (item.type === 'routes') {
            this.registerRoutes(item);
          }
        })
      })
    })
  }

  registerService(item) {

    item.tags = ['data'];
    let cont = container.get('$quartz.view.services');

    cont.push(item)
  }

  registerRoutes(item) {
    let cont = container.get('$quartz.view.routes');

    cont.push(item)
  }

  registerComponent(item) {

    let cont = container.get('$quartz.view.components');

    console.log(item.config);

    /*
    let resolver = new DataResolver();

    if (item.config.options.data) {

      let manager = resolver.createManager(item);
    }
    */

    Vue.component('q-view-' + item.name, {
      data: function () {
        return {
          count: 0
        }
      },
      template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
    })

    cont.push(item)
  }
}