import Ember from 'ember';
import shortid from 'npm:shortid';
import config from '../config/environment';

var ivSeparator = '|',
    OUT = { direction: "out" },
    IN = { direction: "in" };

var host = window.location.hostname,
    protocolSuffix = window.location.protocol.replace(/^http/, '') + '//',
    port = config.QOTR_PORT ? ':' + config.QOTR_PORT : '',
    hostTemplate = protocolSuffix + host + port,
    wsPrefix = 'ws' + hostTemplate,
    httpPrefix = 'http' + hostTemplate;

var e64 = forge.util.encode64,
    d64 = forge.util.decode64;

function mkMessage() {
  var message = Ember.Object.create.apply(Ember.Object, arguments);
  message['is' + Ember.String.capitalize(message.kind)] = true;

  return message;
}

var fixtures = [
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Yo",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Nice",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "nice nice",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "nice ",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "This is so awesome.",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Yo",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Nice",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "nice nice",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "nice ",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "This is so awesome.",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Yo",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "This is so awesome.",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Test",
    "sender": "Me",
    "direction": "out",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Yo",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "Nice",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "nice nice",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "nice ",
    "sender": "test",
    "direction": "in",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "This is so awesome.",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "No?",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  },
  {
    "kind": "chat",
    "body": "I mean c'mon",
    "direction": "out",
    "sender": "Me",
    "isChat": true
  }
];


export default Ember.Object.extend({
  id: null,
  id_b64: null,
  nick: null,
  salt: null,
  password: null,
  socket: null,
  members: null,
  messages: null,

  init: function () {
    if (!this.id) {
      this.set('id', shortid.generate());
      this.set('salt', forge.random.getBytesSync(128));
      this.set('password', shortid.generate());
    }

    this.set('id_b64', e64(this.get('id')));
    this.set('members', Ember.A());
    this.set('messages', Ember.A());
    this.get('messages').pushObjects(fixtures);

    if (!this.get('nick')) {
      this.set('nick', shortid.generate());
    }
  },

  key: Ember.computed('salt', 'password', function () {
    return forge.pkcs5.pbkdf2(this.get('password'), this.get('salt'), 32, 32);
  }),

  start: function () {
    return Ember.$.post(httpPrefix + '/c/new', {
      id: this.id,
      salt: e64(this.salt),
      key_hash: this.get('key_hash')
    });
  },

  connect: function () {
    var socket = new WebSocket(wsPrefix + '/c/' + this.id),
        _this = this;
    this.socket = socket;
    this.socket.onmessage = function (event) {
        var message = JSON.parse(event.data);
        if (message.sender === null) {
          _this.onServerMessage(message);
        } else {
          _this.onFriendMessage(message);
    }};
  },

  encrypt: function (str) {
    var iv = forge.random.getBytesSync(32),
        cipher = forge.aes.startEncrypting(this.get('key'), iv),
        input = forge.util.createBuffer(str);
    cipher.update(input);
    cipher.finish();
    return [this.id, iv, cipher.output.data].map(e64).join(ivSeparator);
  },

  decrypt: function (str) {
    if (str.indexOf(this.id_b64) !== 0) {
      return str;
    }

    var byteArray = str.split(ivSeparator).map(d64),
        iv = byteArray[1],
        text = byteArray[2],
        ptext = forge.aes.startDecrypting(this.get('key'), iv),
        newBuffer = forge.util.createBuffer(text);

    ptext.update(newBuffer);
    ptext.finish();
    return ptext.output.data;
  },

  send: function (kind, body) {
    var message = {
      kind: kind,
      body: body
    };
    if (kind === 'chat') {
      this.messages.pushObject(mkMessage(message, OUT, { sender: "Me" }));
    }
    if (body !== null) {
      message.body = this.encrypt(message.body);
    }
    this.socket.send(JSON.stringify(message));
  },

  onServerMessage: function (message) {
    var that = this;

    switch(message.kind) {
    case "salt":
      this.set('salt', d64(message.body));
      this.send('join', this.get('nick'));
      break;
    case "join":
      that.send('members');
      break;
    case "members":
      this.set('members', Ember.A(message.body.map(function (nick) {
        nick = that.decrypt(nick);

        return {
          type: nick === that.nick ? "self":"friend",
          nick: nick
        };
      })));
      break;
    case "error":
      console.log("Error: " + message.body);
      break;
    }
  },

  onFriendMessage: function (message) {
    if (message.body) {
      message.body = this.decrypt(message.body);
    }

    message.sender = this.decrypt(message.sender);

    switch(message.kind) {
    case "join":
      this.send('members');
      this.messages.pushObject(Ember.Object.create(message, IN));
      break;
    case "part":
      this.messages.pushObject(Ember.Object.create(message, IN));
      this.send('members');
      break;
    case "chat":
      this.messages.pushObject(mkMessage(message, IN));
      break;
    case "nick":
      this.send('members');
      break;
    case "error":
      console.log("Error: " + message.body);
      break;
    }
  }
});
