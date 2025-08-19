import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";

function SpamTable() {
  const [mails, setMails] = useState([]);
  const [sender, setSender] = useState("");

  const fetchMails = () => {
    let url = "/api/mails/spam";
    if (sender) url += `?sender=${encodeURIComponent(sender)}`;
    fetch(url)
      .then(res => res.json())
      .then(setMails);
  };

  useEffect(() => { fetchMails(); }, [sender]);

  const handleUndo = async (mail_id) => {
    await fetch("/api/mails/undo_spam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail_id }),
    });
    fetchMails();
  };

  return (
    <Container className="mt-4">
      <h2>Spam Mails</h2>
      <Form className="mb-3">
        <Form.Group>
          <Form.Label>Filter by Sender</Form.Label>
          <Form.Control value={sender} onChange={e => setSender(e.target.value)} />
        </Form.Group>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mail ID</th>
            <th>Sender</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Undo</th>
          </tr>
        </thead>
        <tbody>
          {mails.map(mail => (
            <tr key={mail.mail_id}>
              <td>{mail.mail_id}</td>
              <td>{mail.sender}</td>
              <td>{mail.subject}</td>
              <td>{mail.date}</td>
              <td>
                <Button variant="warning" onClick={() => handleUndo(mail.mail_id)}>Undo</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default SpamTable;
