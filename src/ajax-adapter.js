import ajax from "./ajax";

export default class AjaxAdapter {

  constructor(options) {
    this._base = (options && options.base) || "";
  };

  create(store, type, partial, options) {

    if (!store._types[type]) {
      throw new Error(`Unknown type '${type}'`);
    }

    var option_headers = options.headers;
              if (!option_headers){
                  option_headers = { "Content-Type": "application/vnd.api+json" }
              }else{
                  option_headers["Content-Type"] = "application/vnd.api+json";
              }

    let source = ajax({
      body: JSON.stringify({
        data: store.convert(type, partial)
      }),
      crossDomain: true,
      headers: option_headers,// {"Content-Type": "application/vnd.api+json"},
      method: "POST",
      responseType: "auto",
      url: this._getUrl(type, null, options)
    }).do(e => store.push(e.response))
      .map(e => store.find(e.response.data.type, e.response.data.id))
      .publish();

    source.connect();

    return source;

  }

  destroy(store, type, id, options) {

    if (!store._types[type]) {
      throw new Error(`Unknown type '${type}'`);
    }

    var option_headers = options.headers;
              if (!option_headers){
                  option_headers = { "Content-Type": "application/vnd.api+json" }
              }else{
                  option_headers["Content-Type"] = "application/vnd.api+json";
              }

    let source = ajax({
      crossDomain: true,
      headers: option_headers, //{"Content-Type": "application/vnd.api+json"},
      method: "DELETE",
      responseType: "auto",
      url: this._getUrl(type, id, options)
    }).do(() => store.remove(type, id))
      .publish();

    source.connect();

    return source;

  }

  load(store, type, id, options) {

    if (id && typeof id === "object") {
      return this.load(store, type, null, id);
    }

    if (!store._types[type]) {
      throw new Error(`Unknown type '${type}'`);
    }

    var option_headers = options.headers;
              if (!option_headers){
                  option_headers = { "Content-Type": "application/vnd.api+json" }
              }else{
                  option_headers["Content-Type"] = "application/vnd.api+json";
              }
    let source = ajax({
      crossDomain: true,
      headers: option_headers,// {"Content-Type": "application/vnd.api+json"},
      method: "GET",
      responseType: "auto",
      url: this._getUrl(type, id, options)
    }).do(e => store.push(e.response))
      .map(function(){
            return id ? {links:store._links, meta: store._meta, data: store.find(type, id)} : {links:store._links, meta:store._meta, data: store.findAll(type)}
            })
      .publish();

    source.connect();

    return source;

  }

  update(store, type, id, partial, options) {

    if (!store._types[type]) {
      throw new Error(`Unknown type '${type}'`);
    }

    let data = store.convert(type, id, partial);

    var option_headers = options.headers;
              if (!option_headers){
                  option_headers = { "Content-Type": "application/vnd.api+json" }
              }else{
                  option_headers["Content-Type"] = "application/vnd.api+json";
              }

    let source = ajax({
      body: JSON.stringify({
        data: data
      }),
      crossDomain: true,
      headers: option_headers, //{"Content-Type": "application/vnd.api+json"},
      method: "PATCH",
      responseType: "auto",
      url: this._getUrl(type, id, options)
    }).do(() => store.add(data))
      .map(() => store.find(type, id))
      .publish();

    source.connect();

    return source;

  }

  _getUrl(type, id, options) {

    let params = [];
    let url = id ? `${this._base}/${type}/${id}` : `${this._base}/${type}`;

    if (options) {

      if (options.fields) {
        Object.keys(options.fields).forEach(field => {
          options[`fields[${field}]`] = options.fields[field];
        });
        delete options.fields;
      }

      params = Object.keys(options).map(key => {
        return key + "=" + encodeURIComponent(options[key]);
      }).sort();

      if (params.length) {
        url = `${url}?${params.join("&")}`;
      }

    }

    return url;

  }

}
