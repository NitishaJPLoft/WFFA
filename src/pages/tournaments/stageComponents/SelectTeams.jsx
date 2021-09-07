import React from 'react';

const SelectTeams = props => {
    const { handleSelectedTeam, selected, teams } = props;

    return (
        <div id="custom-select">
            <select onChange={handleSelectedTeam} value={selected} required>
                <option value="">Select </option>
                {teams && teams.length > 0
                    ? teams.map((team, index) => (
                        <option
                            value={JSON.stringify(team)}
                            key={index}
                        >
                            {team.name}
                        </option>
                    ))
                    : ''}
            </select>
        </div>
    );
};

export default SelectTeams;
