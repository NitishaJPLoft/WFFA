import React, {useState, useEffect} from 'react';
import TeamDropdown from './TeamDropdown';
import RadioLayout from '../../../layouts/RadioLayout';
import LandingPageInfo from './LandingPageInfo';
import JudgesPanel from './JudgesPanel';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import SelectPoolPanel from './SelectPoolPanel';
import {useSnackbar} from 'notistack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {helpers} from '../../../helper';
import {useHistory} from 'react-router-dom';

const PoolPanel = props => {
    const history = useHistory();
    const {
        teams,
        selectedTeam,
        handleSelectedTeam,
        teamDataError,
        videolink,
        setVideolink,
        detailh1,
        setDetailh1,
        bodytext,
        setBodytext,
        judgeCount,
        addJudgeGroups,
        judges,
        noOfCompetitors,
        setNoOfCompetitors,
        compError,
        competitorsPerGroup,
        setCompetitorsPerGroup,
        nextRoundCount,
        setNextRoundCount,
        tableLabel,
        setTableLabel,
        labelSequence,
        setLabelSequence,
        minRound,
        setMinRound,
        maxRound,
        setMaxRound,
        timeToRespond,
        setTimeToRespond,
        maxVideoLength,
        setMaxVideoLength,
        poolRounds,
        setPoolRounds,
        groupCompetitors,
        setGroupCompetitors,
        poolRoundsError,
        membersData,
        teamData,
        getMembers,
        stageId,
        poolCreatedTopya,
        getStageDetails
    } = props;

    const [poolError, setPoolError] = useState({
        id: '',
        name: null,
        startDate: null,
    });
    const [open, setOpen] = React.useState(false);

    const [nextRoundCountErr, setNextRoundCountErr] = useState(null);
    const [timeToResErr, setTimeToResErr] = useState(null);
    const [maxVideoLenErr, setMaxVideoLenErr] = useState(null);
    const [oldNoOfCompetitors, setOldNoOfCompetitors] = useState(0);
    const [members, setMembers] = useState();
    const [isLabelDisabled, setIsLabelDisabled] = useState(false);
    const [isedit, setIsedit] = useState(true);
    const [memCondition, setMemCondition] = useState(true);
    const [memberCon, setMemberCon] = useState(true);
    const [roundIds, setRoundIds] = useState();
    const [updateTopiya, setUpdateTopiya] = useState();
    const {enqueueSnackbar} = useSnackbar();
    const [updated, setUpdated] = useState({
        roundName: '',
        roundDescription: '',
        startDate: ''
    })
    const [rounds, setRounds] = useState()

    const handleClickOpen = (roundid, updateontopya, round) => {

        setOpen(true);
        setRoundIds(roundid)
        setUpdateTopiya(updateontopya)
        setRounds(round)
    };

    const handleClose = () => {
        setOpen(false);
        setRoundIds()
        setUpdateTopiya()
        setUpdated({
            roundName: '',
            roundDescription: '',
            startDate: ''
        })

    };

    const selectCompetitorsPerGroup = value => {
        setCompetitorsPerGroup(value);
        const rounds = [];
        if (value % 2 === 0) {
            value = value - 1;
        }
        for (let i = 1; i <= value; i++) {
            rounds.push({
                key: `Round ${i}`,
                name: `Round ${i}`,
                description: '',
                startDate: new Date(),
            });
        }
        setPoolRounds(rounds);
    };

    const convertToAlphabetLabel = number => {
        let baseChar = 'A'.charCodeAt(0);
        if (number <= 26) {
            return String.fromCharCode(baseChar + (number % 26));
        } else {
            return (
                String.fromCharCode(baseChar + parseInt(number / 26) - 1) +
                String.fromCharCode(baseChar + (number % 26))
            );
        }
    };

    useEffect(() => {
        if (noOfCompetitors && competitorsPerGroup && tableLabel && labelSequence) {
            const groupCount = Math.ceil(noOfCompetitors / competitorsPerGroup);
            const extraPlayers = noOfCompetitors % competitorsPerGroup;
            const groups = [];
            if (groupCount > 26) {
                setLabelSequence('numerical');
                setIsLabelDisabled(true);
            } else {
                setIsLabelDisabled(false);
            }
            if (extraPlayers === 1) {
                enqueueSnackbar('All the groups should have more than 1 competitor', {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setMembers(membersData);
                setGroupCompetitors([]);
            } else {
                for (let i = 0; i < groupCount; i++) {
                    groups.push({
                        id: '',
                        name:
                        tableLabel +
                        ' ' +
                        (labelSequence === 'numerical'
                            ? i + 1
                            : convertToAlphabetLabel(i)),
                        competitor: [],
                        competitorData: [],
                        seed: [],
                    });
                    let n = competitorsPerGroup;
                    if (extraPlayers) {
                        if (i === groupCount - 1) {
                            n = extraPlayers;
                        }
                    }
                    for (let j = 0; j < n; j++) {
                        groups[i].competitor.push(0);

                        groups[i].seed.push(j + 1);
                    }
                }
                setMembers(membersData);
                setGroupCompetitors(groups);
            }
        }
    }, [noOfCompetitors, competitorsPerGroup, tableLabel, labelSequence]);

    const handlePoolRounds = (e, index) => {
        const fieldName = e.target.name;
        let value = e.target.value;
        if (!value) {
            setPoolError({
                ...poolError,
                [fieldName]: 'Value can not be blank',
            });
        } else {
            setPoolError({...poolError, [fieldName]: null});
        }
        let allValue = [...poolRounds];
        allValue[index][fieldName] = value;
        setPoolRounds(allValue);
    };

    const handlePoolUpdateRounds = (e, index) => {

        const fieldName = e.target.name;
        let value = e.target.value;


        setUpdated({...updated, [fieldName]: value});
    };

    const handlePoolDate = (e, index) => {
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
        let all = [...poolRounds];
        all[index].startDate = today;
        setPoolRounds(all);
    };


    const handleUpdatedPoolDate = (e, index) => {
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
        let all = {...updated};
        all.startDate = today;

        setUpdated(all);
    };

    const selectCompetitors = (values, index, number, data) => {
        const memIndex = members.findIndex(obj => obj.id === parseInt(values));
        const array = [...groupCompetitors];
        array[number].competitorData[index] = members[memIndex];
        array[number].competitor[index] = values;
        setGroupCompetitors(array);
        members.splice(memIndex, 1);
        setMembers(members);
    };

    const editCompetitors = (e, index) => {
        let i = 0;
        const mem = members ? members : [];

        if (mem.length) {
            const array = [...groupCompetitors];

            for (i; i < groupCompetitors.length; i++) {
                groupCompetitors[i].competitorData = [];

                for (let j = 0; j < groupCompetitors[i].competitor.length; j++) {
                    const com =
                        groupCompetitors &&
                        groupCompetitors[i] &&
                        groupCompetitors[i].competitor
                            ? groupCompetitors[i].competitor
                            : [];

                    const memInde = mem.findIndex(obj => obj.id === parseInt(com[j]));

                    array[i].competitorData[j] = members[memInde];
                    // members.splice(memInde, 1);
                }
            }

            setGroupCompetitors(array);

            setMembers(members);
            setIsedit(false);
        }
    };

    const handleUpdatePool = async (roundId) => {
        const url =
            process.env.REACT_APP_API_URI + 'tournament/updateRoundDetail';
        let formData = new FormData();
        formData.append('stageId', stageId);
        formData.append('roundId', roundIds ? roundIds : '');
        formData.append('roundName', updated && updated.roundName ? updated.roundName : rounds && rounds.name ? rounds.name : '');
        formData.append('roundDescription', updated && updated.roundDescription ? updated.roundDescription : rounds && rounds.description ? rounds.description : '');
        formData.append('startDate', updated && updated.startDate ? updated.startDate : rounds && rounds.startDate ? rounds.startDate : '');
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {
            enqueueSnackbar(response.message, {
                variant: 'success',
                autoHideDuration: 3000
            });
            handleClose();
            getStageDetails();
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
            handleClose();
            getStageDetails();
        }
    };

    const handleRemove = (index, i) => {
        const arr = [...groupCompetitors];
        const array = [...groupCompetitors];
        members.push(groupCompetitors[index].competitorData[i]);
        const p = groupCompetitors[index].competitor;
        p.push(0);
        arr[index].competitorData.splice(i, 1);
        array[index].competitor.splice(i, 1);

        setGroupCompetitors(arr);
        setGroupCompetitors(array);
    };

    useEffect(() => {
        if (stageId && isedit && !memCondition) {
            editCompetitors();
        }
        if (teamData.id) {
            setMembers(membersData);
            if (members && members.length) {
                setMemCondition(false);
            } else {
                setMemCondition(true);
            }
        }
        if (!stageId && memberCon) {
            getMembers();
            setMemberCon(false);
        }
        if (oldNoOfCompetitors !== noOfCompetitors) {
            getMembers();
            setOldNoOfCompetitors(noOfCompetitors);
        } else {
            setOldNoOfCompetitors(noOfCompetitors);
        }
    }, [
        getMembers,
        noOfCompetitors,
        teamData.id,
        setMembers,
        membersData,
        stageId,
        editCompetitors,
    ]);

    return (
        <React.Fragment>
            <TeamDropdown
                teams={teams}
                selectedTeam={selectedTeam}
                handleSelectedTeam={handleSelectedTeam}
                teamDataError={teamDataError}
            />
            <hr style={{marginTop: '40px'}}/>
            <label>Landing Page</label>
            <div className="col-md-4" style={{paddingLeft: 0}}>
                <LandingPageInfo
                    videolink={videolink}
                    setVideolink={setVideolink}
                    detailh1={detailh1}
                    setDetailh1={setDetailh1}
                    bodytext={bodytext}
                    setBodytext={setBodytext}
                />
            </div>
            <hr style={{marginTop: '40px'}}/>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                            Enter Number of Competitors
                            <span style={{color: '#e63737'}}>*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Number of Competitors"
                            value={noOfCompetitors}
                            required
                            onChange={e => setNoOfCompetitors(e.target.value)}
                            min={0}
                        />
                        <span className="help-block error text-danger">
                            {compError ? compError : ''}
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                            Number of Competitors per Group
                            <span style={{color: '#e63737'}}>*</span>
                        </label>
                        <div id="custom-select">
                            <select
                                onChange={e => selectCompetitorsPerGroup(e.target.value)}
                                value={competitorsPerGroup}
                                required
                            >
                                <option value="">Select</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                                <option value={6}>6</option>
                                <option value={7}>7</option>
                                <option value={8}>8</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                            How many will advance to the next round from each Group?
                            <span style={{color: '#e63737'}}>*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Enter Number"
                            value={nextRoundCount}
                            required
                            onChange={e => setNextRoundCount(e.target.value)}
                            min={0}
                        />
                        <span className="help-block error text-danger">
                            {nextRoundCountErr ? nextRoundCountErr : ''}
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                            Table Label (Group, Pool, etc.)
                            <span style={{color: '#e63737'}}>*</span>
                        </label>
                        <input
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Women's Group"
                            value={tableLabel}
                            required
                            onChange={e => setTableLabel(e.target.value)}
                        />
                        <span className="help-block error text-danger">
                            {poolRoundsError.tableLabelError ? poolRoundsError.tableLabelError : ''}
                        </span>
                    </div>
                    <div className="Configuration">
                        <h6>
                            <strong>Table Label Sequence</strong>
                        </h6>
                        <RadioLayout
                            label="Alphabetical"
                            id="alphabetical"
                            name="sequence"
                            value="alphabatical"
                            checked={labelSequence === 'alphabatical'}
                            handleChange={setLabelSequence}
                            disabled={isLabelDisabled}
                        />
                        <RadioLayout
                            label="Numerical"
                            id="numerical"
                            name="sequence"
                            value="numerical"
                            checked={labelSequence === 'numerical'}
                            handleChange={setLabelSequence}
                            disabled={isLabelDisabled}
                        />
                    </div>
                </div>
            </div>
            <hr style={{marginTop: '30px'}}/>
            <label>Competitors</label>

            {groupCompetitors && groupCompetitors.length
                ? groupCompetitors.map((obj, index) => {

                    return (
                        <div className="form-group" key={index}>
                            <label>{obj.name}</label>
                            <br/>
                            <div className="final-sec tab_nob">
                                <section>
                                    <table style={{width: '60%'}}>
                                        {groupCompetitors && groupCompetitors[index] &&
                                        groupCompetitors[index].competitorData &&
                                        groupCompetitors[index].competitorData.length ? (
                                            <thead>
                                            <tr>
                                                <th>S.no</th>

                                                <th>Name</th>

                                                <th style={{textAlign: 'right'}}>Username</th>
                                                <th/>
                                                <th>Country</th>
                                                <th/>
                                            </tr>
                                            </thead>
                                        ) : (
                                            ''
                                        )}
                                    </table>

                                    {obj && obj.competitor
                                        ? obj.competitor.map((data, i) => (
                                            <SelectPoolPanel
                                                selectCompetitors={selectCompetitors}
                                                handleRemove={handleRemove}
                                                groupCompetitors={groupCompetitors}
                                                members={members}
                                                index={index}
                                                i={i}
                                                data={data}
                                                stageId={stageId}
                                                editCompetitors={editCompetitors}
                                            />
                                        ))
                                        : ''}

                                </section>
                            </div>


                        </div>
                    );
                })
                : ''}
            <span className="help-block error text-danger">
                {poolRoundsError && poolRoundsError.playerSelect
                    ? poolRoundsError.playerSelect
                    : ''}
                                </span>
            <JudgesPanel
                judgeCount={judgeCount}
                handleTn3={e => addJudgeGroups(e)}
                judges={judges}
            />


            <hr style={{marginTop: '20px'}}/>
            <div className="col-md-4">
                <label>Battlezone Settings</label>
                <div className="form-group">
                    <label>
                        Minimum Rounds (enter number, default = 1)
                        <span style={{color: '#e63737'}}>*</span>
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        required
                        min={1}
                        name="minRound"
                        value={minRound}
                        onChange={e => setMinRound(e.target.value)}
                        placeholder="1"
                    />
                    <span className="help-block error text-danger">
                        {poolRoundsError && poolRoundsError.minRoundError
                            ? poolRoundsError.minRoundError
                            : ''}
                    </span>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlInput1">
                        Maximum Rounds (enter number or “no limit”, default = no limit)
                        <span style={{color: '#e63737'}}>*</span>
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        required
                        name="maxRound"
                        min={minRound}
                        value={maxRound}
                        onChange={e => setMaxRound(e.target.value)}
                        placeholder="3"
                    />
                    <span className="help-block error text-danger">
                        {poolRoundsError.maxRoundError ? poolRoundsError.maxRoundError : ''}
                    </span>
                </div>
                <div className="form-group">
                    <label style={{display: 'block'}}>
                        Time to Respond (enter number of hours, default = 48 hours)
                        <span style={{color: '#e63737'}}>*</span>
                    </label>
                    <input
                        style={{
                            width: '60px',
                            display: 'inline-block',
                        }}
                        type="number"
                        className="form-control"
                        name="timeToRespond"
                        required
                        min={0}
                        value={timeToRespond}
                        onChange={e => setTimeToRespond(e.target.value)}
                        placeholder="48"
                    />
                    <span> hours</span>
                    <span className="help-block error text-danger">
                        {timeToResErr ? timeToResErr : ''}
                    </span>
                </div>
                <div className="form-group">
                    <label style={{display: 'block'}}>
                        Maximum Video Length
                        <span style={{color: '#e63737'}}>*</span>
                    </label>
                    <input
                        style={{
                            width: '60px',
                            display: 'inline-block',
                        }}
                        type="number"
                        className="form-control"
                        name="maxVideoLength"
                        required
                        min={1}
                        placeholder="30"
                        value={maxVideoLength}
                        onChange={e => setMaxVideoLength(e.target.value)}
                    />
                    <span> seconds</span>
                    <span className="help-block error text-danger">
                        {maxVideoLenErr ? maxVideoLenErr : ''}
                    </span>
                </div>
            </div>
            <hr style={{marginTop: '40px'}}/>
            {poolRounds && poolRounds.length ? (
                <div id="accordion-style-pool" className="container pl-0 final-sec">
                    <div className="container pl-0">
                        <section>
                            <div className="row">
                                <div className="col-md-7">
                                    <div id="accordionPoolExample" className="accordion">
                                        {poolRounds &&
                                        poolRounds.length &&
                                        poolRounds.map((round, index) => {
                                            return (
                                                <div className="card" key={index}>
                                                    <div
                                                        id={round + '-' + index}
                                                        className="card-header"
                                                    >
                                                        <h5 className="mb-0">
                                                            <button
                                                                style={{marginLeft: '10px'}}
                                                                type="button"
                                                                data-toggle="collapse"
                                                                data-target={
                                                                    '#' + (round.key || round.roundId)
                                                                }
                                                                aria-expanded={index === 0}
                                                                aria-controls={round.key}
                                                                className="btn btn-link btn-block text-left"
                                                            >
                                                                {round.key || round.name}
                                                                <i className="fa fa-chevron-down"/>
                                                            </button>
                                                        </h5>
                                                    </div>
                                                    <div
                                                        id={round.key || round.roundId}
                                                        aria-labelledby={round + '-' + index}
                                                        data-parent="#accordionPoolExample"
                                                        className={
                                                            'collapse fade' + (index === 0 ? ' show' : '')
                                                        }
                                                    >

                                                        <div className="card-body">
                                                            <div className="col-md-10">
                                                                <div className="form-group">
                                                                    <label>
                                                                        Round Name
                                                                        <span style={{color: '#e63737'}}>*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="name"
                                                                        value={round.name}
                                                                        required
                                                                        onChange={e => handlePoolRounds(e, index)}
                                                                    />
                                                                    <span className="help-block error text-danger">
                                                                        {poolError.name ? poolError.name : ''}
                                                                    </span>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Round Description (optional)</label>
                                                                    <textarea
                                                                        className="form-control"
                                                                        rows="5"
                                                                        name="description"
                                                                        value={round.description}
                                                                        onChange={e => handlePoolRounds(e, index)}
                                                                        placeholder="Description"
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label>Start Date</label>
                                                                    <MuiPickersUtilsProvider
                                                                        utils={DateFnsUtils}
                                                                    >
                                                                        <KeyboardDateTimePicker
                                                                            className="form-control"
                                                                            id="startDate"
                                                                            ampm={false}
                                                                            name="startDate"
                                                                            invalidDateMessage={null}
                                                                            value={round.startDate}
                                                                            onChange={e => handlePoolDate(e, index)}
                                                                            format="MM-dd-yyyy HH:mm"
                                                                            minDate={new Date()}
                                                                            onKeyDown={e => e.preventDefault()}
                                                                        />
                                                                    </MuiPickersUtilsProvider>
                                                                    <span className="help-block error text-danger">
                                                                        {poolError.startDate ? poolError.startDate : ''}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                </div>

                                                                {poolCreatedTopya ? poolCreatedTopya === 1 ?
                                                                    <Button variant="outlined" color="primary"
                                                                            onClick={e => handleClickOpen(round.roundId, round.updateOnTopya, round)}>
                                                                        update
                                                                    </Button>
                                                                    : '' : ''}

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby={"alert-dialog-title"}
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id={"alert-dialog-title"}>{"Update Round"}</DialogTitle>
                                            <DialogContent style={{width: "350px"}}>
                                                <div className="col-md-10">
                                                    <div className="form-group">
                                                        <label>
                                                            Round Name
                                                            <span style={{color: '#e63737'}}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="roundName"
                                                            value={updated.roundName ? updated.roundName : rounds && rounds.name ? rounds.name : ''}
                                                            required
                                                            onChange={e => handlePoolUpdateRounds(e)}
                                                        />
                                                        <span className="help-block error text-danger">
                                                                        {poolError.name ? poolError.name : ''}
                                                                    </span>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Round Description (optional)</label>
                                                        <textarea
                                                            className="form-control"
                                                            rows="5"
                                                            name="roundDescription"
                                                            value={updated.roundDescription ? updated.roundDescription : rounds && rounds.description ? rounds.description : ''}
                                                            onChange={e => handlePoolUpdateRounds(e)}
                                                            placeholder="Description"
                                                        />
                                                    </div>
                                                    {updateTopiya ? updateTopiya === 2 ?
                                                        <div className="form-group">
                                                            <label>Start Date</label>
                                                            <MuiPickersUtilsProvider
                                                                utils={DateFnsUtils}
                                                            >
                                                                <KeyboardDateTimePicker
                                                                    className="form-control"
                                                                    id="startDate"
                                                                    ampm={false}
                                                                    name="startDate"
                                                                    invalidDateMessage={null}
                                                                    value={updated.startDate ? updated.startDate : rounds && rounds.startDate ? rounds.startDate : ''}
                                                                    onChange={e => handleUpdatedPoolDate(e)}
                                                                    format="MM-dd-yyyy HH:mm"
                                                                    minDate={new Date()}
                                                                    onKeyDown={e => e.preventDefault()}
                                                                />
                                                            </MuiPickersUtilsProvider>

                                                        </div>
                                                        : '' : ''}


                                                    <div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose} color="primary">
                                                    Disagree
                                                </Button>
                                                <Button onClick={e => handleUpdatePool("df")} color="primary">
                                                    Update
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                ''
            )}
        </React.Fragment>
    );
};

export default PoolPanel;
