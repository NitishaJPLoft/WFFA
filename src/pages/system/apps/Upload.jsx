import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import './dropzone.css';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',

    marginTop: 0,
    position: 'absolute',
    left: 0,
    top: 0,
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    marginBottom: 8,
    marginRight: 8,
    width: 130,
    height: 120,
    padding: 4,
    boxSizing: 'border-box',
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
    margin: '1px',
};

const img = {
    display: 'block',
    width: '100%',
    height: '',
};

const Upload = props => {
    const {handleUpload, image, deleteImage} = props;
    const [files, setFiles] = useState([]);

    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: acceptedFiles => {
            const file = acceptedFiles[0];
            handleUpload(file);
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img src={file.preview} style={img} alt="logo1"/>
            </div>
        </div>
    ));

    useEffect(() => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach(file => URL.revokeObjectURL(file.preview));
        }, [files]);

    const delImage = (e) => {
        e.preventDefault();
        setFiles([]);
        deleteImage(e);
    };

    return (
        <section className="container">
            <div className="dp-container " style={{position: 'relative'}}>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} required/>
                    <p>Drag Asset Here (png or jpeg)</p>
                    <button
                        type="button"
                        className="btn btn-default"
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgb(58, 160, 255)',
                        }}
                    >
                        Browse and Upload File
                    </button>
                    {image ? <i className="fa fa-close close-x" onClick={(e) => delImage(e)}/> : ''}
                </div>
                {image ?
                    <aside style={thumbsContainer}>
                        {thumbs.length > 0 ? (
                            thumbs
                        ) : (
                            <div style={thumb}>

                                <div style={thumbInner}>
                                    <img src={image} style={img} alt="logo"/>
                                </div>
                            </div>
                        )}
                    </aside>
                    : ''}
            </div>
        </section>
    );
};

export default Upload;
