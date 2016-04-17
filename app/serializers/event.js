//import JSONAPISerializer from 'ember-data/serializers/json-api';

//export default JSONAPISerializer.extend({
//});

import DS from 'ember-data';
import {
  extractSingle as parseSingle,
  extractArray as parseArray
} from "nmf-schedule/extractors/event";

export default DS.RESTSerializer.extend({

  normalizeSingleResponse(store, type, payload, id, requestType) {
    console.log('running extractSingle');
    payload = parseSingle(payload);

    this.extractMeta(store, type, payload);

    return this._super(store, type, payload, id, requestType);
  },

  normalizeArrayResponse(store, type, payload, id, requestType) {
    console.log('running normalizeArrayResponse');
    payload = parseArray(payload);
    console.log("payload ---------");
    console.log(payload);
    this.extractMeta(store, type, payload, id, requestType);

    var returnValue = this._super(store, type, payload, id, requestType);
    console.log("-----------");
    console.log(returnValue);
    return returnValue;
  }

});
