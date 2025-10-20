import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import './Header.css';

/**
 * Header Component with Navigation
 */
const Header = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }} className="fw-bold">
          📅 Event Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => navigate('/events')}>Events</Nav.Link>
            <Nav.Link onClick={() => navigate('/categories')}>Categories</Nav.Link>
            <Nav.Link onClick={() => navigate('/venues')}>Venues</Nav.Link>

            <Dropdown className="ms-3">
              <Dropdown.Toggle variant="dark" id="admin-dropdown">
                <FiUser className="me-2" />
                {admin?.firstName}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => navigate('/profile')}>
                  <FiUser className="me-2" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FiLogOut className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
