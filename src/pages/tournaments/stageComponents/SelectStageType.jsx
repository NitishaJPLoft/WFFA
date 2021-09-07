import React from 'react';
import RadioLayout from '../../../layouts/RadioLayout';

const SelectStageType = (props) => {
    const {stageId, stageType, handleStageType} = props;
    return (
        <div className="col-md-6">
            <div className="Configuration">
                <h6>
                    <label>
                        Select Stage Type
                        <span style={{color: '#e63737'}}>*</span>
                    </label>
                </h6>
                <RadioLayout
                    label="Skill"
                    id="Skill"
                    name="customRadioews"
                    value="skill"
                    disabled={stageId}
                    checked={stageType === 'skill'}
                    handleChange={e => handleStageType(e)}
                />

                <RadioLayout
                    label="BattleZone Bracket"
                    id="Battle"
                    value="battle"
                    name="customRadioews"
                    disabled={stageId}
                    checked={stageType === 'battle'}
                    handleChange={e => handleStageType(e)}
                />

                <RadioLayout
                    label="Battle Pool"
                    id="Pool"
                    value="pool"
                    name="customRadioews"
                    disabled={stageId}
                    checked={stageType === 'pool'}
                    handleChange={e => handleStageType(e)}
                />
            </div>
        </div>
    );
};

export default SelectStageType;
