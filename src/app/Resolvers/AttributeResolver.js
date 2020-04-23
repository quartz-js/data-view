import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'
import { Attributes, container, Translator } from '@quartz/core'
import { DataResolver } from '../Services/DataResolver'
import _ from 'lodash'

export class AttributeResolver extends Resolver
{
  resolve (data) {
    let c = 0;
    data.components.filter(attr => {
      return attr.view.type === 'attribute'
    }).map((attr,key) => {
      data.components[key] = this.resolveAttribute(data, attr, c++)
    })

    return data
  }
  resolveAttribute (data, attribute, i) {
    let name = data.name;

    let options = attribute.view.options;

    let attrClass = container.get('$quartz.attributes')[options.type] || Attributes.Base
    
    let layout = _.get(options, 'layout', {
      x: 0,
      y: i,
      w: 12,
      h: ['LongText', 'Yaml'].indexOf(options.type) !== -1 ? 3 : 1
    })

    layout.id = attribute.view.id
    layout.name = attribute.view.name
    layout.i = i


    attribute.instance = new attrClass(options.name).fill({
      raw: attribute.view,
      view: {
        local: attribute.raw.local,
        global: attribute.raw.global
      },
      condition: options.condition || '1',
      name: options.name,
      multiple: _.get(options, 'multiple', false),
      layout: layout,
      type: options.type || 'text',
      column: options.column,
      extract: options.extract,
      inject: options.inject,
      fillable: _.get(options, 'fillable', true),
      required: options.required,
      unique: options.unique,
      mutable: _.get(options, 'mutable', true),
      hide: _.get(options, 'hide', false),
      label: _.get(options, 'label', (new Translator).translate(name, options.name, 'name')),
      hint: _.get(options, 'hint', container.get('translator').t(attribute.hint)),
      default: (resource) => {
        return options.default;
      },
      options: this.resolveAttributeOptions(options),
      fixed: (resource) => {
        return _.get(options, 'fixed', undefined)
      },
      actions: _.map(options.actions, action => {
        return `data-view-${action}`
      }),
      persist: _.merge(
        {
          manager: options.persist.data ? (resource) => {

            let name = container.get('template').parse(options.persist.data.name + ".resource.upsert", {resource: resource});

            return new DataResolver().createManager(container.get('data-view').getViewByName(name))
          } : undefined 
        },
        options.persist
      ),
      select: {
        manager: (resource) => {
          let name = container.get('template').parse(options.select.data + ".resource.upsert", {resource: resource});

          return options.select.data ? new DataResolver().createManager(container.get('data-view').getViewByName(name)) : null
        },
        api: options.select.data,
        include: options.select.include,
        query: options.select.query,
        label: options.select.label
      },
      readable: {
        type: options.readable.type,
        label: _.get(options.readable, 'label', options.name)
      },
    })

    data.manager.addAttribute(attribute.instance);

    if (options.include) {
      data.manager.hook.add('include', (includes) => {
        return [].concat(includes, Object.values(options.include))
      })
    }

    attribute.instance.boot()

    return attribute;
  }

  resolveAttributeOptions(config)
  {
    let options = _.get(config, 'items', [])

    let resolver = Array.isArray(options) ? (item) => { 
      return {
        label: item,
        value: item
      }
    } : (item, key) => {
      return {
        label: item,
        value: key
      }
    }
    
    let obj = Object.values(_.map(options, resolver))

    return obj;
  }
}