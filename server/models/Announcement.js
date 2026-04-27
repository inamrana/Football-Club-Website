const mongoose = require('mongoose');

const announcementSchema = mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
    broadcastEmail: { type: Boolean, default: false },
    emailsSent: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
