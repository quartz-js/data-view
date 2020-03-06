import { container, Attributes, ResourceApi, Manager, Helper, Interceptor } from '@quartz/core'
import _ from 'lodash'
import { DataViewError } from '../Errors/DataViewError'
var yaml = require('js-yaml');

export class Dictionary {

  addViews (views) {


    views = _.map(views, item => {
      return this.parseItemDataView(item);
    })

    // views = this.onParseDataViews(views);

    views = _.mapKeys(views, (val, key) => {
      return this.removeObjectReferences(val.name);
    })

    container.set('$quartz.views', _.assignIn(container.get('$quartz.views', {}), views));

    return container.get('$quartz.views');
  }

  onParseDataViews (items) {

    _.map(items, (item) => {
      if (item.processed.extends === 'resource-show') {

        let data = item.processed.options.data;

        items.push({
          name: data + '.resource.show.or.create',
          type: 'component',
          processed: {
            label: item.processed.label,
            icon: item.processed.icon,
            extends: 'resource.show.or.create',
            permissions: [data + '.show',data + '.create',data + '.update'],
            show: data + '.resource.show',
            create: data + '.resource.create.or.update'
          },
          parent_id: null
        });
      }
    })


    return items;
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  removeObjectReferences(str)
  {
    str = str.replace(/~([a-z0-9_\-]{1,})\.([a-z0-9_\-]{1,})~/gi, '$2')
    str = str.replace(/~([a-z0-9_\-]{1,})~/gi, '$1')

    return str
  }

  parseItemDataView (item) {

    let config = this.removeObjectReferences(item.config)

    config = yaml.load(config)

    item.name = this.removeObjectReferences(item.name)
    item.config = config
    item.priority = 1;

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

  addData (data) {
    container.set('$quartz.data', data);
  }

  updateViewByName (name, content) {
    this.getViewByName(name, true).config = content;

    window.bus.$emit('component.update');
  }

  getViewByTag (tag) {
    return _.pickBy(container.get('$quartz.views'), (i) => {
      return i.tag && i.tag.split(",").indexOf(tag) !== -1
    })
  }

  getComponentsByView (view) {
    let object = _.map(this.getViewsByParent(view.id), (i) => {
      let config = i.config

      if (!config.name) {
        config.name = i.name
      }
      
      config.id = i.id

      return config
    })

    return _.mapKeys(object, (i) => {
      return i.name
    })
  }

  getActionsByView (id, scope) {
    return _.pickBy(this.getViewsByParent(id), (i) => {
      return i.config.type === 'action' && i.config.scope === scope
    })
  }

  getViewsByParent (id) {
    return _.pickBy(container.get('$quartz.views'), (i) => {
      return i.parent_id === id
    })
  }

  getViewById (id) {
    return _.pickBy(container.get('$quartz.views'), (i) => {
      return i.id == id
    })
  }

  getViewByName (name, original) {

    if (typeof container.get('$quartz.views')[name] === "undefined") {
      throw new DataViewError(`Cannot find view with name: ${name}`)
    }

    return original ? container.get('$quartz.views')[name] : _.cloneDeep(container.get('$quartz.views')[name])
  }

  newApiByUrl(url) {
    let api = new ResourceApi(container.get('settings').get('language', 'en'));
    api.resource_url = url;

    return api;
  }

  newApiByName(name) {
    return this.newApiByUrl(this.getViewByName(name + ".resource.show").config.options.api);
  }
};
