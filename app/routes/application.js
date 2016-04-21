import Ember from 'ember';

const { inject } = Ember;

export default Ember.Route.extend({

  myShows: inject.service(),

  afterModel() {
    console.log("A S D EFF");
  },

  model(params) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve) {
      _this.store.query('event', params).then(function(allEvents) {
        console.log("events -----------", allEvents);
        var data = {
          thursday: {
            id: 'thursday',
            events: [],
            stages: [],
            friendlyName: "Thursday"
          },
          friday: {
            id: 'friday',
            events: [],
            stages: [],
            friendlyName: "Friday"
          },
          saturday: {
            id: 'saturday',
            events: [],
            stages: [],
            friendlyName: "Saturday"
          },
          allEvents: allEvents
        }
        allEvents.forEach(function(event){
          data[event.get('day')].events.push(event);
          if(event.get('stageName').trim() !== ''){
            data[event.get('day')].stages.push(event.get('stageName'));
          }
        });
        data.thursday.events = data.thursday.events.sortBy('sortableTime','stageName');
        data.friday.events = data.friday.events.sortBy('sortableTime','stageName');
        data.saturday.events = data.saturday.events.sortBy('sortableTime','stageName');
        data.thursday.stages = data.thursday.stages.uniq().sort();
        data.friday.stages = data.friday.stages.uniq().sort();
        data.saturday.stages = data.saturday.stages.uniq().sort();
        data.thursday = Ember.Object.create(data.thursday);
        data.friday = Ember.Object.create(data.friday);
        data.saturday = Ember.Object.create(data.saturday);
        resolve(data);
      });
    });
  }

});
