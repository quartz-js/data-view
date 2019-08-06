import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'
import { Helper, container } from '@quartz/core'
import _ from 'lodash'

export class RelationResolver extends Resolver
{
  resolve (data) {
    data.components.filter(attr => {
      return attr.view.type === 'relation'
    }).map((attr,key) => {
      data.components[key] = this.resolveRelation(data, attr)
    })

    return data
  }
  resolveRelation (data, attribute) {

    let relationName = attribute.name;
    let name = data.name;
    let manager = data.manager;
    let relationSchema = this.dictionary.findRelationByName(name, attribute.view.name);
    
    if (!relationSchema) {
      throw new DataViewError(`Cannot find Relation in Schema ${name}:${attribute.view.name}`)
    }

    if (relationSchema.type !== 'MorphToMany' && relationSchema.type === 'BelongsToMany') {
      return attribute
    }

    if (!relationSchema.intermediate) {
      return attribute;
    }

    let attrClass = container.get('$quartz.attributes')[relationSchema.type]
    
    if (!attrClass) {
      throw new DataViewError(`Cannot find Javascript Attribute Class ${name}:${relationSchema.type}`)
    }

    let scopes = _.clone(relationSchema.scope.slice(1));


    let view = this.dictionary.getViewByName(`${relationSchema.data}-resource`);

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

    let apiSearcher = this.dictionary.newApiByUrl(view.config.options.api).setFilterQuery(function (query) {
      let queries = _.clone(queriesSearcher)
      queries.push(query);

      return Helper.mergePartsQuery(queries, 'and');
    });

    let apiPersister = this.dictionary.newApiByUrl(this.dictionary.getViewByName(`${relationSchema.intermediate}-resource`).config.options.api).setFilterQuery(function (query) {

      let queries = _.clone(queriesPersister)
      queries.push(query);

      return Helper.mergePartsQuery(queries, 'and');
    }).setParams(params);

    attribute.instance = new attrClass(relationName, apiSearcher, apiPersister)
      .set('column', _.snakeCase(relationName))
      .set('relationId', relationSchema.relatedPivotKey)
      .set('relationName', relationSchema.relatedPivotKey.replace("_id", ""))
      .set('morphTypeColumn', relationSchema.scope[0] ? relationSchema.scope[0].column : null)
      .set('morphTypeValue', relationSchema.scope[0] ? relationSchema.scope[0].value : null)
      .set('morphKeyColumn', relationSchema.foreignPivotKey)
      .set('fillable', true)
      .set('style', _.merge({extends: attribute.view.extends}, attribute.view.options))

    manager.addAttribute(attribute.instance);

    attribute.view.options.label && attribute.instance.set('label', attribute.view.options.label);
    attribute.view.options.hide && attribute.instance.set('show', !attribute.view.options.hide);
    
    if (attribute.instance.style.include) {
      attribute.instance.addHook('include', (includes) => {
        includes.push(attribute.instance.style.include);
        return Promise.resolve(includes)
      })
    }

    let keys = [relationSchema.data]

    attribute.instance.setRelationableSwitcher(resource => {
      return relationSchema.data
    })

    keys.map(key => {

      if (attribute.view.options.query.include) {
        attribute.instance.addHook('include', (includes) => {
          includes.push(attribute.view.options.query.include.split(",").map(i => { return attribute.instance.name + "." + i}));
          return Promise.resolve(includes)
        })
      }

      attribute.instance.addRelationable({
        query: {
          include: attribute.view.options.query.include ? attribute.view.options.query.include.split(",") : [],
          template: attribute.view.options.query.template
        },
        label: {
          type: attribute.view.options.readable.type,
          template: attribute.view.options.readable.template
        },
        key: key,
        onLoad: (t) => {

        }
      })
    })

    return attribute;
  }
}