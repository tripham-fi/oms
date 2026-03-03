// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // ← added AxiosError import
import { Button, Form, Header, Icon, Message, Segment, Container } from 'semantic-ui-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/account/login', {
        username,
        password,
      });

      const { token } = response.data.result;

      localStorage.setItem('jwtToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/');
    } catch (err) {
      const error = err as AxiosError;

      const msg =  error.message 
        ?? 'Login failed. Please try again.';

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container text className="mt-5">
      <Segment raised padded="very">
        <Header as="h2" textAlign="center" color="blue">
          <Icon name="sign in alternate" />
          OMS Login
        </Header>

        <Form onSubmit={handleSubmit} loading={loading} error={!!error}>
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label={<label style={{ textAlign: 'left' }}>Username</label>}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Form.Input
            fluid
            icon={
              <Icon
                name={showPassword ? 'eye slash' : 'eye'}
                link
                onClick={() => setShowPassword(!showPassword)}
              />
            }
            iconPosition="left"
            label={<label style={{ textAlign: 'left' }}>Password</label>}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Message error header="Login Error" content={error} />
          )}

          <Button
            fluid
            primary
            size="large"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Login
          </Button>
        </Form>
      </Segment>
    </Container>
  );
};

export default LoginPage;