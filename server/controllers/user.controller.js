const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = require('../models/user.model');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            //res.send(doc);
            res.status(200).json({ status: true, user : _.pick(doc,['fullName','email']) });
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        console.log(err)

        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res, next);
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','fullName','email', 'profilePhoto']) });
        }
    );
}

module.exports.userProfileUpdate = (req, res, next) => {
    let data = {fullName: req.body.fullNam};
    
    if (req?.file?.hasOwnProperty('filename'))
    {
        data['profilePhoto'] = '/profile-photos/' + req.file.filename;
    }

    User.updateOne({_id: req.body.id},
        {$set: data},
        (err, response) => {
        if (!response)
            return res.status(404).json({ status: false, message: 'Something went wrong' });
        else
            return res.status(200).json({ status: true, message: 'User Profile updated'});
    });
}