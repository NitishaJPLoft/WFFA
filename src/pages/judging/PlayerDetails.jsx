import React from 'react';

const PlayerDetails = props => {
    const {player} = props;

    return (
        <React.Fragment>
            <p>
                <strong>Competitor Name: </strong>
                {player.name}
            </p>
            <p>
                <strong>Username: </strong>
                {player.username}
            </p>
            <p>
                <strong>Age: </strong>
                {player.age}
            </p>
            <p>
                <strong>Country: </strong>
                {player.country}
            </p>
            <p>
                <strong>Gender: </strong>
                {player.gender}
            </p>
        </React.Fragment>
    );
};

export default PlayerDetails;
