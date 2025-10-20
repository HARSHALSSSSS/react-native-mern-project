import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { categoryService } from '../services';
import NotificationAlert from '../components/NotificationAlert';
import { getErrorMessage } from '../utils/helpers';
import Header from '../components/Header';

/**
 * Categories Management Page
 */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data.data.categories || []);
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
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
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
        setAlert({ type: 'success', message: 'Category updated successfully!' });
      } else {
        await categoryService.create(formData);
        setAlert({ type: 'success', message: 'Category created successfully!' });
      }

      handleCloseModal();
      fetchCategories();
    } catch (error) {
      setAlert({ type: 'danger', message: getErrorMessage(error) });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.delete(id);
      setAlert({ type: 'success', message: 'Category deleted successfully!' });
      fetchCategories();
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
          <h1>Categories Management</h1>
          <Button variant="primary" onClick={() => handleShowModal()}>
            <FiPlus className="me-2" />
            Create Category
          </Button>
        </div>

        {categories.length > 0 ? (
          <Card>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td className="fw-bold">{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <Button
                          variant="sm"
                          className="me-2"
                          onClick={() => handleShowModal(category)}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
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
              <p className="text-muted">No categories found. Create one to get started!</p>
            </Card.Body>
          </Card>
        )}

        {/* Category Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingCategory ? 'Edit Category' : 'Create New Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
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
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default Categories;
