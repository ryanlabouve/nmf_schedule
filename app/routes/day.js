import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    var dayId = params.dayId;
    var stages = [];
    var events = this.modelFor('application').filter(event =>{
      var stageName = event.get('stageName');
      if(stageName.trim() != '' && event.get('day') === dayId){
        stages.push(stageName);
      }
      return event.get('day') === dayId;
    });
    var day = Ember.Object.create({
      id: dayId,
      events: events,
      stages: stages.uniq().sort()
    });
    return day;
  }
});

