import { div, text } from 'rynex';

export default function App() {
  return div({
    style: {
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }
  }, [
    text('Hello, Rynex!')
  ]);
}
