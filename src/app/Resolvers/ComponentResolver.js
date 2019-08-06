import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'

export class ComponentResolver extends Resolver
{
  resolve (data) {

    data.components = [];

    let components = data.view.config.options.components;

    for (let attributeName in components) {

      let component = {};

      component.name = attributeName
      component.view = this.mergeWithBase(data.name, components[component.name]);

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

    let parts = attribute.include.split(".");

    let viewName = parts[0]  + '-resource';

    let view = this.dictionary.getViewByName(viewName);

    if (attribute.options === null) {
      attribute.options = {}
    }

    attribute = _.merge(_.get(view.config.options, parts.slice(1)), attribute)

    return attribute;
  }
}