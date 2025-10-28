import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { eventService, categoryService, venueService } from '../services';
import NotificationAlert from '../components/NotificationAlert';
import { formatDate, formatCurrency, getErrorMessage } from '../utils/helpers';
import Header from '../components/Header';

/**
 * Events Management Page
 */
const Events = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    venue: '',
    startDate: '',
    startTime: '',
    totalCapacity: '',
    ticketPrice: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, categoriesRes, venuesRes] = await Promise.all([
        eventService.getByOrganizer(),
        categoryService.getAll(),
        venueService.getAll(),
      ]);

      setEvents(eventsRes.data.data.events || []);
      setCategories(categoriesRes.data.data.categories || []);
      setVenues(venuesRes.data.data.venues || []);
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category._id,
        venue: event.venue._id,
        startDate: event.startDate.split('T')[0],
        startTime: event.startTime || '09:00',
        totalCapacity: event.totalCapacity,
        ticketPrice: event.ticketPrice,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        venue: '',
        startDate: '',
        startTime: '09:00',
        totalCapacity: '',
        ticketPrice: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
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
      if (editingEvent) {
        await eventService.update(editingEvent._id, formData);
        setAlert({ type: 'success', message: 'Event updated successfully!' });
      } else {
        await eventService.create(formData);
        setAlert({ type: 'success', message: 'Event created successfully!' });
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.delete(id);
      setAlert({ type: 'success', message: 'Event deleted successfully!' });
      fetchData();
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
          <h1>Events Management</h1>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FiPlus className="me-2" />
            Create Event
          </Button>
        </div>

        {events.length > 0 ? (
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Venue</th>
                    <th>Date</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td className="fw-bold">{event.title}</td>
                      <td>{event.category.name}</td>
                      <td>{event.venue.name}</td>
                      <td>{formatDate(event.startDate)}</td>
                      <td>{event.totalCapacity}</td>
                      <td>{formatCurrency(event.ticketPrice)}</td>
                      <td>
                        <Button
                          variant="sm"
                          className="me-2"
                          onClick={() => handleShowModal(event)}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(event._id)}
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
              <p className="text-muted">No events found. Create one to get started!</p>
            </Card.Body>
          </Card>
        )}

        {/* Event Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{editingEvent ? 'Edit Event' : 'Create New Event'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Event Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Venue</Form.Label>
                    <Form.Select name="venue" value={formData.venue} onChange={handleChange} required>
                      <option value="">Select Venue</option>
                      {venues.map((venue) => (
                        <option key={venue._id} value={venue._id}>
                          {venue.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Capacity</Form.Label>
                    <Form.Control type="number" name="totalCapacity" value={formData.totalCapacity} onChange={handleChange} required />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ticket Price</Form.Label>
                    <Form.Control type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Events;
