import React, {useEffect, useState, useCallback, useMemo} from 'react';
import AppLayout from '../../layouts/AppLayout';
import {Link, useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import DataTable from "react-data-table-component";
import SearchLayout from '../../layouts/SearchLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import Loader from '../../components/Loader';
import {helpers} from '../../helper';
import SortIcon from "@material-ui/icons/ArrowDownward";

const SystemAdminApps = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [apps, setApps] = useState([]);
    const [filterText, setFilterText] = React.useState('');

    const filteredItems = apps.filter(item => {
        let search = filterText.toLowerCase();
        return item.name && item.name.toLowerCase().includes(search);
    });

    const subHeaderComponentMemo = React.useMemo(() => {
        return <SearchLayout onFilter={setFilterText} placeHolderText="Search by Application Name" />;
    }, [setFilterText]);

    const getApps = useCallback(async () => {
        setIsInitialized(false);
        const data = await helpers.app('GET');
        if (data.status === 200) {
            if (data.data && data.data.length) {
                for (const i in data.data) {
                    if (data.data.hasOwnProperty(i)) {
                        data.data[i].icon = "›"
                    }
                }
            }
            setApps(data.data);
            setIsInitialized(true);
            setIsLoader(false);
        } else {
            if (data.status === 401) {
                history.push('/login');
            } else {
                enqueueSnackbar(data.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
    }, [enqueueSnackbar, history]);

    useEffect(() => {
        if (!isInitialized) {
            getApps();
        }
    }, [isInitialized, getApps]);

    const columns = useMemo(() => [
        {
            name: "Application Name",
            selector: "name",
            sortable: true
        },
        {
            name: "",
            selector: "icon",
            right: true
        }
    ]);

    return (
        isLoader ? (
            <LoaderLayout/>
        ) : (
            <AppLayout>
                <div className="main-d dashboard permision">
                    <div className="container">
                        <h1>Applications </h1>

                        <div className="row">
                            <div className="col-md-12">
                                <Link
                                    to="/system-dashboard/app/create"
                                    className="main-btn text-center ml-0"
                                >
                                    Create an Application
                                </Link>
                            </div>
                        </div>
                        {!isInitialized ? <Loader /> :
                        <DataTable
                            columns={columns}
                            data={filteredItems}
                            defaultSortField="name"
                            sortIcon={<SortIcon/>}
                            pagination
                            expandableRows
                            expandableRowDisabled={row => true}
                            onRowClicked={e => history.push('/system-dashboard/app/' + e.id)}
                            paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                            className="datatable"
                            subHeader
                            subHeaderComponent={subHeaderComponentMemo}
                        /> }
                    </div>
                </div>
            </AppLayout>
        )

    );

};

export default SystemAdminApps;
