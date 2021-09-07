import React from 'react';
import user from '../../images/user.png';
import BattleTreeView from "./BattleTreeView";
import BattleAccordian from "./BattleAccordian";

const imageList = [user];

imageList.forEach(image => {
    new Image().src = image;
});

const BattleZoneView = (props) => {
    const {rounds, capitalizeWord, treeData, tId, stageId, isBattleLoader, competitorLength, roundname,
        thirdbattle, bracket, url, secondary, primary, enableWinner, stageType} = props;

    return (
        <React.Fragment>
            <BattleAccordian rounds={rounds} capitalizeWord={capitalizeWord} competitorLength={competitorLength}
                             stageType={stageType} stageId={stageId} />
                             {stageType=== "pool" ?
                              <BattleTreeView url={url} thirdbattle={thirdbattle} bracket={bracket} roundname={roundname}
                                isBattleLoader={isBattleLoader} rounds={rounds} treeData={treeData} tId={tId}
                                sId={stageId} secondary={secondary} primary={primary} enableWinner={enableWinner}
                                stageType={stageType} /> :
                                <>
            {rounds && rounds[0] && rounds[0].competitors && rounds[0].competitors.length ?
                <BattleTreeView url={url} thirdbattle={thirdbattle} bracket={bracket} roundname={roundname}
                                isBattleLoader={isBattleLoader} rounds={rounds} treeData={treeData} tId={tId}
                                sId={stageId} secondary={secondary} primary={primary} enableWinner={enableWinner}
                                stageType={stageType} />
                : null}
                </>
            }

        </React.Fragment>
    );
};

export default BattleZoneView;
