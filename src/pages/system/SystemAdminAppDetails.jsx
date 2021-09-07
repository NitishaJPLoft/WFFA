import React, {useEffect, useState, useCallback, Fragment} from 'react';
import AppLayout from '../../layouts/AppLayout';
import {Link, useParams, useHistory} from 'react-router-dom';
import LoaderLayout from '../../layouts/LoaderLayout';
import axios from 'axios';
import {useSnackbar} from 'notistack';
import {parseErrorResponse} from '../../helper/utilis';
import moment from 'moment';
import {authHeader} from '../../helper/auth-header';
import {helpers} from '../../helper';

const SystemAdminAppDetails = () => {
    const {appID} = useParams();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [app, setApp] = useState({});

    const history = useHistory();

    const changeStatus = useCallback(
        async status => {
            const url = process.env.REACT_APP_API_URI + 'app/' + appID;
            let formData = new FormData();
            formData.append('status', status);
            formData.append('_method', 'PUT');
            const data = await helpers.formDataMultipart('POST', url, formData);
            if (data.status === 200) {
                setApp(data.data);
                setIsInitialized(true);
                enqueueSnackbar(
                    `Application ${status === 'active' ? 'activated' : 'deactivated'}`,
                    {
                        variant: `${status === 'active' ? 'success' : 'error'}`,
                        autoHideDuration: 3000,
                    }
                );
            } else {
                if (data.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                } else {
                    enqueueSnackbar(data.message, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                }
            }
        },
        [appID, enqueueSnackbar, history]
    );

    const getData = useCallback(async () => {
        try {
            const url = process.env.REACT_APP_API_URI + 'app/' + appID;
            const response = await axios.get(url, {headers: authHeader()});
            if (response.data.status === 200) {
                setApp(response.data.data);
                setIsInitialized(true);
                setIsLoader(false);
            } else {
                if (response.status === 401) {
                    localStorage.clear();
                    history.push('/login');
                } else {
                    enqueueSnackbar(response.message, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    });
                }
            }
        } catch (error) {
            const response = parseErrorResponse(error);
            const redirect = response.redirect;
            const message = response.message;
            enqueueSnackbar(message, {
                variant: 'error',
                autoHideDuration: 3000,
            });

            if (redirect) {
                history.push('/404');
            }
        }
    }, [appID, enqueueSnackbar, history]);

    useEffect(() => {
        if (!isInitialized) {
            getData();
        }
    }, [isInitialized, getData]);

    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <AppLayout>
            <div className="main-d dashboard permision sys-app-details">
                <div className="container">
                    <h1>Applications</h1>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <button
                                type="button"
                                className={
                                    app.status === 'active' ? 'main-btn-cncel' : 'main-btn'
                                }
                                onClick={e =>
                                    changeStatus(app.status === 'active' ? 'inactive' : 'active')
                                }
                            >
                             
                                {app.status === 'active' ? 'Deactivate' : 'Activate'}{' '}
                            </button>

                            <Link to={'/system-dashboard/app/edit/' + appID} className="main-btn">
                                Edit Application
                            </Link>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <p>
                                <strong>Application Name: </strong>
                                {app.name}
                            </p>
                            <p>
                                <strong>Created: </strong>
                                {moment(app.dateCreated).format('MM-DD-YYYY HH:mm:ss')}
                            </p>

                            <p>
                                <strong>Slug Name: </strong>
                                {app.slug}
                            </p>
                            <p>
                                <strong>App Description</strong>
                            </p>
                            <p> {app.description}</p>
                            <p>
                                <strong>App Login Logo:</strong>
                            </p>
                            {app.login_logo ? (
                                <img height="100" alt="WFFALogo" src={app.login_logo}/>
                            ) : (
                                'Not available'
                            )}
                            <p>
                                <strong>App Logo:</strong>
                            </p>
                            {app.header_logo ? (
                                <img height="100" alt="WFFALogo" src={app.header_logo}/>
                            ) : (
                                'Not available'
                            )}
                            <p>
                                <strong>Video Watermark left :</strong>
                            </p>
                            {app.watermark_logo_left ? (
                                <img
                                    height="100"
                                    alt="WFFALogo"
                                    src={app.watermark_logo_left}
                                />
                            ) : (
                                'Not available'
                            )}

                            <p>
                                <strong>Video Watermark Right :</strong>
                            </p>
                            {app.watermark_logo ? (
                                <img height="100" alt="WFFALogo" src={app.watermark_logo}/>
                            ) : (
                                'Not available'
                            )}
                            <p>
                                <strong>Sponsor Logo</strong>
                            </p>
                            {app.sponser_logo ? (
                                <img height="100" alt="WFFALogo" src={app.sponser_logo}/>
                            ) : (
                                'Not available'
                            )}
                            <p>
                                <strong>Bracket Logo</strong>
                            </p>
                            {app.bracket_logo ? (
                                <img height="100" alt="WFFALogo" src={app.bracket_logo}/>
                            ) : (
                                'Not available'
                            )}

                            <p>
                                <strong>Landing page Logo(header left):</strong>
                            </p>
                            {app.landing_page_logo_left ? (
                                <img
                                    height="100"
                                    alt="WFFALogo"
                                    src={app.landing_page_logo_left}
                                />
                            ) : (
                                'Not available'
                            )}
                            <p>
                                <strong>HTML Link :</strong>
                                {app.landing_page_logo_left ? (
                                    <p>{app.landing_page_link_left}</p>
                                ) : (
                                    'Not available'
                                )}{' '}
                            </p>
                            <p>
                                <strong>Landing page Logo(header right):</strong>
                            </p>
                            {app.landing_page_logo_right ? (
                                <img
                                    height="100"
                                    alt="WFFALogo"
                                    src={app.landing_page_logo_right}
                                />
                            ) : (
                                'Not available'
                            )}
                            <p>
                                <strong>HTML Link :</strong>
                                {app.landing_page_logo_right ? (
                                    <p>{app.landing_page_link_left}</p>
                                ) : (
                                    'Not available'
                                )}{' '}
                            </p>

                            <p>
                                <strong>Application Color</strong>
                            </p>
                            <p>
                                {app.primary_color ? (
                                    <Fragment>
                                        <span
                                            className="app-color"
                                            style={{
                                                background: app.primary_color,
                                            }}
                                        /><strong>{app.primary_color}</strong>{' '}
                                    </Fragment>
                                ) : (
                                    ''
                                )}
                            </p>
                            <p>
                                <strong>Sponsor Primary Color</strong>
                            </p>
                            <p>
                                {app.secondary_color ? (
                                    <Fragment>
                                        <span
                                            className="app-color"
                                            style={{
                                                background: app.secondary_color,
                                            }}
                                        />
                                        <strong>{app.secondary_color}</strong>{' '}
                                    </Fragment>
                                ) : (
                                    ''
                                )}
                            </p>
                            <p>
                                <strong>Sponsor Secondary Color</strong>
                            </p>
                            <p>
                                {app.sponser_secondary_color ? (
                                    <Fragment>
                                        <span
                                            className="app-color"
                                            style={{
                                                background: app.sponser_secondary_color,
                                            }}
                                        />
                                        <strong>{app.sponser_secondary_color}</strong>{' '}
                                    </Fragment>
                                ) : (
                                    ''
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default SystemAdminAppDetails;
