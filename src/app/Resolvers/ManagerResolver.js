import { Resolver } from './Resolver'
import { Manager, Interceptor } from '@quartz/core'
import _ from 'lodash'

export class ManagerResolver extends Resolver
{
  resolve (data) {

    let view = data.view;
    let options = data.options;

    let manager = new Manager({
      name: view.config.label,
      data: view.config.options.data,
      route: view.config.label,
      manager: this.dictionary.newApiByUrl(view.config.options.api),
      icon: view.config.icon,
      descriptor: this.dictionary.getDataByName(view.config.options.data).descriptor,
      attributes: []
    });

    if (view.config.options.query) {
      manager.parserFinalQuery.push((query) => {
        return manager.mergePartsQuery([view.config.options.query, query], 'and');
      });
    }

    data.manager = manager;
    data.name = view.config.options.data;
    data.options = _.merge(options, {
      query: view.config.options.query
    })

    return data;
  }

}