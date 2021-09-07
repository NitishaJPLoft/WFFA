import React from 'react';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import LoaderLayout from '../../../layouts/LoaderLayout';
import AppLayout from '../../../layouts/AppLayout';
import {BASE_URL, apiCall} from '../../../helper/fetch';

const Sync = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = React.useState(false);

    const handleClick = async (e, type) => {
        setIsLoader(true);

        const url = BASE_URL + (type === 'user' ? 'cron/userorganizationWise' : type === 'organization' ?
            'cron/organizations' : type === 'team' ? 'cron/teams' : type === 'createChallenge' ? 'createChallenge' :
                type === 'createPoolChallenge' ? 'createPoolChallenge' : type === 'battle' ? 'cron/getChallengeVideo' :
                    type === 'skill' ? 'cron/getskillVideo' : type === 'getCompiledBattleVideo' ? 'cron/getcompiledvideo' :
                        type === 'getCompiledSkillVideo' ? 'cron/getcompiledvideoskill' : type === 'getCompiledPoolVideo' ?
                            'cron/getcompiledvideopool' : type === 'score' ? 'cron/submitscore' : type === 'poolScore' ?
                                'cron/submitPoolScore' : '');
        if (type === 'battle' || type === 'createChallenge' || type === 'createPoolChallenge' || type === 'skill' ||
            type === 'getCompiledBattleVideo' || type === 'getCompiledSkillVideo') {
            setTimeout(function () {
                apiCall('GET', url);
                enqueueSnackbar('Sync request has been taken', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
                setIsLoader(false);
            }, 3000)

        }
        else {
            await apiCall('GET', url);
            enqueueSnackbar('Sync request has been taken', {
                variant: 'success',
                autoHideDuration: 3000
            });
            setIsLoader(false);
        }
    };

    const handleClickvideo = async (e, type) => {
        setIsLoader(true);
        const urlnew = process.env.REACT_APP_VIDEO_URI + (type === 'compileBattleVideo' ? 'player.php' :
            type === 'compileSkillVideo' ? 'skillvideo/player.php' : type === 'compileBattleVideo' ? '' : '');
        const win = window.open(urlnew, "_target");
        win.focus();
        setTimeout(() => {
            win.close();
        }, 5000);
        setIsLoader(false);
    };

    const showVideos = async (e, type) => {
        history.push('/system-dashboard/videos/' + type);
    };

    const goToUpdateVideos = async (e) => {
        history.push('/system-dashboard/sync/update');
    };

    const updateSkillBattleVideo = async (e) => {
        history.push('/system-dashboard/videos/compilation-progress');
    };

    return (
        <AppLayout>
            {isLoader ? <LoaderLayout/> :
                <div className="main-d dashboard">
                    <div className="container">
                        <h1 className="d-flex justify-content-between">Synchronize </h1>
                        <React.Fragment>

                            <div className="row">
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => handleClick(e, 'organization')}

                                    >
                                        Sync Organization

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => handleClick(e, 'user')}

                                    >
                                        Sync User

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => handleClick(e, 'team')}
                                    >
                                        Sync Team

                                    </button>
                                </div>


                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'createChallenge')}
                                    >
                                        Create Challenge

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'createPoolChallenge')}
                                    >
                                        Create Pool Challenge

                                    </button>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'skill')}
                                    >
                                        Sync Skill Video

                                    </button>
                                </div>


                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'battle')}
                                    >
                                        Sync Battle/Pool Video

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClickvideo(e, 'compileSkillVideo')}
                                    >
                                        Compile Skill video
                                    </button>
                                </div>


                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClickvideo(e, 'compileBattleVideo')}
                                    >
                                        Compile Battle video

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'getCompiledSkillVideo')}
                                    >
                                        Get Compiled Skill Video

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'getCompiledBattleVideo')}
                                    >
                                        Get Compiled Battle Video

                                    </button>
                                </div>

                            </div>

                            <hr/>

                            <div className="row">
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => showVideos(e, "downloaded-skill")}
                                    >
                                        Show downloaded skill videos

                                    </button>
                                </div>
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => showVideos(e, "downloaded-battle")}
                                    >
                                        Show downloaded battle videos

                                    </button>
                                </div>
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => showVideos(e, "downloaded-pool")}
                                    >
                                        Show downloaded battle pool videos

                                    </button>
                                </div>
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => showVideos(e, "progress-skill-compile")}
                                    >
                                        Show in progress skill compile videos

                                    </button>
                                </div>
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => showVideos(e, "progress-battle-compile")}
                                    >
                                        Show in progress battle compile videos

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => showVideos(e, "progress-pool-compile")}
                                    >
                                        Show in progress battle pool compile videos

                                    </button>
                                </div>

                            </div>
                            <hr/>

                            <div className="row">
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0"
                                        onClick={e => goToUpdateVideos(e)}
                                    >
                                        Update/Replace Skill/Battle/Pool Videos

                                    </button>
                                </div>
                                <div className="col-md-6" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => updateSkillBattleVideo(e)}
                                    >
                                        New Updated Skill/Battle/Pool Videos Compilation Progress

                                    </button>
                                </div>
                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'score')}
                                    >
                                        Post Normal Battle Score

                                    </button>
                                </div>

                                <div className="col-md-4" style={{marginTop: '3%'}}>
                                    <button
                                        type="button"
                                        className="btn btn-primary m-0 "
                                        onClick={e => handleClick(e, 'poolScore')}
                                    >
                                        Post Pool Battle Score

                                    </button>
                                </div>
                            </div>
                            <hr/>
                        </React.Fragment>
                    </div>
                </div>
            }
        </AppLayout>
    )

};
export default Sync;