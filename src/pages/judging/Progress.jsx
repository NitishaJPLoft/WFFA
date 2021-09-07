import React from 'react';
import PropTypes from 'prop-types';

const Progress = ({percentage, cancelUpload, multiple}) => {
    return (
        <React.Fragment>
            <div className='progress'>
                <div
                    className='progress-bar progress-bar-striped bg-success'
                    role='progressbar'
                    style={{width: `${percentage}%`}}
                >
                    {percentage}%
                </div>
            </div>
            <button type="button" style={{float: 'right', border: 'none', background: 'none', textDecoration: 'underline'}}
                    onClick={() => cancelUpload()}>Cancel
            </button>
        </React.Fragment>
    );
};

Progress.propTypes = {
    percentage: PropTypes.number.isRequired
};

export default Progress;