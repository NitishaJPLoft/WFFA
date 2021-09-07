import React from 'react';
import SingleRow from './SingleRow';

const Mobile = props => {
    const {user, handleModel} = props;

    return (
        <div className="modal fade hidden-lg mobil-mod show"
             id="exampleModal"
             tabIndex="-1"
             aria-labelledby="exampleModalLabel"
             style={{display: 'block', overflow: 'auto'}}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close">
                            <span aria-hidden="true">
                                <i className="fa fa-chevron-left" onClick={handleModel} style={{fontSize: '15px'}}>
                                    {' '} Back </i>
                            </span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {' '}
                        <SingleRow user={user}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mobile;
