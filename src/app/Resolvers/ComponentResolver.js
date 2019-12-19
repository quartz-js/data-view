import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'

export class ComponentResolver extends Resolver
{
  resolve (data) {

    data.components = [];

    // Options are now 
    let components = this.dictionary.getComponentsByView(data.view)

    for (let attributeName in components) {

      let component = {};

      component.name = attributeName

      let rawComponent = components[component.name];

      component.raw = {
        local: rawComponent.raw,
        global: rawComponent ? this.dictionary.getViewByName(rawComponent.include).raw : null
      }

      component.view = this.mergeWithBase(data.name, rawComponent);


      if (!component.view) {
        throw new DataViewError(`Undefined element at key: ${data.name}:${component.name}. ${JSON.stringify(components)}`)
      }

      if (!component.view.name) {
        throw new DataViewError(`Missing property name in ${data.name}:${component.name}. ${JSON.stringify(components)}`)
      }

      data.components.push(component)
    }

    return data;
  }
  mergeWithBase (name, attribute) {
    if (!attribute.include) {
      return attribute
    }

    let view = this.dictionary.getViewByName(attribute.include);

    if (attribute.options === null) {
      attribute.options = {}
    }

    attribute = _.merge(view.config, attribute)

    return attribute;
  }
}