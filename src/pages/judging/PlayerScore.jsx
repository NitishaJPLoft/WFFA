import React from 'react';

const PlayerScore = props => {
    const {player, calculateScore} = props;

    return (
        <div className="col-md-12 text-left wnr-bg py-2">
            <h6>
                {player.winner ? (
                    <strong
                        style={{
                            minHeight: '24px',
                            display: 'block',
                        }}
                    >
                        {player &&
                        player.winner &&
                        player.winner === player.id
                            ? 'Winner'
                            : ''}
                    </strong>
                ) : (
                    ''
                )}
            </h6>
            <h6>
                <strong>Score: {calculateScore(player)}</strong>
            </h6>
            {player.score && player.score.length ? player.score.map((jud, index) => (
                <React.Fragment key={index}>
                    <p key={'battle_' + index}>
                        <small>
                            {jud.displayName} Score: {jud.score}
                        </small>
                    </p>
                </React.Fragment>
            )) : ''}
        </div>
    );
};

export default PlayerScore;
