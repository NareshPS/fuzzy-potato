export const wobject = {
  props: ['name'],

  template: `
  <div :name="name" class="wobject" cname="wobject">
    {{name}}
  </div>
  `
}