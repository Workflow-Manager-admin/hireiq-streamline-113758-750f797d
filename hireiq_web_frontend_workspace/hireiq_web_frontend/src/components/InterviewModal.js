import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// PUBLIC_INTERFACE
function InterviewModal({ show, onHide, onSubmit, candidateName }) {
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({ dateTime, notes });
    setDateTime('');
    setNotes('');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Schedule Interview for {candidateName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Date/Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Schedule</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InterviewModal;
