import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useSnackbar} from 'notistack';
import {useHistory} from 'react-router-dom';
import DataTable from "react-data-table-component";
import AppLayout from '../../../layouts/AppLayout';
import SelectLayout from '../../../layouts/SelectLayout';
import SearchLayout from '../../../layouts/SearchLayout';
import LoaderLayout from '../../../layouts/LoaderLayout';
import Loader from '../../../components/Loader';
import {useMediaQuery} from 'react-responsive';
import {helpers} from '../../../helper';
import {BASE_URL, apiCall} from '../../../helper/fetch';
import SortIcon from "@material-ui/icons/ArrowDownward";
import SingleRow from './SingleRow';
import Mobile from './Mobile';

const Users = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [activeRadio, setActiveRadio] = useState('current');
    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});
    const [apps, setApps] = useState([]);
    const appId = localStorage.getItem('appId');
    const [activeApp, setActiveApp] = useState(appId);
    const [organizations, setOrganizations] = useState([]);
    const [filterText, setFilterText] = React.useState('');

    const filteredItems = users.filter(item => {
        let search = filterText.toLowerCase();
        let nameCondition = item.displayName && item.displayName.toLowerCase().includes(search);
        let userCondition = item.username && item.username.toLowerCase().includes(search);
        let orgCondition = item.orgArr && item.orgArr.toLowerCase().includes(search);
        let roleCondition = item.roleName && item.roleName.toLowerCase().includes(search);
        return nameCondition || userCondition || orgCondition || roleCondition;
    });

    const subHeaderComponentMemo = React.useMemo(() => {
        return <SearchLayout onFilter={setFilterText} placeHolderText="Search by Name, Username, Organisation and Permission Level" />;
    }, [setFilterText]);

    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;

    const getApps = useCallback(async () => {
        const data = await helpers.app('GET');
        if (data.status === 200) {
            setApps(data.data);
            setIsLoader(false);
            setIsInitialized(true);
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
    }, [enqueueSnackbar, history]);

    const getOrganizations = useCallback(async () => {
        const url =
            BASE_URL +
            'permission/organizations?app_id=' +
            appId +
            '&userId=' +
            userId;
        const data = await apiCall('GET', url);
        if (data.status === 200) {
            setOrganizations(data.data.organizations);
            setIsInitialized(true);
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
    }, [appId, userId, enqueueSnackbar, history]);

    useEffect(() => {
        if (!isInitialized) {
            getApps();
            getOrganizations();
        }
    }, [isInitialized, getApps, getOrganizations]);

    const handleModel = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleRadioButton = (e, type) => {
        setActiveRadio(type);
        setIsInitialized(false);
    };

    const getTopyaUser = useCallback(async () => {
            setIsLoading(true);

            const data = await helpers.topyauser('GET', activeApp);
            if (data.status === 200) {
                if (data.data && data.data.length) {
                    for (let i in data.data) {
                        let orgs = [];
                        if (data.data.hasOwnProperty(i)) {
                            orgs = data.data[i].organizations && data.data[i].organizations.length
                                ? data.data[i].organizations.map(org => {
                                    return org.name;
                                })
                                : [];
                            data.data[i].orgArr = orgs && orgs.length ? orgs.join(', ') : '';
                            data.data[i].roleName = data.data[i].roleName === 0 ? 'none' : data.data[i].roleName;
                            data.data[i].icon = "›"
                        }
                    }
                }
                setUsers(data.data);
                setIsLoading(false);
                setIsInitialized(true);
            } else {
                enqueueSnackbar(data.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                if (data.status === 401) {
                    history.push('/login');
                }
            }
        },
        [activeApp, enqueueSnackbar, history]
    );

    const getUser = useCallback(async () => {
            setIsLoading(true);
            const data = await helpers.user('GET', activeApp);
            if (data.status === 200) {
                if (data.data && data.data.length) {
                    for (let i in data.data) {
                        let orgs = [];
                        if (data.data.hasOwnProperty(i)) {
                            orgs = data.data[i].organizations && data.data[i].organizations.length
                                ? data.data[i].organizations.map(org => {
                                    return org.name;
                                })
                                : [];
                            data.data[i].orgArr = orgs && orgs.length ? orgs.join(', ') : '';
                            data.data[i].roleName = data.data[i].roleName === 0 ? 'none' : data.data[i].roleName;
                            data.data[i].icon = "›"
                        }
                    }
                }
                setUsers(data.data);
                setIsLoading(false);
                setIsInitialized(true);
            } else {
                enqueueSnackbar(data.message, {
                    variant: 'error',
                    autoHideDuration: 3000,
                });
                if (data.status === 401) {
                    history.push('/login');
                }
            }
        },
        [activeApp, enqueueSnackbar, history]
    );

    useEffect(() => {
        if (activeApp && !isInitialized) {
            if (activeRadio === 'current') {
                getUser();
            } else {
                getTopyaUser();
            }
            if (!isMobile) {
                setIsOpen(false);
            }
        }


    }, [activeRadio, getUser, getTopyaUser, isMobile, isInitialized, activeApp]);

    const columns = useMemo(() => [
        {
            name: "Name",
            selector: "displayName",
            wrap: true,
            sortable: true
        },
        {
            name: "Username",
            selector: "username",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Organization",
            selector: "orgArr",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Permissions Level",
            selector: "roleName",
            wrap: true,
            sortable: true
        },
        {
            name: " ",
            selector: "icon",
            right: true
        }
    ], [isMobile]);

    // The row data is composed into your custom expandable component via the data prop
    const ExpandableComponent = ({ data }) => {
        if (!isMobile) {
            return <SingleRow
                user={data}
                getUser={getUser}
                apps={apps}
                organizations={organizations}
                setActiveRadio={setActiveRadio}
                setInitialized={setIsInitialized}
            />
        } else if (isMobile && isOpen) {
            return <Mobile user={data} handleModel={handleModel}/>
        } else {
            return false;
        }
    };

    const [userData, setUserData] = useState({});

    const openModel = (e => {
        if (isMobile) {
            setUserData(e);
            setIsOpen(!isOpen);
        }
    });

    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <AppLayout>
            <div className="main-d dashboard permision">
                <div className="container">
                    <h1>Permissions</h1>
                    {!appId ? (
                        <div className="row m-5">
                            <div className="col-md-4"/>
                            <div className="col-md-4 text-center">
                                <SelectLayout
                                    isUsers={true}
                                    type="Application"
                                    data={apps}
                                    isInitialized={isInitialized}
                                    setIsInitialized={setIsInitialized}
                                    setActive={setActiveApp}
                                />
                            </div>
                            <div className="col-md-4"/>
                        </div>
                    ) : (
                        ''
                    )}

                    {activeApp ? (
                        <React.Fragment>
                            <div className="row m-5">
                                <div className="col-md-3"/>
                                <div className="col-md-6 text-center">
                                    <div className="custom-control custom-radio">
                                        <input
                                            type="radio"
                                            id="customRadio1"
                                            name="customRadio"
                                            className="custom-control-input"
                                            checked={activeRadio === 'current'}
                                            onChange={e => handleRadioButton(e, 'current')}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="customRadio1"
                                        >
                                            Current Users
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio">
                                        <input
                                            type="radio"
                                            id="customRadio2"
                                            name="customRadio"
                                            className="custom-control-input"
                                            checked={activeRadio !== 'current'}
                                            onChange={e => handleRadioButton(e, 'all')}
                                        />
                                        <label
                                            className="custom-control-label"
                                            htmlFor="customRadio2"
                                        >
                                            All TopYa! Users
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3"/>
                            </div>

                            {isMobile && isOpen ? <Mobile user={userData} handleModel={handleModel}/> : '' }

                            {isLoading ? <Loader /> :
                                <DataTable
                                    columns={columns}
                                    data={filteredItems}
                                    defaultSortField="displayName"
                                    sortIcon={<SortIcon />}
                                    pagination
                                    paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                                    className="datatable"
                                    expandableRows={!isMobile}
                                    expandOnRowClicked={!isMobile}
                                    onRowClicked={e => openModel(e)}
                                    expandableRowsComponent={<ExpandableComponent/>}
                                    subHeader
                                    subHeaderComponent={subHeaderComponentMemo}
                                /> }
                        </React.Fragment>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Users;
