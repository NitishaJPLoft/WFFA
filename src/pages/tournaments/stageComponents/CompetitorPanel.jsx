import React from 'react';

const CompetitorPanel = (props) => {
    const {selectCompetitors, noOfCompetitors, elements, compError} = props;

    return (
        <div className="row">
            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">
                        Number of Competitors
                        <span style={{color: '#e63737'}}>*</span>
                    </label>
                    <div id="custom-select">
                        <select
                            onChange={e => selectCompetitors(e.target.value)}
                            value={noOfCompetitors}
                            required
                        >
                            <option value="">Select</option>
                            {elements}
                        </select>
                    </div>
                    <span className="help-block error text-danger">
                        {compError ? compError : ''}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CompetitorPanel;
