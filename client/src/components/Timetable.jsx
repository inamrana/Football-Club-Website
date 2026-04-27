import React from 'react';

const Timetable = () => {
    return (
        <section id="schedule" className="card">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>Weekly Timetable</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                    <h4 style={{ color: 'var(--accent-gold)' }}>Under-10</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Monday</td>
                                <td>4:00pm - 5:00pm</td>
                            </tr>
                            <tr>
                                <td>Wednesday</td>
                                <td>4:00pm - 5:00pm</td>
                            </tr>
                            <tr>
                                <td>Friday</td>
                                <td>4:00pm - 5:00pm</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h4 style={{ color: 'var(--accent-gold)' }}>Under-14</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tuesday</td>
                                <td>5:00pm - 6:30pm</td>
                            </tr>
                            <tr>
                                <td>Thursday</td>
                                <td>5:00pm - 6:30pm</td>
                            </tr>
                            <tr>
                                <td>Saturday</td>
                                <td>5:00pm - 6:30pm</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Timetable;
