import React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'

const Dropzone = () => {
    /*const [acceptedFiles, setAcceptedFiles] = useState();*/

    /*const onDrop = useCallback(accepted => {
        setAcceptedFiles(accepted);
        //setRejectedFiles(rejected);
    }, []);*/

    const {
        getRootProps, 
        getInputProps, 
        isDragActive,
        fileRejections,
        acceptedFiles,
    } = useDropzone({
        /*onDrop,*/
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        noKeyboard: true,
    });

    const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));
    
      const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      ));

    return (
        <>
            <div {...getRootProps({className: `dropzone ${isDragActive && (fileRejections ? 'rejecting-file' : 'dragging-file')}`})}>
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
        <ul>{fileRejectionItems}</ul>
        </>
    )
}

export default Dropzone;