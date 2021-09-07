import React, {useState, useEffect, useRef} from 'react';
import axios, {isCancel} from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {useMediaQuery} from 'react-responsive';
import {BASE_URL} from '../../helper/fetch';
import {useSnackbar} from 'notistack';
import {helpers} from '../../helper';
import SelectScore from './SelectScore';
import PlayerDetails from './PlayerDetails';
import PlayerScore from './PlayerScore';
import RoundsAccordian from './RoundsAccordian';
import RawVideos from './RawVideos';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import video from '../../images/video.png';
import {useHistory} from 'react-router-dom';
import saveAs from 'file-saver';
import Progress from './Progress';
import {source} from "./CancelToken";

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

const SingleRow = props => {
    const classes = useStyles();
    const {judge, getjudges, updatevideo} = props;
    const [isCopied, setIsCopied] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const [saveSkill, setSaveSkill] = useState('');
    const [score, setScore] = useState(0);
    const [saveBattels, setSaveBattels] = useState('');
    const [saveBattelsaways, setSaveBattelsaways] = useState('');
    const [saveBattleError, setsaveBattleError] = useState('');
    const [saveSkillError, setsaveSkillError] = useState('');
    const [rawVideo1, setRawVideo1] = useState(judge.player1 && judge.player1.rawVideo && judge.player1.rawVideo.length ? judge.player1.rawVideo : []);
    const [rawVideo2, setRawVideo2] = useState(judge.player2 && judge.player2.rawVideo && judge.player2.rawVideo.length ? judge.player2.rawVideo : []);
    const [rawVideoLink, setRawVideoLink] = useState(updatevideo ? judge.skillVideos : []);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);

    const [uploadPercentage, setUploadPercentage] = useState(0);
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});
    const cancelFileUpload = useRef(null);

    const saveSkills = e => {
        let value = e.target.value;
        setSaveSkill(value);
    };

    const saveBattel = e => {
        let value = e.target.value;
        setSaveBattels(value);
    };

    const saveBattelaway = e => {
        let value = e.target.value;
        setSaveBattelsaways(value);
    };

    const handleSave = async () => {
        if (open) {
            setOpen(false);
        }
        if (saveSkill === 'Select 1-10' || !saveSkill) {
            setsaveSkillError("Score can't be Empty");
        } else {
            setsaveSkillError('');

            const url = BASE_URL + 'addSkillScore';

            const formData = new FormData();
            formData.append('idForUpdate', judge.idForUpdate);
            formData.append('score', saveSkill);
            const response = await helpers.formDataMultipart('POST', url, formData);

            if (response.status === 200) {
                getjudges();
                enqueueSnackbar('Score submission', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setIsEdit(false);
                setScore(0);
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                }
            }
        }

    };

    const handleOpen = e => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isCopied) {
            enqueueSnackbar('Link copied to Clipboard', {
                variant: 'success',
                autoHideDuration: 1000,
            });
            setIsCopied(false);
        }
    }, [isCopied, enqueueSnackbar]);

    const handleSaveBattel = async () => {
        if (open) {
            setOpen(false);
        }
        if (saveBattels === saveBattelsaways) {
            setsaveBattleError("Score can't be same");
        } else if (saveBattels === 'Select 1-10' || !saveBattels) {
            setsaveBattleError("Score can't be Empty");
        } else if (saveBattelsaways === 'Select 1-10' || !saveBattelsaways) {
            setsaveBattleError("Score can't be Empty");
        } else {
            setsaveBattleError('');

            const url = BASE_URL + 'addBattleScore';

            const formData = new FormData();
            formData.append('battleId', judge.battleId);
            formData.append('judgeId', judge.judgeId);
            formData.append('stageId', judge.stageId);
            formData.append('thirdbattle', judge.thirdbattle);

            formData.append('homeUserScore', saveBattels);
            formData.append('awayUserScore', saveBattelsaways);
            const response = await helpers.formDataMultipart('POST', url, formData);

            if (response.status === 200) {
                getjudges();
                enqueueSnackbar(' Score submitted ', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setIsEdit(false);
                setScore(0);
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                }
            }
        }
    };

    const handleSavePoolScore = async () => {
        if (open) {
            setOpen(false);
        }
        if (saveBattels === saveBattelsaways) {
            setsaveBattleError("Score can't be same");
        } else if (saveBattels === 'Select 1-10' || !saveBattels) {
            setsaveBattleError("Score can't be Empty");
        } else if (saveBattelsaways === 'Select 1-10' || !saveBattelsaways) {
            setsaveBattleError("Score can't be Empty");
        } else {
            setsaveBattleError('');

            const url = BASE_URL + 'addBattlePoolScore';

            const formData = new FormData();
            formData.append('battleId', judge.battleId);
            formData.append('judgeId', judge.judgeId);
            formData.append('stageId', judge.stageId);

            formData.append('homeUserScore', saveBattels);
            formData.append('awayUserScore', saveBattelsaways);

            const response = await helpers.formDataMultipart('POST', url, formData);

            if (response.status === 200) {
                getjudges();
                enqueueSnackbar(' Score submitted ', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                setIsEdit(false);
                setScore(0);
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                }
            }
        }
    };

    useEffect(() => {
        let scoreVal = 0;
        if (judge.judges && judge.judges.length) {
            judge.judges.map(
                obj =>
                    (scoreVal = scoreVal + (obj.score !== '' ? parseInt(obj.score) : 0))
            );
            setScore(parseFloat(scoreVal / judge.judges.length).toFixed(2));
        }
    }, [setScore, judge.judges]);

    const downloadVideo = () => {
        const full = judge.videoLink;
        const part = full.split('/');
        saveAs(judge.videoLink, part[part.length - 1]);
    };

    const calculateScore = player => {
        const condition = player && player.score && player.score.length;
        if (condition) {
            let score = 0;
            for (const obj of player.score) {
                score = score + obj.score;
            }
            return (score / player.score.length).toFixed(2);
        }
    };

    const handleVideoSubmit = async event => {
        event.preventDefault();

        const url = BASE_URL + 'system/addskillvideo';

        try {
            const promises = rawVideoLink.map(async (obj) => {
                const formData = new FormData();
                Object.keys(obj).forEach(key => {
                    formData.append(key, obj[key]);
                });
                formData.append('skillId', judge.skillId);
                await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: progressEvent => {
                        setUploadPercentage(
                            parseInt(
                                Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            )
                        );
                    },
                    cancelToken: source.token
                });
            });

            Promise.all(promises).then(() => {
                getjudges();
                enqueueSnackbar('Video Uploaded', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
            }).catch(error => {
                if (isCancel(error)) {
                    enqueueSnackbar(error.message, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                    source.token = '';
                    history.push('/system-dashboard/sync/update');
                }
                setUploadPercentage(0);
            });
        } catch (err) {
            if (isCancel(err)) {
                enqueueSnackbar(err.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
            }
            setUploadPercentage(0);
        }
    };

    const handleCompile = async event => {
        event.preventDefault();

        const url = BASE_URL + 'system/compiledvideo';
        const formData = new FormData();
        formData.append('id', judge.skillId || judge.battleId);
        formData.append('type', judge.stageType);
        const response = await helpers.formDataMultipart('POST', url, formData);

        if (response.status === 200) {
            getjudges();
            enqueueSnackbar('Compiled Request Received Successfully', {
                variant: 'success',
                autoHideDuration: 3000
            });
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
    };

    const handleChangeForPlayer = (e, index, player) => {
        if (judge.stageType === 'skill') {
            const fileIndex = rawVideoLink.findIndex(x => x.index === index);
            const arr = rawVideoLink;
            arr[fileIndex].video = e.target.files[0];
            setRawVideoLink(arr);
        } else {
            let videoArr = player === '1' ? rawVideo1 : rawVideo2;
            videoArr[index].video = e.target.files[0];
            videoArr[index].player = player === '1' ? judge.player1.id : judge.player2.id;
            videoArr[index].battleId = judge.battleId;
            videoArr[index].updated = 1;
            videoArr[index].thirdbattle = judge.thirdbattle;
            if (player === '1') {
                setRawVideo1(videoArr);
            } else {
                setRawVideo2(videoArr);
            }
        }
    };

    const saveBattleVideo = async (event) => {
        event.preventDefault();
        const url = BASE_URL + (judge.stageType === 'battle' ? 'system/addbattlevideo' : 'system/addbattlepoolvideo');
        const rawVideos = rawVideo1.concat(rawVideo2);
        try {
            const promises = rawVideos.map(async (obj) => {
                const formData = new FormData();
                Object.keys(obj).forEach(key => {
                    formData.append(key, obj[key]);
                });
                await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: progressEvent => {
                        setUploadPercentage(
                            parseInt(
                                Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            )
                        );
                    },
                    cancelToken: source.token
                });
            });

            Promise.all(promises).then(() => {
                getjudges();
                enqueueSnackbar('Video Uploaded', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
            }).catch(error => {
                if (isCancel(error)) {
                    enqueueSnackbar(error.message, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                    source.token = '';
                    history.push('/system-dashboard/sync/update');
                }
                setUploadPercentage(0);
            });
        } catch (err) {
            if (isCancel(err)) {
                enqueueSnackbar(err.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });

            }
            setUploadPercentage(0);
        }
    };

    const cancelUpload = async () => {
        if (judge.stageType === 'skill') {
            if (cancelFileUpload.current)
                cancelFileUpload.current("File upload process is cancelled");
        } else {
            source.cancel('Cancelled video file request');
        }
    };

    const hiddenFileInput = React.useRef(null);

    const handleClick = e => {
        e.preventDefault();
        hiddenFileInput.current.click();
    };

    return (
        <div className="row permisn-usr">
            <div className="col-md-7 p-4 text-center">
                {judge.videoLink ? (
                    <video className="w-100" width="500" height="380" controls>
                        <source src={judge.videoLink} type="video/mp4"/>
                    </video>
                ) : (
                    <img className="w-100" src={video} alt="user"/>
                )}

                <div className="row">
                    <React.Fragment>
                        <div className="col-md-12 text-center">
                            <button
                                className="main-btn-cncel"
                                onClick={e => downloadVideo(e)}
                            >
                                Download Link
                            </button>

                            <CopyToClipboard
                                style={{width: '157px'}}
                                className="main-btn-cncel custommargin"
                                text={judge.videoLink}
                                onCopy={() => setIsCopied(true)}
                            >
                                <span>Copy Link</span>
                            </CopyToClipboard>
                        </div>
                        <div className="col-md-12 text-center">
                            <a
                                href={judge.videoLink}
                                target="_blank"
                                rel="noreferrer"
                                className="m-3 d-inline-block"
                            >
                                video link
                            </a>
                        </div>
                    </React.Fragment>

                    {judge.stageType === 'skill' && (judge.judgestatus === 1 || judge.judgestatus === 3 || judge.judgestatus === 4) ? (
                        updatevideo === true ?
                            (
                                <React.Fragment>
                                    <RawVideos rawVideos={rawVideoLink} handleChangeForPlayer={handleChangeForPlayer}
                                               player="1" type="skill"/>
                                    <Progress percentage={uploadPercentage} multiple={true}
                                              cancelUpload={cancelUpload}/>
                                </React.Fragment>

                            ) : (
                                judge.judgestatus === 4 ?
                                    <React.Fragment>
                                        <div className="col-md-12 text-center">
                                            <h6 className="mt-3">
                                                <strong>Score: {score}</strong>
                                            </h6>
                                            {judge.judges.map((jud, index) => (
                                                <p className="pskill" key={'skill_' + index}>
                                                    <small>
                                                        {jud.displayName} Score: {jud.score}
                                                    </small>
                                                </p>
                                            ))}
                                        </div>
                                        {judge.editEnable && isEdit ? <React.Fragment>
                                            <div className="col-md-2"/>
                                            <SelectScore onChange={saveSkills} error={saveSkillError} skill={true}/>
                                            <div className="col-md-2"/>
                                        </React.Fragment> : ''}
                                    </React.Fragment> :
                                    <React.Fragment>
                                        <div className="col-md-2"/>
                                        <SelectScore onChange={saveSkills} error={saveSkillError} skill={true}/>
                                        <div className="col-md-2"/>
                                    </React.Fragment>

                            )
                    ) : (judge.stageType === 'battle' || judge.stageType === 'pool') && judge.judgestatus === 5 ? (
                        <div className="col-md-12 text-center">
                            {updatevideo === true ? (
                                <div className="row mobil-row">
                                    <div className="col-md-12 text-center">
                                        <RoundsAccordian
                                            player1={judge.player1.name}
                                            player2={judge.player2.name}
                                            rawVideo1={rawVideo1}
                                            rawVideo2={rawVideo2}
                                            handleChangeForPlayer={handleChangeForPlayer}
                                        />
                                        <Progress percentage={uploadPercentage} multiple={true}
                                                  cancelUpload={cancelUpload}/>
                                    </div>
                                </div>
                            ) : (
                                <React.Fragment>
                                    <div className="row text-left mt-4 mb-5">
                                        <div className="col-md-1"/>
                                        <div className="col-md-5">
                                            <PlayerDetails player={judge.player1}/>
                                        </div>
                                        <div className="col-md-5">
                                            <PlayerDetails player={judge.player2}/>
                                        </div>

                                        <div className="col-md-1"/>
                                    </div>
                                    <div className="row mobil-row">
                                        <SelectScore onChange={saveBattel} player1={true}/>
                                        <SelectScore onChange={saveBattelaway} error={saveBattleError}/>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    ) : (judge.stageType === 'battle' || judge.stageType === 'pool') && judge.judgestatus >= 6 ? (
                        <div className="col-md-12 text-center">
                            {updatevideo === true ? (
                                <div className="row mobil-row">
                                    <div className="col-md-12 text-center">
                                        <RoundsAccordian
                                            player1={judge.player1.name}
                                            player2={judge.player2.name}
                                            rawVideo1={rawVideo1}
                                            rawVideo2={rawVideo2}
                                            handleChangeForPlayer={handleChangeForPlayer}
                                        />
                                        <Progress percentage={uploadPercentage} multiple={true}
                                                  cancelUpload={cancelUpload}/>
                                    </div>
                                </div>
                            ) : (
                                <React.Fragment>
                                    <div className="row text-left mt-4 mb-5">
                                        <div className="col-md-1"/>
                                        <div className="col-md-5">
                                            <PlayerDetails player={judge.player1}/>
                                            <PlayerScore player={judge.player1} calculateScore={calculateScore}/>
                                        </div>

                                        <div className="col-md-5">
                                            <PlayerDetails player={judge.player2}/>
                                            <PlayerScore player={judge.player2} calculateScore={calculateScore}/>
                                        </div>

                                        <div className="col-md-1"/>
                                    </div>
                                    <div className="row judgebattle">
                                        <div className="col-md-2"/>
                                        <div className="col-md-2"/>
                                    </div>
                                    {judge.editEnable && isEdit ? <div className="row mobil-row">
                                        <SelectScore onChange={saveBattel} player1={true}/>
                                        <SelectScore onChange={saveBattelaway} error={saveBattleError}/>
                                    </div> : ''}
                                </React.Fragment>
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className="col-md-5 pt-5 mb-4">
                {judge.stageType === 'skill' ? (
                    <React.Fragment>
                        <p>
                            <strong>{judge.stageName}</strong>
                        </p>
                        <p>
                            <strong>Competitor Name: </strong>
                            {judge.compititorName}
                        </p>
                        <p>
                            <strong>Username: </strong>
                            {judge.compititorUsername}
                        </p>
                        <p>
                            <strong>Age: </strong>
                            {judge.compititorAge}
                        </p>
                        <p>
                            <strong>Country: </strong>
                            {judge.compititorCountry}
                        </p>
                        <p>
                            <strong>Gender: </strong>
                            {judge.compititorGender}
                        </p>
                        <p>
                            <strong>Start Date: </strong>

                            {judge.startDate ? helpers.getParsedDate(judge.startDate) : ''}
                        </p>
                        <p>
                            <strong>End Date: </strong>
                            {judge.endDate ? helpers.getParsedDate(judge.endDate) : ''}
                        </p>
                        <p>
                            <strong>Video Submission Date: </strong>
                            {judge.submissiondate
                                ? helpers.getParsedDate(judge.submissiondate)
                                : ''}
                        </p>
                        <p>
                            <strong>Maximum Video Length: </strong>
                            {judge.maxVideoLenght}
                        </p>

                        <p className="mt-4">
                            <strong>Judges:</strong>
                        </p>
                        {judge.judges.map((jud, index) => (
                            <p key={'judges_' + index}>
                                {jud.displayName}:{' '}
                                {jud.status === 3 ? 'Incomplete' : 'Complete'}
                            </p>
                        ))}
                    </React.Fragment>
                ) : (judge.stageType === 'battle' || judge.stageType === 'pool') ? (
                    <React.Fragment>
                        <p>
                            <strong>Start Date: </strong>
                            {judge.startDate}
                        </p>

                        <p>
                            <strong>Video Submission Date: </strong>
                            {judge.submissiondate ? helpers.getParsedDate(judge.submissiondate) : ''}
                        </p>
                        <p>
                            <strong>Maximum Video Length: </strong>
                            {judge.maxVideoLenght}
                        </p>

                        <p className="mt-4">
                            <strong>Judges:</strong>
                        </p>
                        {judge.judges && judge.judges.length
                            ? judge.judges.map((jud, index) => (
                                <p key={index}>
                                    {jud.displayName}:{' '}
                                    {jud.status === '5' ? 'Incomplete' : 'Complete'}
                                </p>
                            ))
                            : ''}
                    </React.Fragment>
                ) : (
                    ''
                )}
            </div>
            <div className="col-md-12 text-center">
                {judge.editEnable && !isEdit ?
                    <button
                        className="main-btn"
                        onClick={() => setIsEdit(true)}
                    >
                        Edit Score
                    </button> : ''}
                {updatevideo && judge.compileStatus === 2 ? <button
                    className="main-btn"
                    style={{pointerEvents: 'none'}}
                >
                    Compilation in Progress...
                </button> : <React.Fragment>
                    {updatevideo && judge.compileStatus === 1 ? <button
                        className="main-btn"
                        onClick={handleCompile}
                    >
                        Compile
                    </button> : ''}
                    {(judge.stageType === 'skill' && judge.judgestatus === 3) ||
                    ((judge.stageType === 'battle' || judge.stageType === 'pool') && judge.judgestatus === 5) ||
                    updatevideo || (judge.editEnable && isEdit) ? (
                        <button
                            className="main-btn"
                            onClick={
                                judge.editEnable && judge.scoreSubmited ? handleOpen
                                    : judge.stageType === 'skill' && !updatevideo ? handleSave
                                    : judge.stageType === 'battle' && !updatevideo ? handleSaveBattel
                                        : judge.stageType === 'pool' && !updatevideo ? handleSavePoolScore
                                            : judge.stageType === 'skill' && updatevideo ? handleVideoSubmit : saveBattleVideo
                            }
                        >
                            Save
                        </button>
                    ) : (
                        ''
                    )}
                </React.Fragment>}

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div
                            className={classes.paper}
                            style={{width: isMobile ? '75%' : '50%'}}
                        >
                            <button
                                style={{float: 'right'}}
                                id="transition-modal-title"
                                onClick={handleClose}
                                className="btn btn-danger"
                            >
                                X
                            </button>
                            <h5>Score has been updated on Topya, now this score will be updated on portal only, do you
                                really want to update score?</h5>
                            <hr/>
                            <div style={{float: 'right'}}>
                                <button onClick={handleClose} className="main-btn-cncel" style={{width: "100px"}}>
                                    Cancel
                                </button>
                                <button
                                    className="main-btn"
                                    style={{width: "100px", marginTop: 0, marginBottom: 0, marginRight: 0}}
                                    onClick={judge.stageType === 'skill' && !updatevideo ? handleSave
                                        : judge.stageType === 'battle' && !updatevideo ? handleSaveBattel
                                            : judge.stageType === 'pool' && !updatevideo ? handleSavePoolScore : ''}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Fade>
                </Modal>

            </div>
        </div>
    );
};

export default SingleRow;
