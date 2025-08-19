import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

function Dashboard() {
  const [meta, setMeta] = useState({});

  useEffect(() => {
    fetch("/api/dashboard/metadata")
      .then(res => res.json())
      .then(setMeta);
  }, []);

  return (
    <Container className="mt-4">
      <h2>Dashboard</h2>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Total Mails</Card.Title>
              <Card.Text>{meta.total_mails || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Spam Mails</Card.Title>
              <Card.Text>{meta.spam_mails || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>{meta.users || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
