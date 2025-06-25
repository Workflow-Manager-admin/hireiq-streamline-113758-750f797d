import React from 'react';
import { Container, Card } from 'react-bootstrap';

// PUBLIC_INTERFACE
function NotFoundPage() {
  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h2>404</h2>
          <p>The page you are looking for does not exist.</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NotFoundPage;
