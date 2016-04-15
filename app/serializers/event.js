//import JSONAPISerializer from 'ember-data/serializers/json-api';

//export default JSONAPISerializer.extend({
//});

import DS from 'ember-data';
import {
  extractSingle as parseSingle,
  extractArray as parseArray
} from "nmf-schedule/extractors/event";

export default DS.RESTSerializer.extend({

  extractSingle(store, type, payload, id) {
    console.log('running extractSingle');
    payload = parseSingle(payload);

    this.extractMeta(store, type, payload);

    return this._super(store, type, payload, id);
  },

  extractArray(store, type, payload) {
    console.log('running extractArray');
    payload = parseArray(payload);

    this.extractMeta(store, type, payload);

    return this._super(store, type, payload);
  }

});
