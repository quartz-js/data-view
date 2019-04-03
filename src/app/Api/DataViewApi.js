import { ResourceApi, container } from '@railken/quartz-core'

export class DataViewApi extends ResourceApi {
    resource_url = '/admin/data-views';

    admin () {
      return this.get(container.get('config').app.api.url + "/admin", { headers: { Authorization: 'Bearer ' + this.access_token }})
    }
};
