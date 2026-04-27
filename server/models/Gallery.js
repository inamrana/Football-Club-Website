const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    sizeClass: { type: String, default: 'normal', enum: ['normal', 'large', 'wide', 'tall'] }
}, {
    timestamps: true
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
