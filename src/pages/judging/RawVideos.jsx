import React from 'react';
import VideoInput from './VideoInput';

const RawVideos = props => {
    const {rawVideos, handleChangeForPlayer, player, type} = props;
    console.log('type', type);
    console.log('type === \'skill\'', type === 'skill');
    return (
        rawVideos && rawVideos.length ? rawVideos.map((obj, index) => (
            <form key={'rawVideo' + player + '_' + obj.index}
                  style={{display: 'flex', justifyContent: 'space-around', marginBottom: '10px', alignItems: 'center'}}>
                {obj.video && typeof obj.video === 'string' ?
                    <React.Fragment>
                        <a target="_blank" rel="noreferrer" href={obj.video}
                           style={{marginRight: '10px'}}>
                            <i className="fa fa-check" aria-hidden="true"/> Play Raw Video
                        </a>
                        <span>{type === 'skill' ? ('for ' + obj.skillName) : ('for Round ' + (parseInt(obj.index) + 1))}</span>
                    </React.Fragment> :
                    <span
                        style={{marginRight: '10px'}}>{'No Raw video for ' + (type === 'skill' ? obj.skillName : 'Round ' + parseInt(obj.index) + 1)}</span>}
                <VideoInput handleChangeForPlayer={handleChangeForPlayer} obj={obj} player={player}/>
                <i className="fa fa-info-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right"
                   title={obj.date} style={{marginBottom: '10px'}}/>

            </form>
        )) : ''
    );
};

export default RawVideos;
