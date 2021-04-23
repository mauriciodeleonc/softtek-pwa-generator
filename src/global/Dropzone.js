import React, { useCallback, useState, useRef } from 'react'
import {useDropzone} from 'react-dropzone'
import { Trash } from '../icons/icons';

const Dropzone = () => {
    const [acceptedFiles, setAcceptedFiles] = useState([]);

    const onDrop = useCallback(accepted => {
        let aFiles = [...acceptedFiles];
        console.log(aFiles);
        for(let i = 0; i < accepted.length; i++) {
          aFiles.push(accepted[i]);
        }
        console.log(aFiles);
        setAcceptedFiles(aFiles);
        //setRejectedFiles(rejected);
    }, []);

    const {
        getRootProps, 
        getInputProps, 
        isDragActive,
        //fileRejections,
        //acceptedFiles,
    } = useDropzone({
        onDrop,
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsm',
        noKeyboard: true,
    });

    const acceptedFileItems = acceptedFiles.map((file, i) => {
        const fileName = (file.path).replace(/\\/g, '/').split('/').pop();
        return (
          <li key={file.path}>
            <span><p className='bold text-smallest'>{fileName}</p> <Trash onClick={() => {
              let accepted = [...acceptedFiles];
              accepted.splice(i, 1);
              setAcceptedFiles(accepted);
            }}/></span>
            <progress id={file.path} value={file.size/2} max={file.size}>hola</progress>
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
            <div {...getRootProps({className: `dropzone ${isDragActive && (false ? 'rejecting-file' : 'dragging-file')}`})}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>¡Listo, ahora sueltalos!</p> :
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
            <h4>Accepted files</h4>
            <ul>{acceptedFileItems}</ul>
            <h4>Rejected files</h4>
            <ul>{/*fileRejectionItems*/}</ul>
        </>
    )
}

export default Dropzone;