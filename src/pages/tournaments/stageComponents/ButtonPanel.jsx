import React from 'react';
import {Link} from 'react-router-dom';

const ButtonPanel = (props) => {
    const {tournamentId, stageId, handleSaveStage} = props;
    return (
        <div className="row">
            <div className="col-md-12 text-right">
                <Link
                    to={'/application-dashboard/tournaments/' + tournamentId}
                    className="main-btn-cncel text-center"
                >
                    Cancel
                </Link>
                {tournamentId && stageId ?
                    <button type="submit" className="main-btn text-center">
                        Save
                    </button> :
                    <button
                        type="button"
                        onClick={e => handleSaveStage(e, 'finish')}
                        className="main-btn text-center"
                    >
                        Save
                    </button>
                }
            </div>
        </div>
    );
};

export default ButtonPanel;
