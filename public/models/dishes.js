const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

let dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
      type: String,
      required: true
    },
    category: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required:true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },

    comments:[commentSchema]
}, {
    timestamps: true
});


let Dishes = mongoose.model('Dish', dishSchema);
let Comments = mongoose.model('Comments',commentSchema);

module.exports = Dishes;
