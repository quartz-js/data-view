import { AttributeResolver } from './AttributeResolver'
import { DataViewError } from '../Errors/DataViewError'
import { DataResolver } from '../Services/DataResolver'
import _ from 'lodash'

export class BelongsToResolver extends AttributeResolver
{
  resolveAttribute (data, attribute) {

    let name = data.name;
    let options = data.options;
    let manager = data.manager;


    if (attribute.schema.type !== 'BelongsTo' && attribute.schema.type !== 'MorphTo') {
      return attribute;
    }

    if (!options.query && !options.ignoreTree) {
      if (manager.descriptor.tree && manager.descriptor.tree.parent === attribute.instance.column) {
        if (attribute.instance.fixed(null) === undefined) {
          attribute.instance.setFixed(() => {
            return null;
          });
        }
      }
    }

    let relation = this.dictionary.findRelationByName(name, attribute.schema.relation);
    let relationKey = attribute.schema.descriptor.relation_key;

    if (!relation) {
      throw new DataViewError(`Cannot find relation by name: ${name}:${attribute.schema.relation}`)
    }

    // Create a list of all available managers and components

    let keys = [];


    if (attribute.schema.type === 'BelongsTo') {
      keys = [relation.data]

      attribute.instance.setRelationableSwitcher(resource => {
        return relation.data
      })
    }

    if (attribute.schema.type === 'MorphTo') {
      keys = this.dictionary.findAttributeByName(name, relationKey).options

      attribute.instance.setRelationableSwitcher(resource => {
        return resource[relationKey]
      })
    }

    attribute.instance.addHook('include', (includes) => {
      includes.push(attribute.schema.relation)
      
      if (attribute.instance.style.include) {
        includes.push(attribute.instance.style.include);
      }

      return Promise.resolve(includes)
    })

    attribute.instance.addHook('beforePersist', (params) => {
      delete params[attribute.instance.getRelationName()]
      return Promise.resolve(params)
    })

    attribute.instance.addHook('watchToReload', (params) => {
      params.push(relationKey)

      return Promise.resolve(params)
    }) 
    
    
    keys.map(key => {

      if (!attribute.view.options[key]) {
        throw new DataViewError(`Cannot find options with key ${key}. You should probably update the data-view`)
      }

      let actions = _.map(attribute.view.options[key].actions, action => {
        return `data-view-${action}`
      })

      let view = this.dictionary.getViewByName(`${key}-resource`);
      
      if (attribute.view.options[key].query.include) {
        attribute.instance.addHook('include', (includes) => {
          includes.push(attribute.view.options[key].query.include.split(",").map(i => { return attribute.instance.name + "." + i}));
          return Promise.resolve(includes)
        })
      }
      attribute.instance.addRelationable({
        query: {
          include: attribute.view.options[key].query.include ? attribute.view.options[key].query.include.split(",") : [],
          template: attribute.view.options[key].query.template
        },
        label: {
          type: attribute.view.options[key].readable.type,
          template: attribute.view.options[key].readable.template
        },
        key: key,
        manager: (resource) => {

          let manager = (new DataResolver).createManager(view, {
            ignoreTree: attribute.view.options[key].query.template
          });

          return manager
        },
        actions: actions,
        onLoad: (t) => {
          for (let attrKey in attribute.schema.descriptor.constraint) {

            let attrVal = attribute.schema.descriptor.constraint[attrKey];

            if (attrVal) {
              t.getAttribute(attrKey).setFixed((resource) => {
                return {id: attrVal}
              }, true)
            }
          }
        }
      })
    });

    return attribute
  }
}