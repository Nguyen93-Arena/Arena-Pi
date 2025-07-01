import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState('🔄 Initiating Pi SDK...');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const check = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.createPayment) {
          window.Pi.init({ version: '2.0', sandbox: true });
          setPi(window.Pi);
          setStatus('✅ Pi SDK ready (Testnet)');
          clearInterval(check);
        }
      }, 500);
      return () => clearInterval(check);
    }
  }, []);

  const handlePayment = async () => {
    if (!pi) return setError('❌ SDK not ready');
    try {
      await pi.createPayment({
        amount: 1,
        memo: 'Arena-Pi Test',
        metadata: { action: 'pvp_test' },
        onReadyForServerApproval: async (paymentId) => {
          await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/payment/approve', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId })
          });
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/payment/complete', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId, txid })
          });
        },
        onError: (e) => { setError('❌ Payment failed'); }
      });
    } catch (e) {
      setError('❌ Exception during payment');
    }
  };

  return (
    <main style={{ padding: 20, fontFamily: 'Arial' }}>
      <img src="/logo.png" width={80} alt="Logo" />
      <h1>Arena‑Pi Testnet</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handlePayment} disabled={!pi} style={{ padding: '10px 20px', background: '#0080ff', color: '#fff' }}>
        Thanh toán Test Pi
      </button>
    </main>
  );
}
