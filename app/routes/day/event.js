import Ember from 'ember';

export default Ember.Route.extend({
  model({eventId}) {
    let day = this.modelFor('day');
    console.log('eventId =', eventId);
    console.log('event = ', day.events.findBy('id', eventId));
    return day.events.findBy('id', eventId);
  }
});
