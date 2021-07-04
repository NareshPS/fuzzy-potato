export const wtype = {
  components: {},
  props: ['name'],

  template: `
  <div :name="name" class="wtype" cname="wtype">
    {{name}}
  </div>
  `
}