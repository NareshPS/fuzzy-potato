
/**
 * Visual Element
 */
 export const velement = {
  props: ['id', 'name'],
  template: `
  <div :id="id" :name="name" class="velement">
    {{name}}
    <sup class="float-right">visual</sup>
  </div>
  `
}