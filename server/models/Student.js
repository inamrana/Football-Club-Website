const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    full_name: { type: String, required: true },
    age: { type: Number, required: true },
    guardian: { type: String, required: true },
    contact: { type: String, required: true },     // phone number
    email: { type: String, default: '' },           // email for notifications
    experience: { type: String, default: 'None' },
    course: { type: String, default: 'General' },   // which course/batch
    courseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    paid: { type: Boolean, default: false },
    feeAmount: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
