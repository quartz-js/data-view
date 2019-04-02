import { container, Attributes, ResourceApi, Manager } from '@railken/quartz-core'

export class DataResolver {
  ini(data) {
    container.set('$quartz.data', data);
  }

  createManager (item) {
    let api = new ResourceApi();
    api.resource_url = '/admin/' + item.config.options.api;

    console.log(item.config.options);
    
    return new Manager({
      name: item.name,
      route: item.name,
      manager: api,
      icon: item.config.icon,
      attributes: this.resolveAttributes(item.config.options.data, item.config.options.fields)
    });
  }

  resolveAttributes(name, fields) {
    let data = this.getDataByName(name);

    let attributes = [];

    for (let i in data.attributes) {
      let attribute = data.attributes[i];
      let attrClass = Attributes[attribute.type];

      if (attrClass) {

        if (fields.indexOf(attribute.name) !== -1) {
          attributes.push(attribute);
        }
      } else {
        console.error(`Cannot find ${name}:${attribute.type}`)
      }
    }

    return attributes;

  }

  getDataByName (name) {
    return container.get('$quartz.data').find((item) => {
      return item.name === name;
    })
  }
};
