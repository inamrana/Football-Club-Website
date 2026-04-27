import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UIContext } from '../context/UIContext';

const JoinForm = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        guardian: '',
        contact: '',
        experience: ''
    });
    const { showToast } = useContext(UIContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/register', formData);
            showToast('Application submitted successfully! Our admin will review it.', 'success');
            setFormData({ full_name: '', age: '', guardian: '', contact: '', experience: '' });
        } catch (err) {
            showToast('Error submitting application. Please try again.', 'error');
        }
    };

    return (
        <section id="join" className="card">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>Join The Club</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Become a part of the legacy. Fill out the form below.</p>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input 
                        placeholder="Full Player Name" 
                        required 
                        value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
                    />
                    <input 
                        placeholder="Age" 
                        required 
                        type="number" 
                        min="4" 
                        max="20" 
                        value={formData.age} 
                        onChange={(e) => setFormData({...formData, age: e.target.value})} 
                    />
                    <input 
                        placeholder="Guardian Name" 
                        required 
                        value={formData.guardian} 
                        onChange={(e) => setFormData({...formData, guardian: e.target.value})} 
                    />
                    <input 
                        placeholder="Contact Number (WhatsApp/Phone)" 
                        required 
                        value={formData.contact} 
                        onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                    />
                </div>
                <textarea 
                    placeholder="Previous Football Experience (Optional)" 
                    rows="3" 
                    style={{ marginTop: '1rem' }}
                    value={formData.experience} 
                    onChange={(e) => setFormData({...formData, experience: e.target.value})} 
                ></textarea>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn" type="submit">Submit Applications</button>
                    <button className="btn-muted" type="button" onClick={() => {
                        setFormData({ full_name: '', age: '', guardian: '', contact: '', experience: '' });
                    }}>Reset</button>
                </div>
            </form>
        </section>
    );
};

export default JoinForm;
