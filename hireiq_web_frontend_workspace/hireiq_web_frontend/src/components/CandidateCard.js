import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

// PUBLIC_INTERFACE
function CandidateCard({ candidate, onView, onInterview, score, onFeedback }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          {candidate.name || 'Unnamed Candidate'}
          {score && <Badge bg="success" className="ms-3">AI Match: {score}/100</Badge>}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{candidate.email}</Card.Subtitle>
        <Card.Text>
          {candidate.headline || 'No headline'}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button size="sm" variant="primary" onClick={() => onView(candidate.id)}>View</Button>
          <Button size="sm" variant="info" onClick={() => onInterview(candidate.id)}>Schedule Interview</Button>
          {onFeedback && <Button size="sm" variant="success" onClick={() => onFeedback(candidate.id)}>Feedback</Button>}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CandidateCard;
