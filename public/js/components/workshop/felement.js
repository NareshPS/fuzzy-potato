export const felement = {
  props: ['id', 'name'],
  template: `
  <div :id="id" :name="name" class="felement">
    {{name}}
  </div>
  `
}