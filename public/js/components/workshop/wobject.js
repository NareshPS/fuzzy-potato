export const wobject = {
  props: ['id', 'name', 'value'],
  methods: {
    
  },

  template: `
  <div :id="id" :name="name" class="wobject">
    {{name}}
  </div>
  `
}