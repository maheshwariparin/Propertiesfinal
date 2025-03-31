import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  {StageProvider} from "./context/SetStageContext.jsx"
import {PropertyProvider} from "./context/PropertyContext.jsx"
import { Provider } from "react-redux";
import store from "./Redux/store.js";
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PropertyProvider>
   <StageProvider>
    <App />
    </StageProvider>
  </PropertyProvider>
  </Provider>
)
