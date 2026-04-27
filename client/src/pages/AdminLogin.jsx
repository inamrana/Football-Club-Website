import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Zap } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, admin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (admin) navigate('/admin/dashboard');
    }, [admin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { username, password });
            login(res.data);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            {/* Animated background orbs */}
            <div style={styles.orb1}></div>
            <div style={styles.orb2}></div>
            <div style={styles.orb3}></div>

            <div style={styles.loginContainer} className="animate-fadeInUp">
                {/* Logo / Icon */}
                <div style={styles.logoWrapper}>
                    <div style={styles.logoCircle}>
                        <Shield size={32} color="#fff" />
                    </div>
                </div>

                <h1 style={styles.title}>Welcome Back</h1>
                <p style={styles.subtitle}>Sign in to your admin dashboard</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <div style={styles.inputWrapper}>
                            <input 
                                type="text" 
                                placeholder="Enter your username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                style={{ ...styles.input, paddingRight: '3rem' }}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <span style={styles.errorDot}></span>
                            {error}
                        </div>
                    )}

                    <button 
                        className="btn" 
                        type="submit" 
                        disabled={loading}
                        style={styles.submitBtn}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></div>
                        ) : (
                            <>
                                <Zap size={16} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div style={styles.divider}>
                    <span style={styles.dividerLine}></span>
                    <span style={styles.dividerText}>Credentials</span>
                    <span style={styles.dividerLine}></span>
                </div>

                <p style={styles.hint}>
                    Default: <code style={styles.code}>admin</code> / <code style={styles.code}>SuperStarter@2024</code>
                </p>
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem'
    },
    orb1: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
        top: '-100px',
        right: '-100px',
        animation: 'float 6s ease-in-out infinite',
        pointerEvents: 'none'
    },
    orb2: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent 70%)',
        bottom: '-50px',
        left: '-50px',
        animation: 'float 8s ease-in-out infinite reverse',
        pointerEvents: 'none'
    },
    orb3: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1), transparent 70%)',
        top: '40%',
        left: '20%',
        animation: 'float 5s ease-in-out infinite',
        pointerEvents: 'none'
    },
    loginContainer: {
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.08)',
        position: 'relative',
        zIndex: 1
    },
    logoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem'
    },
    logoCircle: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
        animation: 'float 3s ease-in-out infinite'
    },
    title: {
        textAlign: 'center',
        fontSize: '1.6rem',
        fontWeight: 700,
        color: '#f1f5f9',
        marginBottom: '0.3rem'
    },
    subtitle: {
        textAlign: 'center',
        fontSize: '0.88rem',
        color: '#64748b',
        marginBottom: '2rem'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
    },
    label: {
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#94a3b8',
        letterSpacing: '0.04em'
    },
    inputWrapper: {
        position: 'relative'
    },
    input: {
        width: '100%',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '0.8rem 1rem',
        borderRadius: '10px',
        color: '#f1f5f9',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.9rem',
        transition: 'border-color 0.3s, box-shadow 0.3s'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#64748b',
        cursor: 'pointer',
        display: 'flex',
        padding: '4px'
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.7rem 1rem',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '10px',
        color: '#ef4444',
        fontSize: '0.85rem',
        animation: 'fadeIn 0.3s ease-out'
    },
    errorDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#ef4444',
        flexShrink: 0
    },
    submitBtn: {
        width: '100%',
        padding: '0.85rem',
        fontSize: '0.95rem',
        marginTop: '0.5rem',
        justifyContent: 'center'
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        margin: '1.5rem 0 1rem'
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(148, 163, 184, 0.1)'
    },
    dividerText: {
        fontSize: '0.72rem',
        fontWeight: 600,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
    },
    hint: {
        textAlign: 'center',
        fontSize: '0.78rem',
        color: '#475569'
    },
    code: {
        background: 'rgba(99, 102, 241, 0.1)',
        color: '#818cf8',
        padding: '0.15rem 0.4rem',
        borderRadius: '4px',
        fontSize: '0.76rem',
        fontFamily: 'monospace'
    }
};

export default AdminLogin;
