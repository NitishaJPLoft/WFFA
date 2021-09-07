import React from 'react';
import Progress from './Progress';

const SingleRawVideo = props => {
    const {rawVideoLink, handleChange, uploadPercentage, hiddenFileInput, handleClick, fileName, cancelUpload, videoReceiveDate} = props;
    console.log('rawVideoLink', rawVideoLink);
    return (
        <div className="col-md-12 text-center">
            <form
                style={{display: 'flex', justifyContent: 'space-around', marginBottom: '20px', alignItems: 'center'}}>
                {typeof rawVideoLink === 'string' ?
                    <a target="_blank" rel="noreferrer" href={rawVideoLink}
                       style={{marginRight: '10px', width: '150px'}}>
                        <i className="fa fa-check" aria-hidden="true"/> Play Raw Video
                    </a> : <span style={{marginRight: '10px', width: '150px'}}>Raw video</span>}

                <button className="main-btn-cncel" style={{padding: "5px 10px"}} onClick={handleClick}>
                    Upload Raw Video
                </button>
                <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={e => handleChange(e)}
                    style={{display: 'none'}}
                    accept="video/mp4,video/x-m4v,video/*"
                />
                <label style={{
                    whiteSpace: "pre",
                    width: '200px',
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    alignItems: 'baseline'
                }}>{fileName}</label>
                <span style={{color: 'red', fontSize: '12px', position: 'absolute', bottom: '45px', right: '-10px'}}>
                    <strong>*Hint:</strong> Upload only <strong>.mp4 </strong> format videos and video name <strong>shouldn't have any special characters including "SPACE"</strong>
                </span>

                <i className="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right"
                   title={videoReceiveDate} style={{marginBottom: '10px'}}/>

                <br/>
            </form>
            <Progress percentage={uploadPercentage} cancelUpload={cancelUpload}/>
        </div>
    );
};

export default SingleRawVideo;
