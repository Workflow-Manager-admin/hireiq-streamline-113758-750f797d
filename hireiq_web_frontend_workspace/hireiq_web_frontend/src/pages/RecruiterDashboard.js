import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Form, Tabs, Tab, Card } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import JobCard from '../components/JobCard';
import CandidateCard from '../components/CandidateCard';
import InterviewModal from '../components/InterviewModal';
import Scorecard from '../components/Scorecard';
import { parseResumeAI, scoreResumeAI, generateInterviewQuestionsAI, generateFeedbackAI } from '../services/geminiService';

// PUBLIC_INTERFACE
function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [jobForm, setJobForm] = useState({ title: '', description: '' });
  const [aiScore, setAiScore] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [interviewQ, setInterviewQ] = useState('');
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  async function fetchJobs() {
    let { data, error } = await supabase.from('jobs').select('*').eq('recruiter_id', user.id);
    if (!error) setJobs(data);
  }

  async function createJob() {
    await supabase.from('jobs').insert([{ 
      title: jobForm.title, 
      description: jobForm.description,
      recruiter_id: user.id
    }]);
    setJobForm({ title: '', description: '' });
    setShowJobModal(false);
    fetchJobs();
  }

  async function deleteJob(jobId) {
    await supabase.from('jobs').delete().eq('id', jobId);
    fetchJobs();
  }

  async function viewApplicants(jobId) {
    setSelectedJob(jobs.find(j=>j.id === jobId));
    let { data, error } = await supabase.from('applications').select('*, candidate:profiles(*)').eq('job_id', jobId);
    if (!error) setApplicants(data);
    setShowApplicants(true);
  }

  async function handleInterview({ dateTime, notes }) {
    await supabase.from('interviews').insert({
      candidate_id: interviewCandidate.id,
      job_id: selectedJob.id,
      recruiter_id: user.id,
      scheduled_at: dateTime,
      notes: notes || ''
    });
    setShowInterview(false);
  }

  // AI: Parse and Score Resume
  async function handleScore(candidate) {
    const resumeText = candidate.resume || '';
    const jobDesc = selectedJob.description;
    setShowScore(true);
    const aiResp = await scoreResumeAI(resumeText, jobDesc);
    // Parse score, explanation
    let score = 0; let explanation = '';
    const s = (aiResp.match(/\d{1,3}/) || [])[0];
    if (s) score = s;
    const explMatch = aiResp.match(/Explanation:\s*([\s\S]+)/);
    explanation = explMatch ? explMatch[1].slice(0,250) : '';
    setAiScore(score);
    setAiExplanation(explanation);
  }

  // AI: Interview questions
  async function handleInterviewQ(candidate) {
    const resumeText = candidate.resume || '';
    const jobDesc = selectedJob.description;
    const questions = await generateInterviewQuestionsAI(jobDesc, resumeText);
    setInterviewQ(questions);
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Recruiter Dashboard</h2>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <b>Your Jobs</b>
            <Button size="sm" onClick={()=>setShowJobModal(true)}>+ Post Job</Button>
          </div>
          <Row className="mt-3">
            {jobs.map(job => (
              <Col md={6} key={job.id}>
                <JobCard
                  job={job}
                  onView={id => {}}
                  onCandidatesList={viewApplicants}
                  editable
                  onEdit={()=>{}}
                  onDelete={deleteJob}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Applicants Modal */}
      <Modal show={showApplicants} onHide={()=>setShowApplicants(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Applicants for {selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="list" id="applicants-tabs">
            <Tab eventKey="list" title="Applicants">
              {applicants.map(a => (
                <CandidateCard
                  key={a.candidate.id}
                  candidate={a.candidate}
                  onView={id => {}}
                  onInterview={cid => { setInterviewCandidate(a.candidate); setShowInterview(true); }}
                  score={a.ai_score}
                  onFeedback={async (cid)=>{
                    const featxt = await generateFeedbackAI(
                      a.notes || '', selectedJob?.description
                    );
                    alert(featxt);
                  }}
                />
              ))}
            </Tab>
            <Tab eventKey="interviews" title="Interview Q&A">
              {interviewQ || "Select a candidate to generate..."}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      {/* Interview Modal */}
      <InterviewModal
        show={showInterview}
        onHide={()=>setShowInterview(false)}
        onSubmit={handleInterview}
        candidateName={interviewCandidate?.name}
      />

      {/* Post Job Modal */}
      <Modal show={showJobModal} onHide={()=>setShowJobModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Post a New Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={jobForm.title} onChange={e=>setJobForm(j=>({...j, title: e.target.value}))} required />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={4} value={jobForm.description} onChange={e=>setJobForm(j=>({...j, description: e.target.value}))} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShowJobModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={createJob}>Post</Button>
        </Modal.Footer>
      </Modal>

      {/* AI Resume Score Modal */}
      <Modal show={showScore} onHide={()=>setShowScore(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>AI Resume Score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Scorecard
            score={aiScore}
            explanation={aiExplanation}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default RecruiterDashboard;
