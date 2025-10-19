import { hbox, text } from '../../../../dist/runtime/index.js';

export default function Footer() {
  view {
    hbox({ class: 'footer' }, [
      text({}, 'Built with ZenWeb 🧘')
    ])
  }

  style {
    .footer {
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      justify-content: center;
      color: white;
    }
  }
}
