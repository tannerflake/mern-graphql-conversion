import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/graphql/mutations';
import Auth from '../utils/auth';

const LoginForm: React.FC = () => {
  const [formState, setFormState] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const [login] = useMutation(LOGIN_USER);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await login({ variables: formState });
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formState.email}
        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formState.password}
        onChange={(e) => setFormState({ ...formState, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;