import { useState, useRef } from 'react';
import Button from './global/Button';
import Input from './global/Input';

const App = () => {
  const icon = useRef(null);
  const projectLocation = useRef(null);
  const configFiles = useRef(null);
  const [appName, setAppName] = useState(null);
  const [appColor, setAppColor] = useState(null);
  const [storeName, setStoreName] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [authDomain, setAuthDomain] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [storageBucket, setStorageBucket] = useState(null);
  const [messagingSenderId, setMessagingSenderId] = useState(null);
  const [appId, setAppId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(appName);
    console.log(icon.current.files[0]);
  }

  return (
    <div className='main-flex'>
      <div className='navbar'>
        <h1>Generar PWA</h1>
      </div>
      <form className='content-flex' onSubmit={handleSubmit}>
        <section>
          <h2>
            Datos de la aplicación
          </h2>
          <Input label='Nombre de la aplicación' type='text' handleValue={setAppName}/>
          <Input label='Ícono de la aplicación' type='file' ref={icon}/>
          <Input label='Color principal' type='color' handleValue={setAppColor} />
        </section>
        <section>
          <h2>
            Datos de la plaza
          </h2>
          <Input label='Nombre de la plaza' type='text' handleValue={setStoreName} />
        </section>
        <section>
          <h2>
            Datos del proyecto
          </h2>
          <Input label='Nombre del proyecto' type='text' />
          <Input label='Ubicación donde se guardará el proyecto' type='file' />
          <Input label='Arrastra y suelta tus archivos y folders aquí o busca tus archivos' type='file' />
        </section>
        <section>
          <h2>
            Datos de configuración de firebase
          </h2>
          <Input label='apiKey' type='text' />
          <Input label='authDomain' type='text' />
          <Input label='projectId' type='text' />
          <Input label='storageBucket' type='text' />
          <Input label='messagingSenderId' type='text' />
          <Input label='appId' type='text' />
        </section>
        <section>
          <Button variant='primary' label='Generar PWA' type='submit' />
        </section>
      </form>
    </div>
  );
}

export default App;
