import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

// PUBLIC_INTERFACE
function AdminDashboard() {
  const [recruiters, setRecruiters] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newRecruiter, setNewRecruiter] = useState({ name: '', email: '' });
  const [stats, setStats] = useState({ jobs: 0, hires: 0, candidates: 0 });

  useEffect(() => {
    fetchRecruiters();
    fetchAnalytics();
    // eslint-disable-next-line
  }, []);

  async function fetchRecruiters() {
    let { data, error } = await supabase.from('profiles').select('*').eq('role', 'recruiter');
    if (!error) setRecruiters(data);
  }

  async function fetchAnalytics() {
    // Simulated analytics: #jobs, #candidates, #hires
    let jobs = await supabase.from('jobs').select('*');
    let cands = await supabase.from('profiles').select('*').eq('role','candidate');
    let hires = await supabase.from('applications').select('*').eq('status','hired');
    setStats({
      jobs: jobs.data.length,
      candidates: cands.data.length,
      hires: hires.data.length
    });
  }

  async function handleAddRecruiter() {
    // Only adds profile -- invite flow not implemented
    await supabase.from('profiles').insert([{ 
      name: newRecruiter.name, 
      email: newRecruiter.email, 
      role: 'recruiter' 
    }]);
    setShowAdd(false);
    setNewRecruiter({ name: '', email: '' });
    fetchRecruiters();
  }

  async function deleteRecruiter(id) {
    await supabase.from('profiles').delete().eq('id', id);
    fetchRecruiters();
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Card body className="mb-2"><b>Total Jobs</b> <div>{stats.jobs}</div></Card>
        </Col>
        <Col md={4}>
          <Card body className="mb-2"><b>Candidates</b> <div>{stats.candidates}</div></Card>
        </Col>
        <Col md={4}>
          <Card body className="mb-2"><b>Hires</b> <div>{stats.hires}</div></Card>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <b>Recruiter Management</b>
            <Button size="sm" onClick={()=>setShowAdd(true)}>Add Recruiter</Button>
          </div>
          <Table bordered striped>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map(r=>(
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>
                    <Button size="sm" variant="outline-danger" onClick={()=>deleteRecruiter(r.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Add recruiter modal */}
          <Modal show={showAdd} onHide={()=>setShowAdd(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Recruiter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control value={newRecruiter.name} onChange={e => setNewRecruiter(r=>({...r,name:e.target.value}))} required />
                </Form.Group>
                <Form.Group className="mt-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={newRecruiter.email} onChange={e => setNewRecruiter(r=>({...r,email:e.target.value}))} required />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddRecruiter}>Add</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;
