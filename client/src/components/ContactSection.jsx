import React from 'react';

const ContactSection = () => {
    return (
        <section id="contact" className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>Contact & Fees</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '2rem' }}>
                <div>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Location</h4>
                    <p>C-Block Ground, TopCity-1</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Direct Contact</h4>
                    <p>0344-9058671 (Phone/WhatsApp)</p>
                    <p>xyz@gmail.com</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }}>Payment</h4>
                    <p>Easypaisa: 0344-9058671</p>
                    <p className="unpaid">Due: 10th of each month</p>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
