import Ember from 'ember';
import $ from 'jquery';

export default Ember.Controller.extend({
  queryParams: ['selectedStage'],
  selectedStage: '',
  //sortProps: ['sortableTime','stageName'],
  //sortedEvents: Ember.computed.sort('model.events', 'sortProps'),
  filteredEvents: Ember.computed('model','model.events','selectedStage',function(){
    var events = this.get('model.events');
    var selectedStage = this.get('selectedStage');
    if(selectedStage.trim() === ''){
      return events;
    }else{
      return events.filter(event => event.get('stageName') === selectedStage);
    }
  }),
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

