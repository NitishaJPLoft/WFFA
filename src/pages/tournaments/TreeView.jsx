import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {useMediaQuery} from 'react-responsive';

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

const TreeView = props => {
    const {treeData, roundname, thirdbattle, bracket, url, secondary, primary, enableWinner} = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [video, setVideo] = React.useState('');
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});

    const handleOpen = p => {
        setOpen(true);
        setVideo(p);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const cssArr = [
        {
            class1: '',
            class2: '',
        },
        {
            class1: 'margin30',
            class2: 'margin50',
            class3: 'margin30-1',
            class4: 'margin50-1'
        },
        {
            class1: 'margin75',
            class2: 'margin140',
        },
        {
            class1: 'margin160',
            class2: 'margin200',
        },
        {
            class1: 'margin250',
            class2: 'margin300',
        },
        {
            class1: 'margin350',
            class2: 'margin400',
        },
        {
            class1: 'margin450',
            class2: 'margin500',
        },
    ];

    return (
        <React.Fragment>
            {treeData && treeData.length
                ? treeData.map((obj, index) => {
                    return (
                        <div className="bracket" key={index}>
                            <p
                                className="round-heading "
                                style={{backgroundColor: primary ? primary : ''}}
                            >
                                {roundname &&
                                roundname.length &&
                                roundname[index] &&
                                roundname[index].roundname
                                    ? roundname[index].roundname
                                    : ''}
                            </p>

                            {obj.map((innerObj, i) => {
                                const p1 = innerObj.player1,
                                    p2 = innerObj.player2;
                                return (
                                    <React.Fragment key={index + '_' + i}>
                                        <div
                                            key={index + '_' + i}
                                            className={
                                                'bracket-box ' +
                                                (i === 0
                                                    ? p2 && Object.keys(p2).length ? cssArr[index].class1 : cssArr[index].class3
                                                    : p2 && Object.keys(p2).length ? cssArr[index].class2 : cssArr[index].class4)
                                            }
                                            style={{
                                                borderColor: primary ? primary : '',
                                                height: p2 && Object.keys(p2).length ? '115px' : '60px',
                                                display: p2 && Object.keys(p2).length ? '' : p1.user_id ? '' : 'flex',
                                                alignItems: p2 && Object.keys(p2).length ? '' : p1.user_id ? '' : 'flex-end'
                                            }}
                                        >
                                            {p1.compiledVideo ? <div
                                                type="button"
                                                className='playbtn'
                                                onClick={e => handleOpen(p1.compiledVideo)}
                                            /> : ''}
                                            {p1.compiledVideo ? (
                                                <div className="w-75" id={'video_' + i} tabIndex="-1">
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
                                                                <video
                                                                    className="w-100"
                                                                    height="400"
                                                                    controls
                                                                >
                                                                    <source
                                                                        src={video && video.length ? video : ''}
                                                                        type="video/mp4"
                                                                    />
                                                                </video>
                                                            </div>
                                                        </Fade>
                                                    </Modal>
                                                </div>
                                            ) : (
                                                ''
                                            )}

                                            <div className="name-sr">
                                                {p1.seeds ? (
                                                    <p>{p1.seeds === 'TBD' ? '' : p1.seeds}</p>
                                                ) : (
                                                    <p/>
                                                )}
                                                {p1.avatarURL === 'TBD' ? (
                                                    ''
                                                ) : p1.avatarURL ? (
                                                    <img src={p1.avatarURL} alt="user"/>
                                                ) : (
                                                    ''
                                                )}
                                                <p className="word-wraping" style={{
                                                    textAlign: 'start',
                                                    width: p2 && Object.keys(p2).length ? '' : p1.user_id ? '' : '65%'
                                                }}>
                                                    {p1.displayName}
                                                    <br/>
                                                    <div style={{color: 'grey', fontSize: '13px'}}>
                                                        {p1.username}
                                                    </div>
                                                </p>
                                            </div>

                                            {p1.countrysetting === 'countryCode' ? (
                                                <span>{p1.contrycode}</span>
                                            ) : p1.countrysetting === 'flag' ? (
                                                p1.countryflag === 'TBD' ? (
                                                    ''
                                                ) : (
                                                    <div className="country-flag">
                                                        {!p1.countryflag && p2.user_id !== 0 ? (
                                                            ''
                                                        ) : p1.countryflag === null ? (
                                                            ''
                                                        ) : (
                                                            <embed
                                                                style={{
                                                                    width: '40px',
                                                                    height: '23px',
                                                                    border: '1px solid black',
                                                                }}
                                                                src={p1.countryflag}
                                                                alt="flag"
                                                            />
                                                        )}
                                                    </div>
                                                )
                                            ) : p1.countrysetting === 'both' ? (
                                                <div className="country-flag">
                                                    <span>{p1.contrycode}</span>
                                                    <br/>
                                                    {!p1.countryflag && p1.seeds ? (
                                                        <img
                                                            style={{
                                                                width: '40px',
                                                                height: '23px',
                                                                border: '1px solid #7b7b7b',
                                                                overflow: 'hidden',
                                                                marginRight: '-1px',
                                                            }}
                                                            alt=""
                                                        />
                                                    ) : p1.countryflag ? (
                                                        <embed
                                                            style={{
                                                                width: '23px',
                                                                height: '23px',
                                                                border: '1px solid #7b7b7b',
                                                                overflow: 'hidden',
                                                                marginRight: '-1px',
                                                            }}
                                                            src={p1.countryflag}
                                                            alt="flag"
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            ) : (
                                                ''
                                            )}

                                            {p2 && Object.keys(p2).length ? <hr/> : ''}
                                            {p2 && Object.keys(p2).length ? <React.Fragment>
                                                <div className="name-sr">
                                                    {p2.seeds ? (
                                                        <p>{p2.seeds === 'TBD' ? '' : p2.seeds}</p>
                                                    ) : (
                                                        <p/>
                                                    )}
                                                    {p2.avatarURL === 'TBD' ? (
                                                        ''
                                                    ) : p2.avatarURL ? (
                                                        <img src={p2.avatarURL} alt="user"/>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <p className="word-wraping" style={{textAlign: 'start'}}>
                                                        {p2.displayName}
                                                        <br/>
                                                        <div style={{color: 'grey', fontSize: '13px'}}>
                                                            {p2.username}
                                                        </div>
                                                    </p>
                                                </div>
                                                {p2.countrysetting === 'countryCode' ? (
                                                    <span>{p2.contrycode}</span>

                                                ) : p2.countrysetting === 'flag' ? (
                                                    p2.countryflag === 'TBD' ? (
                                                        ''
                                                    ) : (
                                                        <div className="country-flag">
                                                            {!p2.countryflag && p2.user_id !== 0 ? (
                                                                ''
                                                            ) : p2.countryflag === null ? (
                                                                ''
                                                            ) : (
                                                                <embed
                                                                    style={{
                                                                        width: '40px',
                                                                        height: '23px',
                                                                        border: '1px solid #7b7b7b',
                                                                        overflow: 'hidden',
                                                                        marginRight: '-1px',
                                                                    }}
                                                                    src={p2.countryflag}
                                                                    alt="flag"
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                ) : p2.countrysetting === 'both' ? (
                                                    <div className="country-flag">
                                                        <span>{p2.contrycode}</span>
                                                        <br/>
                                                        {!p2.countryflag && p2.seeds ? (
                                                            <img
                                                                style={{
                                                                    width: '40px',
                                                                    height: '23px',
                                                                    border: '1px solid #7b7b7b',
                                                                    overflow: 'hidden',
                                                                    marginRight: '-1px',
                                                                }}
                                                                alt=""
                                                            />
                                                        ) : p2.countryflag ? (
                                                            <embed
                                                                style={{
                                                                    width: '23px',
                                                                    height: '23px',
                                                                    border: '1px solid #7b7b7b',
                                                                    overflow: 'hidden',
                                                                    marginRight: '-1px',
                                                                }}
                                                                src={p2.countryflag}
                                                                alt="flag"
                                                            />
                                                        ) : (
                                                            ''
                                                        )}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                                {obj.length === 1 && enableWinner ? (
                                                    <div
                                                        key={index + '_' + i}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            margin: 0,
                                                            right: '-260px',
                                                            width: ' 250px',
                                                            border: 'none',
                                                        }}
                                                        className={
                                                            (p1.compiledVideo ? ' bracket-box ' : '') +
                                                            (i === 0
                                                                ? cssArr[index].class1
                                                                : cssArr[index].class2)
                                                        }
                                                        data-toggle="modal"
                                                        data-target={'#exampleModal' + i}
                                                    >
                                                        <div className="name-sr">
                                                            {p1.winner === p1.user_id ? (
                                                                <h3
                                                                    style={{color: secondary ? secondary : ''}}
                                                                >
                                                                    Champion
                                                                </h3>
                                                            ) : p1.winner !== null ? (
                                                                <h3 style={{
                                                                    color: primary ? primary : '',
                                                                    marginTop: '-20px'
                                                                }}>
                                                                    <br/>
                                                                    2nd Place
                                                                </h3>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                        <div className="name-sr">
                                                            {p2.winner === p2.user_id ? (
                                                                <h3
                                                                    style={{
                                                                        color: secondary ? secondary : '',
                                                                        marginTop: '20px',
                                                                    }}
                                                                >
                                                                    Champion
                                                                </h3>
                                                            ) : p2.winner !== null ? (
                                                                <h3
                                                                    style={{
                                                                        color: primary ? primary : '',
                                                                        marginTop: '20px',
                                                                    }}
                                                                >
                                                                    2nd Place
                                                                </h3>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </React.Fragment> : ''}

                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    );
                })
                : null}

            <div className="row">
                <div className="col-md-12 text-left" style={{display: "flex", justifyContent: "space-between"}}>
                    <div>
                        <a href={url}>
                            <h6 style={{color: 'grey'}}>
                                Click here for more tournament details
                            </h6>
                        </a>
                        <img style={{height: '70px'}} src={bracket} alt=""/>
                    </div>

                    {thirdbattle && thirdbattle.player1 ? (
                        <div className="bracket">
                            <p
                                className="round-heading"
                                style={{backgroundColor: primary ? primary : ''}}
                            >
                                THIRD PLACE
                            </p>
                            <div
                                type="button"
                                className={
                                    'bracket-box ' +
                                    (thirdbattle.player1.compiledVideo ? 'playbtn' : '')
                                }
                                style={{
                                    textAlign: 'left',
                                    borderColor: primary ? primary : '',
                                }}
                                onClick={e => handleOpen(thirdbattle.player1.compiledVideo)}
                            >
                                <div className="name-sr">
                                    {thirdbattle.player1.seeds ? (
                                        <p>
                                            {thirdbattle.player1.seeds === 'TBD'
                                                ? ''
                                                : thirdbattle.player1.seeds}
                                        </p>
                                    ) : (
                                        ''
                                    )}
                                    {thirdbattle.player1.avatarURL === 'TBD' ? (
                                        ''
                                    ) : thirdbattle.player1.avatarURL ? (
                                        <img src={thirdbattle.player1.avatarURL} alt="user"/>
                                    ) : (
                                        ''
                                    )}
                                    <p className="word-wraping" style={{textAlign: 'left'}}>
                                        {thirdbattle.player1.displayName}
                                        <br/>
                                        <div style={{color: 'grey', fontSize: '13px'}}>
                                            <div
                                                className="modal fade"
                                                id={'exampleModalth'}
                                                tabIndex="-1"
                                                role="dialog"
                                                aria-labelledby="exampleModalLabel"
                                                aria-hidden="true"
                                            >
                                                <div className="modal-dialog" role="document">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5
                                                                className="modal-title"
                                                                id="exampleModalLabel"
                                                            >
                                                                Video
                                                            </h5>
                                                            <button
                                                                type="button"
                                                                className="close"
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <div
                                                                className="embed-responsive embed-responsive-16by9"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {thirdbattle.player1.username}
                                        </div>
                                    </p>
                                </div>
                                {thirdbattle.player1.countrysetting === 'countryCode' ? (
                                    <span>{thirdbattle.player1.contrycode}</span>
                                ) : thirdbattle.player1.countrysetting === 'flag' ? (
                                    thirdbattle.player1.countryflag === 'TBD' ? (
                                        ''
                                    ) : (
                                        <div className="country-flag">
                                            {!thirdbattle.player1.countryflag &&
                                            thirdbattle.player2.user_id !== 0 ? (
                                                <img
                                                    style={{
                                                        width: '40px',
                                                        height: '23px',
                                                        border: '1px solid black',
                                                    }}
                                                    alt=""
                                                />
                                            ) : thirdbattle.player1.countryflag === null ? (
                                                ''
                                            ) : (
                                                <embed
                                                    style={{
                                                        width: '23px',
                                                        height: '23px',
                                                        border: '1px solid black',
                                                    }}
                                                    src={thirdbattle.player1.countryflag}
                                                    alt="flag"
                                                />
                                            )}
                                        </div>
                                    )
                                ) : thirdbattle.player1.countrysetting === 'both' ? (
                                    <div className="country-flag">
                                        <span>{thirdbattle.player1.contrycode}</span>
                                        <br/>
                                        {!thirdbattle.player1.countryflag ? (
                                            <div
                                                style={{
                                                    width: '33px',
                                                    height: '17px',
                                                    border: '1px solid #7b7b7b',
                                                    overflow: 'hidden',
                                                    marginRight: '-1px',
                                                }}
                                            />
                                        ) : (
                                            <embed
                                                style={{
                                                    width: '23px',
                                                    height: '22px',
                                                    border: '1px solid #7b7b7b',
                                                    overflow: 'hidden',
                                                    marginRight: '-1px',
                                                }}
                                                src={thirdbattle.player1.countryflag}
                                                alt="flag"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    ''
                                )}
                                <hr/>
                                <div className="name-sr">
                                    {thirdbattle.player2.seeds ? (
                                        <p>
                                            {thirdbattle.player2.seeds === 'TBD'
                                                ? ''
                                                : thirdbattle.player2.seeds}
                                        </p>
                                    ) : (
                                        ''
                                    )}
                                    {thirdbattle.player2.avatarURL === 'TBD' ? (
                                        ''
                                    ) : thirdbattle.player2.avatarURL ? (
                                        <img src={thirdbattle.player2.avatarURL} alt="user"/>
                                    ) : (
                                        ''
                                    )}
                                    <p className="word-wraping" style={{textAlign: 'left'}}>
                                        {thirdbattle.player2.displayName}
                                        <br/>
                                        <div style={{color: 'grey', fontSize: '13px'}}>
                                            {thirdbattle.player2.username}
                                        </div>
                                    </p>
                                </div>
                                {thirdbattle.player2.countrysetting === 'countryCode' ? (
                                    <span>{thirdbattle.player2.contrycode}</span>
                                ) : thirdbattle.player2.countrysetting === 'flag' ? (
                                    thirdbattle.player2.countryflag === 'TBD' ? (
                                        ''
                                    ) : (
                                        <div className="country-flag">
                                            {!thirdbattle.player2.countryflag &&
                                            thirdbattle.player2.user_id !== 0 ? (
                                                <img
                                                    style={{
                                                        width: '33px',
                                                        height: '17px',
                                                        border: '1px solid #7b7b7b',
                                                        overflow: 'hidden',
                                                        marginRight: '-1px',
                                                    }}
                                                    alt=""
                                                />
                                            ) : thirdbattle.player2.countryflag === null ? (
                                                ''
                                            ) : (
                                                <embed
                                                    style={{
                                                        width: '23px',
                                                        height: '22px',
                                                        border: '1px solid #7b7b7b',
                                                        overflow: 'hidden',
                                                        marginRight: '-1px',
                                                    }}
                                                    src={thirdbattle.player2.countryflag}
                                                    alt="flag"
                                                />
                                            )}
                                        </div>
                                    )
                                ) : thirdbattle.player2.countrysetting === 'both' ? (
                                    <div className="country-flag">
                                        <span>{thirdbattle.player2.contrycode}</span>
                                        <br/>
                                        {!thirdbattle.player2.countryflag ? (
                                            <img
                                                style={{
                                                    width: '33px',
                                                    height: '17px',
                                                    border: '1px solid #7b7b7b',
                                                    overflow: 'hidden',
                                                    marginRight: '-1px',
                                                }}
                                                alt=""
                                            />
                                        ) : (
                                            <embed

                                                style={{
                                                    width: '23px',
                                                    height: '22px',
                                                    border: '1px solid #7b7b7b',
                                                    overflow: 'hidden',
                                                    marginRight: '-1px',
                                                }}
                                                src={thirdbattle.player2.countryflag}
                                                alt="flag"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {enableWinner ? <div
                                style={{
                                    position: 'absolute',
                                    top: 80,
                                    textAlign: 'left',
                                    margin: 0,
                                    right: '-260px',
                                    width: ' 250px',
                                    border: 'none',
                                }}
                                className={
                                    thirdbattle.player1.compiledVideo ? ' bracket-box' : ''
                                }
                            >
                                <div className="name-sr">
                                    {thirdbattle.player1.winner ===
                                    thirdbattle.player1.user_id ? (
                                        <h3 style={{color: primary ? primary : ''}}>3rd Place</h3>
                                    ) : thirdbattle.player1.winner !== null ? (
                                        <h3 style={{color: primary ? primary : '', marginTop: '-20px'}}>
                                            <br/>
                                            4th Place
                                        </h3>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div className="name-sr">
                                    {thirdbattle.player2.winner ===
                                    thirdbattle.player2.user_id ? (
                                        <h3
                                            style={{
                                                color: secondary ? secondary : '',
                                                marginTop: '20px',
                                            }}
                                        >
                                            3rd Place
                                        </h3>
                                    ) : thirdbattle.player2.winner !== null ? (
                                        <h3
                                            style={{
                                                color: primary ? primary : '',
                                                marginTop: '20px',
                                            }}
                                        >
                                            4th Place
                                        </h3>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div> : ''}
                        </div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default TreeView;
