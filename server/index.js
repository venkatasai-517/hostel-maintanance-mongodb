const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StudentModel = require('./models/student_details.js');
const RoomModel = require('./models/fourroom.js');
const Threeshare = require('./models/thrible_share.js')
const Doubleshare = require('./models/double_share.js');
const Singleshare = require('./models/single_share.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

mongoose.connect('mongodb+srv://sai:Sai%4012345@rooms.ynehj8e.mongodb.net/hostel', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', (error) => console.error('Connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.delete('/delete-file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file');
        }
        console.log('File deleted successfully');
        return res.status(200).send('File deleted successfully');
    });
});
app.get('/', (req, res) => {
    res.send('Welcome to the Hostel API!');
});

app.post('/hostel/student', upload.single('student_img'), async (req, res) => {
    try {
        const { date, due_date, name, adhar_num, mobile_num, status, room_number, floor_number, price } = req.body;
        const studentImg = req.file ? req.file.filename : null;
        const newStudent = new StudentModel({
            date,
            due_date,
            name,
            adhar_num,
            mobile_num,
            status,
            room_number,
            floor_number,
            price,
            student_img: studentImg,
        });
        await newStudent.save();
        return res.status(200).send('Success');
    } catch (err) {
        console.error('Error saving student:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});

app.get('/hostel/students', async (req, res) => {
    try {
        const students = await StudentModel.find({});
        return res.status(200).json(students);
    } catch (err) {
        console.error('Error fetching students:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});


// DELETE endpoint to delete a student by ID
app.delete('/hostel/student/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStudent = await StudentModel.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        return res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});

app.put('/hostel/student/:id', upload.single('student_img'), async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.student_img = req.file.filename;
        }

        await StudentModel.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send('Student updated successfully');
    } catch (err) {
        console.error('Error updating student:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});



// Room endpoints
app.post('/hostel/room', upload.single('room_img'), async (req, res) => {
    try {
        const { date, name, status, room_number, floor_number, price, due_date } = req.body;
        const roomImg = req.file ? req.file.filename : null;
        const newRoom = new RoomModel({
            date,
            name,
            status,
            room_number,
            floor_number,
            price,
            room_img: roomImg,
            due_date
        });
        await newRoom.save();
        return res.status(200).send('Room added successfully');
    } catch (err) {
        console.error('Error saving room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.get('/hostel/rooms', async (req, res) => {
    try {
        const rooms = await RoomModel.find({});
        return res.status(200).json(rooms);
    } catch (err) {
        console.error('Error fetching rooms:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
// DELETE endpoint to delete a rooms by ID
app.delete('/hostel/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await RoomModel.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ error: 'Room not found' });
        }
        return res.status(200).json({ message: 'Room deleted successfully' });
    } catch (err) {
        console.error('Error deleting Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});

app.put('/hostel/rooms/:id', upload.single('room_img'), async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.room_img = req.file.filename;
        }

        await RoomModel.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send('Room updated successfully');
    } catch (err) {
        console.error('Error updating Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
//room3
app.post('/hostel/threeshare', upload.single('room_img'), async (req, res) => {
    try {
        const { date, name, status, room_number, floor_number, price, due_date } = req.body;
        const roomImg = req.file ? req.file.filename : null;
        const newRoom = new Threeshare({
            date,
            name,
            status,
            room_number,
            floor_number,
            price,
            room_img: roomImg,
            due_date
        });
        await newRoom.save();
        return res.status(200).send('3share added successfully');
    } catch (err) {
        console.error('Error saving room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.get('/hostel/threeshares', async (req, res) => {
    try {
        const rooms = await Threeshare.find({});
        return res.status(200).json(rooms);
    } catch (err) {
        console.error('Error fetching rooms:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.delete('/hostel/threeshares/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Threeshare.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ error: 'Threeshare not found' });
        }
        return res.status(200).json({ message: 'Threeshare deleted successfully' });
    } catch (err) {
        console.error('Error deleting Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});

app.put('/hostel/threeshares/:id', upload.single('room_img'), async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.room_img = req.file.filename;
        }

        await Threeshare.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send('Threeshare updated successfully');
    } catch (err) {
        console.error('Error updating Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.post('/hostel/doubleshare', upload.single('room_img'), async (req, res) => {
    try {
        const { date, name, status, room_number, floor_number, price, due_date } = req.body;
        const roomImg = req.file ? req.file.filename : null;
        const newRoom = new Doubleshare({
            date,
            name,
            status,
            room_number,
            floor_number,
            price,
            room_img: roomImg,
            due_date
        });
        await newRoom.save();
        return res.status(200).send('doubleshare added successfully');
    } catch (err) {
        console.error('Error saving room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.get('/hostel/doubleshares', async (req, res) => {
    try {
        const rooms = await Doubleshare.find({});
        return res.status(200).json(rooms);
    } catch (err) {
        console.error('Error fetching rooms:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.delete('/hostel/doubleshares/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Doubleshare.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ error: 'doubleshare not found' });
        }
        return res.status(200).json({ message: 'doubleshare deleted successfully' });
    } catch (err) {
        console.error('Error deleting Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.put('/hostel/doubleshares/:id', upload.single('room_img'), async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.room_img = req.file.filename;
        }

        await Doubleshare.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send('Doubleshare updated successfully');
    } catch (err) {
        console.error('Error updating Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.post('/hostel/singleshare', upload.single('room_img'), async (req, res) => {
    try {
        const { date, name, status, room_number, floor_number, price, due_date } = req.body;
        const roomImg = req.file ? req.file.filename : null;
        const newRoom = new Singleshare({
            date,
            name,
            status,
            room_number,
            floor_number,
            price,
            room_img: roomImg,
            due_date
        });
        await newRoom.save();
        return res.status(200).send('singleshare added successfully');
    } catch (err) {
        console.error('Error saving room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.get('/hostel/singleshares', async (req, res) => {
    try {
        const rooms = await Singleshare.find({});
        return res.status(200).json(rooms);
    } catch (err) {
        console.error('Error fetching rooms:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.delete('/hostel/singleshares/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Singleshare.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ error: 'singleshare not found' });
        }
        return res.status(200).json({ message: 'singleshare deleted successfully' });
    } catch (err) {
        console.error('Error deleting Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.put('/hostel/singleshares/:id', upload.single('room_img'), async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        if (req.file) {
            updateData.room_img = req.file.filename;
        }

        await Singleshare.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send('singleshare updated successfully');
    } catch (err) {
        console.error('Error updating Room:', err);
        return res.status(500).send(err.message || 'Internal Server Error');
    }
});
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});