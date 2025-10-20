import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../services';
import { useAuth } from '../context/AuthContext';
import NotificationAlert from '../components/NotificationAlert';
import { getErrorMessage } from '../utils/helpers';
import './Auth.css';

/**
 * Login Page for Admin
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAlert({ type: 'warning', message: 'Please fill in all fields' });
      return;
    }

    try {
      setLoading(true);
      const response = await adminAuthService.login(formData.email, formData.password);
      const { admin, token } = response.data.data;

      login(admin, token);
      setAlert({ type: 'success', message: 'Login successful!' });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Container className="py-5">
        <div className="auth-wrapper">
          <Card className="auth-card">
            <Card.Body className="p-5">
              <h1 className="text-center mb-4">📅 Event Manager</h1>
              <h4 className="text-center mb-4 text-muted">Admin Login</h4>

              {alert && <NotificationAlert {...alert} onClose={() => setAlert(null)} />}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted small">Demo Credentials:</p>
                <p className="small">Email: admin@eventmanagement.com</p>
                <p className="small">Password: Admin@123</p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Login;
