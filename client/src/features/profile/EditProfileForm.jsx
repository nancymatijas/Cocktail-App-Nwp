import { Form, Button } from 'react-bootstrap';
import ProfileFields from './components/ProfileFields';
import { useEditProfile } from './hooks/useEditProfile';

function EditProfileForm({ user, setUser, setEditing, setMessage }) {
  const { form, loading, handleChange, handleSubmit } = useEditProfile(user, setUser, setEditing, setMessage);

  return (
    <Form onSubmit={handleSubmit}>
      <ProfileFields form={form} onChange={handleChange} loading={loading} />
      <div className="d-flex justify-content-end gap-2">
        <Button 
          variant="secondary" 
          onClick={() => setEditing(false)}
          disabled={loading}
          type="button"
        >
          Cancel
        </Button>
        <Button 
          variant="success" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </Form>
  );
}

export default EditProfileForm;
