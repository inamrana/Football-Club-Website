import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Highlights.css';

const Highlights = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/gallery');
                setImages(res.data.data);
            } catch (err) {
                console.error("Failed to load gallery images");
            }
        };
        fetchGallery();
    }, []);

    return (
        <section id="highlights" className="container" style={{ margin: '4rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-main)', textTransform: 'uppercase', fontWeight: 800 }}>
                    Club <span style={{ color: 'var(--accent-gold)' }}>Highlights</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>A glimpse into our training and events.</p>
            </div>

            <div className="gallery-grid">
                {images.length === 0 ? (
                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No highlight images currently available.</p>
                ) : (
                    images.map((img) => (
                        <div key={img._id} className={`gallery-item ${img.sizeClass === 'normal' ? '' : img.sizeClass}`}>
                            <img src={`http://localhost:3000${img.imageUrl}`} alt={img.title} loading="lazy" />
                            <div className="overlay">
                                <h4>{img.title}</h4>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default Highlights;
