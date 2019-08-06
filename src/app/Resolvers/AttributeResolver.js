import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'
import { container } from '@quartz/core'

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

    attribute.schema = this.dictionary.findAttributeByName(name, attribute.view.name)

    if (!attribute.schema) {
      throw new DataViewError(`Cannot find Attribute in Schema ${name}:${attribute.view.name}`)
    }

    let attrClass = container.get('$quartz.attributes')[attribute.schema.type]
    
    if (!attrClass) {
      throw new DataViewError(`Cannot find Javascript Attribute Class ${name}:${attribute.schema.type}`)
    }

    attribute.instance = new attrClass(attribute.name)
      .set('column', attribute.schema.name)
      .set('fillable', attribute.schema.fillable)
      .set('required', attribute.schema.required)
      .set('unique', attribute.schema.unique)
      .set('show', !attribute.schema.hide)
      .set('style', _.merge({extends: attribute.view.extends}, attribute.view.options))
        
    attribute.view.fixed && attribute.instance.set('fixed', (resource) => {
      return attribute.view.fixed; 
    })

    attribute.schema.default !== null && attribute.instance.set('default', (resource) => { 
      return attribute.schema.default
    })
    attribute.view.options.label && attribute.instance.set('label', attribute.view.options.label);
    attribute.view.options.hide && attribute.instance.set('show', !attribute.view.options.hide);

    attribute.view.options.default && attribute.instance.set('default', (resource) => {
      return attribute.view.options.default;
    })

    data.manager.addAttribute(attribute.instance);

    return attribute;
  }
}