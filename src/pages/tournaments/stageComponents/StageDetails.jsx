import React from 'react';
import SelectStageType from './SelectStageType';

const StageDetails = (props) => {
    const {name, handleTn1, snameError, description, setDescription, stageId, stageType, handleStageType} = props;
    return (
        <div className="row mb-3 mt-3">
            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">
                        Stage Name<span style={{color: '#e63737'}}>*</span>
                    </label>
                    <input
                        className="form-control"
                        id="exampleFormControlInput1"
                        placeholder="Stage Name"
                        value={name}
                        required
                        onChange={handleTn1}
                        maxLength={150}
                    />
                    <span className="help-block error text-danger">
                                                {snameError ? snameError : ''}
                                            </span>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1">
                        Stage Description (optional)
                    </label>
                    <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="5"
                        placeholder="Stage Description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        maxLength={1000}
                    />
                </div>
            </div>
            <div className="col-md-6"/>
            <SelectStageType stageId={stageId} stageType={stageType}
                             handleStageType={handleStageType}/>
        </div>
    );
};

export default StageDetails;
