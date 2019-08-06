import { container, Attributes, ResourceApi, Manager, Helper, Interceptor } from '@quartz/core'
import _ from 'lodash'
import { DataViewError } from '../Errors/DataViewError'

export class Dictionary {


  addViews (views) {
    container.set('$quartz.views', views);
  }

  addData (data) {
    container.set('$quartz.data', data);
  }

  updateViewByName (name, content) {
    container.set('$quartz.view', container.get('$quartz.views').map(item => {
      if (item.name === name) {
        item.config = content
      }
      return item;
    }))
  }
  getViewByName (name) {
    let view = _.cloneDeep(container.get('$quartz.views').find(item => {
      return item.name === name
    }))

    if (!view) {
      throw new DataViewError(`Cannot find view with name: ${name}`)
    }

    return view;
  }

  newApiByUrl(url) {
    let api = new ResourceApi(container.get('settings').get('language', 'en'));
    api.resource_url = url;

    return api;
  }

  newApiByName(name) {
    return this.newApiByUrl(this.getViewByName(name + "-resource").config.options.api);
  }

  findAttributeByName (dataName, attributeName) {
    let data = this.getDataByName(dataName);

    return _.find(data.attributes, attribute => {
      return attribute.name === attributeName
    })
  }

  findRelationByName (dataName, relationName) {
    let data = this.getDataByName(dataName);

    return _.find(data.relations, attribute => {
      return attribute.key === relationName
    })
  }


  getDataByName (dataName) {
    let data = container.get('$quartz.data').find((item) => {
      return item.name === dataName;
    })

    if (!data) {
      throw new DataViewError(`Cannot find data with name ${dataName}`)
    }

    return _.cloneDeep(data);
  }
};
