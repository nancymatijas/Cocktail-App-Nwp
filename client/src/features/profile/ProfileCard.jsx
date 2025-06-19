import { Card, Image } from 'react-bootstrap';
import { FaEnvelope } from 'react-icons/fa';
import "../../App.css"

function ProfileCard({ user }) {
  return (
    <Card className="mb-4 shadow-sm" style={{ borderRadius: '1.2rem' }}>
      <Card.Body className="d-flex flex-column align-items-center">
        <Image
          src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
          roundedCircle
          width={96}
          height={96}
          className="profile-avatar"
          alt="avatar"
        />
        <div className="profile-username">{user.username}</div>

        <div className="profile-info">
          <FaEnvelope style={{ color: '#6c757d' }} />
          <span>{user.email}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProfileCard;
