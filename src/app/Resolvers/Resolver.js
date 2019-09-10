import { Dictionary } from '../Services/Dictionary'
import { container } from '@quartz/core'

export class Resolver
{
  constructor()
  {
    this.dictionary = container.get('data-view')
  }

  
}