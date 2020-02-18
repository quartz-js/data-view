import { ResourceApi, container } from '@quartz/core'

export class AdminApi extends ResourceApi {

    index () {
      return this.get("/")
    }
};
