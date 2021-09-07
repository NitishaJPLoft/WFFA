import React from 'react';
import SelectTeams from './SelectTeams';

const PoolPanel = (props) => {
    const {teams, selectedTeam, handleSelectedTeam, teamDataError} = props;
    return (
        <React.Fragment>
            <label htmlFor="exampleFormControlInput1">
                Team Assigned to Stage
                <span style={{color: '#e63737'}}>*</span>
            </label>
            <SelectTeams
                handleSelectedTeam={handleSelectedTeam}
                selected={selectedTeam}
                teams={teams}
            />
            <span className="help-block error text-danger">
                {teamDataError ? teamDataError : ''}
            </span>
        </React.Fragment>
    );
};

export default PoolPanel;
