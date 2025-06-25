import React from 'react';
import { Container, Card } from 'react-bootstrap';

// PUBLIC_INTERFACE
function InterviewPage() {
  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2>Interview</h2>
          <p>Interview details (date, participants, notes, AI questions/feedback) will be shown here.</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default InterviewPage;
