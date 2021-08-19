export const object = {
  props: ['data'],
  computed: {
    outputData() { return JSON.stringify(this.data)} },
  template: `
  <section class="error">
    <p>{{outputData}}</p>
  </section>
  `
}