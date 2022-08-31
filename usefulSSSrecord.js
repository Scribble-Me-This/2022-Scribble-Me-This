Socket: <ref *1> Socket {
  nsp: 
  client: Client {
    sockets: Map(1) { 'cpYm3swToGEXlHqiAAAB' => [Circular *1] },
    nsps: Map(1) { '/' => [Circular *1] },
    server: Server {
    },
    conn: Socket {
    },
    encoder: Encoder {},
    decoder: Decoder { _callbacks: [Object] },
    id: 'LfVcLuvb6gtBHiClAAAA',
    onclose: [Function: bound onclose],
    ondata: [Function: bound ondata],
    onerror: [Function: bound onerror],
    ondecoded: [Function: bound ondecoded],
    connectTimeout: undefined
  },
  data: {},
  connected: true,
  acks: Map(0) {},
  fns: [],
  flags: {},
  server: <ref *3> Server {
    opts: { cors: [Object] },
    eio: Server {
      _events: [Object: null prototype],
      _eventsCount: 1,
      _maxListeners: undefined,
      clients: [Object],
      clientsCount: 1,
      opts: [Object],
      corsMiddleware: [Function: corsMiddleware],
      ws: [WebSocketServer],
      [Symbol(kCapture)]: false
    },
    httpServer: Server {
    },
    engine: Server {
      _events: [Object: null prototype],
      _eventsCount: 1,
      _maxListeners: undefined,
      clients: [Object],
      clientsCount: 1,
      opts: [Object],
      corsMiddleware: [Function: corsMiddleware],
      ws: [WebSocketServer],
      [Symbol(kCapture)]: false
    },
    [Symbol(kCapture)]: false
  },
  adapter: <ref *4> Adapter {
    _events: [Object: null prototype] {},
    _eventsCount: 0,
    _maxListeners: undefined,
    nsp: <ref *2> Namespace {
      _events: [Object: null prototype],
      _eventsCount: 1,
      _maxListeners: undefined,
      sockets: [Map],
      _fns: [],
      _ids: 0,
      server: [Server],
      name: '/',
      adapter: [Circular *4],
      [Symbol(kCapture)]: false
    },
    rooms: Map(1) { 'cpYm3swToGEXlHqiAAAB' => [Set] },
    sids: Map(1) { 'cpYm3swToGEXlHqiAAAB' => [Set] },
    encoder: Encoder {},
    [Symbol(kCapture)]: false
  },
  id: 'cpYm3swToGEXlHqiAAAB',
  handshake: {
    headers: {
    },
    time: 'Tue Aug 30 2022 16:05:06 GMT-0700 (Pacific Daylight Time)',
    address: '::1',
    xdomain: false,
    secure: false,
    issued: 1661900706608,
    url: '/socket.io/?EIO=4&transport=polling&t=OBn05B1',
    query: [Object: null prototype] {
      EIO: '4',
      transport: 'polling',
      t: 'OBn05B1'
    },
    auth: {}
  },
  [Symbol(kCapture)]: false
} has connected