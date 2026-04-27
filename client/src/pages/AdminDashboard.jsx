import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';
import { FileText, Users, CheckSquare, Settings, LogOut, Image as ImageIcon, Mail } from 'lucide-react';

const AdminDashboard = () => {
    const { admin, logout } = useContext(AuthContext);
    const { showToast } = useContext(UIContext);
    const [view, setView] = useState('students');
    
    // Data states
    const [students, setStudents] = useState([]);
    const [pending, setPending] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [gallery, setGallery] = useState([]);
    
    const authConfig = { headers: { Authorization: `Bearer ${admin.token}` } };

    // Fetch lists
    const fetchStudents = async () => { const res = await axios.get('http://localhost:3000/api/students'); setStudents(res.data.data); };
    const fetchPending = async () => { const res = await axios.get('http://localhost:3000/api/pending', authConfig); setPending(res.data.data); };
    const fetchAnnouncements = async () => { const res = await axios.get('http://localhost:3000/api/announcements'); setAnnouncements(res.data.data); };
    const fetchGallery = async () => { const res = await axios.get('http://localhost:3000/api/gallery'); setGallery(res.data.data); };

    useEffect(() => {
        if (view === 'students') fetchStudents();
        if (view === 'pending') fetchPending();
        if (view === 'announcements') fetchAnnouncements();
        if (view === 'gallery') fetchGallery();
    }, [view]);

    // Student Logic
    const [isEditing, setIsEditing] = useState(false);
    const [studentForm, setStudentForm] = useState({ full_name: '', age: '', guardian: '', contact: '', experience: '', paid: false });
    const [editingId, setEditingId] = useState(null);

    const togglePaid = async (id) => {
        await axios.patch(`http://localhost:3000/api/students/${id}/toggle-paid`, {}, authConfig);
        fetchStudents();
    };

    const deleteStudent = async (id) => {
        if(!window.confirm('Delete student?')) return;
        await axios.delete(`http://localhost:3000/api/students/${id}`, authConfig);
        fetchStudents();
    };

    const saveStudent = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:3000/api/students/${editingId}`, studentForm, authConfig);
                showToast('Student updated successfully');
            } else {
                await axios.post('http://localhost:3000/api/students', studentForm, authConfig);
                showToast('Student added successfully');
            }
            setIsEditing(false);
            setEditingId(null);
            setStudentForm({ full_name: '', age: '', guardian: '', contact: '', experience: '', paid: false });
            fetchStudents();
        } catch (err) {
            showToast('Error saving student', 'error');
        }
    };

    const openEdit = (s) => {
        setStudentForm(s);
        setEditingId(s._id);
        setIsEditing(true);
    };

    // Broadcast logic
    const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
    const sendMail = async () => {
        if (!emailForm.subject || !emailForm.message) return showToast('Fill all fields', 'error');
        showToast('Dispatching broadcast...');
        try {
            const res = await axios.post('http://localhost:3000/api/email/broadcast', emailForm, authConfig);
            showToast(res.data.message);
            setEmailForm({ subject: '', message: '' });
        } catch (e) {
            showToast(e.response?.data?.message || 'Email delivery failed', 'error');
        }
    };

    // Gallery Logic
    const [galleryUpload, setGalleryUpload] = useState({ title: '', sizeClass: 'normal', file: null });
    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', galleryUpload.title);
        fd.append('sizeClass', galleryUpload.sizeClass);
        if (galleryUpload.file) fd.append('image', galleryUpload.file);

        try {
            await axios.post('http://localhost:3000/api/gallery', fd, { headers: { ...authConfig.headers, 'Content-Type': 'multipart/form-data' }});
            showToast('Image added to gallery');
            setGalleryUpload({ title: '', sizeClass: 'normal', file: null });
            fetchGallery();
        } catch (e) {
            showToast('Gallery upload failed', 'error');
        }
    };

    // Announcement Logic
    const [newAnn, setNewAnn] = useState('');
    const addAnn = async () => {
        if(!newAnn) return;
        try {
            await axios.post('http://localhost:3000/api/announcements', { text: newAnn }, authConfig);
            setNewAnn('');
            fetchAnnouncements();
            showToast('Announcement posted');
        } catch (e) {
            showToast('Error adding announcement', 'error');
        }
    };

    const deleteAnn = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/announcements/${id}`, authConfig);
            fetchAnnouncements();
            showToast('Announcement deleted');
        } catch (e) {
            showToast('Error deleting announcement', 'error');
        }
    };

    const navItemStyle = (currentView) => ({
        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem', cursor: 'pointer', borderRadius: '8px', transition: '0.3s',
        background: view === currentView ? 'rgba(251, 191, 36, 0.1)' : 'transparent', color: view === currentView ? 'var(--accent-gold)' : 'var(--text-main)', borderLeft: view === currentView ? '3px solid var(--accent-gold)' : '3px solid transparent'
    });

    return (
        <div style={{ display: 'flex', minHeight: '80vh', maxWidth: 1400, margin: '2rem auto', padding: '0 5%', gap: '2rem' }}>
            <aside className="card" style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-start' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Admin Panel</h3>
                <div style={navItemStyle('students')} onClick={() => setView('students')}><Users size={18} /> Manage Students</div>
                <div style={navItemStyle('pending')} onClick={() => setView('pending')}><CheckSquare size={18} /> Pending Approvals</div>
                <div style={navItemStyle('gallery')} onClick={() => setView('gallery')}><ImageIcon size={18} /> Gallery</div>
                <div style={navItemStyle('email')} onClick={() => setView('email')}><Mail size={18} /> Broadcast Email</div>
                <div style={navItemStyle('announcements')} onClick={() => setView('announcements')}><FileText size={18} /> Announcements</div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--accent-red)' }} onClick={logout}>
                        <LogOut size={18} /> Logout
                    </div>
                </div>
            </aside>

            <main className="card" style={{ flex: 1 }}>
                {view === 'students' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ color: 'var(--accent-gold)' }}>Students Roster</h2>
                            <button className="btn" onClick={() => { setIsEditing(true); setEditingId(null); setStudentForm({ full_name: '', age: '', guardian: '', contact: '', experience: '', paid: false }); }}>+ Add Student</button>
                        </div>
                        
                        {isEditing && (
                            <form onSubmit={saveStudent} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 8, marginBottom: '2rem', display: 'grid', gap: '1rem' }}>
                                <h4>{editingId ? 'Edit Student' : 'New Student'}</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input placeholder="Full Name" value={studentForm.full_name} onChange={e => setStudentForm({...studentForm, full_name: e.target.value})} required />
                                    <input placeholder="Age" type="number" value={studentForm.age} onChange={e => setStudentForm({...studentForm, age: e.target.value})} required />
                                    <input placeholder="Guardian" value={studentForm.guardian} onChange={e => setStudentForm({...studentForm, guardian: e.target.value})} required />
                                    <input placeholder="Contact (Email/Phone)" value={studentForm.contact} onChange={e => setStudentForm({...studentForm, contact: e.target.value})} required />
                                </div>
                                <select value={studentForm.paid} onChange={e => setStudentForm({...studentForm, paid: e.target.value === 'true'})}>
                                    <option value="false">Status: Unpaid</option>
                                    <option value="true">Status: Paid</option>
                                </select>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn" type="submit">Save</button>
                                    <button className="btn-muted" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </form>
                        )}

                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead><tr><th>Name</th><th>Age</th><th>Guardian</th><th>Fee Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {students.map(s => (
                                        <tr key={s._id}>
                                            <td>{s.full_name}</td><td>{s.age}</td><td>{s.guardian}</td>
                                            <td><button onClick={() => togglePaid(s._id)} style={{ background: s.paid ? 'var(--accent-green)' : 'var(--accent-red)', border: 'none', padding: '0.3rem 0.8rem', borderRadius: 4, color: '#000', cursor: 'pointer', fontWeight: 'bold' }}>{s.paid ? 'PAID' : 'UNPAID'}</button></td>
                                            <td>
                                                <button className="btn-muted" style={{ padding: '0.3rem 0.6rem', marginRight: '0.5rem' }} onClick={() => openEdit(s)}>Edit</button>
                                                <button className="btn-muted" style={{ padding: '0.3rem 0.6rem' }} onClick={() => deleteStudent(s._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'gallery' && (
                    <div>
                        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>Gallery Setup</h2>
                        <form onSubmit={handleGallerySubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                            <input type="text" placeholder="Image Title" value={galleryUpload.title} onChange={e => setGalleryUpload({...galleryUpload, title: e.target.value})} required />
                            <select value={galleryUpload.sizeClass} onChange={e => setGalleryUpload({...galleryUpload, sizeClass: e.target.value})}>
                                <option value="normal">Normal Square</option>
                                <option value="large">Large (2x2)</option>
                                <option value="tall">Tall (Vertical)</option>
                                <option value="wide">Wide (Horizontal)</option>
                            </select>
                            <input type="file" accept="image/*" onChange={e => setGalleryUpload({...galleryUpload, file: e.target.files[0]})} required />
                            <button className="btn" type="submit">Upload Image</button>
                        </form>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {gallery.map(g => (
                                <div key={g._id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <img src={`http://localhost:3000${g.imageUrl}`} alt={g.title} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }} />
                                    <strong>{g.title}</strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>Size: {g.sizeClass}</span>
                                    <button className="btn-muted" onClick={async () => { await axios.delete(`http://localhost:3000/api/gallery/${g._id}`, authConfig); fetchGallery(); }}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === 'email' && (
                    <div>
                        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>Broadcast Email</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Send a direct email to all students matching a valid email format in their Contact field.</p>
                        <input placeholder="Subject Line" value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} style={{ marginBottom: '1rem' }} />
                        <textarea placeholder="Write your massive club announcement here..." rows="8" value={emailForm.message} onChange={e => setEmailForm({...emailForm, message: e.target.value})} style={{ marginBottom: '1rem' }}></textarea>
                        <button className="btn" onClick={sendMail}>Send Broadcast</button>
                    </div>
                )}
                
                {view === 'pending' && (
                    <div>
                        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>Pending Applications</h2>
                        {pending.length === 0 ? <p>No pending applications.</p> : (
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    {pending.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <strong>{p.full_name} (Age {p.age})</strong><br/>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    Guardian: {p.guardian} | Contact: {p.contact} <br/>
                                                    Exp: {p.experience}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button style={{ background: 'var(--accent-green)', padding: '0.4rem 1rem', border: 'none', borderRadius: 4, marginRight: '0.5rem', cursor: 'pointer' }} onClick={() => approve(p._id)}>Approve</button>
                                                <button style={{ background: 'var(--accent-red)', padding: '0.4rem 1rem', border: 'none', borderRadius: 4, cursor: 'pointer', color: 'white' }} onClick={() => reject(p._id)}>Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {view === 'announcements' && (
                    <div>
                        <h2 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>Announcements</h2>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input value={newAnn} onChange={(e) => setNewAnn(e.target.value)} placeholder="Type new announcement..." />
                            <button className="btn" onClick={addAnn} style={{ whiteSpace: 'nowrap' }}>Post News</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {announcements.map(a => (
                                <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                                    <p>{a.text}</p>
                                    <button className="btn-muted" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => deleteAnn(a._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
export default AdminDashboard;
