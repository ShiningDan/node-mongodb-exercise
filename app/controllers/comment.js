let Comment = require('../models/comment');

exports.save = function(req, res) {
    let _comment = req.body.comment;
    let comment = new Comment(_comment);
    let movieId = _comment.movie;

    comment.save(function(err, comment) {
        if (err) {
            console.log(err);
        }
        res.redirect('/movie/'+movieId);
    });
}