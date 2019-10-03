import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'
import { Attributes, container, Translator } from '@quartz/core'
import { DataResolver } from '../Services/DataResolver'

export class AttributeResolver extends Resolver
{
  resolve (data) {
    data.components.filter(attr => {
      return attr.view.type === 'attribute'
    }).map((attr,key) => {
      data.components[key] = this.resolveAttribute(data, attr)
    })

    return data
  }
  resolveAttribute (data, attribute) {
    let name = data.name;

    let options = attribute.view.options;

    let attrClass = container.get('$quartz.attributes')[options.type] || Attributes.Base

    attribute.instance = new attrClass(options.name).fill({
      raw: attribute.view,
      name: options.name,
      type: options.type || 'text',
      column: options.column,
      extract: options.extract,
      inject: options.inject,
      fillable: _.get(options, 'fillable', true),
      required: options.required,
      unique: options.unique,
      hide: _.get(options, 'hide', false),
      label: _.get(options, 'label', (new Translator).translate(name, options.name, 'name')),
      hint: _.get(options, 'hint', container.get('translator').t(attribute.hint)),
      default: (resource) => {
        return options.default;
      },
      options: _.get(options, 'items', []).map(item => { 
        return {
          label: item,
          value: item
        }
      }),
      fixed: (resource) => {
        return _.get(options, 'fixed', undefined)
      },
      actions: _.map(options.actions, action => {
        return `data-view-${action}`
      }),
      include: options.include,
      persist: options.persist,
      select: {
        manager: (resource) => {
          return options.select.data ? new DataResolver().createManager(container.get('data-view').getViewByName(options.select.data + ".resource.upsert")) : null
        },
        api: options.select.data ? container.get('data-view').newApiByName(options.select.data) : null,
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

    return attribute;
  }
}