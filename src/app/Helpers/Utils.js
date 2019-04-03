export class Utils {
  static nameToComponent(name){
    return _.upperFirst(_.camelCase(name.replace(/\./g, '-')))
  }
}