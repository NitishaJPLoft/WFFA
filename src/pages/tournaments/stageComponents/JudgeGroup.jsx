import React from 'react';
import SelectUsers from "./SelectUsers";

const JudgeGroup = (props) => {
    const {index, groups, setGroups, users, stageType, battleRound ,setBattleRound} = props;
    return (
        <React.Fragment>
            <div className="form-group competitored">
                <label htmlFor="judgeGroup1">Judge
                    Group {groups && groups[index] ? groups[index].groupName : index + 1}</label>
                <SelectUsers groups={groups} stageType={stageType} index={index} users={users} setGroups={setGroups}
                             selected={groups && groups[index] && groups[index].judges[0]} userIndex={0} battleRound={battleRound} setBattleRound={setBattleRound} />
            </div>
            <div className="form-group competitored">
                <SelectUsers groups={groups} stageType={stageType} index={index} users={users} setGroups={setGroups}
                             selected={groups && groups[index] && groups[index].judges[1]} userIndex={1} battleRound={battleRound} setBattleRound={setBattleRound}/>
            </div>
            <div className="form-group competitored">
                <SelectUsers groups={groups} stageType={stageType} index={index} users={users} setGroups={setGroups}
                             selected={groups && groups[index] && groups[index].judges[2]} userIndex={2} battleRound={battleRound} setBattleRound={setBattleRound}/>
            </div>
        </React.Fragment>
    );
};

export default JudgeGroup;
