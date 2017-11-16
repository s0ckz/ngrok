var ngrok = require('..');
var sinon = require('sinon');
var util = require('./util');

describe('guest.eventemitter.spec.js - ensuring no authtoken set, using ngrok as event emitter', function ( ) {

	before(function(done) {
		ngrok.kill(function() {
			util.removeAuthtoken();
			done();
		});
	});

	describe('connecting to ngrok', function ( ) {
		var connected, tunnelUrl, webAddrUrl;
		var handleStatusChange = sinon.spy();

		before(function(done) {
			ngrok.once('connect', function (url, uiUrl) {
				connected = true;
				tunnelUrl = url;
				webAddrUrl = uiUrl;
				done();
			});
			ngrok.on('statuschange', handleStatusChange);
			ngrok.connect();
		});

		it('should fire "connect" event', function ( ) {
			expect(connected).to.be.true;
		});

		it('should pass tunnel url with a "connect" event', function ( ) {
			expect(tunnelUrl).to.match(/https:\/\/.(.*).ngrok.io/);
		});

		it('should pass web ui url with a "connect" event', function ( ) {
			expect(webAddrUrl).to.match(/^http:\/\/127\.0\.0\.1:4040$/);
		});

		it('should fire a "statuschange" event', function () {
			expect(handleStatusChange.calledTwice).to.be.true;
			expect(handleStatusChange.firstCall.args[0]).to.equal('starting');
			expect(handleStatusChange.secondCall.args[0]).to.equal('online');
		});
	});

	describe('disconnecting from ngrok', function ( ) {
		var disconnected;
		before(function(done){
			ngrok.once('disconnect', function ( ) {
				disconnected = true;
				done();
			});
			ngrok.disconnect();
		});
		it('should fire "disconnect" event', function ( ) {
			expect(disconnected).to.be.true;
		});
	});

	describe('connecting to ngrok with error', function(){
		var error;
		before(function(done){
			ngrok.once('error', function ( err ) {
				error = err;
				done();
			});
			ngrok.connect({proto: 'xxx'});
		});

		it('should fire error event', function(){
			expect(error).to.be.instanceof.Error;
		});
	});

});
