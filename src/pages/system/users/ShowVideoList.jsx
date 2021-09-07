import React, {useState, useEffect, useCallback, useMemo} from "react";
import LoaderLayout from '../../../layouts/LoaderLayout';
import AppLayout from "../../../layouts/AppLayout";
import {useSnackbar} from "notistack";
import {apiCall} from '../../../helper/fetch';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";
import {helpers} from '../../../helper';

const ShowVideoList = (props) => {
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [data, setData] = useState([]);
    const type = props.match.params.type;

    const capitalize = (input) => {
        const words = input.split(' ');
        const CapitalizedWords = [];
        words.forEach(element => {
            CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
        });
        return CapitalizedWords.join(' ');
    };

    const getVideoList = useCallback(async (type) => {
        setIsInitialized(false);
        const mainUrl = process.env.REACT_APP_API_URI + (type.includes('skill') ? 'cron/skillVideoProcess' :
            type.includes('battle') ? 'cron/battleVideoProcess' : 'cron/battlePoolVideoProcess');
        const status = type.includes('progress') ? 2 : 1;
        const url = mainUrl + '?status=' + status + '&from=' + helpers.getDateFormat(fromDate) + '&to=' + helpers.getDateFormat(toDate);
        const result = await apiCall('GET', url);
        if (result.status === 200) {
            setData(result.data);
        } else {
            enqueueSnackbar(result.message, {
                variant: 'error',
                autoHideDuration: 3000
            });
        }
        setIsLoader(false);
        setIsInitialized(true);
        setIsLoader(false);
    }, [fromDate, toDate, enqueueSnackbar]);

    const changeFromDate = (e) => {
        setFromDate(e);
        setIsInitialized(false);
        setIsLoader(true);
    };

    const changeToDate = (e) => {
        setToDate(e);
        setIsInitialized(false);
        setIsLoader(true);
    };

    useEffect(() => {
        if (!isInitialized) {
            getVideoList(type);
        }

    }, [isInitialized, fromDate, toDate, type, getVideoList]);

    const columns = useMemo(() => [
        {
            name: "Tournament Name",
            selector: "tournamentName",
            sortable: true,
            wrap: true
        },
        {
            name: "Stage Name",
            selector: "stageName",
            wrap: true
        },
        {
            name: "Player Name",
            selector: "playerName",
            sortable: true,
            wrap: true
        },
        {
            name: "Round Name",
            selector: "roundName",
            sortable: true,
            omit: type.includes('skill'),
            wrap: true
        },
        {
            name: "Compile Start Datetime",
            selector: "compiledStart",
            sortable: true,
            wrap: true
        },
        {
            name: "Compile End Datetime",
            selector: "compiledEnd",
            sortable: true,
            wrap: true
        },
        {
            name: "Compile Status",
            wrap: true,
            cell: row => <span
                className={"color_" + row.compiledstatus}>{row.compiledstatus === 1 ? 'Pending' : row.compiledstatus === 2 ? 'Under Process' :
                row.compiledstatus === 3 ? 'Completed' : 'Ready to Judge'}</span>
        }
    ], [type]);

    return (
        <AppLayout>
            <div className="main-d dashboard permision">
                <div className="container">
                    <h1>{capitalize(type.replaceAll('-', ' ')) + ' Videos'}</h1>
                    <div className="row" style={{marginTop: '20px', marginBottom: '20px'}}>
                        <div className="col-md-4">
                            <label htmlFor="startDate">From</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    className="form-control"
                                    id="fromDate"
                                    ampm={false}
                                    invalidDateMessage={null}
                                    value={fromDate}
                                    onChange={changeFromDate}
                                    format="yyyy-MM-dd"
                                    onKeyDown={e => e.preventDefault()}
                                    required
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="startDate">To</label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    className="form-control"
                                    id="toDate"
                                    ampm={false}
                                    invalidDateMessage={null}
                                    value={toDate}
                                    onChange={changeToDate}
                                    format="yyyy-MM-dd"
                                    onKeyDown={e => e.preventDefault()}
                                    minDate={fromDate}
                                    required
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                    {isLoader ? <LoaderLayout/> :
                        <DataTable
                            columns={columns}
                            data={data}
                            defaultSortField="tournamentName"
                            sortIcon={<SortIcon/>}
                            pagination
                            paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                            className="datatable videoList"
                        />}
                </div>
            </div>
        </AppLayout>

    )
};

export default ShowVideoList;