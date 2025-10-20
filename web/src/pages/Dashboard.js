import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { dashboardService } from '../services';
import NotificationAlert from '../components/NotificationAlert';
import { formatCurrency, formatDate, getErrorMessage } from '../utils/helpers';
import Header from '../components/Header';

/**
 * Dashboard Page
 */
const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getAdminDashboard();
      setDashboard(response.data.data);
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
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

        <h1 className="mb-4">Dashboard</h1>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <h3 className="text-primary">{dashboard?.statistics.totalEvents || 0}</h3>
                <Card.Text>Total Events</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <h3 className="text-success">{dashboard?.statistics.totalTicketsSold || 0}</h3>
                <Card.Text>Tickets Sold</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <h3 className="text-info">{dashboard?.statistics.totalCapacity || 0}</h3>
                <Card.Text>Total Capacity</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} className="mb-3">
            <Card className="stat-card text-center">
              <Card.Body>
                <h3 className="text-success">{formatCurrency(dashboard?.statistics.totalRevenue || 0)}</h3>
                <Card.Text>Total Revenue</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Upcoming Events */}
        <Row className="mb-4">
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Upcoming Events</Card.Title>
              </Card.Header>
              <Card.Body>
                {dashboard?.upcomingEvents.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Category</th>
                        <th>Venue</th>
                        <th>Date</th>
                        <th>Tickets</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.upcomingEvents.map((event) => (
                        <tr key={event._id}>
                          <td className="fw-bold">{event.title}</td>
                          <td>{event.category.name}</td>
                          <td>{event.venue.name}</td>
                          <td>{formatDate(event.startDate)}</td>
                          <td>{event.totalCapacity}</td>
                          <td>{formatCurrency(event.ticketPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No upcoming events</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Bookings */}
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title className="mb-0">Recent Bookings</Card.Title>
              </Card.Header>
              <Card.Body>
                {dashboard?.recentBookings.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Event</th>
                        <th>Tickets</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>{`${booking.user.firstName} ${booking.user.lastName}`}</td>
                          <td>{booking.event.title}</td>
                          <td>{booking.quantity}</td>
                          <td>{formatCurrency(booking.totalPrice)}</td>
                          <td>
                            <Badge bg={booking.bookingStatus === 'confirmed' ? 'success' : 'warning'}>
                              {booking.bookingStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted">No recent bookings</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
