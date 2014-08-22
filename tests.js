var keyval = require('./keyval');
var expect = require('expect.js');

describe('keyval', function() {

  it('should do the correct stuff ;)', function() {
    var store = keyval();

    store.load();

    store.on('set:foo', function(val, key) {
      expect(key).to.be.equal('foo');
      expect(val).to.be.equal('bar');
    });

    store.set('foo', 'bar');

    expect(store.has('foo')).to.be.ok();
    expect(store.has('doesnotexist')).to.not.be.ok();

    store.on('remove:foo', function(val, key) {
      expect(key).to.be.equal('foo');
    });

    store.remove('foo');
    expect(store.has('foo')).to.not.be.ok();

  });
});