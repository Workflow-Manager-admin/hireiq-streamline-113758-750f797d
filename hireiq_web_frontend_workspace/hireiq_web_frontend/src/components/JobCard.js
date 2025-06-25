import React from 'react';
import { Card, Button } from 'react-bootstrap';

// PUBLIC_INTERFACE
function JobCard({ job, onView, onApply, onCandidatesList, editable, onEdit, onDelete }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{job.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{job.company || 'Company'}</Card.Subtitle>
        <Card.Text>
          {job.description?.substring(0,150)}
          {job.description && job.description.length > 150 && "..."}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button size="sm" variant="primary" onClick={() => onView(job.id)}>View</Button>
          {onApply && <Button size="sm" variant="success" onClick={() => onApply(job.id)}>Apply</Button>}
          {onCandidatesList && <Button size="sm" variant="info" onClick={() => onCandidatesList(job.id)}>Applicants</Button>}
          {editable && (
            <>
              <Button size="sm" variant="outline-secondary" onClick={() => onEdit(job.id)}>Edit</Button>
              <Button size="sm" variant="outline-danger" onClick={() => onDelete(job.id)}>Delete</Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default JobCard;
