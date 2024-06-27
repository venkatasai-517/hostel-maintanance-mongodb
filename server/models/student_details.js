const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    date: { type: String, required: true },
    due_date: { type: String, required: true },
    name: { type: String, required: true },
    adhar_num: { type: String, required: true },
    mobile_num: { type: String, required: true },
    status: { type: String, required: true },
    room_number: { type: Number, required: true },
    floor_number: { type: Number, required: true },
    price: { type: Number, required: true },
    student_img: { type: String, required: true },
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;