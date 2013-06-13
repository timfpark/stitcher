var async = require('async')
  , config = require('./config')
  , exec = require('child_process').exec
  , fs = require('fs')
  , nitrogen = require('nitrogen');

var user = new nitrogen.User({ local_id: 'user', email: "timfpark@gmail.com", password: "[euro4sure]" });

var service = new nitrogen.Service(config);
service.authenticate(user, function(err, session, user) {

    if (err) return console.log('failed to connect user: ' + err);

    // search for all sunset images from camera, sorted in oldest to newest
    nitrogen.Message.find(session, { from: "51b11460446230d078000007", type: 'image' }, /*{ ts: 1 },*/ function(err, images) {
        if (err) return console.log('finding images to stitch failed: ' + err);

        async.eachLimit(images, 50, function(image, callback) {
            nitrogen.Blob.get(session, image.body.url, function(err, resp, blob) {
                if (err) return console.log('downloading image ' + image.id + ' failed.');
                var filename = 'images/' + image.ts.getTime() + '.png';
                fs.writeFile(filename, blob, 'binary', function(err) {
                    if (err) return console.log('saving image failed');

                    console.log(filename + ' downloaded.');
                    callback(err);
                })

            });
        }, function (err) {
            if (err) return console.log('failed to download all images, bailing.');

            console.log('images downloaded successfully.');
            //var createVideoCommand = "ffmpeg -f image2 -r 30 -pattern_type glob -i 'images/*.png' -c:v libx264 out.mp4";
            //exec(createVideoCommand, function (err, stdout, stderr) {
            //    if (err) return console.log('failed to build video.');
            //});

        });
    });

});
