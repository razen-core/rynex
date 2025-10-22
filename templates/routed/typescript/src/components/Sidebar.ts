import * as UI from 'rynex';

export default function Sidebar() {
  return UI.vbox({
    style: {
      padding: '2rem 1.5rem',
      background: '#0a0a0a',
      borderRight: '1px solid #333333',
      minHeight: '100vh',
      gap: '1.5rem',
      minWidth: '250px'
    }
  }, [
    UI.h3({
      style: {
        color: '#ffffff',
        margin: 0,
        fontSize: '1.125rem',
        fontWeight: '700',
        fontFamily: '"Montserrat", sans-serif'
      }
    }, 'Navigation'),
    
    UI.vbox({
      style: {
        gap: '0.5rem'
      }
    }, [
      UI.vbox({
        style: {
          padding: '0.75rem 1rem',
          background: 'rgba(0, 255, 136, 0.1)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }
      }, [
        UI.text({
          style: {
            color: '#00ff88',
            fontWeight: '600'
          }
        }, 'Dashboard')
      ]),
      
      UI.vbox({
        style: {
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        },
        onHover: {
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: '#333333'
        }
      }, [
        UI.text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Settings')
      ]),
      
      UI.vbox({
        style: {
          padding: '0.75rem 1rem',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        },
        onHover: {
          background: 'rgba(255, 255, 255, 0.05)',
          borderColor: '#333333'
        }
      }, [
        UI.text({
          style: {
            color: '#b0b0b0'
          }
        }, 'Profile')
      ])
    ])
  ]);
}
