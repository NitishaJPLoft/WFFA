import React from 'react';
import LandingPageInfo from './LandingPageInfo';

const TeamDetails = (props) => {
    const {handleSelectedPath,pathSkill,pathSkillId,teamData, team, setTeam, videolink, setVideolink, detailh1, setDetailh1, bodytext, setBodytext} = props;
    return (
        <React.Fragment>
            
            <label htmlFor="exampleFormControlInput1">
            Select Path
                <span style={{color: '#e63737'}}>*</span>
            </label>
              <div id="custom-select">
              
            <select  onChange={handleSelectedPath} value={pathSkillId}  required>
                <option value="">Select Path </option>
                {pathSkill && pathSkill.length > 0
                    ? pathSkill.map((team, index) => (
                        <option
                            value={team.id}
                            key={index}
                        >
                            {team.name}
                        </option>
                    ))
                    : ''}
            </select>
        </div>
            <div className="form-group">
                <label>
                    Assigned Path Counts: {teamData.pathcount}{' '}
                </label>
            </div>
            <div className="form-group">
                <label>
                    Number of Competitors: {teamData.members}{' '}
                </label>
            </div>
            <div className="form-group">
                <label>Number of Videos: {teamData.totalvideo}</label>
            </div>
            <hr/>
            <div className="form-group">
                <label htmlFor="exampleFormControlInput1">
                    Team Invite Code<span style={{color: '#e63737'}}>*</span>
                </label>
                <input
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="XXXXX"
                    value={team}

                    onChange={e => setTeam(e.target.value)}
                    maxLength={50}
                />

            </div>
            <LandingPageInfo videolink={videolink} setVideolink={setVideolink} detailh1={detailh1}
                             setDetailh1={setDetailh1} bodytext={bodytext} setBodytext={setBodytext}/>
        </React.Fragment>
    );
};

export default TeamDetails;
