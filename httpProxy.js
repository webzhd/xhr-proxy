//// 

function init() {


  class NewXHR { // 一个新的xhr类
    constructor() {
      this.nativeXhr = null;
      this.url = "";
      this.methods = "get"
      this.status = 0;
      this.statusText = "";
      this.readyState = 0;
      this.response = null;
      this.responseText = null;
      this.responseType = null;
      this.responseURL = null;
      this.responseXML = null;
      this.timeout = null;
      this.upload = null;
      this.onreadystatechange = function () { }; //readyState属性的值发生改变
      this.onloadstart = function () { }; // 程序开始加载时触发
      this.onprogress = function () { }; // 上传文件时，XMLHTTPRequest 实例对象本身和实例的upload属性，都有一个progress事件，会不断返回上传的进度
      this.onabort = function () { }; //当一个资源的加载已中止时，将触发 abort事件。
      this.onerror = function () { }; // 加载资源失败时触发
      this.onload = function () { }; // 资源加载完成时触发事件
      this.onloadend = function () { }; //abort、load和error这三个事件，会伴随一个loadend事件，表示请求结束，但不知道其是否成功。
      this.timeout = function () { }; // 超时

      this.init();

    }

    init() {
      console.log("init");

      if (!this.getFieldVal("skipXhr")) {
        this.nativeXhr = new proxyXHR.xhr();
      }
    }

    open(method, url) { // 用于初始化 XMLHttpRequest 实例对象， 指定 HTTP 请求的参数
      this.methods = method || "get";
      this.url = url || ""
      if (this.getFieldVal("skipXhr")) {
        return
      } else {

        this.nativeXhr.open(this.getRequestVal("_method") || this.methods, this.getRequestVal("_url") || this.url);

        // const headers = this.getFieldVal("headers");
        // Object.keys(headers).forEach(header => {

        //   this.nativeXhr.setRequestHeader(header, `${headers[header]}`)
        // })

        this.readyState = 1;
        this.onreadystatechange();
      }
    }


    send(sendData) { //用于实际发出 HTTP 请求
      if (this.getFieldVal("skipXhr")) {
        this.skipXhr();
      } else {
        this.nexNativeXhr(sendData);
      }
    }


    nexNativeXhr(sendData) {
      //Object.keys(this.getFieldVal("headers"))

      this.nativeXhr.onreadystatechange = () => {
        this.readyState = this.nativeXhr.readyState;
        if (this.readyState == 4) {
          this.setNewXhrAttribute()
        }
        this.onreadystatechange();
      }

      this.nativeXhr.onloadstart = () => {
        this.onloadstart();
      }

      this.nativeXhr.onload = () => {
        this.setNewXhrAttribute()
        this.onload();
      }

      this.nativeXhr.error = () => {
        this.onerror();
      }

      const send = this.getRequestVal("_body") || sendData;

      console.log(typeof sendData)

      let _bodyText;
      if (typeof send === 'string') {
        _bodyText = send
      } else if (typeof send === 'object') {
        _bodyText = JSON.stringify(send)
      }

      this.nativeXhr.send(_bodyText);
    }


    abort() { //用来终止已经发出的 HTTP 请求
      if (this.getFieldVal("skipXhr")) {
        return ""
      }
      this.nativeXhr.abort();


    }

    getAllResponseHeaders() {
      if (this.getFieldVal("skipXhr")) {
        return ""
      }
      this.nativeXhr.getAllResponseHeaders();
    }
    getResponseHeader(option) {
      if (this.getFieldVal("skipXhr")) {
        return ""
      }
      this.nativeXhr.getResponseHeader(option);
    }

    setRequestHeader(key, value) {
      if (this.getFieldVal("skipXhr")) {
        return ""
      }
      this.nativeXhr.setRequestHeader(key, value)
    }
    overrideMimeType(option) { // 用来指定 MIME 类型
      if (this.getFieldVal("skipXhr")) {
        return ""
      }
      this.nativeXhr.overrideMimeType(option)
    }


    skipXhr() {
      this.onloadstart();
      this.onprogress();
      this.status = this.getResponseVal("_status");
      this.statusText = "OK"
      this.readyState = 4;
      this.responseText = this.getResponseVal("_body")
      this.response = this.getResponseVal("_body")
      this.onreadystatechange();
      this.onload();
      this.onloadend();
    }
    setNewXhrAttribute() {
      this.status = this.getResponseVal("_status") || this.nativeXhr.status;
      if(this.status >= 500){
        this.onerror();
        throw new Error("500");
      }

      this.statusText = this.nativeXhr.statusText;
      this.responseText = this.getResponseVal("_body") || this.nativeXhr.responseText;
      this.response = this.getResponseVal("_body") || this.nativeXhr.response;
    }



    getSetSingleOption() { // 获取单个url的设置项，有则options，没有则返回 false
      return (!!proxyXHR.setSingle[`${this.url}-|-${this.methods.toLowerCase()}`]) ?
        proxyXHR.setSingle[`${this.url}-|-${this.methods.toLowerCase()}`] : false
    }

    getFieldVal(key) { // isSkipXhr跳过ajax  // neglectSet忽略设置
      let arg = this.getSetSingleOption();

      return !!arg && arg[key] ;
    }

    getRequestVal(key) {
      let arg = this.getSetSingleOption();
      if(!arg)return false
      let bl = this.getFieldVal("neglectSet");
      return bl ? false: this.getSetSingleOption()["request"][key]
    }

    getResponseVal(key){
      let arg = this.getSetSingleOption();
      if(!arg)return false
      let bl = this.getFieldVal("neglectSet");
      return bl ? false: this.getSetSingleOption()["response"][key]
    }
  }

  class Request {
    constructor() {
      this._url = null;
      this._method = null;
      this._headers = null
      this._body = null

      this.setHeaders = this.setHeaders.bind(this);
      this.setBody = this.setBody.bind(this);
      this.setMethod = this.setMethod.bind(this);
      this.setUrl = this.setUrl.bind(this);
    }


    setUrl(url) {
      this._url = url;
    }

    setMethod(method) {
      this._method = method;
    }

    setHeaders(data) {
      this._headers = data;
    }

    setBody(data) {
      this._body = data;
    }
  }
  class Response {
    constructor() {
      this._headers = null
      this._status = null
      this._readyState = null
      this._body = null

      this.send = this.send.bind(this);
      this.setHeaders = this.setHeaders.bind(this);
      this.setStatus = this.setStatus.bind(this);
      this.setBody = this.setBody.bind(this);
      this.setReadyState = this.setReadyState.bind(this);

    }

    send(data) {
      this.setBody(data)
    }
    setHeaders(headers) {
      this._headers = headers
    }
    setStatus(status) {
      this._status = status
    }
    setBody(data) {
      this._body = data;
    }
    setReadyState(readyState) {
      this._readyState = readyState
    }
  }

  class ProxyXHR {// 一些api
    constructor() {
      this.xhr = window.XMLHttpRequest;
      this.fetch = window.fetch
      this.setAll = null;
      this.setSingle = {};
      this.observer = {
        observe(){}
      }

      this.get = this.get.bind(this);
      this.start = this.start.bind(this);
      this.destroy = this.destroy.bind(this);

    }

    start() {
      window.XMLHttpRequest = NewXHR;
      this.isAnterceptorsDom = true;
      this.observerResource();
      fetchPolyfill();
    }

    destroy() {
      window.XMLHttpRequest = this.xhr;
      window.fetch = this.fetch;
      this.setSingle = {};
      this.observer = {
        observe(){}
      }
    }
    interceptors(option, callback){
      let {url, method} = option;
      this.setSingle[`${url}-|-${method.toLowerCase()}`] = {
        request: new Request(),
        response: new Response(),
        callback
      }
    }

    get(url, callback) {
      this.setSingle[`${url}-|-get`] = {
        request: new Request(),
        response: new Response(),
        isSkipXhr: false,
        neglectSet: false
      }
      this.setSingle[`${url}-|-get`].next = function(){
        this.neglectSet = true;
      }.bind(this.setSingle[`${url}-|-get`]);
      this.setSingle[`${url}-|-get`].skip = function(){
        this.isSkipXhr = true;
      }.bind(this.setSingle[`${url}-|-get`]);

      let {request, response, next, skip} = this.setSingle[`${url}-|-get`]

      callback(request, response, next, skip);

      //console.log(this.setSingle[`${url}-|-get`])
    }

    post(url, callback) {
      this.setSingle[`${url}-|-post`] = {
        request: new Request(),
        response: new Response(),
        isSkipXhr: false,
        neglectSet: false
      }

      this.setSingle[`${url}-|-post`].next = function(){
        this.neglectSet = true;
      }.bind(this.setSingle[`${url}-|-post`]);
      this.setSingle[`${url}-|-post`].skip = function(){
        this.isSkipXhr = true;
      }.bind(this.setSingle[`${url}-|-post`]);

      let {request, response, next, skip} = this.setSingle[`${url}-|-post`]

      callback(request, response, next, skip);

      //console.log(this.setSingle[`${url}-|-post`])

    }


    observerResource(){
      let that = this;
      this.observer = new MutationObserver(function (mutations, observer) {
        mutations.forEach((mutation) => {
          const target = mutation.addedNodes[0];
          if(!target) return 
          const src = target.src;
          if(!src) return;
          Object.keys(that.setSingle).forEach(item=>{
            if(item.endsWith("get")){
              const arr = item.split("-|-");
              const url = arr[0];
              console.log(src, url)
              if(src.indexOf(url) !== -1){
                const info = that.setSingle[item];
                if(info){
                  if(info.neglectSet)return
                  target.src = info.response._body || info.request._url || src;
                }
                
              }

            }
          })


        })
      })
      const options = {
        'childList': true,
        'attributes': true,
        'subtree': true
      }

      this.observer.observe(document, options)
    }
    /**
     * arg <object>, key为标签属性名，value为回调函数，参数为目标元素
     */
    // observerDom(arg) {
    //   this.domSet = arg;
    //   let { domSet } = this;
    //   const that = this;
    //   var observer = new MutationObserver(function (mutations, observer) {
    //     mutations.forEach(function (mutation) {
    //       const target = mutation.addedNodes[0];
    //       if (!that.isAnterceptorsDom) return;
    //       if (!target) return;
    //       if (!(domSet instanceof Object)) {
    //         console.error('参数应该为一个对象')
    //       }
    //       Object.keys(domSet).forEach(k => {
    //         if (target.nodeName.toLowerCase() === k.toLowerCase()) {
    //           if (!(domSet[k] instanceof Function)) {
    //             console.error(`参数属性${k}的值不是一个function`)
    //           }
    //           domSet[k](target)
    //         }
    //       })

    //     });
    //   });

    //   var options = {
    //     'childList': true,
    //     'attributes': true,
    //     'subtree': true
    //   }

    //   observer.observe(document, options)

    // }

  }



  window.proxyXHR = new ProxyXHR();
}


