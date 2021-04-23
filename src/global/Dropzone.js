import React, { useCallback, useState, useRef, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import { Trash } from '../icons/icons';

const Dropzone = () => {
    const [files, setFiles] = useState([]);

    /*const onDrop = useCallback(accepted => {
        setAcceptedFiles([]);
        let aFiles = [...acceptedFiles];
        console.log(aFiles);
        for(let i = 0; i < accepted.length; i++) {
          aFiles.push(accepted[i]);
        }
        console.log(aFiles);
        setAcceptedFiles(aFiles);
        //setRejectedFiles(rejected);
    }, []);*/

    let {
        getRootProps, 
        getInputProps, 
        isDragActive,
        //fileRejections,
        acceptedFiles,
    } = useDropzone({
        onDrop,
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsm',
        noKeyboard: true,
        maxFiles: 1
    });

    useEffect(() => {
      setFiles(acceptedFiles);
    }, [acceptedFiles]);

    const acceptedFileItems = files.map(file => {
      const fileName = (file.path).replace(/\\/g, '/').split('/').pop();

      return (
        <li key={file.path}>
          <span><p className='bold text-smallest'>{fileName}</p> <Trash onClick={() => setFiles([])}/></span>
          {/*<progress id={file.path} value={progress} max={100}>hola</progress>*/}
          <div class="progress">
            <div class="progress-value"></div>
          </div>
        </li>
      );
    });
    
      /*const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      ));*/

    return (
        <>
            <div {...getRootProps({className: `dropzone ${isDragActive && 'dragging-file'}`})}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>¡Listo, ahora suelta tus archivos xls, xlsx, csv, aquí!</p> :
                <>
                        <p>
                            Arrastra y suelta tus archivos aquí
                            <br />
                            o
                            <br />
                            <span className='main-text'>Haz click aquí</span>
                        </p>
                </>
            }
            </div>
            <ul>{acceptedFileItems}</ul>
        </>
    )
}

export default Dropzone;