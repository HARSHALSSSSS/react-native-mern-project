import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { eventService } from '../services';
import NotificationAlert from '../components/NotificationAlert';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/helpers';
import Header from '../components/Header';

/**
 * Event Participants Page
 */
const EventParticipants = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchEventAndBookings();
  }, [eventId]);

  const fetchEventAndBookings = async () => {
    try {
      setLoading(true);
      // Fetch event details
      const eventRes = await eventService.getById(eventId);
      setEvent(eventRes.data.data.event);

      // Fetch bookings for this event
      const bookingsRes = await eventService.getEventParticipants(eventId);
      setBookings(bookingsRes.data.data.bookings);
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (bookings.length === 0) {
      setAlert({ type: 'warning', message: 'No bookings to export' });
      return;
    }

    try {
      // Prepare CSV data
      const headers = ['Name', 'Email', 'Phone', 'Quantity', 'Total Price', 'Status', 'Booking Date', 'Check-in Status'];
      const rows = bookings.map((booking) => [
        `${booking.user.firstName} ${booking.user.lastName}`,
        booking.user.email,
        booking.user.phone || 'N/A',
        booking.quantity,
        `$${booking.totalPrice}`,
        booking.bookingStatus,
        formatDate(booking.createdAt),
        booking.checkedIn ? 'Yes' : 'No',
      ]);

      // Create CSV content
      const csvContent = [
        [
          `Event: ${event.title}`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          `Date: ${formatDate(event.startDate)}`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          `Venue: ${event.venue.name}`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [],
        headers,
        ...rows,
        [],
        [
          `Total Bookings: ${bookings.length}`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
        [
          `Total Revenue: $${bookings.reduce((sum, b) => sum + b.totalPrice, 0)}`,
          '',
          '',
          '',
          '',
          '',
          '',
          '',
        ],
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${event.title
          .replace(/\s+/g, '_')
          .toLowerCase()}_participants_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setAlert({ type: 'success', message: 'CSV exported successfully' });
    } catch (error) {
      setAlert({ type: 'danger', message: 'Failed to export CSV' });
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchMatch =
      `${booking.user.firstName} ${booking.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filterStatus === 'all' || booking.bookingStatus === filterStatus;

    return searchMatch && statusMatch;
  });

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

        <Row className="mb-4">
          <Col>
            <h1>Event Participants</h1>
          </Col>
        </Row>

        {/* Event Summary */}
        {event && (
          <Row className="mb-4">
            <Col md={8}>
              <Card>
                <Card.Body>
                  <h5 className="card-title">{event.title}</h5>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Date:</strong> {formatDate(event.startDate)}
                      </p>
                      <p>
                        <strong>Venue:</strong> {event.venue.name}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Total Capacity:</strong> {event.totalCapacity}
                      </p>
                      <p>
                        <strong>Remaining:</strong> {event.remainingCapacity}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <h3 className="text-primary">{bookings.length}</h3>
                  <p className="text-muted">Total Bookings</p>
                  <h4 className="text-success">
                    ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                  </h4>
                  <p className="text-muted">Total Revenue</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Filters and Export */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Status Filter</Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="success" onClick={handleExportCSV} className="w-100">
              📥 Export CSV
            </Button>
          </Col>
        </Row>

        {/* Participants Table */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Participants ({filteredBookings.length})</Card.Title>
              </Card.Header>
              <Card.Body>
                {filteredBookings.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Tickets</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Check-in</th>
                        <th>Booking Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="fw-bold">
                            {booking.user.firstName} {booking.user.lastName}
                          </td>
                          <td>{booking.user.email}</td>
                          <td>{booking.user.phone || '-'}</td>
                          <td className="text-center">{booking.quantity}</td>
                          <td className="text-end">${booking.totalPrice}</td>
                          <td>
                            <Badge bg={booking.bookingStatus === 'confirmed' ? 'success' : 'warning'}>
                              {booking.bookingStatus}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg={booking.checkedIn ? 'success' : 'secondary'}>
                              {booking.checkedIn ? '✓ Checked In' : 'Pending'}
                            </Badge>
                          </td>
                          <td>{formatDate(booking.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No bookings found</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EventParticipants;
