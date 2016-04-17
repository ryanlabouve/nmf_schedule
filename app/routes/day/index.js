import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    selectedStage: {
      refreshModel: true
    }
  },
  model(params){
    var day = this.modelFor('day');
    var events = day.get('events');
    if(params.selectedStage){
      events = events.filter(event => event.get('stageName') === params.selectedStage)
    }
    var newDay = Ember.Object.create({
      id: day.get('id'),
      events: events,
      stages: day.get('stages')
    });
    return newDay;
  }
});
