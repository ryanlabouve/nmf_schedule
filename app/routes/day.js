import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    var dayId = params.dayId;
    var day = this.modelFor('application')[dayId];
    return day;
  }
});

