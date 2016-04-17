import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  bandName: attr(),
  day: attr(),
  time: attr(),
  stageName: attr(),
  title: attr()
});
