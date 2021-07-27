export const errorsection = {
  computed: {
    benchError() {return this.$store.state.bench.error}
  },
  template: `
  <div class="errorsection">
    <p>{{benchError.message}}</p>
  </div>
  `
}