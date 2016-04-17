import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    console.log('in day', params);
    var dayId = params.dayId;
    console.log('dayId = ', dayId);
    var day = {
      id: dayId,
      events: this.modelFor('application').filter(event => event.get('day') === dayId)
    };
    return day;
  }
});
