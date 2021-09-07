import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { apiCall, BASE_URL } from '../../helper/fetch';
import TreeView from './TreeView';
import LoaderLayout from '../../layouts/LoaderLayout';
import img from '../../assets/images/sponsers.png';
import TablePool from './stageComponents/TablePool';

const BattleTreeViewPublic = props => {
  const sId = props.match.params.sId;
  const poolpath = props.match.path.split('-');

  const { enqueueSnackbar } = useSnackbar();
  const [treeData, setTreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [name, setName] = useState('');
  const [roundname, setRoundname] = useState([]);
  const [thirdbattle, setThirdbattle] = useState([]);
  const [sponser, setSponser] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [secondary, setSecondary] = useState('');
  const [primary, setPrimary] = useState('');
  const [url, setUrl] = useState('');
  const [advance, setAdvance] = useState('');
  const [enableWinner, setEnableWinner] = useState(false);

  const createTreeOfBattles = useCallback(async () => {
    let url =
      BASE_URL +
      `${
        poolpath[0] !== '/pool'
          ? 'tournament/battletree?stage_id='
          : 'tournament/poolList?stageId='
      }` +
      sId;
    const response = await apiCall('GET', url);

    if (response.status === 200) {
      setName(response.data.tournamentName);
      setTreeData(response.data.battles);
      setSponser(response.data.sponserLogo);
      setRoundname(response.data.roundnames);
      setThirdbattle(response.data.thirdbattle);
      setBracket(response.data.bracket_logo);
      setUrl(response.data.landingpagelink);
      setSecondary(response.data.secondary);
      setPrimary(response.data.primary);
      setEnableWinner(response.data.enable_final);
      setAdvance(response.data.advanceToNextRound)
    } else {
      enqueueSnackbar('Error in creating tree structure', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
    setIsLoading(false);
    setIsInitialized(true);
  }, [enqueueSnackbar, sId]);

  useEffect(() => {
    if (!isInitialized) {
      createTreeOfBattles();
    }
  }, [isInitialized, createTreeOfBattles]);

  return (
    <div className="viw-tournament">
      {isLoading ? (
        <LoaderLayout />
      ) : (
        <div className="card card-body" style={{ textAlign: 'left' }}>
          <div className="brackets" style={poolpath[0] === '/pool' ?{width: "50%"}:{width: 340 * treeData.length }}>
            <div className="row">
              <div className="col-md-6">
                <h1>
                  <strong>{name}</strong>
                </h1>
              </div>
              <div className="col-md-6 text-right">
                <h6>
                  <strong> Brought to you by - </strong>
                </h6>
                <img style={{ height: '80px' }} src={sponser} alt="" />
              </div>
            </div>
            {poolpath[0] === '/pool' ? (
              <React.Fragment>
                {treeData
                  ? treeData.map((data, index) =>
                  
                  <>
                  
                      <TablePool index={index} ListData={data} enableWinner={enableWinner} advanceToNextRound={advance} type={'public'} />
                      </>
                      
                      )
                  : ''}
              </React.Fragment>
            ) : (
              <TreeView
                treeData={treeData}
                roundname={roundname}
                bracket={bracket}
                url={url}
                thirdbattle={thirdbattle}
                secondary={secondary}
                primary={primary}
                enableWinner={enableWinner}
              />
            )}
          </div>
          <br />
        </div>
      )}
    </div>
  );
};

export default BattleTreeViewPublic;
