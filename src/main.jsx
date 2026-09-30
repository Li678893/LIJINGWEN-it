import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ContentProvider } from './content/ContentContext.jsx';
import EditorBar from './editor/EditorBar.jsx';
import { editorEnabled } from './editor/editorEnabled.js';
import './styles.css';
import './editor/editor.css';
import './deployment-overrides.css';

// 线上默认不渲染编辑条，访客看不到入口；网址加 ?edit=1 才出现
createRoot(document.getElementById('root')).render(
  <ContentProvider>
    <App />
    {editorEnabled() && <EditorBar />}
  </ContentProvider>
);
