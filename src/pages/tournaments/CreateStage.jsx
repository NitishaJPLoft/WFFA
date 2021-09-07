import React, {useEffect, useState, useCallback, Fragment} from 'react';
import {useHistory} from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import {helpers} from '../../helper';
import JudgeGroup from './stageComponents/JudgeGroup';
import {useSnackbar} from 'notistack';
import {apiCall, BASE_URL} from '../../helper/fetch';
import {uniq} from 'underscore';
import BattleZoneForm from './stageComponents/BattleZoneForm';
import InputPlayers from './stageComponents/InputPlayers';
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {makeStyles} from '@material-ui/core/styles';
import {useMediaQuery} from 'react-responsive';
import JudgesPanel from './stageComponents/JudgesPanel';
import CompetitorPanel from './stageComponents/CompetitorPanel';
import ConfirmModal from './stageComponents/ConfirmModal';
import ButtonPanel from './stageComponents/ButtonPanel';
import PoolPanel from './stageComponents/PoolPanel';
import TeamDropdown from './stageComponents/TeamDropdown';
import SkillStageDetails from './stageComponents/SkillStageDetails';
import StageDetails from './stageComponents/StageDetails';
import BattleStageDetails from './stageComponents/BattleStageDetails';
import TeamDetails from './stageComponents/TeamDetails';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        minHeight: '500',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const CreateStage = props => {
    const history = useHistory();
    const classes = useStyles();
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isJudgeAdded, setIsJudgeAdded] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const userId =
        localStorage.getItem('user') &&
        JSON.parse(localStorage.getItem('user'))['id'];
    const roleId = localStorage.getItem('roleId');
    const appId = localStorage.getItem('appId');
    const [stageType, setStageType] = useState('skill');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [judges, setJudges] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [videoLength, setVideoLength] = useState('');
    const [judgeCount, setJudgeCount] = useState(0);
    const [elements, setElements] = useState([]);
    const [isbattleZone, setIsBattleZone] = useState(false);
    const [battles, setBattles] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [teamData, setTeamData] = useState({});
    const [teams, setTeams] = useState([]);

    const [groups, setGroups] = useState([]);
    const tournamentId = props.match.params.id;
    const stageId = props.match.params.stageId;

    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selected, setSelected] = useState('');
    const [isEdit, setIsEdit] = useState(!!stageId);
    const [isPlayerSlice, setIsPlayerSlice] = useState(false);
    const [battleRound, setBattleRound] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [seeds, setSeeds] = useState([]);
    const [noOfCompetitors, setNoOfCompetitors] = useState(0);
    const [compError, setCompError] = useState(null);
    const [membersChanged, setMembersChanged] = useState(false);
    const [isMembers, setIsMembers] = useState(false);
    const [snameError, setSnameError] = useState(null);
    const [sdateError, setSdateError] = useState(null);
    const [edateError, setEdateError] = useState(null);
    const [videoError, setVideoError] = useState(null);
    const [teamDataError, setTeamDataError] = useState(null);
    const [roundForTBD, setRoundForTBD] = useState([]);
    const [battleError, setBattleError] = useState({
        id: '',
        name: null,
        startDate: null,
        minRound: null,
        maxRound: null,
        timeToRespond: null,
        maxVideoLength: null,
        judge: null,
        players: null,
    });
    const [todayDate, setTodayDate] = useState(new Date());
    const [tournamentStartDate, setTournamentStartDate] = useState(null);
    const [battledate, setBattledate] = useState(null);
    const [thirdbracket, setThirdbracket] = useState('yes');
    const [videolink, setVideolink] = useState('');
    const [team, setTeam] = useState('');
    const [detailh1, setDetailh1] = useState('');
    const [bodytext, setBodytext] = useState(EditorState.createEmpty());
    const [isBattleSet, setIsBattleSet] = useState(false);
    const [competitorArr, setCompetitorArr] = useState([]);
    const [thirdBattleRoundName, setThirdBattleRoundName] = useState(
        'Third Place'
    );
    const [thirdBattleDescription, setThirdBattleDescription] = useState('');
    const [topyaRoundNameForThird, setTopyaRoundNameForThird] = useState('');
    const [
        topyaRoundDescriptionForThird,
        setTopyaRoundDescriptionForThird,
    ] = useState('');
    const [thirdBattleError, setThirdBattleError] = useState(null);
    const [isUpdateOnTopya, setIsUpdateOnTopya] = useState(false);
    const [show, setShow] = useState(false);
    const [competitorsPerGroup, setCompetitorsPerGroup] = useState(0);
    const [nextRoundCount, setNextRoundCount] = useState(0);
    const [tableLabel, setTableLabel] = useState('');
    const [labelSequence, setLabelSequence] = useState('alphabatical');
    const [minRound, setMinRound] = useState(0);
    const [maxRound, setMaxRound] = useState(0);
    const [timeToRespond, setTimeToRespond] = useState(0);
    const [maxVideoLength, setMaxVideoLength] = useState(0);
    const [poolRounds, setPoolRounds] = useState([]);
    const [poolRoundsError, setPoolRoundsError] = useState({
        minRoundError: null,
        maxRoundError: null,
        nextRoundCountErr: null,
        tableLabelError: null,
        timeToResErr: null,
        maxVideoLenErr: null,
        playerSelect: null
    });
    const [groupCompetitors, setGroupCompetitors] = useState([]);
    const [pathSkill, setPathSkill] = useState([]);
    const [pathSkillId, setPathSkillId] = useState(null);
    const [poolCreatedTopya, setPoolCreatedTopya] = useState(null)

    const setError = data => {
        if (data.status === 401) {
            history.push('/login');
        } else {
            enqueueSnackbar(data.message, {
                variant: 'error',
                autoHideDuration: 3000,
            });
        }
    };

    const getUsers = useCallback(
        async org => {
            let url =
                BASE_URL + 'tournament/judgelist?appId=' + appId + '&orgId=' + org;
            const data = await apiCall('GET', url);
            if (data.status === 200) {
                const arr = [];
                for (let obj of data.data) {
                    obj.selected = false;
                    arr.push(obj);
                }
                setUsers(arr);
            } else {
                setError(data);
            }
        },
        [enqueueSnackbar, appId, history]
    );

    const getTournament = useCallback(async () => {
        if (tournamentId) {
            let url =
                BASE_URL + 'timezoneBytournamentId?tournament_id=' + tournamentId;
            const response = await apiCall('GET', url);

            if (response.status === 200) {
                const selectedZone = response.data.value;
                // setOrg(response.data.orgId);
                getUsers(response.data.orgId);

                const splitTime = selectedZone.split(':');
                const val =
                    parseInt(splitTime[0], 10) * 60 +
                    parseInt(splitTime[1] === '50' ? '30' : splitTime[1], 10);
                const currentTimeZone = todayDate.getTimezoneOffset();
                const zoneDiff = val + currentTimeZone;
                const minTimes = todayDate.getTime() / (60 * 1000);
                const newTime = new Date((minTimes + zoneDiff) * (60 * 1000));

                let today = newTime,
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
                today = year + '-' + month + '-' + day + 'T' + hrs + ':' + mins;
                setTodayDate(today);
            } else {
                setError(response);
            }
        }
    }, [enqueueSnackbar, history, todayDate, tournamentId]);

    const getMembers = useCallback(async () => {
        const data = await helpers.teammembers('GET', teamData.id, tournamentId);
        if (data.status === 200) {
            setMembers(data.data);
            if (!isEdit) {
                setSelectedMembers([]);
                setCompetitors([]);
                setMembersChanged(true);
            }
        } else {
            setError(data);
        }
    }, [enqueueSnackbar, teamData, isEdit]);

    const getTeams = useCallback(async (type = 'skill') => {
        const data = await helpers.teams('GET', type, stageId);
        if (data.status === 200) {
            setTeams(data.data);
        } else {
            if (data.status === 401) {
                history.push('/login');
            } else {
                enqueueSnackbar(data.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
            }
        }
    }, [enqueueSnackbar, history, stageId]);

    const handleSelectedTeam = e => {

        setTeamData(JSON.parse(e.target.value));
        setSelectedTeam(e.target.value);
        setIsEdit(false);
        setTeamDataError('');

        if (stageType === 'skill') {
            const teamSkillId = JSON.parse(e.target.value);

            getSkillTeamPath(teamSkillId.id)
        }
    };

    const getSkillTeamPath = useCallback(async (Id) => {

        let formData = new FormData();
        formData.append('teamId', Id);
        let url = `${BASE_URL}tournament/teampath`;
        const response = await helpers.formDataMultipart('POST', url, formData);
        if (response.status === 200) {
            setPathSkill(response.data)
        }
    });


    const handleSelectedPath = (e) => {
        setPathSkillId(e.target.value)
    };

    const getStageDetails = useCallback(async () => {
        if (tournamentId && stageId) {
            let url = `${BASE_URL}tournament/stage?tournament_id=${tournamentId}&stage_id=${stageId}`;
            const response = await apiCall('GET', url);
            if (response.status === 200) {
                setIsLoader(false);
                const data = response.data[0];
                setIsLoader(false);
                setName(data.stageName || '');
                setDescription(data.stageDescription || '');
                setStartDate(data.startDate ? data.startDate.replace(' ', 'T') : '');
                setEndDate(data.endDate ? data.endDate.replace(' ', 'T') : '');
                setVideoLength(data.maxVideoLenght || '');
                setStageType(data.stageType || 'skill');
                setJudgeCount(data.noOfGroups || '');
                setTeam(data.invitCode || '');
                setVideolink(data.videoLink || '');
                setDetailh1(data.detailH1 || '');
                setPathSkillId(data.team_path_id || '');

                const blocksFromHtml = htmlToDraft(data.bodytext);
                const {contentBlocks, entityMap} = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(
                    contentBlocks,
                    entityMap
                );
                const editorState = EditorState.createWithContent(contentState);
                setBodytext(editorState || EditorState.createEmpty());
                setNoOfCompetitors(
                    data.stageType !== 'skill' ? data.noOfCompititor : ''
                );
                if (data.stageType === 'pool') {
                    setCompetitorsPerGroup(data.noOfCompititorPerGroup);
                    setNextRoundCount(data.advanceToNextRound);
                    setMinRound(data.minRound);
                    setMaxRound(data.maxRound);
                    setTableLabel(data.tableLable);
                    setLabelSequence(data.lableSequence);
                    setMaxVideoLength(data.maxVideoLenght);
                    setTimeToRespond(data.timeOfResponed);
                    setPoolRounds(data.rounds);
                    setGroupCompetitors(data.poolGroups);
                    setPoolCreatedTopya(data.poolCreatedTopya)

                }
                setTeamData({
                    id: data.team_id,
                    name: data.teamname,
                    members: data.teammembers,
                    pathcount: data.pathcount,
                    totalvideo: data.totalvideo,
                });
                setSelectedTeam(
                    JSON.stringify({
                        id: data.team_id,
                        name: data.teamname,
                        members: data.teammembers,
                        pathcount: data.pathcount,
                        totalvideo: data.totalvideo,
                    })
                );

                setBattledate(
                    data.rounds &&
                    data.rounds.length &&
                    data.rounds[0] &&
                    data.rounds[0].startDate
                        ? data.rounds[0].startDate.replace(' ', 'T')
                        : null
                );
                const arr = [];
                if (data.rounds && data.rounds.length) {
                    data.rounds.map((round, index) =>
                        arr.push({
                            id: round && round.id ? round.id : '',
                            name: round && round.roundName ? round.roundName : '',
                            description: round && round.roundDescription ? round.roundDescription : '',
                            startDate:
                                round && round.startDate
                                    ? round.startDate.replace(' ', 'T')
                                    : '',
                            minRound:
                                round && round.minRound ? parseInt(round.minRound, 10) : 0,
                            maxRound:
                                round && round.maxRound ? parseInt(round.maxRound, 10) : 0,
                            timeToRespond:
                                round && round.timeOfResponed ? round.timeOfResponed : 1,
                            maxVideoLength:
                                round && parseInt(round.maxVideoLength, 10) !== 0
                                    ? parseInt(round.maxVideoLength, 10)
                                    : 1,
                            judges: round && round.judges ? round.judges : '',
                            showUpdateTopya:
                                round && round.showUpdateTopya ? round.showUpdateTopya : 0,
                            updateOnTopya: 0,
                            topyaRoundName:
                                round && round.topyaRoundName
                                    ? round.topyaRoundName.includes('UPLOAD HERE')
                                    ? round.topyaRoundName
                                    : 'UPLOAD HERE ' + round.topyaRoundName
                                    : '',
                            topyaRoundDescription:
                                round && round.topyaRoundDescription
                                    ? round.topyaRoundDescription
                                    : '',
                            topyaRoundStartDate:
                                round && round.topyaRoundStartDate
                                    ? round.topyaRoundStartDate.replace(' ', 'T')
                                    : '',
                        })
                    );
                    setBattleRound(arr);
                    const thirdRName =
                        data.rounds[data.rounds.length - 1].thirdBattleRoundName;
                    const thirdRDesc =
                        data.rounds[data.rounds.length - 1].thirdBattleDescription;
                    const topyaNameForThird =
                        data.rounds[data.rounds.length - 1].topyaRoundNameForThird;
                    const topyaDescForThird =
                        data.rounds[data.rounds.length - 1].topyaRoundDescriptionForThird;
                    if (thirdRName) {
                        setThirdBattleRoundName(thirdRName);
                    }
                    if (thirdRDesc) {
                        setThirdBattleDescription(thirdRDesc);
                    }
                    if (topyaNameForThird) {
                        setTopyaRoundNameForThird(topyaNameForThird);
                    }
                    if (topyaDescForThird) {
                        setTopyaRoundDescriptionForThird(topyaDescForThird);
                    }
                }

                setSelectedMembers(data && data.rounds && data.rounds.length ? data.rounds[0].competitors : []);

                const competArr = [];
                const seedArr = [];
                if (data) {
                    for (let obj of data && data.stageType === 'battle' && data.rounds && data.rounds.length ?
                        data.rounds[0].competitors : []) {
                        competArr.push(obj.user_id);
                        seedArr.push(parseInt(obj.seeds, 10));
                    }
                    setCompetitors(competArr);
                    setSeeds(seedArr);
                    const compArr = [];
                    for (let [index, obj] of data.rounds.entries()) {
                        if (index > 0 && obj.competitors && obj.competitors.length) {
                            compArr.push(obj.competitors);
                        }
                    }
                    setCompetitorArr(compArr);
                }
                const groupArr = [];
                if ((data.stageType === 'skill' || data.stageType === 'pool') && data && data.groups && data.groups.length) {
                    for (let obj of data.groups) {
                        const judgeList = [];
                        for (let judge of obj.judges) {
                            judgeList.push(parseInt(judge.user_id, 10));
                        }
                        groupArr.push({
                            groupName: obj.groupname,
                            judges: judgeList,
                        });
                    }
                } else {
                    if (data.stageType === 'battle') {
                        if (data.rounds && data.rounds.length) {
                            for (let [index, obj] of data.rounds.entries()) {
                                const judgeList = [];
                                for (let judge of obj.judges) {
                                    judgeList.push(parseInt(judge.user_id, 10));
                                }
                                groupArr.push({
                                    groupName: index + 1,
                                    judges: judgeList,
                                });
                            }
                        }
                    }
                }
                setGroups(groupArr);
                getTeams(data.stageType);
                getSkillTeamPath(data.team_id)
            } else {
                setError(response);
            }
        } else {
            setIsLoader(false);
        }
    }, [enqueueSnackbar, stageId, tournamentId, history, getTeams, setBattleRound]);

    useEffect(() => {
        if (stageId && !isMembers && members && members.length && selectedMembers && selectedMembers.length) {
            const memList = members;
            for (let obj of selectedMembers) {
                const index = members.findIndex(x => x.id === obj.user_id);
                memList.splice(index, 1);
                setIsMembers(true);
            }
            setMembers(memList);
        }
    }, [selectedMembers, members, isMembers, stageId, players]);

    const selectMember = useCallback((index, value) => {
        const user = JSON.parse(value);
        let arr = selectedMembers;
        const competUsers = competitors;
        let memList = members;
        if (arr[index - 1]) {
            if (arr[index - 1].insert) {
                if (arr.findIndex(x => x.user_id === user.id) > -1) {
                    enqueueSnackbar('This player is already selected', {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                    setSelected('');
                } else {
                    competUsers[index - 1] = user.id;
                    setSelected(user);
                    const i = memList.findIndex(x => x.id === user.id);
                    memList.splice(i, 1);
                    arr[index - 1] = {
                        user_id: user.id,
                        seeds: index,
                        orders: null,
                        competitorName: user.name,
                        competitorImage: user.avatarURL,
                        competitorContry: user.country,
                        competitorUsername: user.username,
                        countryCode: user.countryCode,
                        score: user.score,
                    };

                    for (let i in arr) {
                        if (arr.hasOwnProperty(i)) {
                            if (arr[i].insert) {
                                arr[i] = {
                                    insert: true,
                                    name: (
                                        <InputPlayers
                                            index={parseInt(i, 10) + 1}
                                            users={memList}
                                            selectMember={selectMember}
                                            selected={selected}
                                        />
                                    ),
                                };
                            }
                        }
                    }
                    if (players && players.length) {
                        const playerArr = players;
                        for (let i in playerArr) {
                            if (playerArr.hasOwnProperty(i)) {
                                playerArr[i] = (
                                    <InputPlayers
                                        key={parseInt(players[i].key)}
                                        index={parseInt(players[i].key) + 1}
                                        users={memList}
                                        selectMember={selectMember}
                                        selected={selected}
                                    />
                                );
                            }
                        }
                        setPlayers(playerArr);
                    }
                }
            } else {
                const i = memList.findIndex(x => x.id === user.id);
                memList.splice(i, 1);
                for (let i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        if (arr[i].insert) {
                            arr[i] = {
                                insert: true,
                                name: (
                                    <InputPlayers
                                        index={parseInt(i, 10) + 1}
                                        users={memList}
                                        selectMember={selectMember}
                                        selected={selected}
                                    />
                                ),
                            };
                        }
                    }
                }
                arr[index - 1] = user;
            }
        } else {
            if (arr.findIndex(x => x.id === user.id) > -1) {
                enqueueSnackbar('This player is already selected', {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setSelected('');
            } else {
                arr.push(user);
                const i = memList.findIndex(x => x.id === user.id);
                memList.splice(i, 1);
                setSelected(user);
                for (let i in arr) {
                    if (arr.hasOwnProperty(i)) {
                        if (arr[i].insert) {
                            arr[i] = {
                                insert: true,
                                name: (
                                    <InputPlayers
                                        index={parseInt(i, 10) + 1}
                                        users={memList}
                                        selectMember={selectMember}
                                        selected={selected}
                                    />
                                ),
                            };
                        }
                    }
                }
                setIsPlayerSlice(true);
                competUsers.push(user.id);
            }
        }
        setCompetitors(competUsers);
        setSelectedMembers(arr);
        setMembers(memList);
        setBattleError({...battleError, players: null});
    }, [competitors, enqueueSnackbar, selectedMembers, members, setMembers, battleError, setBattleError, players, selected]);

    const enterInputFields = useCallback((round, startIndex) => {
        const playerInputs = [];
        const length =
            round === 'Quarter Final'
                ? 8
                : round === 'Semi Final'
                ? 4
                : round === 'Final'
                    ? 2
                    : round;
        const seedValues = [];
        if (startIndex !== 0) {
            for (let j = 0; j < startIndex; j++) {
                seedValues.push(j + 1);
            }
        }

        for (let i = startIndex; i < length; i++) {
            seedValues.push(i + 1);
            playerInputs.push(
                <InputPlayers
                    key={i}
                    index={i + 1}
                    users={members}
                    selectMember={selectMember}
                    selected={selected}
                />
            );
        }
        setSeeds(seedValues);
        setPlayers(playerInputs);
    }, [members, selectMember, selected]);

    const selectCompetitors = useCallback(value => {
            const x = Math.log(value) / Math.log(2);
            setNoOfCompetitors(value);
            setIsBattleZone(true);
            if (value) {
                setCompError(null);
            }
            const rounds = [];
            const roundfortb = [];

            for (let i = x; i > 0; i--) {
                const y = Math.pow(2, i);
                if (i === x) {
                    if (selectedMembers.length && selectedMembers.length > value) {
                        if (players.length) {
                            setPlayers([]);
                        }
                        const arr = selectedMembers;
                        const competUsers = competitors;
                        const seedArr = seeds;
                        const memList = members;
                        for (const i in selectedMembers) {
                            if (selectedMembers.hasOwnProperty(i)) {
                                if (i >= value) {
                                    memList.push(selectedMembers[i]);
                                }
                            }
                        }
                        setMembers(memList);
                        competUsers.splice(value, selectedMembers.length - value);
                        seedArr.splice(value, selectedMembers.length - value);
                        arr.splice(value, selectedMembers.length - value);
                        setSelectedMembers(arr);
                        setCompetitors(competUsers);
                        setSeeds(seedArr);
                    } else {
                        enterInputFields(y, selectedMembers.length || 0);
                    }
                }

                if (y !== x && selectedMembers.length) {
                    if (value > selectedMembers.length) {
                        enterInputFields(value, selectedMembers.length);
                    }
                }
                rounds.push(
                    y > 8
                        ? 'Round of ' + +y
                        : y === 8
                        ? ' Quarter Final'
                        : y === 4
                            ? ' Semi Final'
                            : ' Final'
                );

                roundfortb.push(y > 8 ? +y : y === 8 ? 8 : y === 4 ? 4 : 2);
            }
            setRoundForTBD(roundfortb);
            setBattleRound({...battleRound, name: rounds});
            const arr = [];
            for (let i = 0; i < rounds.length; i++) {
                arr.push({
                    id: !isBattleSet
                        ? ''
                        : stageId && battleRound[i] && battleRound[i] && battleRound[i].id
                            ? battleRound[i].id
                            : '',
                    name:
                        battleRound[i] && battleRound[i].name
                            ? battleRound[i].name
                            : rounds[i],
                    description: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].description
                            ? battleRound[i].description
                            : '',
                    startDate: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].startDate
                            ? battleRound[i].startDate
                            : '',
                    minRound: !isBattleSet
                        ? 1
                        : battleRound[i] && battleRound[i].minRound
                            ? battleRound[i].minRound
                            : 1,
                    maxRound: !isBattleSet
                        ? 1
                        : battleRound[i] && battleRound[i].maxRound
                            ? battleRound[i].maxRound
                            : 1,
                    timeToRespond: !isBattleSet
                        ? 1
                        : battleRound[i] && battleRound[i].timeToRespond
                            ? battleRound[i].timeToRespond
                            : 1,
                    maxVideoLength: !isBattleSet
                        ? 1
                        : battleRound[i] && battleRound[i].maxVideoLength
                            ? battleRound[i].maxVideoLength
                            : 1,
                    judge: !isBattleSet
                        ? []
                        : battleRound[i] && battleRound[i].judge
                            ? battleRound[i].judge
                            : [],
                    showUpdateTopya: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].showUpdateTopya
                            ? battleRound[i].showUpdateTopya
                            : 0,
                    updateOnTopya: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].updateOnTopya
                            ? battleRound[i].updateOnTopya
                            : 0,
                    topyaRoundName: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].topyaRoundName
                            ? battleRound[i].topyaRoundName
                            : '',
                    topyaRoundDescription: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].topyaRoundDescription
                            ? battleRound[i].topyaRoundDescription
                            : '',
                    topyaRoundStartDate: !isBattleSet
                        ? ''
                        : battleRound[i] && battleRound[i].topyaRoundStartDate
                            ? battleRound[i].topyaRoundStartDate.replace(' ', 'T')
                            : '',
                });
            }
            setIsBattleSet(true);
            setBattleRound(arr);

            if (!stageId) {
                if (stageType === 'battle') {
                    setJudgeCount(7);
                } else {
                    setJudgeCount(0);
                }
                setIsJudgeAdded(false);
            }
            setBattles(rounds);
        },
        [
            stageType,
            enterInputFields,
            players.length,
            seeds,
            members,
            setBattleRound,
            battleRound,
            competitors,
            isBattleSet,
            selectedMembers,
            stageId,
        ]
    );

    useEffect(() => {
        if (stageId && stageType === 'battle' && noOfCompetitors) {
            setIsBattleZone(true);
            selectCompetitors(noOfCompetitors);
        }
    }, [
        noOfCompetitors,
        stageId,
        stageType,
        selectedMembers && selectedMembers.length,
        members && members.length,
    ]);

    useEffect(() => {
        if (stageType === 'battle' && noOfCompetitors) {
            getTeams(stageType);
            selectCompetitors(noOfCompetitors);
        }
    }, [stageType, noOfCompetitors, members.length]);

    useEffect(() => {
        if (!isInitialized) {
            getTournament();
            if (tournamentId && stageId) {
                getStageDetails();
            } else {
                getTeams();
                setIsLoader(false);
            }
            setIsInitialized(true);
        }
    }, [
        isInitialized,
        getStageDetails,
        getTeams,
        getUsers,
        roleId,
        stageId,
        stageType,
        tournamentId,
        getTournament,
    ]);

    const addJudgeGroups = e => {
        const value = e.target.value;
        if (value < 0) {
            setJudgeCount(0);
        } else {
            setJudgeCount(value);
        }
        setIsJudgeAdded(false);
    };

    useEffect(() => {
        if (isPlayerSlice) {
            let arr = players;
            arr.shift();
            setPlayers(arr);
            setIsPlayerSlice(false);
            enterInputFields(
                noOfCompetitors,
                selectedMembers && selectedMembers.length
            );
        }
    }, [
        isPlayerSlice,
        players,
        enterInputFields,
        noOfCompetitors,
        selectedMembers && selectedMembers.length,
    ]);

    useEffect(() => {
        const groupArr = [];
        if (judgeCount > 0 && !isJudgeAdded && !stageId) {
            let groupList = [...groups];
            if (judgeCount < groupList.length) {
                groupList.splice(judgeCount, groupList.length);
            }

            for (let i = 0; i < judgeCount; i++) {
                groupList.push({
                    groupName: i + 1,
                    judges: [],
                });
                const arr = uniq(groupList, x => x.groupName);
                groupArr.push(
                    <JudgeGroup
                        key={i}
                        index={i}
                        users={users}
                        groups={arr}
                        setGroups={setGroups}
                        stageType={stageType}
                        battleRound={battleRound}
                        setBattleRound={setBattleRound}
                    />
                );
                setGroups([...arr]);
            }
            setIsJudgeAdded(true);
        } else {
            const groupList = [];
            for (let i = 0; i < judgeCount; i++) {
                if (!isJudgeAdded) {
                    groupList.push({
                        groupName: i + 1,
                        judges: [],
                    });
                    const arr = uniq(groupList, x => x.groupName);
                    setGroups([...arr]);
                }

                groupArr.push(
                    <JudgeGroup
                        key={i}
                        index={i}
                        users={users}
                        groups={groups}
                        setGroups={setGroups}
                        stageType={stageType}
                        battleRound={battleRound}
                        setBattleRound={setBattleRound}
                    />
                );
            }
            setIsJudgeAdded(true);
        }
        setJudges(groupArr);
    }, [
        groups,
        setGroups,
        setJudges,
        judgeCount,
        isJudgeAdded,
        users,
        stageType,
        stageId,
        battleRound,
    ]);

    useEffect(() => {
        const options = [];
        for (let i = 1; i <= 7; i++) {
            const x = Math.pow(2, i);
            options.push(
                <option key={i} value={x}>
                    {x}
                </option>
            );
        }
        setElements(options);
    }, []);

    useEffect(() => {
        setSelectedTeam(JSON.stringify(teamData));
        if ((stageType === 'battle' || stageType === 'pool') && teamData.id) {
            getMembers(teamData.id);
            if (stageType === 'battle' && teamData.id) {
                setJudgeCount(battleRound.length);
            }
        }
    }, [teamData, teamData.id, getMembers, stageType, battleRound.length]);

    const handleBattleForm = (e, index) => {
        const fieldName = e.target.name;

        let value = e.target.value;

        if (fieldName === 'name' || fieldName === 'startDate' || fieldName === 'topyaRoundName' || fieldName === 'topyaRoundStartDate') {
            if (!value) {
                setBattleError({
                    ...battleError,
                    [fieldName]: 'Value can not be blank',
                });
            } else {
                setBattleError({...battleError, [fieldName]: null});
            }
            if (fieldName === 'startDate' || fieldName === 'topyaRoundStartDate') {
                if (
                    new Date(startDate).getTime() <
                    new Date(tournamentStartDate).getTime()
                ) {
                    setBattleError({
                        ...battleError,
                        [fieldName]: 'Selected date is past date',
                    });
                } else {
                    setBattleError({...battleError, [fieldName]: null});
                }
            }
        }

        if (fieldName === 'updateOnTopya') {
            value = battleRound[index].updateOnTopya ? 0 : 1;
            if (value === 1) {
                setIsUpdateOnTopya(true);
            }
        }
        if (fieldName === 'minRound') {
            if (value < 1 && value > battleRound[0].maxRound) {
                value = 1;
                setBattleError({
                    ...battleError,
                    [fieldName]: 'Min value can not be less than an hour.',
                });
            } else {
                setBattleError({...battleError, [fieldName]: null});
            }
        }
        if (fieldName === 'timeToRespond' || fieldName === 'maxVideoLength') {
            if (parseInt(value, 10) < 1) {
                value = 1;
                setBattleError({
                    ...battleError,
                    [fieldName]: 'Min value can not be less than an hour.',
                });
            } else {
                setBattleError({...battleError, [fieldName]: null});
            }
        }
        if (fieldName === 'maxRound') {
            if (
                value < 0 ||
                parseInt(value, 10) < parseInt(battleRound[0].minRound, 10)
            ) {
                setBattleError({
                    ...battleError,
                    [fieldName]: "Battle Max Round can't be less than 1 or min round",
                });
                value = battleRound[0].minRound;
            } else {
                setBattleError({...battleError, [fieldName]: null});
            }
        }
        let allvalue = [...battleRound];

        allvalue[index][fieldName] = value;
        setBattleRound(allvalue);
    };

    const saveStage = async (e, label) => {
        e.preventDefault();
        setIsLoader(true);
        if (!name) {
            setSnameError('Stage Name field is required.');
        }
        if (stageType !== 'pool') {
            const condition1 =
                !stageId &&
                new Date(battledate).getTime() < new Date(todayDate).getTime();
            const condition =
                !stageId &&
                new Date(startDate).getTime() < new Date(todayDate).getTime();
            const conditionStartDate =
                (!stageId &&
                    new Date(startDate).getTime() <
                    new Date(tournamentStartDate).getTime()) ||
                (stageId &&
                    new Date(startDate).getTime() <
                    new Date(tournamentStartDate).getTime());

            const conditionStartDateBattle =
                (!stageId &&
                    new Date(battledate).getTime() <
                    new Date(tournamentStartDate).getTime()) ||
                (stageId &&
                    new Date(battledate).getTime() <
                    new Date(tournamentStartDate).getTime());

            const conditionEndDate =
                (!stageId &&
                    new Date(endDate).getTime() < new Date(todayDate).getTime()) ||
                (stageId &&
                    new Date(endDate).getTime() < new Date(todayDate).getTime());

            const conditionEndDate1 =
                !stageId && new Date(endDate).getTime() < new Date(startDate).getTime();
            // if(condition)
            if (stageType === 'skill') {
                if (condition) {
                    setSdateError(
                        'Please Select the future "Date & Time" to start the Stage.'
                    );
                }
                if (conditionStartDate) {
                    setSdateError('selected date is less then Tournament Start Date');
                }
                if (!startDate) {
                    setSdateError('Stage "Start Date & Time " field is required.');
                } else {
                    if (condition) {
                        setSdateError(
                            'Please Select the future "Date & Time" to start the Stage.'
                        );
                    } else if (
                        new Date(endDate).getTime() < new Date(startDate).getTime()
                    ) {
                        setEdateError('Selected date must be less than End Date');
                    }
                }
                if (!endDate) {
                    setEdateError('Stage " End Date & Time " field is required.');
                } else {
                    if (conditionEndDate) {
                        setEdateError(
                            'Selected "Date & Time" must be greater than from Start Date & Time.'
                        );
                    } else if (
                        new Date(endDate).getTime() < new Date(startDate).getTime()
                    ) {
                        setEdateError('Selected date must be greater than Start Date');
                    }
                }
                if (!videoLength) {
                    setVideoError('" Maximum Video Length " field is required.');
                }
            } else {
                if (thirdbracket === 'yes' && !thirdBattleRoundName) {
                    setThirdBattleError('Third Battle Round Name is mandatory');
                }
                if (!noOfCompetitors) {
                    setCompError(' Number of Competitors is required for BattleZone.');
                }

                if (!battleRound[0].name) {
                    setBattleError({
                        ...battleError,
                        name: ' "Round Name" field is required for BattleZone.',
                    });
                }
                if (!battledate) {
                    setBattleError({
                        ...battleError,
                        startDate: 'BattleZone "Start Date" field is required.',
                    });
                } else {
                    if (condition1) {
                        setBattleError({
                            ...battleError,
                            startDate:
                                'Please Select the future "Date & Time" to start the Stage.',
                        });
                    }
                }
                if (
                    parseInt(battleRound[0].minRound) > parseInt(battleRound[0].maxRound)
                ) {
                    setBattleError({
                        ...battleError,
                        minRound: 'A minimum round can not be more than the maximum round.',
                    });
                }
                if (parseInt(battleRound[0].minRound, 10) === 0) {
                    setBattleError({...battleError, minRound: 'Value should not be 0'});
                }
                if (parseInt(battleRound[0].maxRound, 10) === 0) {
                    setBattleError({...battleError, maxRound: 'Value should not be 0'});
                }

                if (parseInt(battleRound[0].timeToRespond, 10) === 0) {
                    setBattleError({
                        ...battleError,
                        timeToRespond: 'Value should not be 0',
                    });
                }

                if (parseInt(battleRound[0].maxVideoLength, 10) === 0) {
                    setBattleError({
                        ...battleError,
                        maxVideoLength: 'Min value can not be less than a Second.',
                    });
                }
            }

            if (
                !name ||
                !selectedTeam ||
                condition ||
                conditionStartDate ||
                conditionEndDate1 ||
                (stageType === 'battle' &&
                    (!battleRound[0].name ||
                        !battleRound[0].minRound ||
                        !battledate ||
                        condition1 ||
                        conditionStartDateBattle ||
                        parseInt(battleRound[0].minRound) >
                        parseInt(battleRound[0].maxRound))) ||
                (stageType === 'skill' &&
                    (!videoLength || sdateError || edateError || !startDate || !endDate))
            ) {
                enqueueSnackbar('Please fill all the details correctly', {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setIsLoader(false);
                return false;
            }
        } else if (stageType === 'pool') {
            if (!minRound) {
                setPoolRoundsError({
                    ...poolRoundsError,
                    minRoundError: 'Value Should not be Blank',
                });
            }

            if (!nextRoundCount) {
                setPoolRoundsError({
                    ...poolRoundsError,
                    nextRoundCountErr: 'Value Should not be Blank',
                });
            }

            if (!tableLabel) {
                setPoolRoundsError({
                    ...poolRoundsError,
                    tableLabelError: 'Value Should not be Blank',
                });
            }
            if (!timeToRespond) {
                setPoolRoundsError({
                    ...poolRoundsError,
                    timeToResErr: 'Value Should not be Blank',
                });
            }
            if (!maxVideoLength) {
                setPoolRoundsError({
                    ...poolRoundsError,
                    maxVideoLenErr: 'Value Should not be Blank',
                });
            }

            if (!maxRound) {
                setPoolRoundsError({
                    ...poolRoundsError,
                    maxRoundError: 'Value Should not be Blank',
                });
            }
            let totalcompitior = 0;
            for (let i = 0; i < groupCompetitors.length; i++) {
                if (groupCompetitors[i].competitorData.length > 1) {
                    totalcompitior = totalcompitior + groupCompetitors[i].competitorData.length;
                }
            }
            if (totalcompitior < 1) {
                if (!tableLabel) {
                    setPoolRoundsError({
                        ...poolRoundsError,
                        tableLabelError: 'Value Should not be Blank',
                    })
                } else {
                    setPoolRoundsError({
                        ...poolRoundsError,
                        playerSelect: 'Please select more then 2 players'
                    })
                }
            }

            if (!minRound || !maxRound || !nextRoundCount || !tableLabel || !timeToRespond || !maxVideoLength || totalcompitior < 1) {
                enqueueSnackbar('Please fill all the details correctly', {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setIsLoader(false);
                return false;
            }
        }

        if (selectedTeam === '{}') {
            setTeamDataError(' Team field is required for Stage. ');
        }

        let formData = new FormData();
        const competitorsArr = [];
        if (selectedMembers && selectedMembers.length) {
            for (const obj of selectedMembers) {
                if (obj.id || obj.user_id) {
                    competitorsArr.push(obj.id || obj.user_id);
                }
            }
        }

        if (stageType === 'battle' && competitorsArr.length !== parseInt(noOfCompetitors, 10)) {
            if (competitorsArr.length === 0) {
                setBattleError({...battleError, players: null});
            } else if (
                competitorsArr.length <
                parseInt(noOfCompetitors, 10) / 2 + 1
            ) {
                setBattleError({
                    ...battleError,
                    players: `Please Select atleast ${parseInt(noOfCompetitors, 10) / 2 +
                    1} competitor players for the BattleZone. `,
                });
                setIsLoader(false);
                return false;
            } else {
                setBattleError({...battleError, players: null});
            }
        }

        const battles = battleRound;
        if (stageType === 'battle' && battles.length && thirdbracket === 'yes') {
            battles[battles.length - 1].thirdBattleRoundName = thirdBattleRoundName;
            battles[
            battles.length - 1
                ].thirdBattleDescription = thirdBattleDescription;
            battles[
            battles.length - 1
                ].topyaRoundNameForThird = topyaRoundNameForThird;
            battles[
            battles.length - 1
                ].topyaRoundDescriptionForThird = topyaRoundDescriptionForThird;
        }

        const judgeGroups = [];

        if (groups && groups.length) {
            for (const obj of groups) {
                if (obj.judges && obj.judges.length) {
                    judgeGroups.push(obj);
                }
            }
        }

        const competitorArray = [];
        if (stageType === 'pool' && groupCompetitors && groupCompetitors.length) {
            for (let obj of groupCompetitors) {
                delete obj.competitorData;
                competitorArray.push(obj);
            }
        }

        formData.append('stageName', name);
        formData.append('stageDescription', description);
        formData.append('stageType', stageType);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('maxVideoLenght', videoLength);
        formData.append('userId', userId);
        formData.append('team_id', parseInt(teamData.id, 10));
        formData.append('noOfGroups', judgeCount);
        formData.append('tournament_id', tournamentId);
        formData.append('judges', JSON.stringify(judgeGroups));
        formData.append('noOfCompititor', noOfCompetitors);
        formData.append('pathId', pathSkillId)
        if (stageType === 'battle') {
            formData.append('roundArray', JSON.stringify(battles));
        }
        formData.append('competitor', JSON.stringify(competitorsArr));
        formData.append('seeds', JSON.stringify(seeds));
        formData.append(
            'thirdplacebracket',
            JSON.stringify(thirdbracket === 'yes' ? 1 : 0)
        );
        formData.append('invitCode', team);
        formData.append('videoLink', videolink);
        formData.append('detailH1', detailh1);
        formData.append('bodytext', draftToHtml(convertToRaw(bodytext.getCurrentContent()))
        );
        if (stageType === 'pool') {
            formData.append('tableLable', tableLabel);
            formData.append('lableSequence', labelSequence);
            formData.append('minRound', minRound);
            formData.append('maxRound', maxRound);
            formData.append('timeOfResponed', timeToRespond);
            formData.append('maxVideoLenght', maxVideoLength);
            formData.append('roundArray', JSON.stringify(poolRounds));
            formData.append('groupCompetitor', JSON.stringify(competitorArray));
            formData.append('noOfCompititorPerGroup', competitorsPerGroup);
            formData.append('advanceToNextRound', nextRoundCount);
        }
        let url = process.env.REACT_APP_API_URI + 'tournament/';
        if (tournamentId && stageId) {
            formData.append('stageId', stageId);
            url = url + 'updatestage';
        } else {
            url = url + 'createstage';
        }

        const data = await helpers.formDataMultipart('POST', url, formData);
        setIsLoader(false);

        if (data.status === 200) {
            const message =
                tournamentId && stageId ? 'Stage Updated' : 'Stage created';
            enqueueSnackbar(message, {
                variant: 'success',
                autoHideDuration: 3000,
            });
            if (label === 'finish' || (tournamentId && stageId)) {
                const path =
                    roleId === '2'
                        ? '/application-dashboard/tournaments/' + tournamentId
                        : '/organisation-dashboard/tournaments/' + tournamentId;
                history.push(path);
            } else {
                setName('');
                setDescription('');
                setStageType('skill');
                setStartDate('');
                setEndDate('');
                setVideoLength('');
                setJudgeCount(0);
                setSelectedTeam('');
                setTeamData({});
                setGroups([]);
                setSnameError(null);
                setSdateError(null);
                setVideoError(null);
                setTeamDataError(null);
                setBattleError({});
            }
            handleClose()
        } else {
            setError(data);

            const path =
                roleId === '2'
                    ? '/application-dashboard/tournaments/' + tournamentId
                    : '/organisation-dashboard/tournaments/' + tournamentId;
            history.push(path);
            handleClose()
        }
    };

    useEffect(() => {
        if (membersChanged) {
            enterInputFields(noOfCompetitors, 0);
            setMembersChanged(false);
        }
    }, [membersChanged, selectedMembers, enterInputFields, noOfCompetitors]);

    const handleStageType = value => {
        setStageType(value);
        setJudgeCount(0);
        setSelectedTeam('');
        setTeamData({});
        if (!isEdit) {
            setGroups([]);
        }
    };

    const handleTn1 = async e => {
        setName(e.target.value);
        const value = e.target.value;
        if (!value) {
            const msg = "This field can't be blank.";
            setSnameError(msg);
        } else {
            setSnameError(null);
        }
    };

    const handleTn2 = async e => {
        const value = e.target.value;
        if (!value) {
            setVideoLength(e.target.value < 0 ? 0 : e.target.value);
            const msg = "This field can't be blank.";
            setVideoError(msg);
        } else if (value === '0') {
            setVideoLength(e.target.value < 1 ? 1 : e.target.value);
            setVideoError("Value Can't be 0");
            return false;
        } else {
            setVideoLength(e.target.value < 0 ? 0 : e.target.value);
            setVideoError(null);
        }
    };

    const handleTn4 = async e => {
        let today = e,
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
        today = year + '-' + month + '-' + day + 'T' + hrs + ':' + mins;
        const value = e;

        if (new Date().getTime > new Date(value).getTime) {
            setSdateError('Start date is less then Current');
        } else {
            setStartDate(today);
            setSdateError(null);
        }
        if (!value) {
            const msg = "This field can't be blank.";
            setSdateError(msg);
        } else {
            setSdateError(null);
        }
    };

    const handleTn5 = async e => {
        let today = e,
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
        today = year + '-' + month + '-' + day + 'T' + hrs + ':' + mins;
        setEndDate(today);
        const value = e;
        if (!value) {
            const msg = "This field can't be blank.";
            setEdateError(msg);
        } else {
            if (new Date(value) < new Date(todayDate)) {
                setEdateError('Selected date should not be before ');
            }
            setEdateError(null);
        }
    };

    const handleSaveStage = async (e, label) => {
        e.preventDefault();
        if (isUpdateOnTopya || (stageId && stageType === "pool" && poolCreatedTopya === 1)) {
            setShow(true);
        } else {
            saveStage(e, label);
        }
    };

    const handleClose = () => setShow(false);

    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <React.Fragment>
            <AppLayout>
                <div className="main-d dashboard permision sys-app-details">
                    <div className="container">
                        <h1>{stageId ? 'Edit a Stage - ' + name : 'Create a Stage'}</h1>
                        <form onSubmit={handleSaveStage}>
                            <StageDetails
                                name={name}
                                handleTn1={handleTn1}
                                snameError={snameError}
                                description={description}
                                setDescription={setDescription}
                                stageId={stageId}
                                stageType={stageType}
                                handleStageType={handleStageType}
                            />

                            {stageType !== 'pool' ? (
                                <Fragment>
                                    <hr/>
                                    <div className="row">
                                        <div className="col-md-4">
                                            {stageType === 'skill' ? (
                                                <SkillStageDetails
                                                    startDate={startDate}
                                                    handleTn4={handleTn4}
                                                    todayDate={todayDate}
                                                    sdateError={sdateError}
                                                    endDate={endDate}
                                                    handleTn5={handleTn5}
                                                    edateError={edateError}
                                                    videoLength={videoLength}
                                                    handleTn2={handleTn2}
                                                    videoError={videoError}
                                                />
                                            ) : (
                                                ''
                                            )}
                                            <div className="form-group">
                                                {stageType === 'battle' ? (
                                                    <BattleStageDetails
                                                        thirdbracket={thirdbracket}
                                                        setThirdbracket={setThirdbracket}
                                                        videolink={videolink}
                                                        setVideolink={setVideolink}
                                                        detailh1={detailh1}
                                                        setDetailh1={setDetailh1}
                                                        bodytext={bodytext}
                                                        setBodytext={setBodytext}
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                                <TeamDropdown
                                                    teams={teams}
                                                    selectedTeam={selectedTeam}
                                                    handleSelectedTeam={handleSelectedTeam}
                                                    teamDataError={teamDataError}
                                                />
                                            </div>
                                            {stageType === 'skill' ? (
                                                <TeamDetails
                                                    pathSkillId={pathSkillId}
                                                    handleSelectedPath={handleSelectedPath}
                                                    pathSkill={pathSkill}
                                                    teamData={teamData}
                                                    team={team}
                                                    setTeam={setTeam}
                                                    videolink={videolink}
                                                    setVideolink={setVideolink}
                                                    detailh1={detailh1}
                                                    setDetailh1={setDetailh1}
                                                    bodytext={bodytext}
                                                    setBodytext={setBodytext}
                                                />
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                    {stageType === 'skill' ? (
                                        <JudgesPanel
                                            judgeCount={judgeCount}
                                            handleTn3={e => addJudgeGroups(e)}
                                            judges={judges}
                                        />
                                    ) : (
                                        <CompetitorPanel
                                            selectCompetitors={selectCompetitors}
                                            noOfCompetitors={noOfCompetitors}
                                            elements={elements}
                                            compError={compError}
                                        />
                                    )}
                                    {stageType === 'battle' &&
                                    isbattleZone &&
                                    battles &&
                                    battles.length ? (
                                        <BattleZoneForm
                                            battleError={battleError}
                                            rounds={battles}
                                            players={players}
                                            roundForTBD={roundForTBD}
                                            judges={judges}
                                            members={members}
                                            setMembers={setMembers}
                                            selectMember={selectMember}
                                            selected={selected}
                                            setCompetitors={setCompetitors}
                                            setSeeds={setSeeds}
                                            seeds={seeds}
                                            setPlayers={setPlayers}
                                            setSelectedMembers={setSelectedMembers}
                                            selectedMembers={selectedMembers}
                                            battleRound={battleRound}
                                            handleBattleForm={handleBattleForm}
                                            setBattledate={setBattledate}
                                            competitorArr={competitorArr}
                                            thirdbracket={thirdbracket}
                                            thirdBattleRoundName={thirdBattleRoundName}
                                            thirdBattleDescription={thirdBattleDescription}
                                            setThirdBattleRoundName={setThirdBattleRoundName}
                                            setThirdBattleDescription={setThirdBattleDescription}
                                            topyaRoundNameForThird={topyaRoundNameForThird}
                                            topyaRoundDescriptionForThird={
                                                topyaRoundDescriptionForThird
                                            }
                                            handleTopyaRoundNameForThird={setTopyaRoundNameForThird}
                                            handleTopyaRoundDescForThird={
                                                setTopyaRoundDescriptionForThird
                                            }
                                            thirdBattleError={thirdBattleError}
                                            stageId={stageId}
                                        />
                                    ) : null}
                                </Fragment>
                            ) : (
                                <PoolPanel
                                    teams={teams}
                                    selectedTeam={selectedTeam}
                                    handleSelectedTeam={handleSelectedTeam}
                                    teamDataError={teamDataError}
                                    videolink={videolink}
                                    setVideolink={setVideolink}
                                    detailh1={detailh1}
                                    setDetailh1={setDetailh1}
                                    bodytext={bodytext}
                                    setBodytext={setBodytext}
                                    judgeCount={judgeCount}
                                    addJudgeGroups={addJudgeGroups}
                                    judges={judges}
                                    noOfCompetitors={noOfCompetitors}
                                    setNoOfCompetitors={setNoOfCompetitors}
                                    compError={compError}
                                    competitorsPerGroup={competitorsPerGroup}
                                    setCompetitorsPerGroup={setCompetitorsPerGroup}
                                    nextRoundCount={nextRoundCount}
                                    setNextRoundCount={setNextRoundCount}
                                    tableLabel={tableLabel}
                                    setTableLabel={setTableLabel}
                                    labelSequence={labelSequence}
                                    setLabelSequence={setLabelSequence}
                                    minRound={minRound}
                                    setMinRound={setMinRound}
                                    maxRound={maxRound}
                                    setMaxRound={setMaxRound}
                                    timeToRespond={timeToRespond}
                                    setTimeToRespond={setTimeToRespond}
                                    maxVideoLength={maxVideoLength}
                                    setMaxVideoLength={setMaxVideoLength}
                                    poolRounds={poolRounds}
                                    setPoolRounds={setPoolRounds}
                                    groupCompetitors={groupCompetitors}
                                    setGroupCompetitors={setGroupCompetitors}
                                    poolRoundsError={poolRoundsError}
                                    membersData={members}
                                    getMembers={getMembers}
                                    teamData={teamData}
                                    stageId={stageId}
                                    poolCreatedTopya={poolCreatedTopya}
                                    getStageDetails={getStageDetails}
                                />
                            )}

                            <ButtonPanel
                                tournamentId={tournamentId}
                                stageId={stageId}
                                handleSaveStage={handleSaveStage}
                                stageType={stageType}
                            />
                        </form>
                    </div>
                </div>
            </AppLayout>
            <ConfirmModal
                classes={classes}
                show={show}
                stageType={stageType}
                handleClose={handleClose}
                saveStage={saveStage}
                isMobile={isMobile}
            />
        </React.Fragment>
    );
};

export default CreateStage;
