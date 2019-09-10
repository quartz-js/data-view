import { ManagerResolver } from '../Resolvers/ManagerResolver'
import { AttributeResolver } from '../Resolvers/AttributeResolver'
import { EnumResolver } from '../Resolvers/EnumResolver'
import { TabsResolver } from '../Resolvers/TabsResolver'
import { ComponentResolver } from '../Resolvers/ComponentResolver'
import { RelationResolver } from '../Resolvers/RelationResolver'
import { EagerLoadingResolver } from '../Resolvers/EagerLoadingResolver'
import { DataViewError } from '../Errors/DataViewError'
import { Interceptor } from '@quartz/core'


export class DataResolver {

  constructor() {
    this.resolvers = [
      new ManagerResolver,
      new ComponentResolver,
      new AttributeResolver,
      new TabsResolver,
      new EagerLoadingResolver
    ]
  }

  createManager (item, options) {
    let data = {
      view: item,
      options: options
    };

    try {
      this.resolvers.map(resolver => {

        data = resolver.resolve(data)
      })
    } catch (e) {
      if (e instanceof DataViewError) {
        throw e;
      }

      throw e;
    }

    data = Interceptor.resolve('managerOnCreate', {
      manager: data.manager,
      view: data.view
    })

    return data.manager;
  }
};
