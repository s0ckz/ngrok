var os = require('os');
var fs = require('fs');
var tar = require('tar.gz');
var Zip = require('decompress-zip');
var request = require('request');

var cdn = process.env.NGROK_CDN_URL || 'https://bin.equinox.io';
var bins = {
	darwinia32:	cdn + '/c/6raCnPaTf2c/ngrok-beta-darwin-386.zip',
	darwinx64:	cdn + '/c/6raCnPaTf2c/ngrok-beta-darwin-amd64.zip',
	linuxarm:	cdn + '/c/6raCnPaTf2c/ngrok-beta-linux-arm.tgz',
	linuxia32:	cdn + '/c/6raCnPaTf2c/ngrok-beta-linux-386.tgz',
	linuxx64:	cdn + '/c/6raCnPaTf2c/ngrok-beta-linux-amd64.tgz',
	win32ia32:	cdn + '/c/6raCnPaTf2c/ngrok-beta-windows-386.zip',
	win32x64:	cdn + '/c/6raCnPaTf2c/ngrok-beta-windows-amd64.zip',
	freebsdia32:	cdn + '/c/6raCnPaTf2c/ngrok-beta-freebsd-386.tgz',
	freebsdx64:	cdn + '/c/6raCnPaTf2c/ngrok-beta-freebsd-amd64.tgz'
};

var arch = os.platform() + os.arch();
var hostedFile = bins[arch];

if (!hostedFile) {
	console.error('ngrok - platform ' + arch + ' is not supported.');
	process.exit(1);
}

var isZip = /.zip$/.test(hostedFile);
var localPath = __dirname + '/bin/';
var localFile = localPath + (isZip ? 'ngrok.zip' : 'ngrok.tar');

console.log('ngrok - downloading binary ' + hostedFile + ' ...');

request
	.get(hostedFile)
	.pipe(fs.createWriteStream(localFile))
	.on('finish', function() {
		console.log('ngrok - binary downloaded...');
		extract();
	})
	.on('error', function(e) {
		console.error('ngrok - error downloading binary.', e);
		process.exit(1);
	});

function extract() {
	isZip ?
		new Zip(localFile).extract({path: localPath})
			.once('error', error)
			.once('extract', finish) :
		tar().extract(localFile, localPath, function(err) {
			if (err) return error(err);
			finish();
		});
}

function finish() {
	var suffix = os.platform() === 'win32' ? '.exe' : '';
	if (suffix === '.exe')
		fs.writeFileSync(localPath + 'ngrok.cmd', 'ngrok.exe');
	fs.unlinkSync(localFile);
	var target = localPath + 'ngrok' + suffix;
	fs.chmodSync(target, 0755);
	if (!fs.existsSync(target) || fs.statSync(target).size <= 0)
		return error(new Error('corrupted file ' + target));
	console.log('ngrok - binary unpacked.');
	process.exit(0);
}

function error(e) {
	console.error('ngrok - error unpacking binary', e);
	process.exit(1);
}
