import { AttributeResolver } from './AttributeResolver'
import { DataViewError } from '../Errors/DataViewError'
import { DataResolver } from '../Services/DataResolver'
import _ from 'lodash'

export class RelationResolver extends AttributeResolver
{
  resolveAttribute (data, attribute) {

    let name = data.name;
    let options = data.options;
    let manager = data.manager;

    console.log(attribute)

    let relationers = attribute.view.options.schema;

    if (!relationers) {
      return attribute;
    }

    console.log(relationers)

    /*if (!options.query && !options.ignoreTree) {
      if (manager.descriptor.tree && manager.descriptor.tree.parent === attribute.instance.column) {
        if (attribute.instance.fixed(null) === undefined) {
          attribute.instance.setFixed(() => {
            return null;
          });
        }
      }
    }*/
    // Create a list of all available managers and components

    let keys = [];


    keys = Object.keys(relationers)

    attribute.instance.setRelationableSwitcher(resource => {
      return resource[relationKey]
    })
    
    keys.map(key => {

      if (!relationers[key]) {
        throw new DataViewError(`Cannot find options with key ${key}. You should probably update the data-view`)
      }

      let actions = _.map(relationers[key].actions, action => {
        return `data-view-${action}`
      })

      let view = this.dictionary.getViewByName(`${key}.resource.upsert`);
      
      if (relationers[key].select.include) {
        attribute.instance.hook.add('include', (includes) => {
          includes.push(relationers[key].query.include.split(",").map(i => { return attribute.instance.name + "." + i}));
          return Promise.resolve(includes)
        })
      }

      attribute.instance.addRelationable({
        select: {
          include: relationers[key].include,
          label: relationers[key].select.label
        },
        label: {
          type: relationers[key].readable.type,
          label: relationers[key].readable.label
        },
        key: key,
        manager: (resource) => {

          let manager = (new DataResolver).createManager(view, {
            ignoreTree: relationers[key].select.label
          });

          return manager
        },
        actions: actions,
        onLoad: (t) => {}
      })
    });

    return attribute
  }
}