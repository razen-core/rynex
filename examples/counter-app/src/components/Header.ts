import { hbox, text } from '../../../../dist/runtime/index.js';

interface HeaderProps {
  title: string;
}

export default function Header(props: HeaderProps) {
  view {
    hbox({ class: 'header' }, [
      text({ class: 'title' }, props.title)
    ])
  }

  style {
    .header {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      justify-content: center;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }
  }
}
