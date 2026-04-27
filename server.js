const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        branding_id TEXT,
        full_name TEXT NOT NULL,
        age INTEGER,
        guardian TEXT,
        contact TEXT,
        experience TEXT,
        paid INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pending_registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER,
        full_name TEXT NOT NULL,
        age INTEGER,
        guardian TEXT,
        contact TEXT,
        experience TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp INTEGER,
        text TEXT NOT NULL
    )`);
}

// --- API ENDPOINTS ---

// Get all students
app.get('/api/students', (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        // Convert integer boolean back to boolean for frontend
        const students = rows.map(s => ({...s, paid: !!s.paid}));
        res.json({ "data": students });
    });
});

// Add a student (Admin)
app.post('/api/students', (req, res) => {
    const { full, age, guardian, contact, experience, paid } = req.body;
    const paidInt = paid ? 1 : 0;
    const sql = `INSERT INTO students (full_name, age, guardian, contact, experience, paid) VALUES (?,?,?,?,?,?)`;
    const params = [full, age, guardian, contact, experience, paidInt];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "id": this.lastID });
    });
});

// Update student
app.put('/api/students/:id', (req, res) => {
    const { full, age, guardian, contact, paid } = req.body;
    const paidInt = paid ? 1 : 0;
    const sql = `UPDATE students SET full_name = ?, age = ?, guardian = ?, contact = ?, paid = ? WHERE id = ?`;
    const params = [full, age, guardian, contact, paidInt, req.params.id];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Updated", changes: this.changes });
    });
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
    db.run(`DELETE FROM students WHERE id = ?`, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// Get pending registrations
app.get('/api/pending', (req, res) => {
    db.all("SELECT * FROM pending_registrations", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        const pending = rows.map(r => ({
            id: r.id, 
            full: r.full_name, 
            age: r.age, 
            guardian: r.guardian, 
            contact: r.contact, 
            experience: r.experience
        }));
        res.json({ "data": pending });
    });
});

// Submit registration
app.post('/api/register', (req, res) => {
    const { full, age, guardian, contact, experience } = req.body;
    const sql = `INSERT INTO pending_registrations (timestamp, full_name, age, guardian, contact, experience) VALUES (?,?,?,?,?,?)`;
    const params = [Date.now(), full, age, guardian, contact, experience];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "id": this.lastID });
    });
});

// Approve Registration
app.post('/api/approve/:id', (req, res) => {
    const id = req.params.id;
    // Transaction: Get pending -> Insert Student -> Delete Pending
    db.get("SELECT * FROM pending_registrations WHERE id = ?", [id], (err, row) => {
        if (err || !row) {
            res.status(400).json({ "error": "Registration not found" });
            return;
        }
        
        const sqlInsert = `INSERT INTO students (full_name, age, guardian, contact, experience, paid) VALUES (?,?,?,?,?,0)`;
        const params = [row.full_name, row.age, row.guardian, row.contact, row.experience];
        
        db.run(sqlInsert, params, function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            db.run("DELETE FROM pending_registrations WHERE id = ?", [id], (err) => {
                 if (err) { console.error("Error cleaning up pending", err); }
                 res.json({ message: "Approved" });
            });
        });
    });
});

// Reject Registration
app.delete('/api/reject/:id', (req, res) => {
    db.run(`DELETE FROM pending_registrations WHERE id = ?`, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Rejected", changes: this.changes });
    });
});


// Get Announcements
app.get('/api/announcements', (req, res) => {
    db.all("SELECT * FROM announcements ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "data": rows });
    });
});

// Add Announcement
app.post('/api/announcements', (req, res) => {
    const { text } = req.body;
    const sql = `INSERT INTO announcements (timestamp, text) VALUES (?,?)`;
    const params = [Date.now(), text];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "id": this.lastID });
    });
});

// Delete Announcement
app.delete('/api/announcements/:id', (req, res) => {
    db.run(`DELETE FROM announcements WHERE id = ?`, req.params.id, function (err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ message: "Deleted" });
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
