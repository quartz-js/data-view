import { ResourceApi, container } from '@railken/quartz-core'
import Vue from 'vue'

export class DataViewApi extends ResourceApi {
    resource_url = '/admin/data-views';

    admin () {
      return Vue.http.get(container.get('config').app.api.url + "/admin", { headers: { Authorization: 'Bearer ' + this.access_token }})
    }
};
