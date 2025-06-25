import React from 'react';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// PUBLIC_INTERFACE
function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <BsNavbar bg="primary" variant="dark" fixed="top" expand="md">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold">
          <span className="me-2">💼</span> HireIQ
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-navbar-nav" />
        <BsNavbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
            )}
            {user?.role === 'recruiter' && (
              <Nav.Link as={Link} to="/recruiter">Recruiter Dashboard</Nav.Link>
            )}
            {user?.role === 'candidate' && (
              <Nav.Link as={Link} to="/candidate">Candidate Dashboard</Nav.Link>
            )}
            {user && (
              <Nav.Link as={Button} variant="outline-light" size="sm" onClick={handleLogout}>Logout</Nav.Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
