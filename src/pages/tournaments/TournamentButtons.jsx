import React from 'react';
import {Link} from 'react-router-dom';

const TournamentButtons = props => {
    const {tournament, updateTournamentStatus, isStatusUpdate, editPath, stagePath} = props;
    return (
        <div className="row">
            <div className="col-md-12 text-center">
                <Link
                    className="main-btn-cncel text-center"
                    to=""
                    style={{width: '250px'}}
                    onClick={updateTournamentStatus}
                >
                    {tournament.status ? 'Deactivate ' : 'Activate '}
                    Tournament{' '}
                    {isStatusUpdate ? (
                        <i className="fa fa-spinner fa-spin"/>
                    ) : (
                        ''
                    )}
                </Link>
                <Link
                    style={{width: '250px'}}
                    className="main-btn text-center"
                    to={editPath + tournament.id}
                >
                    Edit Tournament
                </Link>
                <Link
                    className="main-btn text-center"
                    style={{width: '250px'}}
                    to={stagePath}
                >
                    Create Stage
                </Link>
            </div>
        </div>
    )
};

export default TournamentButtons;
