import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/students');
                setStudents(res.data.data);
            } catch (err) {
                console.error("Failed to fetch students");
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => {
        if (filter === 'paid' && !s.paid) return false;
        if (filter === 'unpaid' && s.paid) return false;
        const hay = (s.full_name + ' ' + s.guardian + ' ' + (s.contact || '')).toLowerCase();
        if (search && !hay.includes(search.toLowerCase())) return false;
        return true;
    });

    return (
        <section id="students" className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>Club Members</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        placeholder="Search members..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        style={{ width: '200px', margin: 0 }}
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '120px', margin: 0 }}>
                        <option value="all">Status: All</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Guardian</th>
                            <th>Contact</th>
                            <th>Exp</th>
                            <th>Fee Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s, i) => (
                            <tr key={s._id}>
                                <td>{i + 1}</td>
                                <td style={{ fontWeight: 600, color: 'white' }}>{s.full_name}</td>
                                <td>{s.age}</td>
                                <td>{s.guardian}</td>
                                <td>{s.contact}</td>
                                <td>{s.experience || '-'}</td>
                                <td className={s.paid ? 'paid' : 'unpaid'}>{s.paid ? 'PAID' : 'UNPAID'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default StudentsList;
