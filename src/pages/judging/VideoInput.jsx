import React, {useState, useRef} from 'react';

const VideoInput = ({handleChangeForPlayer, obj, player}) => {
    const [file, setFile] = useState('No video file selected');
    const hiddenFileInput = useRef(null);

    const handleClick = e => {
        e.preventDefault();
        hiddenFileInput.current.click();
    };

    const handleChange = (e, index, player) => {
        setFile(e.target.files && e.target.files.length ? e.target.files[0].name : 'No video file selected');
        handleChangeForPlayer(e, index, player);
    };

    return (
        <React.Fragment>
            <button className="main-btn-cncel" style={{padding: "5px 10px"}} onClick={handleClick}>
                Upload Raw Video
            </button>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={e => handleChange(e, obj.index, player)}
                style={{display: 'none'}}
                accept="video/mp4,video/x-m4v,video/*"
            />
            <label style={{
                whiteSpace: "pre",
                width: '200px',
                overflow: "hidden",
                textOverflow: "ellipsis",
                alignItems: 'baseline'
            }}>{file}</label>
            <span style={{color: 'red', fontSize: '12px', position: 'absolute', bottom: '0', right: '-1px'}}>
                <strong>*Hint:</strong> Upload only <strong>.mp4 </strong> format videos and video name <strong>shouldn't have any special characters including "SPACE"</strong>
            </span>
        </React.Fragment>
    );
};

export default VideoInput;