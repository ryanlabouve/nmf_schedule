import Ember from 'ember';

export default Ember.Route.extend({
  //queryParams: {
    //selectedStage: {
      //refreshModel: true
    //}
  //},
  model(params){
    console.log('calling the model hook', params);
    var day = this.modelFor('day');
    //var events = day.get('events');
    //console.log('events = ', events);
    //if(params.selectedStage){
      //events = events.filter(event => event.get('stageName') === params.selectedStage)
    //}
    //var newDay = Ember.Object.create({
      //id: day.get('id'),
      //events: events,
      //stages: day.get('stages'),
      //friendlyName: day.get('friendlyName')
    //});
    return day;
  }
});
