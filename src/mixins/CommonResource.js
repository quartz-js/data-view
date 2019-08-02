import { Common } from '../mixins/Common'
import _ from 'lodash'

export var CommonResource = {
  mixins: [Common],
  created() {
    var t = this;

    bus.$on('data-view.updated', dataView => {
      
      if (!dataView || !this.view) {
        return;
      }

      if (this.view.name.includes(dataView.name)) {
        dataView = this.view;
      }

      if (dataView.id === this.view.id) {
        dataView.config = dataView.processed
        this.manager = null;
        setTimeout(() => {
          this.manager = this.newManagerByView(dataView);
        }, 1)
      }
    });
  }
}