import Ember from 'ember';

export default Ember.Controller.extend({
  sortProps: ['sortableTime','stageName'],
  sortedEvents: Ember.computed.sort('model.events', 'sortProps'),
  actions: {
    chooseTalk(event) {
      let talkId = $(event.target).closest('li').data('talk-id');
      if (talkId && event.target.nodeName !== 'BUTTON') {
        this.transitionToRoute('day.talk', this.get('model.id'), talkId);
      }else{
        console.log('skipping!');
      }
    }
  }
});

