const mongoose = require('mongoose');
const _ = require('lodash');
const Photo = require('../models/photo.model');

// Create photo record
module.exports.create = (req, res, next) => {
    if(!req.file) {
        return res.status(500).send({ message: 'Upload fail'});
    }
    req.body.photo = '/shared/' + req.file.filename;
    var photo = new Photo();
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.user_id = req.body.user_id;
    photo.photo = req.body.photo;
    photo.save((err, doc) => {
        if (!err)
            res.status(200).json({ status: true });
        else {
            return next(err);
        }

    });
}

// Get all Photo records
module.exports.get = (req, res, next) => {
    Photo.find({},
        (err, data) => {
            if (!data)
                return res.status(404).json({ status: false, message: 'Photo record not found.' });
            else
                return res.status(200).json({ status: true, data: data });
        }
    ).sort({create_at: -1});
}

module.exports.delete = (req, res, next) => {
    Photo.deleteOne({ _id: req.params.id},
        (err, data) => {
            if (!data)
                return res.status(404).json({ status: false, message: 'Something went wrong' });
            else
                return res.status(200).json({ status: true });
        }
    );
}