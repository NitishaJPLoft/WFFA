import React, {useCallback, useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import {apiCall, BASE_URL} from '../../helper/fetch';
import LoaderLayout from '../../layouts/LoaderLayout';
import {helpers} from '../../helper';
import {useSnackbar} from 'notistack';
import BattleZoneView from './BattleZoneView';
import DragToReorderList from '../../layouts/DragToReorderList';
import TournamentButtons from './TournamentButtons';

const TournamentDetails = props => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);
    const [isBattleLoader, setIsBattleLoader] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tournament, setTournament] = useState({});
    const [treeData, setTreeData] = useState([]);
    const [isStatusUpdate, setIsStatusUpdate] = useState(false);
    const [newTime, setNewTime] = useState(null);
    const appName = localStorage.getItem('appName');
    const [roundname, setRoundname] = useState([]);
    const [thirdbattle, setThirdbattle] = useState([]);
    const [bracket, setBracket] = useState(null);
    const [secondary, setSecondary] = useState('');
    const [primary, setPrimary] = useState('');
    const [url, setUrl] = useState('');
    const [enableWinner, setEnableWinner] = useState(false);
    const roleId = localStorage.getItem('roleId');
    const userId = localStorage.getItem('user')

        ? JSON.parse(localStorage.getItem('user'))['id']
        : null;
    const tournamentId = props.match.params.id;
    const editPath =
        roleId === '2'
            ? '/application-dashboard/tournament/edit/'
            : '/organisation-dashboard/tournament/edit/';
    const stagePath =
        roleId === '2'
            ? '/application-dashboard/tournament/' + tournamentId + '/stage/create'
            : '/organisation-dashboard/tournament/' + tournamentId + '/stage/create';
    const editStagePath =
        roleId === '2'
            ? '/application-dashboard/tournament/' + tournamentId + '/stage/'
            : '/organisation-dashboard/tournament/' + tournamentId + '/stage/';

    const getTournamentDetails = useCallback(async () => {
        if (tournamentId) {
            let url = BASE_URL + 'tournament/show1/' + tournamentId;
            const response = await apiCall('GET', url);

            if (response.status === 200) {
                setTournament(response.data);
                if (response.data && response.data.timezoneValue) {
                    currentTime(response.data.timezoneValue);
                }
            } else {
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                } else {
                    enqueueSnackbar(response.message, {
                        variant: 'error',
                        autoHideDuration: 3000
                    });
                }
            }
            setIsLoading(false);
            setIsStatusUpdate(false);
        }
    }, [enqueueSnackbar, tournamentId, history]);

    const currentTime = tdata => {
        const splitTime = tdata.split(':');
        const val = parseInt(splitTime[0], 10) * 60 +
            parseInt(splitTime[1] === '50' ? '30' : splitTime[1], 10);
        const currentTimeZone = new Date().getTimezoneOffset();

        const zoneDiff = val + currentTimeZone;

        const minTimes = new Date().getTime() / (60 * 1000);
        const newTimes = new Date((minTimes + zoneDiff) * (60 * 1000));

        let today = newTimes,
            day = today.getDate(),
            month = today.getMonth() + 1, //January is 0
            year = today.getFullYear(),
            hrs = today.getHours(),
            mins = today.getMinutes();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        if (hrs < 10) {
            hrs = '0' + hrs;
        }
        if (mins < 10) {
            mins = '0' + mins;
        }
        today = year + '-' + month + '-' + day + ' ' + hrs + ':' + mins;

        setNewTime(today);
    };

    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            getTournamentDetails();
        }
    }, [isInitialized, setIsInitialized, getTournamentDetails]);

    const updateTournamentStatus = async e => {
        e.preventDefault();
        setIsStatusUpdate(true);
        const url =
            process.env.REACT_APP_API_URI + 'tournament/updateTournamentStatus';
        let formData = new FormData();
        formData.append('userId', userId);
        formData.append('id', tournamentId);
        formData.append('status', tournament.status ? 0 : 1);
        const response = await helpers.formDataMultipart('POST', url, formData);
        if (response.status === 200) {
            enqueueSnackbar(
                `${tournament.status === 0 ? 'Activated' : 'Deactivated'}`,
                {
                    variant: `${tournament.status === 0 ? 'success' : 'error'}`,
                    autoHideDuration: 3000,
                }
            );
            setIsLoading(false);
            setIsInitialized(false);
        } else {
            enqueueSnackbar(response.message, {
                variant: 'error',
                autoHideDuration: 3000,
            });
        }
    };

    const capitalizeWord = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const changeWinnerStatus = async (e, stageId) => {
        e.preventDefault();
        const url =
            process.env.REACT_APP_API_URI + 'tournament/enablefinalwinner';
        let formData = new FormData();
        formData.append('stageId', stageId);
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {
            enqueueSnackbar(response.message, {
                variant: 'success',
                autoHideDuration: 3000
            });
            getTournamentDetails();
            
            
            
        } else {
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
    };

    const createTopyaBattles = async (e, stageId, stageType) => {
        e.preventDefault();
       
        setTimeout(function(){  enqueueSnackbar("Battle Created Successfully", {
            variant: 'success',
            autoHideDuration: 3000
        }); }, 2000);
        const url = process.env.REACT_APP_API_URI + (stageType === 'battle' ? 'createChallengeStageWise' : 'createPoolChallengeStageWise');
        let formData = new FormData();
        formData.append('stageId', stageId);

        const response = await helpers.formDataMultipart('POST', url, formData);
       
        if (response.status === 200) {
            enqueueSnackbar(response.message, {
                variant: 'success',
                autoHideDuration: 3000
            });
        } else {
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
    };

    const postTopyaScores = async (e, stageId, stageType) => {
        e.preventDefault();
        const url = process.env.REACT_APP_API_URI + (stageType === 'battle' ? 'submitScoreStageWise' : 'submitPoolScoreStageWise');
        let formData = new FormData();
        formData.append('stageId', stageId);
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {
            enqueueSnackbar(response.message, {
                variant: 'success',
                autoHideDuration: 3000
            });
        } else {
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
    };

    const getSkillPlayer = async (e, stageId) => {
        e.preventDefault();
        const url =
            process.env.REACT_APP_API_URI + 'tournament/getnewskillplayer';
        let formData = new FormData();
        formData.append('stageId', stageId);
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {
            enqueueSnackbar('Request received successfully', {
                variant: 'success',
                autoHideDuration: 3000
            });
        } else {
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
    };

    const updateStageStatus = async (e, id, status) => {
        e.preventDefault();
        setIsStatusUpdate(true);
        const url =
            process.env.REACT_APP_API_URI + 'tournament/updateTournamentStageStatus';
        let formData = new FormData();
        formData.append('userId', userId);
        formData.append('id', id);
        formData.append('status', status ? 0 : 1);
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {

            enqueueSnackbar(`${status === 0 ? 'Activated' : 'Deactivated'}`, {
                variant: `${status === 0 ? 'success' : 'error'}`,
                autoHideDuration: 3000,
            });
            setIsLoading(false);
            setIsInitialized(false);
        } else {
            enqueueSnackbar('Error in updating stage status', {
                variant: 'error',
                autoHideDuration: 3000,
            });
        }
    };

    const createTreeOfBattles = async (e, stageId, stageType) => {
        e.preventDefault();
        if (stageType === 'battle') {
            setIsBattleLoader(true);
            let url = BASE_URL + 'tournament/battletree?stage_id=' + stageId;
            const response = await apiCall('GET', url);

            if (response.status === 200) {
                setTreeData(response.data.battles);
                setRoundname(response.data.roundnames);
                setThirdbattle(response.data.thirdbattle);
                setBracket(response.data.bracket_logo);
                setUrl(response.data.landingpagelink);
                setSecondary(response.data.secondary);
                setPrimary(response.data.primary);
                setEnableWinner(response.data.enable_final);

            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                }
            }
            setIsBattleLoader(false);
        }
        if (stageType === 'pool') {
            setIsBattleLoader(true);
            // https://api.dev-compete.com/api/tournament/poolList?stageId=152
            let url = BASE_URL + 'tournament/poolList?stageId=' + stageId;
            const response = await apiCall('GET', url);
            if (response.status === 200) {
                setTreeData(response.data);
                setRoundname(response.data.roundnames);
                setThirdbattle(response.data.thirdbattle);
                setBracket(response.data.bracket_logo);
                setUrl(response.data.landingpagelink);
                setSecondary(response.data.secondary);
                setPrimary(response.data.primary);
                setEnableWinner(response.data.enable_final);

            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                }
            }
            setIsBattleLoader(false);
        }
    };


    return (

        isLoading ? (
            <LoaderLayout/>
        ) : (
            <AppLayout>
                <div className="main-d dashboard permision viw-tournament">
                    <div className="container">
                        
                        <h1>
                            {tournament.tournamentName &&
                            tournament.tournamentName.toUpperCase()}
                        </h1>

                        <div className="row mb-5">
                            <div className="col-md-3">
                                <div className="tab">
                                    <DragToReorderList
                                        tournament={tournament}
                                        stages={tournament.stages}
                                        createTreeOfBattles={createTreeOfBattles}
                                    />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="tab-content">
                                    <div role="tabpanel"
                                         className="tab-pane active"
                                         id={tournament.tournamentName+"t"}
                                    >
                                        <p>
                                            <strong>App: </strong>
                                            {appName && appName.toUpperCase()}
                                        </p>
                                        <p>
                                            <strong>Org Name: </strong>
                                            {tournament.organization && tournament.organization.name}
                                        </p>
                                        <p>
                                            <strong>Tournament Name: </strong>
                                            {tournament.tournamentName &&
                                            tournament.tournamentName.toUpperCase()}
                                        </p>
                                        <p>
                                            <strong>Tournament Description: </strong>
                                        </p>
                                        <p>{tournament.tournamentDescription}</p>
                                        <p>
                                            <strong>Landing Page URL: </strong>
                                            <a target="_blank" rel="noreferrer" href={tournament.landing_page_link}
                                               style={{color: 'black'}}>
                                                {tournament.landing_page_link}
                                            </a>
                                        </p>

                                        <p>
                                            <strong>Country: </strong>
                                            {tournament.countryName &&
                                            tournament.countryName.toUpperCase()}
                                        </p>

                                        <p>
                                            <strong>TimeZone: </strong>
                                            {tournament.timezoneName &&
                                            tournament.timezoneName.toUpperCase()}
                                        </p>

                                        <p>
                                            <strong>Gender:</strong>{' '}
                                            {tournament.gender && tournament.gender.charAt(0).toUpperCase() +
                                            tournament.gender.slice(1)}
                                        </p>
                                        <p>
                                            <strong>Age Requirement:</strong>{' '}
                                            {tournament.ageType && tournament.ageType.charAt(0).toUpperCase() +
                                            tournament.ageType.slice(1)}
                                        </p>
                                        {tournament.ageType === 'range' && (
                                            <React.Fragment>
                                                <p>
                                                    <strong>Min Age: </strong>
                                                    {tournament.ageMin}
                                                </p>
                                                <p>
                                                    <strong>Max Age: </strong>
                                                    {tournament.ageMax}
                                                </p>
                                            </React.Fragment>
                                        )}

                                        <hr className="mt-4 mb-4"/>
                                        <p>
                                            <strong>Tournament Display Configuration</strong>
                                        </p>
                                        <p>
                                            <strong>Display Seeding Number: </strong>{' '}
                                            {tournament.displaySeedingNo
                                                ? capitalizeWord(tournament.displaySeedingNo)
                                                : ''}
                                        </p>
                                        <p>
                                            <strong>Display Competitor Profile Image: </strong>{' '}
                                            {tournament.displayCompetitorProfile
                                                ? capitalizeWord(tournament.displayCompetitorProfile)
                                                : ''}
                                        </p>
                                        <p>
                                            <strong>Display Competitor Name: </strong>
                                            {tournament.displayPlayerName
                                                ? capitalizeWord(tournament.displayPlayerName)
                                                : ''}
                                        </p>
                                        <p>
                                            <strong>Display Country: </strong>{' '}
                                            {tournament.displayCountry
                                                ? capitalizeWord(tournament.displayCountry)
                                                : ''}
                                        </p>
                                        <hr className="mt-4 mb-4"/>
                                        <p>
                                            <strong>Left Watermark: </strong>{' '}
                                            {!tournament.watermarkBottomLeft && 'None'}
                                        </p>
                                        {tournament.watermarkBottomLeft && (
                                            <img
                                                height="60"
                                                src={tournament.watermarkBottomLeft}
                                                alt={tournament.watermarkBottomLeft}
                                            />
                                        )}
                                        <p>
                                            <strong>Right Watermark: </strong>
                                            {!tournament.watermarkBottomRight && 'None'}
                                        </p>
                                        {tournament.watermarkBottomRight && (
                                            <img
                                                height="60"
                                                src={tournament.watermarkBottomRight}
                                                alt={tournament.watermarkBottomRight}
                                            />
                                        )}
                                        <p>
                                            <strong>Sponsor Watermark: </strong>
                                            {!tournament.sponser_logo && 'None'}
                                        </p>
                                        {tournament.sponser_logo && (
                                            <img
                                                height="60"
                                                src={tournament.sponser_logo}
                                                alt={tournament.sponser_logo}
                                            />
                                        )}
                                        <p>
                                            <strong>Bracket Watermark: </strong>
                                            {!tournament.bracket_logo && 'None'}
                                        </p>
                                        {tournament.bracket_logo && (
                                            <img
                                                height="60"
                                                src={tournament.bracket_logo}
                                                alt={tournament.bracket_logo}
                                            />
                                        )}

                                        <hr className="mt-4 mb-4"/>
                                        <p>
                                            <strong>Number of Stages:</strong>{' '}
                                            {tournament.stages && tournament.stages.length}
                                        </p>
                                        <TournamentButtons tournament={tournament} stagePath={stagePath}
                                                           updateTournamentStatus={updateTournamentStatus}
                                                           isStatusUpdate={isStatusUpdate} editPath={editPath}/>
                                    </div>
                                    {tournament.stages && tournament.stages.length
                                        ? tournament.stages.map((stage, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    role="tabpanel"
                                                    className="tab-pane"
                                                    id={stage.stageName+"st"+index}
                                                >
                                                    <p>
                                                        <strong>Stage Name: </strong>
                                                        {stage.stageName.toUpperCase()}
                                                    </p>
                                                    <p>
                                                        <strong>Stage Description: </strong>
                                                    </p>
                                                    <p>{stage.stageDescription}</p>
                                                    <p>
                                                        <strong>Stage Type:</strong>{' '}
                                                        {stage.stageType === 'battle'
                                                            ? 'Battlezone Bracket'
                                                            : stage.stageType === 'skill'
                                                                ? 'Skill'
                                                                : stage.stageType === 'pool' ? 'Battle Pool' : ''}
                                                    </p>
                                                    {stage.stageType !== 'battle' ? (
                                                        <React.Fragment>
                                                            <p>
                                                                <strong>Start Date:</strong>{' '}
                                                                {stage.startDate ? helpers.getParsedDate(stage.startDate) : ''}
                                                            </p>
                                                            <p>
                                                                <strong>End Date:</strong>{' '}
                                                                {stage.endDate ? helpers.getParsedDate(stage.endDate) : ''}
                                                            </p>
                                                            <p>
                                                                <strong>Status:</strong>{' '}
                                                                {stage.status ? 'Active' : 'Inactive'}
                                                            </p>
                                                        </React.Fragment>
                                                    ) : null}
                                                    <p>
                                                        <strong>Team Assigned to Stage:</strong>{' '}
                                                        {stage.teamname}
                                                    </p>
                                                    {stage.stageType !== 'battle' ? (
                                                        <React.Fragment>
                                                            <p>
                                                                <strong>Path Count:</strong> {stage.pathcount}
                                                            </p>
                                                            <hr className="mt-4 mb-4"/>
                                                        </React.Fragment>
                                                    ) : null}
                                                    <p>
                                                        <strong>Number of Competitors:</strong>{' '}
                                                        {stage.stageType === 'skill'
                                                            ? stage.teammembers
                                                            : stage.noOfCompititor}
                                                    </p>

                                                    {stage.stageType === 'skill' || stage.stageType === 'pool' ? (
                                                        <React.Fragment>
                                                            {stage.stageType === 'skill' ? <p>
                                                                <strong>Number of Videos:</strong>{' '}
                                                                {stage.totalvideo}
                                                            </p> : ''}
                                                            <p>
                                                                <strong>Judges:</strong>
                                                            </p>

                                                            {stage.groups && stage.groups.length ? (
                                                                stage.groups.map((group, index) => {
                                                                    return (
                                                                        <div className="ml-5" key={index}>
                                                                            <p>
                                                                                <strong>
                                                                                    Group {parseInt(index) + 1}
                                                                                </strong>
                                                                            </p>
                                                                            {group.judges && group.judges.length
                                                                                ? group.judges.map((judge, index) => {
                                                                                    return (
                                                                                        <p key={index}>
                                                                                            {judge.displayName
                                                                                                ? judge.displayName
                                                                                                : judge.fullName}
                                                                                        </p>
                                                                                    );
                                                                                })
                                                                                : null}
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <p>none assigned</p>
                                                            )}
                                                        </React.Fragment>
                                                    ) : ''}

                                                    {stage.stageType !== 'skill' ? (
                                                        <BattleZoneView
                                                            treeData={treeData}
                                                            stageId={stage.id}
                                                            rounds={stage.rounds}
                                                            stageType={stage.stageType}
                                                            isBattleLoader={isBattleLoader}
                                                            tId={tournament.id}
                                                            competitorLength={stage.noOfCompititor}
                                                            capitalizeWord={capitalizeWord}
                                                            roundname={roundname}
                                                            thirdbattle={thirdbattle}
                                                            bracket={bracket}
                                                            url={url}
                                                            secondary={secondary}
                                                            primary={primary}
                                                            enableWinner={enableWinner}
                                                        />
                                                    ) : ''}

                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            {stage.stageType === 'skill' && stage.playerbtnstatus ?
                                                                <button
                                                                    style={{width: '250px', marginRight: '10px'}}
                                                                    className="main-btn-cncel text-center"
                                                                    onClick={e =>
                                                                        getSkillPlayer(e, stage.id)
                                                                    }
                                                                >
                                                                    Fetch New Players
                                                                </button> : ''}

                                                            {(stage.stageType === 'battle' || stage.stageType === 'pool') ?
                                                                <button
                                                                    style={{width: '250px', marginLeft: 0, marginRight: '10px', marginBottom: 0}}
                                                                    className="main-btn text-center"
                                                                    onClick={e =>
                                                                        changeWinnerStatus(e, stage.id)
                                                                    }
                                                                >
                                                                    
                                                                    {stage.enable_final ? 'Hide' : 'Display'} {stage.stageType === 'battle'?"Winners in TMS":"Group Winners"}
                                                                </button> : ''}

                                                            {(stage.stageType === 'battle' || (stage.stageType === 'pool' && stage.poolCreatedTopya ===0) ) ?
                                                                <button
                                                                    style={{width: '250px', marginLeft: 0, marginRight: '10px', marginBottom: 0}}
                                                                    className="main-btn text-center"
                                                                    onClick={e =>
                                                                        createTopyaBattles(e, stage.id, stage.stageType)
                                                                    }
                                                                >
                                                                    Create Battle in Topya
                                                                </button> : ''}

                                                            {(stage.stageType === 'battle' || stage.stageType === 'pool') ?
                                                                <button
                                                                    style={{width: '250px', marginLeft: 0, marginRight: '10px', marginBottom: 0}}
                                                                    className="main-btn text-center"
                                                                    onClick={e =>
                                                                        postTopyaScores(e, stage.id, stage.stageType)
                                                                    }
                                                                >
                                                                    Post Scores in Topya
                                                                </button> : ''}


                                                            <button
                                                                style={{width: '250px'}}
                                                                className="main-btn-cncel text-center"
                                                                onClick={e =>
                                                                    updateStageStatus(e, stage.id, stage.status)
                                                                }
                                                            >
                                                                {stage.status ? 'Deactivate' : 'Activate'}{' '}
                                                                Stage{' '}
                                                                {isStatusUpdate ? (
                                                                    <i className="fa fa-spinner fa-spin"/>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </button>
                                                            <Link
                                                                style={{width: '250px'}}
                                                                className="main-btn text-center"
                                                                to={editStagePath + stage.id}
                                                            >
                                                                Edit Stage
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        )

    );
};

export default TournamentDetails;
