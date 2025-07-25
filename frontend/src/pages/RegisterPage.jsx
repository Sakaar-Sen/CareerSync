import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './AuthPages.css';

const RegisterPage = () => {
    const { registerUser } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const password2 = e.target.password2.value;
        registerUser(username, email, password, password2);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Create an Account</h2>
                <p>Sign up to save and view your analysis history.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                     <div className="form-group">
                        <label htmlFor="password2">Confirm Password</label>
                        <input type="password" id="password2" name="password2" required />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>
                 <p className="auth-switch">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
