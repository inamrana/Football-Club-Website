const mongoose = require('mongoose');

const pendingRegistrationSchema = mongoose.Schema({
    full_name: { type: String, required: true },
    age: { type: Number, required: true },
    guardian: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    experience: { type: String }
}, {
    timestamps: true
});

const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema);
module.exports = PendingRegistration;
