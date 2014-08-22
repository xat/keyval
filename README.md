# keyval.js

evented key/value storage lib.

## Usage

```javascript

var keyval = require('keyval');

// storage can be 'local', 'session' or 'memory' (default)
// ..or you can specify your own storage function

var store = keyval({ storage: 'local' });

store.set('foo', 'bar');

// writes the data to the
// storage provider
store.save();

store.get('foo'); // => 'bar'

store.on('update:foo', function(newVal) {
    console.log(newVal); // => 'bar2'
});

store.set('foo', 'bar2');

store.on('remove:foo', function() {
    console.log('foo got removed');
});

store.remove('foo');

```

## Installation

### bower

```bower install keyval```


## License
Copyright (c) 2014 Simon Kusterer
Licensed under the MIT license.