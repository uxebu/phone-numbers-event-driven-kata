describe 'test env' (void) -> # we need void, so LiveScript wont hijack `it`
  it 'works' ->
    expect 1 .toBe 1


EventEmitter = require 'events' .EventEmitter

class PhoneNumberSource extends EventEmitter
  (phoneNumbers) ->
    @_phoneNumbers = phoneNumbers
  start: ->
    emitPhoneNumber = (phoneNumber) ~>
      setTimeout ~>
        @emit 'new-phone-number', phoneNumber
      , 1

    @_phoneNumbers.forEach emitPhoneNumber

class PhoneNumberSink extends EventEmitter
  (source) ->
    @_source = source
    @_handleSourceEvents()


  _handleSourceEvents: ->
    @_counts = 0;
    @_source.on 'new-phone-number', ~>
      @_counts++
      @emit 'update-count', @_counts




expectPhoneNumbers = (expectedNumbers, done) ->
  source = new PhoneNumberSource(expectedNumbers);
  actualNumbers = [];
  source.on 'new-phone-number', (phoneNumber) ->
    actualNumbers.push(phoneNumber);
    if actualNumbers.length == expectedNumbers.length
      expect actualNumbers .toEqual expectedNumbers
      done()
  source.start()

describe 'phone number source' (void) ->
  describe 'should emit one number' (void) ->
    it '123', (done) ->
      initialNumbers = [123]
      expectPhoneNumbers initialNumbers, done
    it '456', (done) ->
      initialNumbers = [456]
      expectPhoneNumbers initialNumbers, done

  describe 'should emit two numbers' (void) ->
    it '123, 456', (done) ->
      initialNumbers = [123, 456]
      expectPhoneNumbers initialNumbers, done

describe 'phone number sink' (void) ->
  it 'should count one number', (done) ->
    initialNumbers = [123];
    source = new PhoneNumberSource(initialNumbers);
    sink = new PhoneNumberSink(source);
    source.start()
    sink.on 'update-count', (count) ->
      expect(count).toBe(1);
      done()

  it 'should count two number', (done) ->
    initialNumbers = [123, 456];
    source = new PhoneNumberSource(initialNumbers);
    sink = new PhoneNumberSink(source);
    source.start()
    sink.on 'update-count', (count) ->
      if count == 2
        expect(count).toBe(2);
        done()
