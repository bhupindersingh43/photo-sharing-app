const mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: "User id can't be empty",
    },
    title: {
        type: String,
        required: "Title can't be empty",
        maxlength: [30, 'Title should be 30 characters atmost']
    },
    description: {
        type: String,
        required: "Description can't be empty"
    },
    photo: {
        type: String,
        required: 'Photo can\'t be empty'
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    saltSecret: String
});

module.exports = mongoose.model('Photo', photoSchema);