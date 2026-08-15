import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link 
        href="/"
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          textDecoration: 'none',
          color: 'white',
          backgroundColor: '#629D23',
          borderRadius: '4px'
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
