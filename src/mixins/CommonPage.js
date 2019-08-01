import { Common } from '../mixins/Common'
import _ from 'lodash'

export var CommonPage = {
  mixins: [Common],
  created() {
    var t = this;

    bus.$on('data-view.updated', dataView => {
      
      if (!dataView || !this.view) {
        return;
      }

      if (dataView.id === this.view.id) {

        dataView.config = dataView.processed

        this.view = dataView;
      }
    });
  }
}