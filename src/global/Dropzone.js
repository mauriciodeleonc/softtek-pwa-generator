import React, { useState, useEffect } from 'react'
import {useDropzone} from 'react-dropzone'
import { Trash } from '../icons/icons';

const Dropzone = (props) => {
    const [files, setFiles] = useState([]);

    let {
        getRootProps, 
        getInputProps, 
        isDragActive,
        acceptedFiles,
    } = useDropzone({
        accept: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .xlsm',
        noKeyboard: true,
        maxFiles: 1
    });

    useEffect(() => {
      setFiles(acceptedFiles);
      props.handleAcceptedFile(acceptedFiles[0]);
    }, [acceptedFiles]);

    const acceptedFileItems = files.map(file => {
      const fileName = (file.path).replace(/\\/g, '/').split('/').pop();

      return (
        <li key={file.path}>
          <span><p className='bold text-smallest'>{fileName}</p> <Trash onClick={() => setFiles([])}/></span>
          <div className="progress">
            <div className="progress-value"></div>
          </div>
        </li>
      );
    });

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