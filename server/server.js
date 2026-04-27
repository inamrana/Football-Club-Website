require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');

const Admin = require('./models/Admin');
const Student = require('./models/Student');
const PendingRegistration = require('./models/PendingRegistration');
const Announcement = require('./models/Announcement');
const Gallery = require('./models/Gallery');
const Course = require('./models/Course');
const multer = require('multer');
const path = require('path');

const { protect } = require('./middleware/authMiddleware');
const { sendRegistrationNotification, sendWelcomeEmail, sendFeeConfirmationEmail, sendBroadcast } = require('./utils/sendEmail');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded images securely
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Connect Database
connectDB();

// Seed Default Admin
const seedAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            await Admin.create({ username: 'admin', password: 'SuperStarter@2024' });
            console.log('Default admin seeded.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};
seedAdmin();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- ROUTES ---

// 1. Auth Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change Password
app.put('/api/auth/change-password', protect, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const admin = await Admin.findById(req.admin._id);
        if (admin && (await admin.matchPassword(oldPassword))) {
            admin.password = newPassword;
            await admin.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid old password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Student Routes
// Public: Get all students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({}).sort({ createdAt: -1 });
        res.json({ data: students });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Add Student
app.post('/api/students', protect, async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Edit Student
app.put('/api/students/:id', protect, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Delete Student
app.delete('/api/students/:id', protect, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (student) {
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Toggle Paid Status
app.patch('/api/students/:id/toggle-paid', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            student.paid = !student.paid;
            await student.save();
            
            // Send email confirmation if marked as paid
            if (student.paid) {
                await sendFeeConfirmationEmail(student);
            }
            
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Registration Routes
// Public: Submit form
app.post('/api/register', async (req, res) => {
    try {
        const pending = await PendingRegistration.create(req.body);
        // Send email notification
        sendRegistrationNotification(req.body);
        res.status(201).json(pending);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get pending
app.get('/api/pending', protect, async (req, res) => {
    try {
        const pending = await PendingRegistration.find({}).sort({ createdAt: -1 });
        res.json({ data: pending });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Approve
app.post('/api/approve/:id', protect, async (req, res) => {
    try {
        const pending = await PendingRegistration.findById(req.params.id);
        if (pending) {
            // Find default course or assign to general
            const defaultCourse = await Course.findOne({ isActive: true });
            
            // Move to Students
            const studentData = {
                full_name: pending.full_name,
                age: pending.age,
                guardian: pending.guardian,
                contact: pending.contact,
                email: pending.email,
                experience: pending.experience,
                paid: false,
                courseRef: defaultCourse ? defaultCourse._id : null,
                feeAmount: defaultCourse ? defaultCourse.fee : 0
            };
            const newStudent = await Student.create(studentData);
            await PendingRegistration.findByIdAndDelete(req.params.id);
            
            // Send welcome
            await sendWelcomeEmail(newStudent, defaultCourse);
            
            res.json({ message: 'Registration approved', student: newStudent });
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Reject
app.delete('/api/reject/:id', protect, async (req, res) => {
    try {
        const pending = await PendingRegistration.findByIdAndDelete(req.params.id);
        if (pending) {
            res.json({ message: 'Registration rejected' });
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. Announcements
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        res.json({ data: announcements });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/announcements', protect, async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        
        // Handle Email Broadcast
        if (req.body.broadcastEmail) {
            const students = await Student.find({}, 'email contact');
            const bccList = students
                .map(s => s.email || s.contact)
                .filter(email => email && email.includes('@'));
                
            if (bccList.length > 0) {
                await sendBroadcast(req.body.title, req.body.text, bccList);
                announcement.emailsSent = bccList.length;
                await announcement.save();
            }
        }
        
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/announcements/:id', protect, async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (announcement) {
            res.json({ message: 'Announcement deleted' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Gallery Routes
app.get('/api/gallery', async (req, res) => {
    try {
        const items = await Gallery.find({}).sort({ createdAt: -1 });
        res.json({ data: items });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/gallery', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }
        const { title, sizeClass } = req.body;
        const newItem = await Gallery.create({
            imageUrl: `/uploads/${req.file.filename}`,
            title,
            sizeClass: sizeClass || 'normal'
        });
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/gallery/:id', protect, async (req, res) => {
    try {
        const item = await Gallery.findByIdAndDelete(req.params.id);
        if (item) {
            res.json({ message: 'Gallery item removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. Broadcast Email Route
app.post('/api/email/broadcast', protect, async (req, res) => {
    const { subject, message } = req.body;
    try {
        const students = await Student.find({}, 'email contact');
        const bccList = students
            .map(s => s.email || s.contact)
            .filter(email => email && email.includes('@'));
        
        if (bccList.length === 0) {
            return res.status(400).json({ message: 'No valid email addresses found among students.' });
        }
        
        await sendBroadcast(subject, message, bccList);
        res.json({ message: `Broadcast dispatched to ${bccList.length} addresses.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Course Routes
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ createdAt: -1 });
        res.json({ data: courses });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/courses', protect, async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/courses/:id', protect, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/courses/:id', protect, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
