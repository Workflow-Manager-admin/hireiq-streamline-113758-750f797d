import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import JobCard from '../components/JobCard';

// PUBLIC_INTERFACE
function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applicationModal, setApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState([]);
  const [resumeText, setResumeText] = useState('');
  const [appFeedback, setAppFeedback] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchJobs();
    fetchAppliedJobs();
    // eslint-disable-next-line
  }, []);

  async function fetchProfile() {
    let { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(data);
    setResume(data?.resume || '');
  }

  async function fetchJobs() {
    let { data, error } = await supabase.from('jobs').select('*');
    setJobs(data);
  }

  async function fetchAppliedJobs() {
    let { data, error } = await supabase.from('applications').select('*').eq('candidate_id', user.id);
    setApplied(data.map(a=>a.job_id));
  }

  async function uploadResume(e) {
    e.preventDefault();
    setUploading(true);
    // Save resume text to profile
    await supabase.from('profiles').update({ resume: resumeText }).eq('id', user.id);
    setResume(resumeText);
    setUploading(false);
    setResumeText('');
    fetchProfile();
  }

  async function handleApply(jobId) {
    await supabase.from('applications').insert({
      job_id: jobId,
      candidate_id: user.id,
      status: 'applied'
    })
    setApplicationModal(false);
    fetchAppliedJobs();
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Candidate Dashboard</h2>
      <Row>
        <Col md={5}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Profile</h5>
              <div>Name: <b>{profile?.name}</b></div>
              <div>Email: <b>{profile?.email}</b></div>
              <hr />
              <div>
                <b>Your Resume:</b>
                {resume ? (
                  <pre style={{ background: "#f8f9fa", padding: 8, borderRadius: 5, maxHeight: 180, overflowY:'auto' }}>{resume.substring(0,900)}{resume.length > 900 && "..."}</pre>
                ) : (
                  <div className="text-secondary">No resume uploaded.</div>
                )}
              </div>
              <Form className="mt-2" onSubmit={uploadResume}>
                <Form.Group>
                  <Form.Label>Upload/Update Resume (paste text)</Form.Label>
                  <Form.Control as="textarea" rows={3} value={resumeText} onChange={e=>setResumeText(e.target.value)} />
                </Form.Group>
                <Button size="sm" variant="primary" className="mt-2" type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Save Resume'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Available Jobs</h5>
              <Row>
                {jobs.map(job => (
                  <Col md={12} key={job.id}>
                    <JobCard
                      job={job}
                      onView={id => setSelectedJob(jobs.find(j=>j.id===id)) && setApplicationModal(true)}
                      onApply={applied.includes(job.id) ? null : handleApply}
                      editable={false}
                    />
                    {applied.includes(job.id) && (
                      <Badge bg="success" className="mb-2">Applied</Badge>
                    )}
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Application Modal */}
      <Modal show={applicationModal} onHide={()=>setApplicationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h6>Job Description:</h6>
            <div>{selectedJob?.description}</div>
            <Button variant="success" className="mt-3" onClick={()=>handleApply(selectedJob.id)}>Apply</Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CandidateDashboard;
