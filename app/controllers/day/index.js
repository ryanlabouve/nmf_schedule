import Ember from 'ember';
import $ from 'jquery';

const { inject } = Ember;

export default Ember.Controller.extend({
  myShows: inject.service(),
  queryParams: ['selectedStage'],
  selectedStage: '',
  columns: [100],
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
    addShow(show) {
      debugger;
      const myShows = this.get('myShows');
      myShows.addShow(show);
    },
    chooseTalk(event) {
      let talkId = $(event.target).closest('li').data('talk-id');
      console.log('talkId = ', talkId);
      if (talkId && event.target.nodeName !== 'BUTTON') {
        this.transitionToRoute('day.event', this.get('model.id'), talkId);
      }else{
        console.log('skipping!');
      }
    },
    scrollChange(left, top){
      this.setProperties({
        scrollTop: top,
        scrollLeft: left
      });
    }
  }
});

