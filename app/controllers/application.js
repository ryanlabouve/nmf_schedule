import Ember from 'ember';

const {
  Controller,
  computed,
  inject: { service }
} = Ember;

export default Controller.extend({
  routing: service('-routing'),
  showArrow: computed.equal('routing.currentPath', 'day.event')
});
