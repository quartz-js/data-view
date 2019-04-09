import { container, Attributes, ResourceApi, Manager } from '@railken/quartz-core'

export class DataResolver {
  ini(data) {
    container.set('$quartz.data', data);
  }

  createManager (item) {
    let api = new ResourceApi();
    api.resource_url = item.config.options.api;

    return new Manager({
      name: item.config.options.data,
      route: item.config.options.data,
      manager: api,
      icon: item.config.icon,
      attributes: item.config.options.attributes ? this.resolveAttributes(item.config.options.data, item.config.options.attributes) : []
    });
  }

  resolveAttributes(name, attributesSelected) {

    let attributes = [];

    for (let attributeName in attributesSelected) {
      let attributeSelected = attributesSelected[attributeName]

      let attributeSchema = this.findAttributeByName(name, attributeSelected.name)

      if (!attributeSchema) {

        console.error(`Cannot find Attribute in Schema ${name}:${attributeSelected.name}`)
      } else {

        console.log(Attributes);
        
        let attrClass = Attributes[attributeSchema.type];

        if (!attrClass) {

          console.error(`Cannot find Javascript Attribute Class ${name}:${attributeSchema.type}`)

        } else {
          let attribute = new attrClass(attributeName)
            .set('column', attributeSchema.name)
            .set('fillable', attributeSchema.fillable)
            .set('required', attributeSchema.required)
            .set('unique', attributeSchema.unique)

            console.log(attributeName);
            console.log(attributeSelected);
              
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
          
          attributes.push(attribute);
        }
      }
    }

    return attributes;

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


  getDataByName (name) {
    return container.get('$quartz.data').find((item) => {
      return item.name === name;
    })
  }
};
