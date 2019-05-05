import { container, Attributes, ResourceApi, Manager, Helper, Interceptor } from '@railken/quartz-core'
import { DataViewError } from '../Errors/DataViewError'
import _ from 'lodash'

export class DataResolver {

  addViews (views) {
    container.set('$quartz.views', views);
  }

  addData (data) {
    container.set('$quartz.data', data);
  }

  createManager (item) {

    let manager = new Manager({
      name: item.config.options.data,
      data: item.config.options.data,
      route: item.config.options.data,
      manager: this.newApiByUrl(item.config.options.api),
      icon: item.config.icon,
      descriptor: this.getDataByName(item.config.options.data).descriptor,
      attributes: []
    });

    if (item.config.options.attributes) {
      this.resolveAttributes(manager, item.config.options.data, item.config.options.attributes);
    }

    let data = Interceptor.resolve('managerOnCreate', {
      manager: manager,
      view: item
    })

    return data.manager;
  }

  resolveAttributes(manager, name, attributesSelected) {

    for (let attributeName in attributesSelected) {


      let attributeSelected = attributesSelected[attributeName]


      attributeSelected = this.mergeWithBase(name, attributeName, attributeSelected);


      if (!attributeSelected) {
        throw `Undefined element at key: ${attributeName}. ${JSON.stringify(attributesSelected)}`
      }

      if (!attributeSelected.name) {
        throw `Missing property name in ${name}:${attributeName}. ${JSON.stringify(attributesSelected)}`
      }

      let attributeSchema = this.findAttributeByName(name, attributeSelected.name)

      if (!attributeSchema) {
        throw `Cannot find Attribute in Schema ${name}:${attributeSelected.name}`
      }

      let attrClass = container.get('$quartz.attributes')[attributeSchema.type]
      
      if (!attrClass) {

        throw `Cannot find Javascript Attribute Class ${name}:${attributeSchema.type}`
      }

      let attribute = new attrClass(attributeName)
        .set('column', attributeSchema.name)
        .set('fillable', attributeSchema.fillable)
        .set('required', attributeSchema.required)
        .set('unique', attributeSchema.unique)
        .set('hidden', attributeSchema.hidden)
        .set('style', _.merge({extends: attributeSelected.extends}, attributeSelected.options))
          
      if (attributeSelected.fixed) {
        attribute.set('fixed', (resource) => {
          return attributeSelected.fixed;
        })
      }

      if (attributeSchema.type === 'Enum') {
        attribute.setOptions(attributeSchema.options.map(item => { 
          return {
            label: item,
            value: item
          }
        }))
      }

      if (attributeSchema.type === 'BelongsTo' || attributeSchema.type === 'MorphTo') {
        let relation = this.findRelationByName(name, attributeSchema.relation);
        let relationKey = attributeSchema.descriptor.relation_key;

        if (!attributeSelected.options) {
          throw `Expected options in ${name}:${attributeSelected.name}. Got: ${JSON.stringify(attributeSelected)}`
        }

        // Create a list of all available managers and components

        let keys = [];

        if (attributeSchema.type === 'BelongsTo') {
          keys = [relation.data]

          attribute.setRelationableSwitcher(resource => {
            return relation.data
          })

        }

        if (attributeSchema.type === 'MorphTo') {
          keys = this.findAttributeByName(name, relationKey).options

          attribute.setRelationableSwitcher(resource => {
            return resource[relationKey]
          })
        }

        attribute.setRetriever('include', (includes) => {
          includes.push(attributeSchema.relation)
          return includes
        })

        attribute.setRetriever('beforePersist', (params) => {
          delete params[attribute.getRelationName()]
          return params
        })

        attribute.setRetriever('watchToReload', (params) => {
          params.push(relationKey)

          return params
        }) 
        
        keys.map(key => {

          let actions = _.map(attributeSelected.options[key].actions, action => {
            return `data-view-${action}`
          })

          let view = this.getViewByName(`${key}-resource`);

          if (!view) {
            throw new DataViewError(`Cannot find view with name: ${key}-resource`)
          }

          attribute.addRelationable({
            key: key,
            manager: (resource) => {
              return this.createManager(view)
            },
            actions: actions
          })
        });

        let queries = [];

        for (let attrKey in attributeSchema.descriptor.constraint) {

          let attrVal = attributeSchema.descriptor.constraint[attrKey];

          if (attrVal) {
            /*relationManager.getAttribute(attrKey).set('fixed', (resource) => {
              return attrVal
            });*/

            queries.push(`${attrKey} eq '${attrVal}'`)
          }
        }

        if (queries.length > 0) {
          attribute.setQuery((key, resource) => {
            queries.push(`name ct '${key}'`)
            return Helper.mergePartsQuery(queries, 'and');
          });

        }
      }

      manager.addAttribute(attribute);

    }
  }
  getViewByName (name) {
    return _.cloneDeep(container.get('$quartz.views').find(item => {
      return item.name === name
    }))
  }

  mergeWithBase (name, attributeName, attribute) {
    if (!attribute.include) {
      return attribute
    }

    let parts = attribute.include.split(".");

    let viewName = parts[0]  + '-resource';

    let view = this.getViewByName(viewName);

    attribute = _.merge(_.get(view.config.options, parts.slice(1)), attribute)

    return attribute;
  }

  newApiByUrl(url) {
    let api = new ResourceApi();
    api.resource_url = url;

    return api;
  }

  findAttributeByName (dataName, attributeName) {
    let data = this.getDataByName(dataName);

    if (!data) {
      throw `Cannot find data with name ${dataName}`
    }

    return _.find(data.attributes, attribute => {
      return attribute.name === attributeName
    })
  }

  findRelationByName (dataName, relationName) {
    let data = this.getDataByName(dataName);

    if (!data) {
      throw `Cannot find data with name ${dataName}`
    }

    return _.find(data.relations, attribute => {
      return attribute.key === relationName
    })
  }


  getDataByName (name) {
    return container.get('$quartz.data').find((item) => {
      return item.name === name;
    })
  }
};
