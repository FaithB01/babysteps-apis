const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { 
        type: String, 
        enum: ["pregnant user", "non-pregnant-user","postnatal", "doctor"], 
        required: true 
    },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);




