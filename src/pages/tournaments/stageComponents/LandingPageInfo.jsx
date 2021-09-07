import React from 'react';
import {Editor} from "react-draft-wysiwyg";

const LandingPageInfo = (props) => {
    const {videolink, setVideolink, detailh1, setDetailh1, bodytext, setBodytext} = props;
    return (
        <React.Fragment>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput1">
                    Video Link<span style={{color: '#e63737'}}>*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Video Link"
                    value={videolink}

                    onChange={e => setVideolink(e.target.value)}
                />

            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput1">
                    Details H1<span style={{color: '#e63737'}}>*</span>
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Details H1"
                    value={detailh1}
                    onChange={e => setDetailh1(e.target.value)}
                    maxLength={50}
                />

            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">
                    Body Text
                </label>
                <Editor
                    editorState={bodytext}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={setBodytext}
                />
            </div>
        </React.Fragment>
    );
};

export default LandingPageInfo;