init();

////// fetch polyfill
function fetchPolyfill() {
  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function () {
        try {
          new Blob()
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function (obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function () {
        var value = items.shift()
        return { done: value === undefined, value: value }
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue + ', ' + value : value
  }

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function (name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function () {
    var items = []
    this.forEach(function (value, name) {
      items.push(name)
    })
    return iteratorFor(items)
  }

  Headers.prototype.values = function () {
    var items = []
    this.forEach(function (value) {
      items.push(value)
    })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function () {
    var items = []
    this.forEach(function (value, name) {
      items.push([name, value])
    })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result)
      }
      reader.onerror = function () {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function (body) {
      if (typeof body === 'object') {
        body = JSON.stringify(body)
      }
      this._bodyInit = body;
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function () {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode)
      }
    }

    this.json = function () {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      this.signal = input.signal
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'same-origin'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.signal = options.signal || this.signal
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body
      .trim()
      .split('&')
      .forEach(function (bytes) {
        if (bytes) {
          var split = bytes.split('=')
          var name = split.shift().replace(/\+/g, ' ')
          var value = split.join('=').replace(/\+/g, ' ')
          form.append(decodeURIComponent(name), decodeURIComponent(value))
        }
      })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' })
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, { status: status, headers: { location: url } })
  }

  var DOMException = self.DOMException
  try {
    new DOMException()
  } catch (err) {
    DOMException = function (message, name) {
      this.message = message
      this.name = name
      var error = Error(message)
      this.stack = error.stack
    }
    DOMException.prototype = Object.create(Error.prototype)
    DOMException.prototype.constructor = DOMException
  }

  function fetch(input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init)

      if (request.signal && request.signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest()

      function abortXhr() {
        xhr.abort()
      }

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'))
      }

      xhr.onabort = function () {
        reject(new DOMException('Aborted', 'AbortError'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value)
      })

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr)

        xhr.onreadystatechange = function () {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr)
          }
        }
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }

  fetch.polyfill = true

  window.fetch = fetch
  window.Headers = Headers
  window.Request = Request
  window.Response = Response

}




