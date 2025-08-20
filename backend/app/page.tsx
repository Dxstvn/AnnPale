export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Ann Pale Backend API</h1>
      <p>API Status: Running</p>
      <p>Version: 1.0.0</p>
      <hr />
      <h2>Available Endpoints:</h2>
      <ul>
        <li>POST /api/auth/signup - Register new user</li>
        <li>POST /api/auth/login - Login user</li>
        <li>POST /api/auth/logout - Logout user</li>
        <li>GET /api/auth/session - Get current session</li>
        <li>GET /api/auth/profile - Get user profile</li>
        <li>PUT /api/auth/profile - Update user profile</li>
        <li>POST /api/auth/magic-link - Send magic link</li>
        <li>POST /api/auth/verify - Verify email</li>
      </ul>
    </div>
  )
}