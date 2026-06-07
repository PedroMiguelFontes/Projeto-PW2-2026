const fetch = global.fetch || require('node-fetch');

(async () => {
  const base = 'http://localhost:3000';
  const user = {
    nome: 'Login Test',
    email: 'login.test@example.com',
    password: 'Pass1234',
    tipo: 'Utilizador',
    estado: 'Ativo'
  };

  try {
    console.log('Creating test user...');
    let res = await fetch(`${base}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    console.log('Create status', res.status);
    console.log(await res.text());

    console.log('Logging in...');
    res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password })
    });
    console.log('Login status', res.status);
    const loginBody = await res.json();
    console.log(loginBody);

    if (loginBody.token) {
      console.log('Calling protected /api/users/me...');
      const profileRes = await fetch(`${base}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginBody.token}`
        }
      });
      console.log('Profile status', profileRes.status);
      console.log(await profileRes.text());
    }
  } catch (err) {
    console.error(err);
  }
})();
