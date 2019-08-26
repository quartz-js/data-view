export class Utils {
  static nameToComponent(name){
    name = "data-view-" + name
    return _.upperFirst(_.camelCase(name.replace(/\./g, '-')))
  }
}