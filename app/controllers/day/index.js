import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
  queryParams: ['selectedStage'],
  selectedStage: '',
  sortProps: ['sortableTime','stageName'],
  sortedEvents: Ember.computed.sort('model.events', 'sortProps'),
  actions: {
    chooseTalk(event) {
      let talkId = $(event.target).closest('li').data('talk-id');
      console.log('talkId = ', talkId);
      if (talkId && event.target.nodeName !== 'BUTTON') {
        this.transitionToRoute('day.event', this.get('model.id'), talkId);
      }else{
        console.log('skipping!');
      }
    }
  }
});

