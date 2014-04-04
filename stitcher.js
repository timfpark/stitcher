var async = require('async')
  , config = require('./config')
  , exec = require('child_process').exec
  , fs = require('fs')
  , nitrogen = require('nitrogen');

var user = new nitrogen.User({
    nickname: 'user',
    email: process.env.NITROGEN_EMAIL,
    password: process.env.NITROGEN_PASSWORD
});

var service = new nitrogen.Service(config);
service.authenticate(user, function(err, session, user) {

    if (err) return console.log('failed to connect user: ' + err);

    // search for all sunset images from camera, sorted in oldest to newest
    nitrogen.Message.find(session, { from: "52c33da4b77d9aac07000025", type: 'image', tags: 'sunset-1' }, {}, function(err, images) {
        if (err) return console.log('finding images to stitch failed: ' + err);

        async.eachLimit(images, 10, function(image, callback) {
            var filename = 'images/' + image.ts.getTime() + '.jpg';

            if (!fs.existsSync(filename)) {
                nitrogen.Blob.get(session, image.body.url, function(err, resp, blob) {
                    if (err) return callback(err);

                    fs.writeFile(filename, blob, 'binary', function(err) {
                        if (err) return console.log('saving image failed');

                        console.log(filename + ' downloaded.');
                        callback();
                    });
                });
            } else {
                console.log(filename + ' already downloaded.');
                callback();
            }
        }, function (err) {
            if (err) return console.log('failed to download all images, bailing.');

            console.log('images downloaded successfully.');
            var createVideoCommand = "ffmpeg -f image2 -r 20 -pattern_type glob -i 'images/*.jpg' -c:v libx264 timelapse.mp4";
            exec(createVideoCommand, function (err, stdout, stderr) {
                if (err) return console.log('failed to build video.');
                console.log('created video');
            });
        });
    });

});
