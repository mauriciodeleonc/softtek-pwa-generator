import { useState, useRef } from 'react';
import Button from './global/Button';
import Input from './global/Input';

const App = () => {
  const icon = useRef(null);
  const projectLocation = useRef(null);
  const configFiles = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [appName, setAppName] = useState({
    label: 'Nombre de la aplicación',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [appColor, setAppColor] = useState({
    label: 'Color principal (opcional)',
    type: 'color',
    value: '',
    required: false,
    errorText: '',
    valid: false,
  });
  const [storeName, setStoreName] = useState({
    label: 'Nombre de la plaza',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [projectName, setProjectName] = useState({
    label: 'Nombre del proyecto',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [apiKey, setApiKey] = useState({
    label: 'apiKey',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [authDomain, setAuthDomain] = useState({
    label: 'authDomain',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [projectId, setProjectId] = useState({
    label: 'projectId',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [storageBucket, setStorageBucket] = useState({
    label: 'storageBucket',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [messagingSenderId, setMessagingSenderId] = useState({
    label: 'messagingSenderId',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });
  const [appId, setAppId] = useState({
    label: 'appId',
    type: 'text',
    value: '',
    required: true,
    errorText: '',
    valid: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(appName.value.trim() !== '' && appName.required) {
      setAppName({...appName, valid: true});
    }
    if(storeName.value.trim() !== '' && storeName.required) {
      setStoreName({...storeName, valid: true});
    }
    if(projectName.value.trim() !== '' && projectName.required) {
      setProjectName({...projectName, valid: true});
    }
    if(apiKey.value.trim() !== '' && apiKey.required) {
      setApiKey({...apiKey, valid: true});
    }
    if(authDomain.value.trim() !== '' && authDomain.required) {
      setAuthDomain({...authDomain, valid: true});
    }
    if(projectId.value.trim() !== '' && projectId.required) {
      setProjectId({...projectId, valid: true});
    }
    if(storageBucket.value.trim() !== '' && storageBucket.required) {
      setStorageBucket({...storageBucket, valid: true});
    }
    if(messagingSenderId.value.trim() !== '' && messagingSenderId.required) {
      setMessagingSenderId({...messagingSenderId, valid: true});
    }
    if(appId.value.trim() !== '' && appId.required) {
      setAppId({...appId, valid: true});
    }
    console.log(icon.current.files[0]);
    console.log(projectLocation.current.files[0]);
    console.log(configFiles.current.files[0]);
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
          <Input 
            label={appName.label}
            type={appName.type}
            handleValue={(value) => setAppName({...appName, value})}
            required={appName.required}
            errorText={appName.errorText}
            submitted={submitted}
            valid={appName.valid}
          />
          <Input
            label='Ícono de la aplicación'
            type='file'
            ref={icon}
          />
          <Input
            label={appColor.label}
            type={appColor.type}
            handleValue={(value) => setAppColor({...appColor, value})}
          />
        </section>
        <section>
          <h2>
            Datos de la plaza
          </h2>
          <Input 
            label={storeName.label}
            type={storeName.type}
            handleValue={(value) => setStoreName({...storeName, value})}
            required={storeName.required}
            errorText={storeName.errorText}
            submitted={submitted}
            valid={storeName.valid}
          />
        </section>
        <section>
          <h2>
            Datos del proyecto
          </h2>
          <Input
            label={projectName.label}
            type={projectName.type}
            handleValue={(value) => setProjectName({...projectName, value})}
            required={projectName.required}
            errorText={projectName.errorText}
            submitted={submitted}
            valid={projectName.valid}
          />
          <Input
            label='Ubicación donde se guardará el proyecto'
            type='file'
            ref={projectLocation}
          />
          <h3>Archivos de configuración</h3>
          <Input
            label='Arrastra y suelta tus archivos y folders aquí o busca tus archivos'
            type='file'
            ref={configFiles}
          />
        </section>
        <section>
          <h2>
            Datos de configuración de firebase
          </h2>
          <Input 
            label={apiKey.label}
            type={apiKey.type}
            handleValue={(value) => setApiKey({...apiKey, value})}
            required={apiKey.required}
            errorText={apiKey.errorText}
            submitted={submitted}
            valid={apiKey.valid}
          />
          <Input
            label={authDomain.label}
            type={authDomain.type}
            handleValue={(value) => setAuthDomain({...authDomain, value})}
            required={authDomain.required}
            errorText={authDomain.errorText}
            submitted={submitted}
            valid={authDomain.valid}
          />
          <Input
            label={projectId.label}
            type={projectId.type}
            handleValue={(value) => setProjectId({...projectId, value})}
            required={projectId.required}
            errorText={projectId.errorText}
            submitted={submitted}
            valid={projectId.valid}
          />
          <Input
            label={storageBucket.label}
            type={storageBucket.type}
            handleValue={(value) => setStorageBucket({...storageBucket, value})}
            required={storageBucket.required}
            errorText={storageBucket.errorText}
            submitted={submitted}
            valid={storageBucket.valid}
          />
          <Input
            label={messagingSenderId.label}
            type={messagingSenderId.type}
            handleValue={(value) => setMessagingSenderId({...messagingSenderId, value})}
            required={messagingSenderId.required}
            errorText={messagingSenderId.errorText}
            submitted={submitted}
            valid={messagingSenderId.valid}
            size='md'
          />
          <Input
            label={appId.label}
            type={appId.type}
            handleValue={(value) => setAppId({...appId, value})}
            required={appId.required}
            errorText={appId.errorText}
            submitted={submitted}
            valid={appId.valid}
          />
        </section>
        <section>
          <Button variant='primary' label='Generar PWA' type='submit' />
        </section>
      </form>
    </div>
  );
}

export default App;
