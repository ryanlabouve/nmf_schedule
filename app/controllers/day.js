import Ember from 'ember';

export default Ember.Controller.extend({
  sortProps: ['sortableTime','stageName'],
  sortedEvents: Ember.computed.sort('model', 'sortProps')
});
