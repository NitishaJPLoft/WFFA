import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import {Link} from 'react-router-dom';
import DataTable from "react-data-table-component";
import SearchLayout from '../../layouts/SearchLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import {helpers} from '../../helper';
import {useSnackbar} from "notistack";
import SortIcon from "@material-ui/icons/ArrowDownward";
import {useMediaQuery} from 'react-responsive';

const Tournaments = () => {
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const [path, setPath] = useState('');
    const roleId = localStorage.getItem('roleId');
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});
    const [filterText, setFilterText] = React.useState('');

    const filteredItems = tournaments.filter(item => {
        let search = filterText.toLowerCase();
        let tournamentCondition = item.tournamentName && item.tournamentName.toLowerCase().includes(search);
        let orgCondition = item.organization.name && item.organization.name.toLowerCase().includes(search);
        return tournamentCondition || orgCondition;
    });

    const subHeaderComponentMemo = React.useMemo(() => {
        return <SearchLayout onFilter={setFilterText} placeHolderText="Search by Tournament and Organisation Name" />;
    }, [setFilterText]);

    const createPath = roleId === '2' ? '/application-dashboard/tournament/create' : '/organisation-dashboard/tournament/create';
    const getTournaments = useCallback(async () => {
        setIsInitialized(false);
        const data = await helpers.tournament('GET');

        if (data.status === 200) {
            if (data.data && data.data.length) {
                for (let i in data.data) {
                    if (data.data.hasOwnProperty(i)) {
                        data.data[i].icon = "›";
                        data.data[i].status = data.data[i].status === 1 ? 'Active' : data.data[i].status === 2 ? 'Processing' : data.data[i].status === 3 ? 'Completed' : 'Inactive';
                    }
                }
            }
            setTournaments(data.data);
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
        setIsInitialized(true);
        setIsLoader(false);
    }, [enqueueSnackbar, history]);

    useEffect(() => {
        if (!isInitialized) {
            getTournaments();
        }
        if (roleId === '2') {
            setPath('/application-dashboard/tournaments');
        }
        if (roleId === '3') {
            setPath('/organisation-dashboard/tournaments');
        }
    }, [getTournaments, roleId, isInitialized]);

    const columns = useMemo(() => [
        {
            name: "Tournament ID",
            selector: "id",
            sortable: true,
            omit: isMobile
        },
        {
            name: "Tournament Name",
            selector: "tournamentName",
            wrap: true,
            sortable: true
        },
        {
            name: "Org ID",
            selector: "organization_id",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Org Name",
            selector: "organization.name",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "# Stages",
            selector: "stages.length",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Status",
            selector: "status",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "",
            selector: "icon",
            right: true
        }
    ], [isMobile]);


    return (
        isLoader ? <LoaderLayout/> : <AppLayout>
            <div className="main-d dashboard permision">
                <div className="container">
                    <h1>Tournaments</h1>
                    <div className="row">
                        <div className="col-md-12">
                            <Link
                                to={createPath}
                                className="main-btn text-center ml-0"
                            >
                                Create a Tournament
                            </Link>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        defaultSortField="tournamentName"
                        sortIcon={<SortIcon/>}
                        pagination
                        expandableRows
                        expandableRowDisabled={row => true}
                        onRowClicked={e => history.push(path + '/' + e.id)}
                        paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                        className="datatable"
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                    />
                </div>
            </div>
            )}
        </AppLayout>)
};

export default Tournaments;
