import { AttributeResolver } from './AttributeResolver'

export class EnumResolver extends AttributeResolver
{
  resolveAttribute (data, attribute) {

    if (attribute.schema.type !== 'Enum') {
      return attribute;
    } 

    attribute.instance.setOptions(attribute.schema.options.map(item => { 
      return {
        label: item,
        value: item
      }
    }))

    return attribute
  }
}