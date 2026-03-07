import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import './index.css'
import App from './App.jsx'
import "@radix-ui/themes/styles.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme appearance='dark' accentColor="violet" grayColor="sage" radius="large">
        <App />
    </Theme>
  </StrictMode>,
)
