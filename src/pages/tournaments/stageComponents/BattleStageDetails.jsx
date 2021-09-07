import React from 'react';
import RadioLayout from '../../../layouts/RadioLayout';
import LandingPageInfo from './LandingPageInfo';

const BattleStageDetails = (props) => {
    const {thirdbracket, setThirdbracket, videolink, setVideolink, detailh1, setDetailh1, bodytext, setBodytext} = props;
    return (
        <div className="col-md-12 Configuration">
            <h6>
                <strong>Third Place Bracket</strong>
            </h6>
            <RadioLayout
                label="Yes"
                id="customRadio12"
                name="customRadioew"
                value='yes'
                checked={thirdbracket === 'yes'}
                handleChange={setThirdbracket}
            />
            <RadioLayout
                label="No"
                id="customRadio13"
                name="customRadioew"
                value='no'
                checked={thirdbracket === 'no'}
                handleChange={setThirdbracket}
            />
            <hr/>
            <LandingPageInfo videolink={videolink} setVideolink={setVideolink} detailh1={detailh1}
                             setDetailh1={setDetailh1} bodytext={bodytext} setBodytext={setBodytext}/>
        </div>
    );
};

export default BattleStageDetails;
