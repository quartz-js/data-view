import { ResourceApi, container } from '@quartz/core'

export class DataViewApi extends ResourceApi {
    resource_url = '/admin/data-views';

    admin () {
      return this.get(container.get('config').app.api.url + "/admin", { headers: this.headers })
    }
};
