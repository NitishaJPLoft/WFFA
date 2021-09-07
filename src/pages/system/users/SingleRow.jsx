import React, {Fragment, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import SelectApp from './SelectApp';
import {useSnackbar} from 'notistack';
import SelectOrganization from './SelectOrganization';
import {BASE_URL} from '../../../helper/fetch';
import {helpers} from '../../../helper';

const SingleRow = props => {
    const {getUser} = props;
    const history = useHistory();
    const {user, apps, organizations, setActiveRadio, noEdit, setInitialized} = props;
    const {enqueueSnackbar} = useSnackbar();
    const [isShowMore, setIsShowMore] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [activePermission, setActivePermission] = useState('none');
    const [selectedApp, setSelectedApp] = useState([]);
    const [isShowAppSelect, setIsShowAppSelect] = useState(false);
    const [existingApps, setExsistingApps] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [existingOrganizations, setExistingOrganizations] = useState([]);
    const [orgError, setOrgError] = useState('');
    const roleId = parseInt(localStorage.getItem('roleId'), 10);
    const [multiple] = useState(true);

    const handleSelectedApp = data => {
        if (existingApps.length > -1) {
            setOrgError(null)
        }
        if (activePermission !== 2) {
            setSelectedApp(data.target.value);
        } else {
            setExsistingApps(data);
        }
    };

    const handleSelectedOrganization = data => {
        if (existingOrganizations.length > -1) {
            setOrgError(null)
        }
        setExistingOrganizations(data);
    };

    const handleShowMore = () => {
        setIsShowMore(!isShowMore);
    };

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };

    const handleSave = async () => {

        const url = BASE_URL + 'permission';
        const user_id = user.id;
        const role_id = activePermission;
        let appIds = [];
        if (activePermission === 2) {
            for (let obj of existingApps) {
                appIds.push(obj.id);
            }
        }

        const formData = new FormData();
        if (activePermission === 2 || activePermission === 'none') {
            if (activePermission === 2 ? existingApps && existingApps.length === 0 : '') {

                setOrgError('This field cannot be blank.');
                return false
            }
            formData.append('app_id', JSON.stringify(appIds));
            formData.append('user_id', user.id);
            formData.append(
                'role_id',
                activePermission === 'none' ? 0 : activePermission
            );

            const response = await helpers.formDataMultipart('POST', url, formData);

            if (response.status === 200) {
                enqueueSnackbar(`${activePermission === 'none' ? 'No permission saved.' : 'Permission saved'}`, {
                    variant: `${activePermission === 'none' ? 'error' : 'success'}`,
                    autoHideDuration: 3000,
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
        }

        if (activePermission === 3 || activePermission === 4) {
            if (existingOrganizations && existingOrganizations.length === 0) {

                setOrgError('This field cannot be blank.');
                return false
            }

            else if (existingOrganizations && existingOrganizations.length && user_id) {
                setOrgError('');
                const orgIds = [];
                for (let obj of existingOrganizations) {
                    orgIds.push(obj.id);
                }

                formData.append('organisation_id', JSON.stringify(orgIds));
                formData.append('user_id', user_id);
                formData.append('role_id', role_id);
                formData.append('app_id', selectedApp);
                let url1;
                if (activePermission === 3) {
                    url1 = BASE_URL + 'permission/createOrganization';
                } else {
                    url1 = BASE_URL + 'permission/createJudge';
                }
                const response = await helpers.formDataMultipart(
                    'POST',
                    url1,
                    formData
                );

                if (response.status === 200) {
                    getUser();
                    enqueueSnackbar(`${activePermission === 3 ? 'Organization permission saved. ' : 'Judge permision saved.'}`, {
                        variant: 'success',
                        autoHideDuration: 3000,
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
            }
        }
        setIsEdit(!isEdit);
        setActiveRadio('current');
        setInitialized(false);
    };

    const handlePermissionRadioButton = (e, type) => {
        setActivePermission(type);

        if (type === 'none') {
            setIsShowAppSelect(false);
        } else {
            if (type !== user.role_id) {
                setExistingOrganizations([]);
            } else {
                setExistingOrganizations(user.organizations);
            }
            setIsShowAppSelect(true);
        }
    };

    useEffect(() => {
        if (!isInitialized) {
            setActivePermission(user.role_id === 0 ? 'none' : user.role_id);
            setIsShowAppSelect(user.role_id !== 0);
            if (user.role_id === 0 || user.role_id === 3 || user.role_id === 4) {
                setSelectedApp(parseInt(user.app_id, 10));
                setExistingOrganizations(user.organizations);
            }
            if (user.role_id === 2) {
                setExsistingApps(user.allApps);
            }

            setIsInitialized(true);
        }
    }, [isInitialized, setIsInitialized, user]);


    return (
        <div className="row permisn-usr">
            <div className="col-md-3 p-4 text-center">
                <img src={user.avatarURL} alt="user" width="150" height="150"/>
            </div>
            <div className="col-md-9 pt-4 mb-5">
                <p>
                    <strong>
                        {user.firstName
                            ? user.firstName + (user.lastName ? ' ' + user.lastName : '')
                            : user.displayName}
                    </strong>
                </p>
                <p>
                    <strong>Username: </strong> {user.username}
                </p>
                <p>
                    <strong>Country: </strong> {user.country}
                </p>

                <p>
                    <strong>Organizations: </strong>{' '}
                    {user.organizationTopya && user.organizationTopya.length
                        ? user.organizationTopya.map((org, index) =>
                            index < 3 ? (
                                <p key={index}>{org.name}</p>
                            ) : isShowMore ? (
                                index >= 3 ? (
                                    <p key={index}>{org.name}</p>
                                ) : (
                                    ''
                                )
                            ) : (
                                ''
                            )
                        )
                        : ''}
                    {user.organizationTopya && user.organizationTopya.length && user.organizationTopya.length > 3 ? (
                        <button
                            type="button"
                            className="mb-3 d-block"
                            onClick={handleShowMore}
                            style={{
                                color: '#4A90E2',
                                background: 'none',
                                border: 'none',
                            }}
                        >
                            {!isShowMore ? 'see more...' : 'see less...'}
                        </button>
                    ) : (
                        ''
                    )}
                </p>

                <p>
                    <strong>Permissions:</strong>
                </p>

                <div className="nav nav-tabs" role="tablist">
                    <div className="custom-control custom-radio">
                        <input
                            id={'customRadio3' + user.id}
                            // checked
                            type="radio"
                            disabled={!isEdit}
                            data-target={'#scheduleDaily' + user.id}
                            className="custom-control-input"
                            ///  defaultChecked={true}
                            checked={activePermission === 'none'}
                            onChange={e => handlePermissionRadioButton(e, 'none')}
                        />
                        <label
                            className="custom-control-label"
                            htmlFor={'customRadio3' + user.id}
                        >
                            None
                        </label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input
                            id={'customRadio5' + user.id}
                            // checked

                            type="radio"
                            data-target={'#scheduleDaily' + user.id}
                            className="custom-control-input"
                            checked={activePermission === 2}
                            disabled={!isEdit || roleId === 3 || roleId === 4}
                            //  checked={activePermission === 2}
                            onChange={e => handlePermissionRadioButton(e, 2)}
                        />
                        <label
                            className="custom-control-label"
                            htmlFor={'customRadio5' + user.id}
                        >
                            Application Admin
                        </label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input
                            id={'customRadio4' + user.id}
                            type="radio"
                            data-target={'#scheduleDaily' + user.id}
                            className="custom-control-input"
                            // checked={activePermission === 3}
                            checked={activePermission === 3}
                            disabled={!isEdit}
                            onChange={e => handlePermissionRadioButton(e, 3)}
                        />
                        <label
                            htmlFor={'customRadio4' + user.id}
                            className="custom-control-label"
                        >
                            Org Admin
                        </label>
                    </div>
                    <div className="custom-control custom-radio">
                        <input
                            id={'customRadio6' + user.id}
                            type="radio"
                            data-target={'#scheduleDaily' + user.id}
                            className="custom-control-input"
                            checked={activePermission === 4}
                            disabled={!isEdit}
                            onChange={e => handlePermissionRadioButton(e, 4)}
                        />
                        <label
                            htmlFor={'customRadio6' + user.id}
                            className="custom-control-label"
                        >
                            Judge
                        </label>
                    </div>
                </div>

                <div className="tab-content">
                    <div
                        id={'scheduleDaily' + user.id}
                        className={isShowAppSelect ? 'tab-pane active' : 'tab-pane'}
                    >
                        {activePermission !== 2 ? (
                            <Fragment>
                                <SelectApp
                                    disabled={!isEdit || roleId === 3 || roleId === 4}
                                    handleSelectedApp={handleSelectedApp}
                                    existingApps={existingApps}
                                    selected={selectedApp}
                                    apps={apps}
                                    multiple={!multiple}
                                />
                                <SelectOrganization
                                    disabled={!isEdit}
                                    multiple={multiple}
                                    existingOrganizations={existingOrganizations}
                                    handleSelectedOrganization={handleSelectedOrganization}
                                    organizations={organizations}

                                />
                                <span className="help-block error text-danger">
                                    {orgError ? orgError : ''}
                                </span>
                            </Fragment>
                        ) : (
                            <React.Fragment>
                                <SelectApp
                                    disabled={!isEdit || roleId === 3 || roleId === 4}
                                    handleSelectedApp={handleSelectedApp}
                                    existingApps={existingApps}
                                    selected={selectedApp}
                                    multiple={multiple}
                                    apps={apps}
                                />
                                <span className="help-block error text-danger">
                                    {orgError ? orgError : ''}
                                </span>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
            {noEdit ? (
                ''
            ) : (
                <div className="col-md-12 text-center">
                    {!isEdit ? (
                        <button type="button" className="main-btn" onClick={handleEdit}>
                            Edit Permissions
                        </button>
                    ) : (
                        <Fragment>
                            <button
                                type="button"
                                className="main-btn-cncel"
                                onClick={handleEdit}
                            >
                                Cancel
                            </button>
                            <button type="button" className="main-btn" onClick={handleSave}>
                                Save
                            </button>
                        </Fragment>
                    )}
                </div>
            )}
        </div>
    );
};

export default SingleRow;
