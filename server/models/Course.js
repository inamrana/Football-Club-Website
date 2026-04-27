const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    coach: { type: String, default: 'Aftab Iqbal' },
    fee: { type: Number, required: true },
    schedule: {
        days: { type: [String], default: [] },
        startTime: { type: String, default: '' },
        endTime: { type: String, default: '' },
        venue: { type: String, default: '' }
    },
    capacity: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
