import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import DataTable from "react-data-table-component";
import AppLayout from '../../layouts/AppLayout';
import SearchLayout from '../../layouts/SearchLayout';
import LoaderLayout from '../../layouts/LoaderLayout';
import Loader from '../../components/Loader';
import {helpers} from '../../helper';
import SortIcon from "@material-ui/icons/ArrowDownward";
import SingleRow from './SingleRow';
import Mobilejudges from '../../pages/system/users/Mobilejudges';
import SelectTournament from './SelectTournaments';
import SelectStage from './SelectStages';
import SelectRound from './SelectRounds';
import {useMediaQuery} from 'react-responsive';

const JudgingList = () => {
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isLoader1, setIsLoader1] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const [judges, setJudges] = useState([]);
    const isMobile = useMediaQuery({query: '(max-width: 999px)'});
    const [isOpen, setIsOpen] = useState(false);

    const roleId = localStorage.getItem('roleId');

    const [activeRadio, setActiveRadio] = useState('current');
    const [stageType, setStageType] = useState('skill');
    const [isStageChanged, setIsStageChanged] = useState(true);
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState('');
    const [stages, setStages] = useState([]);
    const [selectedStage, setSelectedStage] = useState('');
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [filterText, setFilterText] = React.useState('');

    const filteredItems = judges.filter(item => {
        let search = filterText.toLowerCase();
        let tournamentCondition = item.tournamentName && item.tournamentName.toLowerCase().includes(search);
        let stageCondition = item.stageName && item.stageName.toLowerCase().includes(search);
        let roundCondition = item.roundName && item.roundName.toLowerCase().includes(search);
        let compCondition = item.compititorName && item.compititorName.toLowerCase().includes(search);
        let judgeCondition = item.judgeName && item.judgeName.toLowerCase().includes(search);
        let orgCondition = item.organizationName && item.organizationName.toLowerCase().includes(search);
        return tournamentCondition || stageCondition || roundCondition || compCondition || judgeCondition || orgCondition;
    });

    const subHeaderComponentMemo = React.useMemo(() => {
        return <SearchLayout onFilter={setFilterText} placeHolderText="Search by Tournament, Organisation, Stage, Competitor, Judge Name" />;
    }, [setFilterText]);

    const getjudges = useCallback(async () => {
        setIsLoader1(true);
        const tournamentId = selectedTournament && selectedTournament.length ? selectedTournament[0].id : '';
        const stageId = selectedStage && selectedStage.length ? selectedStage[0].id : '';
        const roundId = selectedRound && selectedRound.length ? selectedRound[0].id : '';
        const groupId = selectedGroup && selectedGroup.length ? selectedGroup[0].id : '';
        const data = await helpers.judges('GET', activeRadio, stageType, tournamentId, stageId, roundId, groupId);
        if (data.status === 200) {
            if (data.data && data.data.length) {
                for (let i in data.data) {
                    if (data.data.hasOwnProperty(i)) {
                        data.data[i].icon = "›"
                    }
                }
            }
            setJudges(data.data);
            setIsLoader(false);
            setIsLoader1(false);
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
    }, [enqueueSnackbar, history, activeRadio, stageType, selectedTournament, selectedStage, selectedRound, selectedGroup]);

    const tournamentDropdown = useCallback(async () => {
        const result = await helpers.tournamentDropdown('GET', activeRadio, stageType);
        setTournaments(result.data);
        setIsStageChanged(false);
    }, [stageType, activeRadio]);

    const handleModel = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isInitialized) {
            getjudges();
        }
        if (!isMobile) {
            setIsOpen(false);
        }
        if (isStageChanged) {
            tournamentDropdown();
        }
    }, [isInitialized, roleId, getjudges, isMobile, selectedTournament, selectedStage, selectedRound, isStageChanged, tournamentDropdown]);

    const handleRadioButton = (e, type) => {
        setActiveRadio(type);
        setIsInitialized(false);
        setIsStageChanged(true);
        setSelectedTournament('');
        setSelectedStage('');
        setSelectedRound('');
        setSelectedGroup('');
        setTournaments([]);
        setStages([]);
        setRounds([]);
        setGroups([]);
    };

    const handleStageButton = (e, type) => {
        setStageType(type);
        setIsInitialized(false);
        setIsStageChanged(true);
        setSelectedTournament('');
        setSelectedStage('');
        setSelectedRound('');
        setSelectedGroup('');
        setTournaments([]);
        setStages([]);
        setRounds([]);
        setGroups([]);
    };

    const handleTournamentName = async e => {
        setSelectedTournament(e);
        if (e && e.length) {
            setStages(e[0].stage);
        } else {
            setStages([]);
            setRounds([]);
            setGroups([]);
        }
        setSelectedStage('');
        setSelectedRound('');
        setSelectedGroup('');
        setIsInitialized(false);
    };

    const handleStageName = async e => {
        setSelectedStage(e);
        if (e && e.length) {
            if (stageType === 'battle') {
                setRounds(e[0].rounds);
            }
            if (stageType === 'pool') {
                setGroups(e[0].poolGroup);
            }
        } else {
            setRounds([]);
            setGroups([]);
        }
        setSelectedRound('');
        setSelectedGroup('');
        setIsInitialized(false);
    };

    const handleRoundName = async e => {
        setSelectedRound(e);
        setIsInitialized(false);
    };

    const handleGroupName = async e => {
        setSelectedGroup(e);
        setIsInitialized(false);
    };

    const columns = useMemo(() => [
        {
            name: "Submitted",
            selector: "submitteddate",
            sortable: true,
            omit: isMobile
        },
        {
            name: "Org",
            selector: "organizationName",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Tournament Name",
            selector: "tournamentName",
            wrap: true,
            sortable: true
        },
        {
            name: "Stage #",
            selector: "stageName",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Round Name",
            selector: "roundName",
            sortable: true,
            wrap: true,
            omit: stageType === 'skill' || stageType === 'pool' || isMobile
        },
        {
            name: "Group Name",
            selector: "groupName",
            sortable: true,
            wrap: true,
            omit: stageType === 'skill' || stageType === 'battle' || isMobile
        },
        {
            name: "Competitor(s)",
            selector: "compititorName",
            sortable: true,
            wrap: true,
            omit: isMobile
        },
        {
            name: "Judge",
            selector: "judgeName",
            wrap: true,
            sortable: true
        },
        {
            name: " ",
            selector: "icon",
            right: true
        }
    ], [stageType, isMobile]);

    // The row data is composed into your custom expandable component via the data prop
    const ExpandableComponent = ({ data }) => {
        if (!isMobile) {
            return <SingleRow
                judge={data}
                getjudges={getjudges}
                updatevideo={false}
            />
        } else if (isMobile && isOpen) {
            return <Mobilejudges
                handleModel={handleModel}
                judge={data}
                getjudges={getjudges}
            />
        } else {
            return false;
        }
    };

    const [judgeData, setJudgeData] = useState({});

    const openModel = (e => {
        if (isMobile) {
            setJudgeData(e);
            setIsOpen(!isOpen);
        }
    });

    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <AppLayout>
            <div className="main-d dashboard permision">
                <div className="container">
                    <h1>Judging List</h1>
                    <div className="row m-3">
                        <div className="col-md-3"/>
                        <div className="col-md-6 text-center">
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    id="customRadio3"
                                    name="stageRadio"
                                    className="custom-control-input"
                                    checked={stageType === 'skill'}
                                    onChange={e => handleStageButton(e, 'skill')}
                                    disabled={isLoader1 === true ? 'disable' : ''}
                                />
                                <label className="custom-control-label" htmlFor="customRadio3">
                                    Skill
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    id="customRadio4"
                                    name="stageRadio"
                                    className="custom-control-input"
                                    checked={stageType === 'battle'}
                                    onChange={e => handleStageButton(e, 'battle')}
                                    disabled={isLoader1 === true ? 'disable' : ''}
                                />
                                <label className="custom-control-label" htmlFor="customRadio4">
                                    Battle
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    id="customRadio5"
                                    name="stageRadio"
                                    className="custom-control-input"
                                    checked={stageType === 'pool'}
                                    onChange={e => handleStageButton(e, 'pool')}
                                    disabled={isLoader1 === true ? 'disable' : ''}
                                />
                                <label className="custom-control-label" htmlFor="customRadio5">
                                    Battle Pool
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3"/>
                    </div>
                    <div className="row m-3">
                        <div className="col-md-3"/>
                        <div className="col-md-6 text-center">
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    id="customRadio1"
                                    name="customRadio"
                                    className="custom-control-input"
                                    checked={activeRadio !== 'completed'}
                                    onChange={e => handleRadioButton(e, 'current')}
                                    disabled={isLoader1 === true ? 'disable' : ''}
                                />
                                <label className="custom-control-label" htmlFor="customRadio1">
                                    Current
                                </label>
                            </div>
                            <div className="custom-control custom-radio">
                                <input
                                    type="radio"
                                    id="customRadio2"
                                    name="customRadio"
                                    className="custom-control-input"
                                    checked={activeRadio === 'completed'}
                                    onChange={e => handleRadioButton(e, 'completed')}
                                    disabled={isLoader1 === true ? 'disable' : ''}
                                />
                                <label className="custom-control-label" htmlFor="customRadio2">
                                    Completed
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3"/>
                    </div>
                    <div className="row my-4">
                        <div className="col-md-4">
                            <div className="form-group timeZone judgeDropdown">
                                <label htmlFor="exampleFormControlInput1">
                                    Tournament Name
                                </label>
                                <SelectTournament
                                    tournaments={tournaments}
                                    handleSelectedTournament={handleTournamentName}
                                    selected={selectedTournament}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group timeZone judgeDropdown">
                                <label htmlFor="exampleFormControlInput1">
                                    Stage Name
                                </label>
                                <SelectStage
                                    stages={stages}
                                    handleSelectedStage={handleStageName}
                                    selected={selectedStage}
                                    disabled={stages.length === 0}
                                />
                            </div>
                        </div>
                        {stageType === 'battle' ? <div className="col-md-4">
                            <div className="form-group timeZone judgeDropdown">
                                <label htmlFor="exampleFormControlInput1">
                                    Round Name
                                </label>
                                <SelectRound
                                    rounds={rounds}
                                    handleSelectedRound={handleRoundName}
                                    selected={selectedRound}
                                    disabled={rounds.length === 0}
                                />
                            </div>
                        </div> : null}
                        {stageType === 'pool' ? <div className="col-md-4">
                            <div className="form-group timeZone judgeDropdown">
                                <label htmlFor="exampleFormControlInput1">
                                    Group Name
                                </label>
                                <SelectRound
                                    rounds={groups}
                                    handleSelectedRound={handleGroupName}
                                    selected={selectedGroup}
                                    disabled={groups.length === 0}
                                />
                            </div>
                        </div> : null}
                    </div>
                    {!isInitialized ? (
                        <Loader/>
                    ) : (
                        <React.Fragment>
                            {isMobile && isOpen ? <Mobilejudges
                                handleModel={handleModel}
                                judge={judgeData}
                                getjudges={getjudges}
                            /> : ''}

                            <DataTable
                                columns={columns}
                                data={filteredItems}
                                defaultSortField="tournamentName"
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
                            />
                        </React.Fragment>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default JudgingList;
