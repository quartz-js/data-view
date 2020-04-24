import _ from 'lodash'
import YAWN from 'yawn-yaml/cjs'

/**
 * Util class to read and update yaml
 */
export class Yaml
{

  /**
   * Retrieve on a defined path the value
   *
   * @param string yaml
   * @param string path
   *
   * @return mixed
   */
  static get (yaml, path) {
    return _.get(new YAWN(yaml).toJSON(), path)
  }

  /**
   * Update on a defined yaml path a new value
   *
   * @param string yaml
   * @param string path
   * @param mixed value
   *
   * @return string
   */
  static put (yaml, path, value) {
    let yawn = new YAWN(yaml);
    let json = yawn.toJSON()
    _.set(json, path, value)
    yawn.json = json
    return yawn.yaml
  }
}