import Ember from 'ember';

const { computed } = Ember;

export default Ember.Service.extend({
  _shows: [],

  addShow(show) {
    const s = this.get('_shows');
    debugger;
  },

  shows: computed('_shows.[]', function() {
    return this.get('_shows');
  })
});
