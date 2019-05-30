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

    try {

      item.config.options.components && this.resolveAttributes(manager, item.config.options.data, item.config.options.components);


      this.resolveAllRelations(manager);
    } catch (e) {
      if (e instanceof DataViewError) {
        throw new DataViewError(`[View:${item.name}] ` + e.message);
      }

      throw e;
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
        throw new DataViewError(`Undefined element at key: ${attributeName}. ${JSON.stringify(attributesSelected)}`)
      }

      if (!attributeSelected.name) {
       throw new DataViewError(`Missing property name in ${name}:${attributeName}. ${JSON.stringify(attributesSelected)}`)
      }

      if (attributeSelected.type === 'attribute') {
        this.resolveAttribute(name, attributeName, attributeSelected, manager);
      }

      if (attributeSelected.type === 'relation') {
        this.resolveRelation(name, attributeName, attributeSelected, manager);
      }
    }
  }

  resolveAttribute(name, attributeName, attributeSelected, manager)
  {
      let attributeSchema = this.findAttributeByName(name, attributeSelected.name)

      if (!attributeSchema) {
        throw new DataViewError(`Cannot find Attribute in Schema ${name}:${attributeSelected.name}`)
      }

      let attrClass = container.get('$quartz.attributes')[attributeSchema.type]
      
      if (!attrClass) {
        throw new DataViewError(`Cannot find Javascript Attribute Class ${name}:${attributeSchema.type}`)
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
        this.resolveEnum(name, attribute, attributeSchema, attributeSelected, manager);
      }

      if (attributeSchema.type === 'BelongsTo' || attributeSchema.type === 'MorphTo') {
        this.resolveBelongsTo(name, attribute, attributeSchema, attributeSelected, manager);
      }
      manager.addAttribute(attribute);
  }

  resolveRelation(name, relationName, attributeSelected, manager)
  {
      let relationSchema = this.findRelationByName(name, attributeSelected.name);

      if (!relationSchema) {
        throw new DataViewError(`Cannot find Relation in Schema ${name}:${attributeSelected.name}`)
      }

      let attrClass = container.get('$quartz.attributes')[relationSchema.type]
      
      if (!attrClass) {
        throw new DataViewError(`Cannot find Javascript Attribute Class ${name}:${relationSchema.type}`)
      }

      if (relationSchema.type === 'MorphToMany' || relationSchema.type === 'BelongsToMany') {

        if (!relationSchema.intermediate) {
          return;
        }

        let scopes = _.clone(relationSchema.scope.slice(1));

        let view = this.getViewByName(`${relationSchema.data}-resource`);

        let include = [];


        let params = [];

        var queriesSearcher = scopes.filter(scope => {
          return scope.column.split(".").length === 1;

        }).map(scope => {
          return `${scope.column} ${scope.operator} "${scope.value}"`
        })

        var queriesPersister = scopes.filter(scope => {
          return scope.column.split(".").length === 2;

        }).map(scope => {

          scope.column = scope.column.split(".")[1]

          params[scope.column] = scope.value;

          return `${scope.column} ${scope.operator} "${scope.value}"`
        })

        let apiSearcher = this.newApiByUrl(view.config.options.api).setFilterQuery(function (query) {
          let queries = _.clone(queriesSearcher)
          queries.push(query);

          return Helper.mergePartsQuery(queries, 'and');
        });

        let apiPersister = this.newApiByUrl(this.getViewByName(`${relationSchema.intermediate}-resource`).config.options.api).setFilterQuery(function (query) {

          let queries = _.clone(queriesPersister)
          queries.push(query);

          return Helper.mergePartsQuery(queries, 'and');
        }).setParams(params);


        let attribute = new attrClass(relationName, apiSearcher, apiPersister)
          .set('relationId', relationSchema.relatedPivotKey)
          .set('relationName', relationSchema.relatedPivotKey.replace("_id", ""))
          .set('morphTypeColumn', relationSchema.scope[0].column)
          .set('morphKeyColumn', relationSchema.scope[0].column.replace("_type", "_id"))
          .set('morphTypeValue', relationSchema.scope[0].value)
          .set('fillable', true)
          .set('style', _.merge({extends: attributeSelected.extends}, attributeSelected.options))

          manager.addAttribute(attribute);
      }
  }
  resolveAllRelations (manager) {
    this.getDataByName(manager.name).relations.map(relation => {
      if (relation.type === 'HasOne' || relation.type === 'MorphOne' || relation.type === 'MorphToMany'  || relation.type === 'BelongsToMany') {
        manager.addHook('include', (includes) => {
          includes.push(relation.key);
          return Promise.resolve(includes)
        })
      }
    });
  }

  resolveEnum(name, attribute, attributeSchema, attributeSelected, manager)
  {
    attribute.setOptions(attributeSchema.options.map(item => { 
      return {
        label: item,
        value: item
      }
    }))
  }

  resolveBelongsTo(name, attribute, attributeSchema, attributeSelected, manager)
  {
    if (manager.descriptor.tree && manager.descriptor.tree.parent === attribute.column) {
      if (attribute.fixed(null) === undefined) {
        attribute.set('fixed', () => {
          return null;
        });
      }
    }

    let relation = this.findRelationByName(name, attributeSchema.relation);
    let relationKey = attributeSchema.descriptor.relation_key;


    // NO Data has been attached to this
    if (!attributeSelected.options) {
    }

    if (!relation) {
      throw new DataViewError(`Cannot find relation by name: ${name}:${attributeSchema.relation}`)
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

    attribute.addHook('include', (includes) => {
      includes.push(attributeSchema.relation)
      return Promise.resolve(includes)
    })

    attribute.addHook('beforePersist', (params) => {
      delete params[attribute.getRelationName()]
      return Promise.resolve(params)
    })

    attribute.addHook('watchToReload', (params) => {
      params.push(relationKey)

      return Promise.resolve(params)
    }) 
    
    keys.map(key => {


      if (!attributeSelected.options[key]) {
        throw new DataViewError(`Cannot find options with key ${key}. You should probably update the data-view`)
      }

      let actions = _.map(attributeSelected.options[key].actions, action => {
        return `data-view-${action}`
      })

      let view = this.getViewByName(`${key}-resource`);

      attribute.addRelationable({
        key: key,
        manager: (resource) => {
          return this.createManager(view)
        },
        actions: actions,
        onLoad: (t) => {
          for (let attrKey in attributeSchema.descriptor.constraint) {

            let attrVal = attributeSchema.descriptor.constraint[attrKey];

            if (attrVal) {
              t.getAttribute(attrKey).set('fixed', (resource) => {
                return {id: attrVal}
              });
            }
          }
        }
      })
    });
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


  getDataByName (name) {
    let data = container.get('$quartz.data').find((item) => {
      return item.name === name;
    })

    if (!data) {
      throw new DataViewError(`Cannot find data with name ${dataName}`)
    }

    return _.cloneDeep(data);
  }
};
