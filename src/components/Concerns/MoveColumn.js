import { Sortable } from '@shopify/draggable'
import { Yaml } from '../../app/Yaml'

export var MoveColumn = {
  methods: {
    loadMove () {
      const drg = new Sortable(this.$refs.headerRow, {
        draggable: 'td',
        handle: '.btn-move-column',
        mirror: {
          yAxis: false,
          constrainDimensions: true,
        }
      });

      drg.on('sortable:stop', (e) => {
        e.oldIndex != e.newIndex && this.moveColumn(e.oldIndex-1, e.newIndex-1)
      });
    },

    moveColumn(oldIndex, newIndex) {

      let i = 0;

      let calls = this.manager.attributes.filter((attr) => {
        return attr.canShow();
      }).map((attr) => {
        let sort = i++
        let viewId = attr.view.local.id
        let view = Object.values(this.$container.get('data-view').getViewById(viewId))[0]
        
        let config = view.config

        if (!config.options) {
          config.options = {}
        }

        if (sort === oldIndex) {
          sort = newIndex
        } else if (sort === newIndex) {
          sort = oldIndex
        }


        if (config.options.sort !== sort) {
          config.options.sort = sort
          attr.sort = sort

          let api = this.$container.get('data-view').newApiByName('data-view');

          this.$container.get('data-view').updateViewByName(view.name, config)
          
          return api.update(viewId, {
            config: Yaml.put(view.raw, 'options.sort', sort)
          });
        }
      })

      this.manager.sortAttributes()
      bus.$emit(this.manager.resourceEvent("reload"), null);
    }
  },
}