/* global describe, it */
var scissors = require('../scissors');
var promisify = require('stream-to-promise');
var fs = require('fs');
var Testfile = require('./testfile');

var pdf = __dirname + '/test_data/test.pdf';

// TODO: better result checks

describe('Scissors', function() {
  
  this.timeout(20000);
  
  // range() using stream events for async continuation
  describe('#range()', function() {
    it('should extract a range of pdf pages', function(done) {
      var testfile = new Testfile('range');
      scissors(pdf)
      .range(1,3)
      .pdfStream()
      .pipe(fs.createWriteStream(testfile.getPath()))
      .on('finish', function(){
        testfile.assertExists();
        //testfile.assertHasLength(3);
        testfile.remove();
        done();
      }).on('error',function(err){
        throw err;
      });
    });
  });

  // pages() with Promise
  describe('#pages()', function() {
    it('should extract pdf pages', function() {
      var testfile = new Testfile('pages');
      return promisify(scissors(pdf)
      .pages(1,3)
      .pdfStream().pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        //testfile.assertHasLength(2);
        testfile.remove();
      }).catch(function(err){
        throw err;
      });
    });
  });

  // odd() with Promise
  describe('#odd()', function() {
    it('should extract all odd pages', function() {
      var testfile = new Testfile('odd');
      return promisify(scissors(pdf)
      .odd()
      .pdfStream().pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        testfile.remove();
      }).catch(function(err){
        throw err;
      });
    });
  });

  // odd() with Promise
  describe('#even()', function() {
    it('should extract all odd pages', function() {
      var testfile = new Testfile('even');
      return promisify(scissors(pdf).even()
      .pdfStream().pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        testfile.remove();
      }).catch(function(err){
        throw err;
      });
    });
  });

  // reverse() with Promise
  describe('#reverse()', function() {
    it('should reverse the page order', function() {
      var testfile = new Testfile('reverse');
      return promisify(scissors(pdf).reverse()
      .pdfStream().pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        testfile.remove();
      })
    });
  });

  // chained commands
  describe('(chained commands)', function() {
    it('should execute a couple of chained commands', function() {
      var testfile = new Testfile('odd');
      return promisify(scissors(pdf)
      .reverse()
      .odd()
      .range(2,3)
      .pages(1)
      .pdfStream().pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        testfile.remove();
      }).catch(function(err){
        throw err;
      });
    });
  });

  // rotate
  describe('#rotate()', function() {
    it('should rotate the selected pages', function() {
      var testfile = new Testfile('rotate');
      return promisify(scissors(pdf)
      .range(1,3)
      .rotate(90)
      .pdfStream().pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        testfile.remove();
      })
    });
  });

  // compress
  describe('#compress()', function() {
    it('should compress the selected pages', function() {
      var testfile = new Testfile('compress');
      return promisify(scissors(pdf)
      .compress()
      .pdfStream()
      .pipe(fs.createWriteStream(testfile.getPath())))
      .then(function(){
        testfile.assertExists();
        testfile.remove();
      }).catch(function(err){
        throw err;
      });
    });
  });

  // decompress
  // describe('#uncompress()', function() {
  //   it('should uncompress the selected pages', function() {
  //     var infile  = new Testfile('compress');
  //     var outfile = new Testfile('uncompress');
  //     return promisify(scissors(infile.getPath())
  //     .uncompress()
  //     .pdfStream().pipe(fs.createWriteStream(outfile.getPath())))
  //     .then(function(){
  //       outfile.assertExists();
  //       //outfile.remove();
  //     }).catch(function(err){
  //       throw err;
  //     });
  //   });
  // });


});