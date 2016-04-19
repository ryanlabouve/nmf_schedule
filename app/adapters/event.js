//import ApplicationAdapter from './application';

//export default ApplicationAdapter.extend({
//});

import Ember from 'ember';
import DS from 'ember-data';
import config from 'nmf-schedule/config/environment';
import { isError, parentID } from 'nmf-schedule/extractors/event';

export default DS.RESTAdapter.extend({

  proxy: config.APP.CORS_PROXY,
  host: config.APP.NMF_HOST,

  find(store, type, id) {
    return new Ember.RSVP.Promise( (resolve, reject) => {

      var xhr = new XMLHttpRequest();

      console.log('buildUrl = ', this.buildUrl(`item?id=${id}`));
      console.log('id = ', id);
      xhr.open("GET", this.buildUrl(`item?id=${id}`), true);
      xhr.responseType = "document";

      var parent;

      xhr.onload = () => {
        if (isError(xhr.response)) {
          Ember.run(null, reject, "Not found");
        } else if(parent = parentID(xhr.response)) {
          Ember.run(null, resolve, this.find(store, type, parent));
        } else {
          Ember.run(null, resolve, xhr.response);
        }
      };

      xhr.onerror = () => Ember.run(null, reject, xhr.statusText);

      xhr.send();

    });
  },

  findAll(store, type) { this.findQuery(store, type); },

  query(store, type, query = {}) {
    console.log('starting query');
    return new Ember.RSVP.Promise( (resolve, reject) => {

      var xhr = new XMLHttpRequest();

      console.log('urlForQuery = ', this.urlForQuery(query));
      xhr.open("GET", this.urlForQuery(query), true);
      xhr.responseType = "document";
      console.log('set responseType');

      xhr.onload = () => {
        console.log('in onload');
        if (isError(xhr.response)) {
          console.log('isError', xhr.response);
          Ember.run(null, reject, "Not found");
        } else {
          console.log('in else');
          console.log(xhr.response);
          Ember.run(null, resolve, xhr.response);
        }
      };

      xhr.onerror = () => Ember.run(null, reject, xhr.statusText);
      console.log('starting xhr send');
      xhr.send();
      console.log('after xhr send');

    });
  },

  urlForQuery({ filter, page }) {
    console.log('calling urlForQuery', filter, page);
    var url;

    filter = filter || "schedule";

    switch (filter) {
      //case "front-page":
        //url = "news";
        //break;

      case "schedule":
        url = "schedule";
        break;

      //case "active":
        //url = "active";
        //break;

      //case "show-hn":
        //url = "show";
        //break;

      //case "ask-hn":
        //url = "ask";
        //break;

      //case "jobs":
        //url = "jobs";
        //break;

      default:
        throw "Unknown filter: " + filter;
    }

    if (page && filter === "latest") {
      url += `?next=${ encodeURIComponent(page) }`;
    } else if (page) {
      url += `?p=${ encodeURIComponent(page) }`;
    }

    return this.buildUrl(url);
  },

  buildUrl(path) {
    var parts = [];

    if (this.get("proxy")) {
      parts.push( this.get("proxy").replace(/\/$/, "") );
    }

    if (this.get("host")) {
      parts.push( this.get("host").replace(/\/$/, "") );
    }

    if (!parts.length) {
      parts.push("");
    }

    parts.push(path);

    return parts.join("/");
  },

});
