import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    var dayId = params.dayId;
    console.log('dayId = ', dayId);
    return this.modelFor('application').filter(event => event.get('day') === dayId);
  }
});
