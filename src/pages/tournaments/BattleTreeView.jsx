import React, {useState} from 'react';
import TreeView from './TreeView';
import LoaderLayout from "../../layouts/LoaderLayout";
import TablePool from './stageComponents/TablePool';
import PoolPreview from './stageComponents/PoolPreview';

const BattleTreeView = (props) => {
    const {rounds, treeData, sId, isBattleLoader, roundname, thirdbattle, bracket, url, secondary, primary, enableWinner, stageType} = props;
    const [text, setText] = useState('show');
    const [check, setCheck] = useState('');
    

    const changeText = (e) => {
        e.preventDefault();
        if (text === 'show') {
            setText('hide');
            setCheck('')
        } else {
            setText('show');
            setCheck('')
        }
    };

    const changeTextPool = (e) => {
        e.preventDefault();
        if (text === 'show') {
            setText('hide');
            setCheck('poolpreview')
        } else {
            setText('show');
            setCheck('')
        }
    };

    return (
        <React.Fragment>
            <p><strong>Bracket </strong>
                <a data-toggle="collapse" onClick={(e) => changeText(e)}
                   href={'#round_' + (rounds && rounds[0] && (rounds[0].id || rounds[0].roundId))}
                   aria-expanded="false"
                   aria-controls={'round_' + (rounds && rounds[0] && (rounds[0].id || rounds[0].roundId))}>[{text}]</a>

                <a href={(stageType === 'battle' ? '/battle-public/' : '/pool-public/') + sId} target="_blank"
                   rel="noreferrer"> Public View</a>

                {stageType === 'pool' ?
                    <a data-toggle="collapse" onClick={(e) => changeTextPool(e)}
                       href={'#round_' + (rounds && rounds[0] && (rounds[0].id || rounds[0].roundId))}
                       aria-expanded="false"
                       aria-controls={'round_' + (rounds && rounds[0] && (rounds[0].id || rounds[0].roundId))}>&nbsp;
                        Pool Preview</a>
                    : ""}

            </p>

            <div className="collapse fade" id={'round_' + (rounds && rounds[0] && (rounds[0].id || rounds[0].roundId))}>
                <div className="card card-body">
                    {check === "poolpreview" ? <PoolPreview stageId={sId}/> :
                        <React.Fragment>
                        {isBattleLoader ? <LoaderLayout/> :
                            treeData && stageType === 'battle' ?
                                <div className="brackets" style={{width: 340 * treeData.length}}>
                                    <TreeView treeData={treeData} roundname={roundname} bracket={bracket} url={url}
                                              thirdbattle={thirdbattle} secondary={secondary} primary={primary}
                                              enableWinner={enableWinner}/>
                                </div> :
                                <React.Fragment>
                                    {treeData && treeData.battles ? treeData.battles.map((data, index) =>
                                    <>

                                        <TablePool index={''} ListData={data} enableWinner={treeData.enable_final} advanceToNextRound={treeData.advanceToNextRound} type={'show'}/>
                                        </>
                                    ) : ''}

                                    </React.Fragment>
                            }
                        </React.Fragment>
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default BattleTreeView;