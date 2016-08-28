var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require('./models/comment');
var data = [{
    name: 'Silent Hill',
    imageURL: 'https://media-cdn.tripadvisor.com/media/photo-s/06/d9/cf/e5/buck-hill-campground.jpg',
    description: 'Etenim si attendere diligenter, existimare vere de omni hac causa volueritis, sic constituetis, iudices, nec descensurum quemquam ad hanc accusationem fuisse, cui, utrum vellet, liceret, nec, cum descendisset, quicquam habiturum spei fuisse, nisi alicuius intolerabili libidine et nimis acerbo odio niteretur. Sed ego Atratino, humanissimo atque optimo adulescenti meo necessario, ignosco, qui habet excusationem vel pietatis vel necessitatis vel aetatis. Si voluit accusare, pietati tribuo, si iussus est, necessitati, si speravit aliquid, pueritiae. Ceteris non modo nihil ignoscendum, sed etiam acriter est resistendum.'
}, {
    name: 'Crazy Forest',
    imageURL: 'http://www.nationalparks.nsw.gov.au/~/media/D97B5C772FB44716B8CD3E5289685B96.ashx',
    description: 'Etenim si attendere diligenter, existimare vere de omni hac causa volueritis, sic constituetis, iudices, nec descensurum quemquam ad hanc accusationem fuisse, cui, utrum vellet, liceret, nec, cum descendisset, quicquam habiturum spei fuisse, nisi alicuius intolerabili libidine et nimis acerbo odio niteretur. Sed ego Atratino, humanissimo atque optimo adulescenti meo necessario, ignosco, qui habet excusationem vel pietatis vel necessitatis vel aetatis. Si voluit accusare, pietati tribuo, si iussus est, necessitati, si speravit aliquid, pueritiae. Ceteris non modo nihil ignoscendum, sed etiam acriter est resistendum.'
}, {
    name: 'River Dale',
    imageURL: 'http://i1.trekearth.com/photos/116437/sage_hill.jpg',
    description: 'Etenim si attendere diligenter, existimare vere de omni hac causa volueritis, sic constituetis, iudices, nec descensurum quemquam ad hanc accusationem fuisse, cui, utrum vellet, liceret, nec, cum descendisset, quicquam habiturum spei fuisse, nisi alicuius intolerabili libidine et nimis acerbo odio niteretur. Sed ego Atratino, humanissimo atque optimo adulescenti meo necessario, ignosco, qui habet excusationem vel pietatis vel necessitatis vel aetatis. Si voluit accusare, pietati tribuo, si iussus est, necessitati, si speravit aliquid, pueritiae. Ceteris non modo nihil ignoscendum, sed etiam acriter est resistendum.'
}, ]

function seedDB() {
    Campground.remove({}, function(err) {
        if (err) {
            console.log('Removed all campgrounds')
        } else {
            data.forEach(function(seed) {
                Campground.create(seed, function(err, campground) {
                    if (err) {
                        console.log('Could not create the following campground:');
                        console.log(seed);
                    } else {
                        console.log('The following campground has been correctly added:');
                        console.log(campground);
                        campground.comments = [];
                        // Comment.create({
                        //     text: 'This place is greate but I wish there was internet.',
                        //     author: 'Homer'
                        // }, function(err, comment){
                        //     if(err){
                        //         console.log('Could not create comment.');
                        //     } else {
                        //         campground.comments.push(comment);
                        //         campground.save();
                        //         console.log('Created new comment and associated it to campground.');
                        //     }
                        // });
                    }
                });
            });
        }
    });
};

module.exports = seedDB;
