import { useState, useRef, useEffect } from 'react';
import Button from './global/Button';
import Input from './global/Input';
import Dropzone from './global/Dropzone';
const fs = window.require('fs');
const { readExcel, connectFirebase } = require('./utils');
const App = () => {

  const [iconPath, setIconPath] = useState(null);
  const [iconImg, setIconImg] = useState(null);
  const [isIconValid, setIsIconValid] = useState(false);
  const [icon, setIcon] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (appName.value.trim() !== '' && appName.required) {
      setAppName({ ...appName, valid: true });
    } else {
      setAppName({ ...appName, valid: false });
    }

    if (storeName.value.trim() !== '' && storeName.required) {
      setStoreName({ ...storeName, valid: true });
    } else {
      setStoreName({ ...storeName, valid: false });
    }

    if (projectName.value.trim() !== '' && projectName.required) {
      if (/^[a-zA-Z0-9-]*$/.test(projectName.value)) {
        setProjectName({ ...projectName, valid: true });
      } else {
        setProjectName({ ...projectName, valid: false, errorText: 'El nombre del proyecto solo puede estar conformado por letras, números, y guiones' });
      }
    } else {
      setProjectName({ ...projectName, valid: false, errorText: 'Por favor define un nombre del proyecto para poder continuar' });
    }

    if (apiKey.value.trim() !== '' && apiKey.required) {
      setApiKey({ ...apiKey, valid: true });
    } else {
      setApiKey({ ...apiKey, valid: false });
    }

    if (authDomain.value.trim() !== '' && authDomain.required) {
      if (/^[a-zA-Z0-9-\\.]*$/.test(authDomain.value)) {
        setAuthDomain({ ...authDomain, valid: true });
      } else {
        setAuthDomain({ ...authDomain, valid: false, errorText: 'El authDomain solo puede estar conformado por letras, números, guiones, y puntos' });
      }
    } else {
      setAuthDomain({ ...authDomain, valid: false, errorText: 'Por favor escribe tu authDomain para poder continuar' });
    }

    if (projectId.value.trim() !== '' && projectId.required) {
      if (/^[a-zA-Z0-9-]*$/.test(projectId.value)) {
        setProjectId({ ...projectId, valid: true });
      } else {
        setProjectId({ ...projectId, valid: false, errorText: 'El projectId solo puede estar conformado por letras, números, y guiones' });
      }
    } else {
      setProjectId({ ...projectId, valid: false, errorText: 'Por favor escribe tu projectId para poder continuar' });
    }

    if (storageBucket.value.trim() !== '' && storageBucket.required) {
      if (/^[a-zA-Z0-9-\\.]*$/.test(storageBucket.value)) {
        setStorageBucket({ ...storageBucket, valid: true });
      } else {
        setStorageBucket({ ...storageBucket, valid: false, errorText: 'El storageBucket solo puede estar conformado por letras, números, guiones, y puntos' });
      }
    } else {
      setStorageBucket({ ...storageBucket, valid: false, errorText: 'Por favor escribe tu storageBucket para poder continuar' });
    }

    if (messagingSenderId.value.trim() !== '' && messagingSenderId.required) {
      if (/^[0-9]*$/.test(projectId.value)) {
        setMessagingSenderId({ ...messagingSenderId, valid: true });
      } else {
        setMessagingSenderId({ ...messagingSenderId, valid: false, errorText: 'El messagingSendeId solo puede estar conformado por números' });
      }
    } else {
      setMessagingSenderId({ ...messagingSenderId, valid: false, errorText: 'Por favor escribe tu messagingSenderId para poder continuar' });
    }

    if (appId.value.trim() !== '' && appId.required) {
      setAppId({ ...appId, valid: true });
    } else {
      setAppId({ ...appId, valid: false });
    }
    if ( //if all fields are valid, read excel and upload to firebase
      appName.valid &&
      appColor.valid &&
      storeName.valid &&
      projectName.valid &&
      apiKey.valid &&
      authDomain.valid &&
      projectId.valid &&
      storageBucket.valid &&
      messagingSenderId.valid &&
      appId.valid
      ) {
      const excelData = await readExcel('C:\\Users\\berna\\Documents\\Prácticas ITC\\excel test\\formato_pwa.xlsm');
      console.log('excel data:', excelData);
      //check if excel data is complete. return if not
      for (const rest of excelData) {
        if (!rest[1][1] || !rest[2][1] || !rest[3][1] || !rest[4][1] || !rest[5][1] || !rest[6][1] || !rest[7][1] || !rest[8][1]) {
          console.log('Excel restaurant data missing')
          return
        }
        for (let i = 12; i < rest.length; i++) {
          if (!rest[i][0] || !rest[i][1] || !rest[i][2] || !rest[i][3] || !rest[i][4] || !rest[i][5] || !rest[i][6]) {
            console.log('Excel restaurant product data missing')
            return
          }
        }
      }
      //connect to firebase
      // const db = await connectFirebase({
      //   apiKey: apiKey.value,
      //   authDomain: authDomain.value,
      //   projectId: projectId.value,
      //   storageBucket: storageBucket.value,
      //   messagingSenderId: messagingSenderId.value,
      //   appId: appId.value
      // })
      const [db, storage] = await connectFirebase({
        apiKey: "AIzaSyDBeKFfQLOXcTwzsoMDrepvk3BHvqUNFvY",
        authDomain: "test-bb03e.firebaseapp.com",
        projectId: "test-bb03e",
        storageBucket: "test-bb03e.appspot.com",
        messagingSenderId: "1035533266251",
        appId: "1:1035533266251:web:e2e8fcea80feec49228cce"
      })
      const batch = db.batch();
      batch.set(db.collection('faq').doc(), {
        questions: '¿Puedo actualizar el "Cajón de estacionamiento"?',
        answer: 'Una vez especificado el cajón ya no podrá actualizar la información, le recomendamos hacer la especificación una vez que se encuentre en el área reservada para "Order to Go"',
        position: 1
      })
      batch.set(db.collection('faq').doc(), {
        questions: '¿Dónde encuentro el número "Cajón de estacionamiento"?',
        answer: 'En el estacionamiento del centro comercial encontrará un área reservada para "Order to Go" y cada cajón tendrá una numeración que deberá de usar en la app',
        position: 2
      })
      batch.set(db.collection('faq').doc(), {
        questions: '¿Dónde actualizo el número de "Cajón de estacionamiento"?',
        answer: 'Una vez creada la orden, dirigirse a "Ordenes" en el menú inferior y dar click sobre "CAJÓN" de la orden a actualizar',
        position: 3
      })
      batch.set(db.collection('faq').doc(), {
        questions: "¿Porqué se canceló mi orden?",
        answer: "Existen varias razones por las cual una orden puede ser cancelada (comercio ha cerrado, producto no disponible, etc). Le recomendamos contactar al comercio para obtener más detalle",
        position: 4
      })
      batch.set(db.collection('faq').doc(), {
        questions: "¿Cómo se calcula la hora de entrega?",
        answer: "El tiempo estimado que aparece incluye el tiempo que le lleva a un restaurante aceptar y preparar un pedido promedio, y el tiempo que debería tomarle al establecimiento hacer la entrega en el punto acordado.",
        position: 11
      })
      batch.set(db.collection('faq').doc(), {
        questions: "¿Cómo puedo identificar cuando el personal del establecimiento realizará mi entrega?",
        answer: 'En la sección de "Ordenes" podrá ver el estatus de su pedido. Asegúrese de haber introducido el número de cajón, o de haber contactado al establecimiento para determinar el punto de entrega.',
        position: 12
      })
      batch.set(db.collection('faq').doc(), {
        questions: "Necesito hablar sobre mi pedido con el personal de entrega del establecimiento ¿cómo lo hago?",
        answer: "Diríjase a la sección del restaurante, luego presione sobre el número telefónico para iniciar la llamada. (Tendrá que aceptar permisos para llamar)",
        position: 13
      })
      batch.set(db.collection('faq').doc(), {
        questions: "¿Dónde debo esperar al personal de entrega del establecimiento?",
        answer: 'Tiene que ubicarse en el área reservada para "Order to Go", o puede comunicarse con el establecimiento para acordar un punto.',
        position: 14
      })
      batch.set(db.collection('faq').doc(), {
        questions: "¿Puedo hacer un pedido a domicilio por medio de la app?",
        answer: 'No, todos los pedidos realizados en la app son para recoger en el área reservada para "Order to Go".',
        position: 15
      })
      batch.set(db.collection('faq').doc(), {
        questions: "¿Tengo que realizar un pago extra a la app al hacer uso de ella?",
        answer: "No, todos los cobros de los pedidos que se realicen por medio de la app son llevados a cabo directamente por el establecimiento",
        position: 16
      })
      batch.commit();

      //add locations collection
      const locations = await db.collection('locations').add({
        isVisible: true,
        name: storeName.value
      })
      //update locations id field
      const locationsRef = db.collection('locations').doc(locations.id);
      await locationsRef.set({ id: locations.id }, { merge: true });

      //upload restaurant excel data to firebase
      for (const excelRestaurant of excelData) {
        //upload restaurant logo to firebase storage
        const localImage = await fs.readFileSync(excelRestaurant[8][1])
        const logoRef = await storage.ref().child(`/restaurantes/${excelRestaurant[1][1]}/logo_${excelRestaurant[1][1]}`)
        await logoRef.put(localImage, { contentType: 'image/jpeg' })
        const logoUrl = await logoRef.getDownloadURL()
        const paymentTypes = [];
        if (excelRestaurant[6][1].toLowerCase() === "sí" || excelRestaurant[6][1].toLowerCase() === "si") paymentTypes.push('Efectivo')
        if (excelRestaurant[7][1].toLowerCase() === "sí" || excelRestaurant[7][1].toLowerCase() === "si") paymentTypes.push('Tarjeta')
        //create restaurants subcollection in locations document
        const restaurant = await locationsRef.collection("restaurants").add({
          hours: `De ${excelRestaurant[3][1]} a ${excelRestaurant[4][1]}`,
          imageURL: logoUrl,
          name: excelRestaurant[1][1],
          description: excelRestaurant[2][1],
          paymentTypes: paymentTypes,
          phone: excelRestaurant[5][1],
          isOpen: true
        })
        //update id field
        const restaurantRef = await locationsRef.collection('restaurants').doc(restaurant.id);
        await restaurantRef.set({ id: restaurant.id }, { merge: true });

        //add restaurant's products
        for (let i = 12; i < excelRestaurant.length; i++) {
          //upload product image to firebase storage
          const localProductImage = await fs.readFileSync(excelRestaurant[i][6])
          const productImgRef = await storage.ref().child(`/restaurantes/${excelRestaurant[1][1]}/productos/${excelRestaurant[i][1]}`)
          await productImgRef.put(localProductImage, { contentType: 'image/jpeg' })
          const productImageUrl = await productImgRef.getDownloadURL()
          const product = await restaurantRef.collection("products").add({
            category: excelRestaurant[i][0],
            name: excelRestaurant[i][1],
            description: excelRestaurant[i][2],
            price: excelRestaurant[i][3],
            estimated_time: excelRestaurant[i][4],
            isAvailable: (excelRestaurant[i][5].toLowerCase() === "sí" || excelRestaurant[i][5].toLowerCase() === "si") ? true : false,
            img: productImageUrl
          })
          await restaurantRef.collection('products').doc(product.id).set({ id: product.id }, { merge: true });
        }
      }
    }
  }

  useEffect(() => {
    if (isIconValid) {
      setIconImg(URL.createObjectURL(icon));
      setIconPath(icon.path);
    } else {
      setIconImg(null);
      setIconPath(null);
    }
  }, [isIconValid]);

  const handleIconUpload = (e) => {
    setIsIconValid(false);
    setIcon(e.target.files[0]);

    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function (e) {
      let image = new Image();

      image.src = e.target.result;

      image.onload = function () {
        let height = this.height;
        let width = this.width;
        if (height !== width) {
          alert("Images must be same size");
          setIsIconValid(false);
          return false;
        } else {
          setIsIconValid(true);
          return true;
        }
      }
    }
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
            handleValue={(value) => setAppName({ ...appName, value })}
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
            handleFiles={handleIconUpload}
          />
          {iconImg &&
            <img src={iconImg} className='icon' />
          }
          <Input
            label={appColor.label}
            type={appColor.type}
            handleValue={(value) => setAppColor({ ...appColor, value })}
          />
        </section>
        <section>
          <h2>
            Datos de la plaza
          </h2>
          <Input
            label={storeName.label}
            type={storeName.type}
            handleValue={(value) => setStoreName({ ...storeName, value })}
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
            handleValue={(value) => setProjectName({ ...projectName, value })}
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
            directory
            handleFiles={(e) => {
              console.log(e.target.files[0].path);
              setProjectLocation(e.target.files[0].path);
            }}
          />
          <h3>Información de restaurantes</h3>
          <Dropzone />
        </section>
        <section>
          <h2>
            Datos de configuración de firebase
          </h2>
          <Input
            label={apiKey.label}
            type={apiKey.type}
            handleValue={(value) => setApiKey({ ...apiKey, value })}
            required={apiKey.required}
            errorText={apiKey.errorText}
            submitted={submitted}
            valid={apiKey.valid}
          />
          <Input
            label={authDomain.label}
            type={authDomain.type}
            handleValue={(value) => setAuthDomain({ ...authDomain, value })}
            required={authDomain.required}
            errorText={authDomain.errorText}
            submitted={submitted}
            valid={authDomain.valid}
          />
          <Input
            label={projectId.label}
            type={projectId.type}
            handleValue={(value) => setProjectId({ ...projectId, value })}
            required={projectId.required}
            errorText={projectId.errorText}
            submitted={submitted}
            valid={projectId.valid}
          />
          <Input
            label={storageBucket.label}
            type={storageBucket.type}
            handleValue={(value) => setStorageBucket({ ...storageBucket, value })}
            required={storageBucket.required}
            errorText={storageBucket.errorText}
            submitted={submitted}
            valid={storageBucket.valid}
          />
          <Input
            label={messagingSenderId.label}
            type={messagingSenderId.type}
            handleValue={(value) => setMessagingSenderId({ ...messagingSenderId, value })}
            required={messagingSenderId.required}
            errorText={messagingSenderId.errorText}
            submitted={submitted}
            valid={messagingSenderId.valid}
            size='md'
          />
          <Input
            label={appId.label}
            type={appId.type}
            handleValue={(value) => setAppId({ ...appId, value })}
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
