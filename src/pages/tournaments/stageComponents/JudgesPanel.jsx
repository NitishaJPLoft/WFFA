import React from 'react';

const JudgesPanel = (props) => {
    const {judgeCount, handleTn3, judges} = props;
    return (
        <React.Fragment>
            <hr/>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="judgeCount">
                            How many judge groups do you want to divide the
                            competitors into?
                            <span style={{color: '#e63737'}}>*</span>
                        </label>
                        <input
                            type="number"
                           
                            className="form-control"
                            id="judgeCount"
                            value={judgeCount}
                            min={0}
                            onChange={handleTn3}
                            placeholder="Enter Group No."
                        />
                    </div>

                    {judgeCount ? (
                        <React.Fragment>
                            <h5>Invite Judges</h5>

                            {judges}
                        </React.Fragment>
                    ) : null}
                </div>
            </div>
        </React.Fragment>
    );
};

export default JudgesPanel;
