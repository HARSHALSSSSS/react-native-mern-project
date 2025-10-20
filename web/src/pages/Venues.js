import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { venueService } from '../services';
import NotificationAlert from '../components/NotificationAlert';
import { getErrorMessage } from '../utils/helpers';
import Header from '../components/Header';

/**
 * Venues Management Page
 */
const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    capacity: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await venueService.getAll();
      setVenues(response.data.data.venues || []);
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (venue = null) => {
    if (venue) {
      setEditingVenue(venue);
      setFormData({
        name: venue.name,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        zipCode: venue.zipCode,
        capacity: venue.capacity,
        contactPerson: venue.contactPerson,
        contactPhone: venue.contactPhone,
        contactEmail: venue.contactEmail,
      });
    } else {
      setEditingVenue(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        capacity: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVenue(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVenue) {
        await venueService.update(editingVenue._id, formData);
        setAlert({ type: 'success', message: 'Venue updated successfully!' });
      } else {
        await venueService.create(formData);
        setAlert({ type: 'success', message: 'Venue created successfully!' });
      }

      handleCloseModal();
      fetchVenues();
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;

    try {
      await venueService.delete(id);
      setAlert({ type: 'success', message: 'Venue deleted successfully!' });
      fetchVenues();
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="py-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="py-4">
        {alert && <NotificationAlert {...alert} onClose={() => setAlert(null)} />}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Venues Management</h1>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FiPlus className="me-2" />
            Create Venue
          </Button>
        </div>

        {venues.length > 0 ? (
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Capacity</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((venue) => (
                    <tr key={venue._id}>
                      <td className="fw-bold">{venue.name}</td>
                      <td>{venue.address}</td>
                      <td>{venue.city}</td>
                      <td>{venue.capacity}</td>
                      <td>{venue.contactPerson}</td>
                      <td>
                        <Button
                          variant="sm"
                          className="me-2"
                          onClick={() => handleShowModal(venue)}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(venue._id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body className="text-center py-5">
              <p className="text-muted">No venues found. Create one to get started!</p>
            </Card.Body>
          </Card>
        )}

        {/* Venue Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingVenue ? 'Edit Venue' : 'Create New Venue'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Venue Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" name="city" value={formData.city} onChange={handleChange} required />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" name="state" value={formData.state} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Contact Person</Form.Label>
                <Form.Control type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100">
                {editingVenue ? 'Update Venue' : 'Create Venue'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Venues;
