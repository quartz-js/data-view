import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'

export class EagerLoadingResolver extends Resolver
{
  resolve (data) {

    let manager = data.manager;

    data.components.filter(i => i.view && i.view.options).map(i => {
      return i.view.options.include
    }).filter(i => i).map(include => {

      manager.hook.add('include', (includes) => {
        includes = _.clone(includes)

        includes.push(include);
        return Promise.resolve(includes)
      })

    });

    return data;
  }
}