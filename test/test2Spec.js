;(function () {

  const path = require('path');
  const assert = require('chai').assert;
  const tmpdir = require('os').tmpdir();

  const program = require(path.join(__dirname, '../livetest-program'));


  describe('test 2', function () {

    var testWindow, 
      $,
      testPath;

    before(function (done) {

      program(this, 3000)
        .do(function (next) {

          // test window context is available now
          testWindow = this.getTestWindow();

          this.log('test filename "%s"', this.getTestFilename());
          
          testPath = path.dirname(this.getTestFilename());
          this.log('test path "%s"', testPath);

          testWindow.location.assign(`file://${testPath}/test2.html`);

          this.await(
            () => {
              return testWindow.$;
            },
            () => {
              // test windows jquery is available now
              $ = this.getJQuery();
              next();
            }
          );
        })
        .run(done);
    }); // before


    it('should type', (done) => {

      assert.strictEqual($('#text').val(), '', 'text should be empty');

      program(this, 5000)
        .type('#text', 'foo bar baz')
        .capture(path.join(tmpdir, 'livetest-program.typetest.png'))
        .do(function (next) {
          assert.strictEqual($('#text').val(), 'foo bar baz', 'text should have value');
          next();
        })
        .run(done);
    }); // type


  }); // describe test 1 

}());