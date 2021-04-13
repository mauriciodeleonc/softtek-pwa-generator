import { useState, useRef } from 'react';
import Button from './global/Button';
import Input from './global/Input';
import Dropzone from './global/Dropzone';

const App = () => {
  const [iconPath, setIconPath] = useState(null);
  const [iconImg, setIconImg] = useState(null);
  const [projectLocation, setProjectLocation] = useState(null);
  const configFiles = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [appName, setAppName] = useState({
    label: 'Nombre de la aplicación',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor define un nombre de la aplicación para poder continuar',
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
    errorText: 'Por favor escribe el nombre de la plaza para poder continuar',
    valid: false,
  });
  const [projectName, setProjectName] = useState({
    label: 'Nombre del proyecto',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor define un nombre del proyecto para poder continuar',
    valid: false,
  });
  const [apiKey, setApiKey] = useState({
    label: 'apiKey',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor escribe tu apiKey para poder continuar',
    valid: false,
  });
  const [authDomain, setAuthDomain] = useState({
    label: 'authDomain',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor escribe tu authDomain para poder continuar',
    valid: false,
  });
  const [projectId, setProjectId] = useState({
    label: 'projectId',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor escribe tu projectId para poder continuar',
    valid: false,
  });
  const [storageBucket, setStorageBucket] = useState({
    label: 'storageBucket',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor escribe tu storageBucket para poder continuar',
    valid: false,
  });
  const [messagingSenderId, setMessagingSenderId] = useState({
    label: 'messagingSenderId',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor escribe tu messagingSenderId para poder continuar',
    valid: false,
  });
  const [appId, setAppId] = useState({
    label: 'appId',
    type: 'text',
    value: '',
    required: true,
    errorText: 'Por favor escribe tu appId para poder continuar',
    valid: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(appName.value.trim() !== '' && appName.required) {
      setAppName({...appName, valid: true});
    } else {
      setAppName({...appName, valid: false});
    } 

    if(storeName.value.trim() !== '' && storeName.required) {
      setStoreName({...storeName, valid: true});
    } else {
      setStoreName({...storeName, valid: false});
    }

    if(projectName.value.trim() !== '' && projectName.required) {
      if(/^[a-zA-Z0-9-]*$/.test(projectName.value)) {
        setProjectName({...projectName, valid: true});
      } else {
        setProjectName({...projectName, valid: false, errorText: 'El nombre del proyecto solo puede estar conformado por letras, números, y guiones'});
      }
    } else {
      setProjectName({...projectName, valid: false, errorText: 'Por favor define un nombre del proyecto para poder continuar'});
    }
    
    if(apiKey.value.trim() !== '' && apiKey.required) {
      setApiKey({...apiKey, valid: true});
    } else {
      setApiKey({...apiKey, valid: false});
    }

    if(authDomain.value.trim() !== '' && authDomain.required) {
      if(/^[a-zA-Z0-9-\\.]*$/.test(authDomain.value)) {
        setAuthDomain({...authDomain, valid: true});
      } else {
        setAuthDomain({...authDomain, valid: false, errorText: 'El authDomain solo puede estar conformado por letras, números, guiones, y puntos'});
      }
    } else {
      setAuthDomain({...authDomain, valid: false, errorText: 'Por favor escribe tu authDomain para poder continuar'});
    } 

    if(projectId.value.trim() !== '' && projectId.required) {
      if(/^[a-zA-Z0-9-]*$/.test(projectId.value)) {
        setProjectId({...projectId, valid: true});
      } else {
        setProjectId({...projectId, valid: false, errorText: 'El projectId solo puede estar conformado por letras, números, y guiones'});
      }
    } else {
      setProjectId({...projectId, valid: false, errorText: 'Por favor escribe tu projectId para poder continuar'});
    }

    if(storageBucket.value.trim() !== '' && storageBucket.required) {
      if(/^[a-zA-Z0-9-\\.]*$/.test(storageBucket.value)) {
        setStorageBucket({...storageBucket, valid: true});
      } else {
        setStorageBucket({...storageBucket, valid: false, errorText: 'El storageBucket solo puede estar conformado por letras, números, guiones, y puntos'});
      }
    } else {
      setStorageBucket({...storageBucket, valid: false, errorText: 'Por favor escribe tu storageBucket para poder continuar'});
    }

    if(messagingSenderId.value.trim() !== '' && messagingSenderId.required) {
      if(/^[0-9]*$/.test(projectId.value)) {
        setMessagingSenderId({...messagingSenderId, valid: true});
      } else {
        setMessagingSenderId({...messagingSenderId, valid: false, errorText: 'El messagingSendeId solo puede estar conformado por números'});
      }
    } else {
      setMessagingSenderId({...messagingSenderId, valid: false, errorText: 'Por favor escribe tu messagingSenderId para poder continuar'});
    }

    if(appId.value.trim() !== '' && appId.required) {
      setAppId({...appId, valid: true});
    } else {
      setAppId({...appId, valid: false});
    }
    //console.log(icon.current.files[0]);
    //console.log(projectLocation.current.files[0]);
    //console.log(configFiles.current.files[0]);
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
            label={'Ícono de la aplicación'}
            value={iconPath ? iconPath : ''}
            type='file'
            name='icon'
            size='md'
            buttonLabel='Escoger archivo'
            accept='image/*'
            handleFiles={(e) => {
                setIconImg(URL.createObjectURL(e.target.files[0]));
                setIconPath(e.target.value);
              }
            }
          />
          <img src={iconImg} className='icon' />
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
            value={projectLocation ? projectLocation : ''}
            name='projectLocation'
            size='lg'
            buttonLabel='Escoger ruta'
            handleFiles={(e) => setProjectLocation(e.target.value)}
          />
          <h3>Archivos de configuración</h3>
          <Dropzone />
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
