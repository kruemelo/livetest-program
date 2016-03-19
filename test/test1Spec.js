;(function () {

  const path = require('path');
  const assert = require('chai').assert;
  const tmpdir = require('os').tmpdir();

  console.log(
    'process.cwd: %s, __dirname: %s, __filename: %s',
    process.cwd(), __dirname, __filename
  );

  const program = require(path.join(__dirname, '../livetest-program'));


  describe('test 1', function () {

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

          testWindow.location.assign(`file://${testPath}/test1.html`);

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


    it('should click', (done) => {

      assert.strictEqual($('#result').text(), '', 'result text should be empty');

      program(this, 3000)
        .wait(1000)
        .click('#btn-clickme')
        .wait(500)
        .capture(path.join(tmpdir, 'livetest-program.clicktest.png'))
        .run(function () {
          assert.strictEqual($('#result').text(), 'yay!', 'result text should have value');
          done();
        });
    }); // click


  }); // describe test 1 

}());