import React from 'react';
import { Card, Image } from 'react-bootstrap';

function ProfileCard({ user }) {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3 text-center">User Profile</Card.Title>
        <Card.Text className="text-center">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
            roundedCircle
            width={80}
            height={80}
            className="mb-3"
            alt="avatar"
          /><br />
          <strong>Username:</strong> {user.username}<br />
          <strong>Email:</strong> {user.email}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProfileCard;
