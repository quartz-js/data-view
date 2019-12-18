import { Resolver } from './Resolver'
import { DataViewError } from '../Errors/DataViewError'

export class EagerLoadingResolver extends Resolver
{
  resolve (data) {
    let manager = data.manager;

    this.dictionary.getDataByName(manager.data).relations.map(relation => {
      if (relation.type === 'HasOne' || relation.type === 'MorphOne' || relation.type === 'MorphToMany' || relation.type === 'BelongsToMany') {
        manager.hook.add('include', (includes) => {
          includes = _.clone(includes)

          includes.push(relation.key);
          return Promise.resolve(includes)
        })
      }
    });

    return data;
  }
}