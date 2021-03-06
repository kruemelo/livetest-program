
programmable livetest workflows when running mocha tests in nwjs window

## Install

```bash
npm i livetest-program --save-dev
```

## Usage

```bash
$ node node_modules/.bin/livetest
$ node livetest --config=./test/config.json
```

Press F5 in dev tools window to repeat all tests.

If you want to run multiple instances, add the `--user-data-dir` option to start nw with different profiles:

```bash
$ node livetest --user-data-dir=first-profile &
$ node livetest --user-data-dir=second-profile
```

## Test

```bash
$ npm test
```

## Mocha spec file usage

```
;(function () {

  const program = require('livetest-program');

  describe('...', function () {
    ...

    it('...', (done) => {

      assert.strictEqual($('#result').text(), '', 'result text should be empty');

      program(this, 5000)
        .await('#btn-clickme')
        .click('#btn-clickme')
        .wait(500)
        .capture('livetest-program.clicktest.png')
        .run(function () {
          assert.strictEqual($('#result').text(), 'yay!', 'result text should have value');
          done();
        });
    });
  });
}());

```

see test/*Spec.js files for working examples

## Config file

```
{
  "files": [
    "test/test1Spec.js",
    "./test/**/*Spec.js"
  ]
}
```

## API

### program(mochaTest[, timeout])

start program description

```
describe('suite', function () {

  it('test', (done) => {

    program(this, 5000)
      ...
      .run(done)
  });
});

```

also works in before():

```
describe('suite', function () {

  before((done) => {

    program(this)
      ...
      .run(done)
  });
});

```

### getTestFilename ()

returns the current test filename;

```
  program(mochaTest)
    .do(function (next) {
      this.log(this.getTestFilename());
      ..
```

### getTestWindow ()

returns the test window object

```
  program(mochaTest)
    .do(function (next) {
      var testWindow = this.getTestWindow();
      testWindow.$('body').empty();
      ..
```

### getMainWindow ()

returns the main window object

```
  program(mochaTest)
    .do(function (next) {
      this.getMainWindow().console.log(42);
      ..
```


### getNwWindow ()

returns the NW-Window Object

see [nw docs](http://docs.nwjs.io/en/v0.13.0-rc3/References/Window/)

### getConsole ()

get the main window console

```
  program(mochaTest).getConsole().log(42);

  program(mochaTest)
    .do(function (next) {
      this.getConsole().warn(43);
      ..  

```

### getJQuery ()

get the test window $

```
  const $ = program(mochaTest).getJQuery();

```


### wait (duration ms)

```
  program(mochaTest)
    .wait(500)
    .log('delayed')
    .run();
```

### await (predicate)
### await (selector)


```
  program(mochaTest)
    .await(function () {
      // if returns truthy, wait ends
      return $('.msgbox').length;
    })
    .log('message box element available now')
    .run();
```

with argument as a selector string
```
  program(mochaTest)
    .await('.controls .desired-classname')
    .log('desired element in controls is available now')
    .run();
```


### log ()
### warn ()
### error ()

```
  var n = 0;
  program(mochaTest)
    .log('message %d', ++n)
    .do(function (next) {
      this.log('message  %d', ++n);
      next();
    })
    .run();

  // => message 1
  // => message 2
```

### moveTo (x, y)
### resizeTo (width, height) {

position/resize main window

```
  program(mochaTest)
    .moveTo(0, 0)
    .resizeTo(50, 50)
    .wait(1000)
    .do(function (next) {
      this.moveTo(100, 100);
      this.resizeTo(420, 700);
      this.wait(100, next);
    })
    .run();
```

### capture (filename)

captures the page to png file

```
  program(mochaTest)
    .resizeTo(320, 240)
    .capture('/tmp/livetest-programm-xs.png')
    .wait(1000)
    .do(function (next) {
      this.resizeTo(1600, 800)
        .capture('/tmp/livetest-programm-xl.png')
        .wait(100, next);
    })
    .run();
```  

### on (eventName, selector, fn)
### one (eventName, selector, fn)

attach a handler to an event for the selector elements

```
  program(mochaTest)
    .on('click', '#btn-continue', function (ev) {
      triggered = true;
    })
```
Use one() to execute the handler at most once.

### trigger (selector, event)

trigger an event

```
  program(mochaTest)
    .trigger('#btn-continue', 'click')
```

### type (selector, text)

simulate typing a text

```
  program(mochaTest)
    .type('.email', 'my.email@example.com')
    .do(function (next) {
      this.type('.password', 'secret', next);
    })
    .run();
```  
when finished, this also triggers the 'change' event

### click (target)

simulate click

```
  program(mochaTest)
    .click('.reset')  // selector string
    .do(function (next) {
      this.click($('.send')); // jquery
      next();
    })
    .run();
```  

### run ([callback])

run the program


### exit ([callback])

early exit program execution

```
  program(mochaTest)
    .do(function (next) {
      this.exit(() => {
        this.log('bye');
      });
    })
    .run();
```  

## License
MIT &copy; [kruemelo](https://github.com/kruemelo)
