describe('test env', function() {
  it('works', function() {
    expect(1).toBe(1);
  });
});

var EventEmitter = require('events').EventEmitter;
//var sleep = require('sleep').sleep;

function PhoneNumberSource(phoneNumbers) {
  this._phoneNumbers = phoneNumbers;
}
PhoneNumberSource.prototype = EventEmitter.prototype;
PhoneNumberSource.prototype.start = function() {
  var self = this;
  function emitPhoneNumber(phoneNumber) {
    setTimeout(function() {
      self.emit('new-phone-number', phoneNumber);
    }, 1);
  }

  this._phoneNumbers.forEach(emitPhoneNumber);
};

function PhoneNumberSink(source) {
  this._source = source;
  this._handleSourceEvents();
}
PhoneNumberSink.prototype = EventEmitter.prototype;
PhoneNumberSink.prototype._handleSourceEvents = function() {
  var self = this;
  this._counts = 0;
  this._source.on('new-phone-number', function() {
    self._counts++;
    self.emit('update-count', self._counts);
  });
};




function expectPhoneNumbers(expectedNumbers, done) {
  var source = new PhoneNumberSource(expectedNumbers);
  var actualNumbers = [];
  source.on('new-phone-number', function(phoneNumber) {
    actualNumbers.push(phoneNumber);
    if (actualNumbers.length == expectedNumbers.length) {
      expect(actualNumbers).toEqual(expectedNumbers);
      done();
    }
  });
  source.start();
}

describe('phone number source', function() {
  describe('should emit one number', function() {
    it('123', function(done) {
      var initialNumbers = [123];
      expectPhoneNumbers(initialNumbers, done);
    });
    it('456', function(done) {
      var initialNumbers = [456];
      expectPhoneNumbers(initialNumbers, done);
    });
  });
  describe('should emit two numbers', function() {
    it('123, 456', function(done) {
      var initialNumbers = [123, 456];
      expectPhoneNumbers(initialNumbers, done);
    });
  });
});

describe('phone number sink', function() {
  it('should count one number', function(done) {
    var initialNumbers = [123];
    var source = new PhoneNumberSource(initialNumbers);
    var sink = new PhoneNumberSink(source);
    source.start();
    sink.on('update-count', function(count) {
      expect(count).toBe(1);
      done();
    });
  });
  it('should count two number', function(done) {
    var initialNumbers = [123, 456];
    var source = new PhoneNumberSource(initialNumbers);
    var sink = new PhoneNumberSink(source);
    source.start();
    sink.on('update-count', function(count) {
      if (count == 2) {
        expect(count).toBe(2);
        done();
      }
    });
  });
});
