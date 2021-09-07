import React, {useEffect, useState, useCallback} from 'react';
import AppLayout from '../../layouts/AppLayout';
import {Link, useHistory} from 'react-router-dom';
import LoaderLayout from '../../layouts/LoaderLayout';
import {useSnackbar} from 'notistack';
import Upload from '../system/apps/Upload';
import SelectOrganization from '../system/users/SelectOrganization';
import SelectTimeZone from './stageComponents/SelectTimeZone';
import {apiCall, BASE_URL} from '../../helper/fetch';
import RadioLayout from '../../layouts/RadioLayout';
import {helpers} from '../../helper';
import SelectCountry from './SelectCountry';
import DragToReorderList from '../../layouts/DragToReorderList';
import {authHeader} from "../../helper/auth-header";
import axios from 'axios'

const CreateTournament = props => {
    const subdomain = window.location.host;
    const protocol = window.location.protocol;
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tournamentName, setTournamentName] = useState('');
    const [landingpage, setLandingpage] = useState('');
    const [leftWatermark, setLeftWatermark] = useState(localStorage.getItem('watermark_left'));
    const [rightWatermark, setRightWatermark] = useState(localStorage.getItem('watermark'));
    const [selectedOrganisation, setSelectedOrganisation] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedTimeZone, setSelectedTimeZone] = useState('');
    const [existingTimeZones, setExistingTimeZones] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState('male');
    const [ageRequirement, setAgeRequirement] = useState('open');
    const [displaySeed, setDisplaySeed] = useState('yes');
    const [displayProfileImg, setDisplayProfileImg] = useState('yes');
    const [displayPlayerName, setDisplayPlayerName] = useState('both');
    const [displayCountry, setDisplayCountry] = useState('both');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [stages, setStages] = useState([]);
    const [, setDescriptionError] = useState(null);
    const appName = localStorage.getItem('appName');
    const roleId = localStorage.getItem('roleId');
    const userId = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).id
        : null;
    const appId = localStorage.getItem('appId');
    const tournamentId = props && props.match && props.match.params.id;
    const [tnError, setTnError] = useState(null);
    const [landingError, setLandingError] = useState(null);
    const [countryError, setCountryError] = useState(null);
    const [orgError, setOrgError] = useState(null);
    const [timeError, setTimeError] = useState(null);
    const [maxError, setMaxError] = useState(null);

    const [sponsorLogo, setSponsorLogo] = useState('');
    const [bracketLogo, setBracketLogo] = useState('');

    const [minAgeError, setMinAgeError] = useState('');
    const [maxAgeError, setMaxAgeError] = useState('');

    const [landingpageLogo, setLandingpageLogo] = useState('');
    const [landingpagerightLogo, setLandingpagerightLogo] = useState('');
    const [landingpageurl, setLandingpageurl] = useState('');
    const [landingpageurlright, setLandingpageurlright] = useState('');
    const [footer, setFooter] = useState([{label: "", link: ""}]);
    const [statuss, setStatus] = useState('');
    const [org, setOrg] = useState(null);

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
                    autoHideDuration: 3000
                });
            }
        }
    }, [appId, userId, enqueueSnackbar, history]);

    const getdata = useCallback(async () => {
        setIsLoader(true);
        const url = BASE_URL + 'app/' + appId;
        const data = await apiCall('GET', url);
        if (!tournamentId) {
            if (data.status === 200) {

                setLeftWatermark(data.data.watermark_logo_left);
                setRightWatermark(data.data.watermark_logo);
                setSponsorLogo(data.data.sponser_logo);
                setBracketLogo(data.data.bracket_logo);
                setLandingpageLogo(data.data.landing_page_logo_left);
                setLandingpagerightLogo(data.data.landing_page_logo_right);
                setIsLoader(false)
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
        }
    }, [appId, enqueueSnackbar, history]);

    const getTimeZones = useCallback(async () => {
        let url = BASE_URL + 'timezone';
        const response = await apiCall('GET', url);
        if (response.status === 200) {
            setExistingTimeZones(response.data);
        } else {
            if (response.status === 401) {
                localStorage.clear();
                history.push('/login');
            } else {
                enqueueSnackbar(response.message, {
                    variant: 'error',
                    autoHideDuration: 3000
                });
            }
        }
        setIsLoader(false);
    }, [enqueueSnackbar, history]);

    useEffect(() => {
        if (!isInitialized) {

            getOrganizations();
            getTimeZones();
            if (!tournamentId) {
                getdata();
            }
        }
    }, [isInitialized, getOrganizations, getTimeZones, getdata]);

    const getTournamentDetails = useCallback(async () => {
        if (tournamentId) {
            let url = BASE_URL + 'tournament/show1/' + tournamentId;
            const response = await apiCall('GET', url);
            if (response.status === 200) {
                const data = response.data;

                const landing = data.landing_page_link ? data.landing_page_link.split('/') : [];
                const landingpage = landing[landing.length - 1];
                setIsLoader(false);
                setSelectedOrganisation(data.organization_id);
                setSelectedCountry(data.country_id);
                setTournamentName(data.tournamentName);
                setLandingpage(landingpage);
                setDescription(data.tournamentDescription);
                setGender(data.gender);
                setAgeRequirement(data.ageType);
                setMinAge(data.ageMin);
                setOrg(data.judgeAssignStatus);
                setMaxAge(data.ageMax);
                setStatus(data.statuss);
                setDisplaySeed(data.displaySeedingNo);
                setDisplayProfileImg(data.displayCompetitorProfile);
                setDisplayPlayerName(data.displayPlayerName);
                setDisplayCountry(data.displayCountry);
                const timeInfo = [];
                timeInfo.push({id: data.timeZone, label: data.timezoneName, value: data.timezoneValue});
                setSelectedTimeZone(timeInfo);
                setLeftWatermark(data.watermarkBottomLeft);
                setRightWatermark(data.watermarkBottomRight);
                setSponsorLogo(data.sponser_logo);
                setBracketLogo(data.bracket_logo);
                setStages(data.stages);
                setLandingpageLogo(data.landing_page_logo_left);
                setLandingpagerightLogo(data.landing_page_logo_right);
                setLandingpageurl(data.landing_page_link_left);
                setLandingpageurlright(data.landing_page_link_right);
                setFooter(JSON.parse(data.footer));
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
    }, [tournamentId, enqueueSnackbar, history]);

    useEffect(() => {
        if (tournamentId) {
            getTournamentDetails();
        }
    }, [getTournamentDetails, tournamentId]);

    const handleDescription = e => {
        const value = e.target.value;
        if (value.length < 3) {
            const msg = 'Value should be atleast 3 character long';
            setDescriptionError(msg);
        } else {
            setDescriptionError(null);
        }
        setDescription(value);
    };

    const createTournament = async e => {
        e.preventDefault();
        setIsLoader(true);
        if (!tournamentName) {
            setTnError('Can not be empty ');
        }
        if (!landingpage) {
            setLandingError('Landing Page "URL" field is required. ');
        } else {
            setLandingError('');
        }
        if (!minAge) {
            setMinAgeError('Minimum age field is required.');
        }

        if (!maxAge) {
            setMaxAgeError('Maximun age field is required.');
        }

        if (!selectedOrganisation) {
            setOrgError('Org is required. ');
        }
        if (!selectedTimeZone) {
            setTimeError('Tournament "Time Zone" field is required.');
        }

        let formData = new FormData();
        if (
            !selectedOrganisation ||
            !tournamentName ||
            !displayCountry ||
            tnError ||
            countryError ||
            orgError ||
            timeError || landingError ||
            (ageRequirement === 'range' && (!minAge || !maxAge))
        ) {
            enqueueSnackbar('Please fill in all the details correctly', {
                variant: 'error',
                autoHideDuration: 3000,
            });
            setIsLoader(false);
            return false;
        }
        formData.append('appId', appId);
        formData.append('orgId', parseInt(selectedOrganisation, 10));
        formData.append('tournamentName', tournamentName);
        formData.append('landingpage', (landingpage ? (protocol + "//" + subdomain + '/tournament/' + landingpage) : ''));
        formData.append('tournamentDescription', description);
        formData.append('gender', gender);
        formData.append('ageType', ageRequirement);
        if (ageRequirement === 'range') {
            formData.append('ageMin', minAge);
            formData.append('ageMax', maxAge);
        }
        formData.append('displaySeedingNo', displaySeed);
        formData.append('displayCompetitorProfile', displayProfileImg);
        formData.append('displayPlayerName', displayPlayerName);
        formData.append('displayCountry', displayCountry);
        formData.append('userId', userId);
        formData.append('countryId', selectedCountry);
        formData.append('timeZone', parseInt(selectedTimeZone[0].id, 10));
        formData.append('watermarkBottomLeft', leftWatermark);
        formData.append('watermarkBottomRight', rightWatermark);
        formData.append('sponsor_logo', sponsorLogo);
        formData.append('bracket_logo', bracketLogo);
        formData.append('landing_page_logo_left', landingpageLogo);
        formData.append('landing_page_logo_right', landingpagerightLogo);
        formData.append('landing_page_link_right', landingpageurlright);
        formData.append('landing_page_link_left', landingpageurl);
        formData.append('footer', JSON.stringify(footer));

        if (tournamentId) {
            formData.append('id', tournamentId);
        }

        const url =
            process.env.REACT_APP_API_URI +
            'tournament/' +
            (tournamentId ? 'update' : 'store');
        const data = await helpers.formDataMultipart('POST', url, formData);
        if (data.status === 200) {
            // setApp(response.data.data);
            const message = tournamentId
                ? 'Tournament Updated'
                : 'Tournament created';
            enqueueSnackbar(message, {
                variant: 'success',
                autoHideDuration: 3000,
            });
            if (tournamentId) {
                const path =
                    roleId === '2'
                        ? '/application-dashboard/tournaments/' + tournamentId
                        : '/organisation-dashboard/tournaments/' + tournamentId;
                history.push(path);
            } else {
                const stagePath =
                    roleId === '2'
                        ? '/application-dashboard/tournament/' +
                        data.data.id +
                        '/stage/create'
                        : '/organisation-dashboard/tournament/' +
                        data.data.id +
                        '/stage/create';
                history.push(stagePath);
            }
            setIsLoader(false);
        } else {
            enqueueSnackbar(data.message, {
                variant: 'error',
                autoHideDuration: 3000,
            });
            if (data.status === 401) {
                history.push('/login');
            }
        }
        setIsLoader(false);
    };

    const deleteLeftWaterMark = e => {
        e.preventDefault();
        setLeftWatermark('');
    };

    const deleteRightWaterMark = e => {
        e.preventDefault();
        setRightWatermark('');
    };
    const deleteSponsorLogo = (e) => {
        e.preventDefault();
        setSponsorLogo('');
    };
    const deleteBracketLogo = (e) => {
        e.preventDefault();
        setBracketLogo('');
    };
    const handleTn = async e => {
        setTournamentName(e.target.value);
        const value = e.target.value;
        if (value.length === 0) {
            const msg = "This field can't be empty.";
            setTnError(msg);
        } else {
            setTnError(null);
        }
    };

    const handleLanding = async e => {
        setLandingpage(e.target.value);
        const value = e.target.value;

        if (value.length === 0) {
            if (statuss === 1) {
                const msg = "This field can't be empty.";
                setLandingError(msg);
            } else {
                setLandingError(null);
            }
        } else {
            setLandingError(null);
            const isExsist = await checklanding(value);
            if (isExsist) {
                setLandingError('Landing page Url is already in use');
            }
        }
    };
    const checklanding = async value => {
        try {
            if (!value) {
                setLandingError('');
            } else {
                setLandingError(null);
                const url = process.env.REACT_APP_API_URI + 'tournament/slug?name=' + protocol + '//' + subdomain + '/tournament/' + value + '&tournament_id=' + tournamentId;
                const response = await axios.get(url, {headers: authHeader()});
                if (response.data.status === 200) {
                    return response.data.data.isFound;
                } else {
                    enqueueSnackbar(response.message, {
                        variant: 'error',
                        autoHideDuration: 3000
                    });
                    if (response.status === 401) {
                        localStorage.clear();
                        history.push('/login');
                    }
                }
            }
        } catch (error) {
            return false;
        }
    };

    const handleTn1 = async e => {

        const value = e.target.value;
        if (!value) {
            const msg = "This field can't be empty.";
            setOrgError(msg);
        } else if (org === true) {
            setOrgError("You have selected judges in existing stages from the current organization, so can't change it");
        }
        else {
            setOrgError(null);
            setSelectedOrganisation(e.target.value);
        }
    };
    const handleTn2 = async e => {
        setSelectedCountry(e.target.value);
        const value = e.target.value;
        if (!value) {

            setCountryError(null);
        } else {
            setCountryError(null);
        }
    };
    const handleTn3 = async e => {
        const value = e && e.length && e[0].id;
        setSelectedTimeZone(e);
        if (!value) {
            const msg = "This field can't be empty.";
            setTimeError(msg);
        } else {
            setTimeError(null);
        }
    };

    const handleAge = (e, minAge) => {
        //  alert(e)
        if (e < minAge) {
            const msg = 'maximun field can not be less than minimum';
            setMaxError(msg);
            return false;
        }
        setMaxError(null);
        setMaxAge(e);
    };
    const handleAges = e => {
        setMaxAge(e.target.value);

        if (maxAge > minAge) {
            setMaxError(null);
        }
        if (!maxAge) {
            setMaxAgeError('');
        } else {
            setMaxAgeError(null);
        }
    };

    const handleMinAge = e => {
        setMinAge(
            parseInt(e.target.value, 10) < 0 ||
            parseInt(e.target.value, 10) > parseInt(maxAge, 10)
                ? maxAge
                : parseInt(e.target.value, 10)
        );
        if (!minAge) {
            setMinAgeError('');
        } else {
            setMinAgeError(null);
        }
    };
    const handleKeyAge = e => {
        let value = e.target.value;

        if (value > 99) {
            setMinAge(null);
            setMinAgeError('Age can not be more than 99');
            return false;
        } else {
            setMinAgeError(null);
        }
    };
    const handleKeyMaxAge = e => {
        let value = e.target.value;

        if (value > 99) {
            setMaxAge(null);
            setMaxAgeError('Age can not be more than 99');
            return false;
        } else {
            setMaxAgeError(null);
        }
    };
    const deletLandingpageLogo = (e) => {
        e.preventDefault();
        setLandingpageLogo('');
    };
    const deletLandingpagerightLogo = (e) => {
        e.preventDefault();
        setLandingpagerightLogo('');
    };
    const handleLandingleft = async e => {
        setLandingpageurl(e.target.value);
    };
    const handleLandingright = async e => {
        setLandingpageurlright(e.target.value);
    };
    const handleInputChange = (e, index) => {
        const {name, value} = e.target;
        const list = [...footer];
        list[index][name] = value;
        setFooter(list);
    };

    const handleAddClick = () => {
        setFooter([...footer, {label: "", link: ""}]);
    };

    return (

        isLoader ? (
            <LoaderLayout/>
        ) : (
            <AppLayout>
                <div className="main-d dashboard permision sys-app-details">
                    <div className="container">
                        <h1>{tournamentId ? 'Edit ' : 'Create a '} Tournament</h1>
                        <form onSubmit={createTournament}>
                            <div className="row mb-5">
                                <div className="col-md-4">
                                    {tournamentId && stages.length ? (
                                        <div className="form-group">
                                            <label htmlFor="exampleFormControlInput1">
                                                Stage Order (Drag and Drop to change order.)
                                            </label>
                                            <br/>

                                            <DragToReorderList stages={stages} editPage={true}/>

                                            <div className="row">
                                                <div className="col-md-12 text-left mt-3">
                                                    <Link
                                                        className="main-btn-cncel text-center"
                                                        to={
                                                            roleId === '2'
                                                                ? '/application-dashboard/tournament/' +
                                                                tournamentId +
                                                                '/stage/create'
                                                                : '/organisation-dashboard/tournament/' +
                                                                tournamentId
                                                        }
                                                    >
                                                        Add Another Stage

                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">App</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Application Name"
                                            value={appName.toUpperCase()}
                                            disabled
                                        />
                                    </div>
                                    <div className="form-group has-warning">
                                        <label htmlFor="exampleFormControlInput1">
                                            Org<span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <SelectOrganization
                                            required="required"
                                            handleSelectedOrganization={handleTn1}
                                            selected={selectedOrganisation}
                                            organizations={organizations}
                                        />
                                        <span className="help-block error text-danger">
                                                {orgError ? orgError : ''}
                                            </span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Tournament Name<span style={{color: '#e63737'}}>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="tournamentName"
                                            value={tournamentName}
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Tournament Name"
                                            onChange={handleTn}
                                            maxLength={200}
                                            required="required"
                                        />

                                        <span className="help-block error text-danger">
                                                {tnError ? tnError : ''}
                                            </span>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlTextarea1">
                                            Tournament Description (optional)
                                        </label>

                                        <textarea
                                            className="form-control"
                                            id="exampleFormControlTextarea1"
                                            rows="5"
                                            placeholder="Tournament Description"
                                            value={description}
                                            onChange={handleDescription}
                                            maxLength={1000}
                                        />
                                    </div>

                                    <div className="form-group has-warning">
                                        <label htmlFor="exampleFormControlInput1">
                                            Select Country
                                        </label>
                                        <SelectCountry
                                            required="required"
                                            handleSelectedCountry={handleTn2}
                                            selected={selectedCountry}
                                        />
                                        <span className="help-block error text-danger">
                                                {countryError ? countryError : ''}
                                            </span>
                                    </div>

                                    <div className="form-group timeZone">
                                        <label htmlFor="exampleFormControlInput1">
                                            Time Zone<span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <SelectTimeZone
                                            timeZones={existingTimeZones}
                                            handleSelectedTimeZone={handleTn3}
                                            selected={selectedTimeZone}
                                        />

                                        <span className="help-block error text-danger">
                                                {timeError ? timeError : ''}
                                            </span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Gender
                                            <span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <div id="custom-select">
                                            <select
                                                onChange={e => setGender(e.target.value)}
                                                required="required"
                                                value={gender}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Age Requirements
                                            <span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <div id="custom-select">
                                            <select
                                                onChange={e => setAgeRequirement(e.target.value)}
                                                value={ageRequirement}
                                            >
                                                <option value="open">Open</option>
                                                <option value="range">Range</option>
                                            </select>
                                        </div>
                                    </div>
                                    {ageRequirement === 'range' && (
                                        <React.Fragment>
                                            <label htmlFor="exampleFormControlInput1">
                                                Age When Tournament Starts
                                            </label>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-md-6 d-flex">
                                                        <input
                                                            type="number"
                                                            name="minimum"
                                                            value={minAge}
                                                            min={0}
                                                            style={{height: '36px', padding: '1px'}}
                                                            className="form-control mr-2"
                                                            id="exampleFormControlInput1"
                                                            placeholder="##"
                                                            onChange={handleMinAge}
                                                            onKeyUp={handleKeyAge}
                                                            required
                                                        />
                                                        <label htmlFor="exampleFormControlInput1">
                                                            Minimum<span style={{color: '#e63737'}}>*</span>
                                                        </label>

                                                    </div>

                                                    <div className="col-md-6 d-flex">
                                                        <input
                                                            type="number"
                                                            name="maximum"
                                                            value={maxAge}
                                                            min={minAge}
                                                            style={{height: '36px', padding: '1px'}}
                                                            className="form-control mr-2"
                                                            id="exampleFormControlInput1"
                                                            placeholder="##"
                                                            onChange={handleAges}
                                                            onMouseLeave={e =>
                                                                handleAge(parseInt(e.target.value, 10), minAge)
                                                            }
                                                            onKeyUp={handleKeyMaxAge}
                                                            required
                                                        />
                                                        <label htmlFor="exampleFormControlInput1">
                                                            Maximum<span style={{color: '#e63737'}}>*</span>
                                                        </label>

                                                    </div>
                                                    <span className="help-block error text-danger">
                                                        {minAgeError ? minAgeError : ''}
                                                    </span>
                                                    <span className="help-block error text-danger">
                                                        {maxAgeError ? maxAgeError : ''}
                                                    </span>
                                                </div>

                                                <span className="help-block error text-danger">
                                                    {maxError ? maxError : ''}
                                                </span>
                                            </div>
                                        </React.Fragment>
                                    )}
                                </div>
                                <div className="col-md-12 Configuration">
                                    <hr/>
                                    <h5>
                                        <strong>Tournament Display Configuration</strong>
                                    </h5>
                                    <h6>
                                        <strong>Display Seeding Number</strong>
                                    </h6>
                                    <RadioLayout
                                        label="Yes"
                                        id="customRadio12"
                                        name="customRadioew"
                                        value="yes"
                                        checked={displaySeed === 'yes'}
                                        handleChange={setDisplaySeed}
                                    />
                                    <RadioLayout
                                        label="No"
                                        id="customRadio13"
                                        name="customRadioew"
                                        value="no"
                                        checked={displaySeed === 'no'}
                                        handleChange={setDisplaySeed}
                                    />
                                    <h6>
                                        <strong>Display Competitor Profile Image</strong>
                                    </h6>

                                    <RadioLayout
                                        label="Yes"
                                        id="customRadio14"
                                        name="customRadioes"
                                        value="yes"
                                        checked={displayProfileImg === 'yes'}
                                        handleChange={setDisplayProfileImg}
                                    />

                                    <RadioLayout
                                        label="No"
                                        id="customRadio15"
                                        name="customRadioes"
                                        value="no"
                                        checked={displayProfileImg === 'no'}
                                        handleChange={setDisplayProfileImg}
                                    />

                                    <h6>
                                        <strong>Display Player Name</strong>
                                    </h6>

                                    <RadioLayout
                                        label="Full Name"
                                        id="customRadio16"
                                        name="customRadioiy"
                                        value="fullName"
                                        checked={displayPlayerName === 'fullName'}
                                        handleChange={setDisplayPlayerName}
                                    />

                                    <RadioLayout
                                        label="Username"
                                        id="customRadio17"
                                        name="customRadioiy"
                                        value="userName"
                                        checked={displayPlayerName === 'userName'}
                                        handleChange={setDisplayPlayerName}
                                    />

                                    <RadioLayout
                                        label="Both"
                                        id="customRadio18"
                                        name="customRadioiy"
                                        value="both"
                                        checked={displayPlayerName === 'both'}
                                        handleChange={setDisplayPlayerName}
                                    />

                                    <h6>
                                        <strong>Display Country</strong>
                                    </h6>

                                    <RadioLayout
                                        label="Flag"
                                        id="customRadio19"
                                        name="customRadiods"
                                        value="flag"
                                        checked={displayCountry === 'flag'}
                                        handleChange={setDisplayCountry}
                                    />

                                    <RadioLayout
                                        label="3-Digit Country Code"
                                        id="customRadio20"
                                        name="customRadiods"
                                        value="countryCode"
                                        checked={displayCountry === 'countryCode'}
                                        handleChange={setDisplayCountry}
                                    />

                                    <RadioLayout
                                        label="Both"
                                        id="customRadio21"
                                        name="customRadiods"
                                        value="both"
                                        checked={displayCountry === 'both'}
                                        handleChange={setDisplayCountry}
                                    />

                                    <RadioLayout
                                        label="None"
                                        id="customRadio22"
                                        name="customRadiods"
                                        value="none"
                                        checked={displayCountry === 'none'}
                                        handleChange={setDisplayCountry}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label>Watermark - Bottom Left</label>
                                    <Upload
                                        handleUpload={setLeftWatermark}
                                        image={leftWatermark}
                                        deleteImage={deleteLeftWaterMark}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label>Watermark - Bottom Right</label>
                                    <Upload
                                        handleUpload={setRightWatermark}
                                        image={rightWatermark}
                                        deleteImage={deleteRightWaterMark}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label>Sponsor Logo</label>
                                    <Upload
                                        handleUpload={setSponsorLogo}
                                        image={sponsorLogo}
                                        deleteImage={deleteSponsorLogo}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label>Bracket Logo</label>
                                    <Upload
                                        handleUpload={setBracketLogo}
                                        image={bracketLogo}
                                        deleteImage={deleteBracketLogo}
                                    />
                                </div>

                                <hr/>
                                <div className="col-md-12 Configuration">
                                    <h3>Landing Page Configuration</h3>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Landing Page URL
                                        </label>
                                        <span>
                                        {''} {protocol + "//" + subdomain + '/'}
                                            <input
                                                type="text"
                                                name="landingpage"
                                                value={landingpage}
                                                className="form-control"
                                                id="exampleFormControlInput1"
                                                placeholder=""
                                                onChange={handleLanding}
                                                maxLength={50}
                                                required="required"
                                            />
                                        </span>


                                        <span className="help-block error text-danger">
                                        {landingError ? landingError : ''}
                                    </span>
                                    </div>
                                    <div className="col-md-12">
                                        <label>Landing Page Logo (header left)</label>
                                        <Upload
                                            handleUpload={setLandingpageLogo}
                                            image={landingpageLogo}
                                            deleteImage={deletLandingpageLogo}
                                        />
                                        <label htmlFor="exampleFormControlInput1">
                                            Html Link <span style={{color: '#e63737'}}>*</span>
                                        </label>

                                        <input
                                            className="form-control"
                                            type="text"
                                            name="landingpage"
                                            value={landingpageurl}
                                            id="exampleFormControlInput1"
                                            placeholder=""
                                            onChange={(e) => handleLandingleft(e)}
                                            maxLength={200}
                                            required="required"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label>Landing Page Logo (header right)</label>
                                        <Upload
                                            handleUpload={setLandingpagerightLogo}
                                            image={landingpagerightLogo}
                                            deleteImage={deletLandingpagerightLogo}
                                        />
                                        <label htmlFor="exampleFormControlInput1">
                                            Html Link <span style={{color: '#e63737'}}>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="landingpage"
                                            value={landingpageurlright}
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder=""
                                            onChange={(e) => handleLandingright(e)}
                                            maxLength={200}
                                            required="required"
                                        />
                                    </div>

                                    <label>Landing Page Footer</label>

                                    {footer.map((x, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <div className="form-group row">
                                                    <div className='col-md-6'>
                                                        <label>{i + 1}. label</label>

                                                        <input
                                                            className="form-control"
                                                            id="exampleFormControlInput1"
                                                            name="label"
                                                            value={x.label}
                                                            onChange={e => handleInputChange(e, i)}
                                                        />
                                                    </div>
                                                    <div className='col-md-6'>
                                                        <label>Html Link</label>
                                                        <input
                                                            className="form-control"
                                                            id="exampleFormControlInput1"
                                                            name="link"
                                                            value={x.link}
                                                            onChange={e => handleInputChange(e, i)}
                                                        />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                    })}
                                    <br/>
                                    <br/>
                                    <Link to="#" onClick={handleAddClick} style={{color: 'black'}}>+Add Another</Link>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-md-12 text-right">
                                    <Link
                                        to={
                                            roleId === '2'
                                                ? '/application-dashboard/tournaments' +
                                                (tournamentId ? '/' + tournamentId : '')
                                                : '/organisation-dashboard/tournaments' +
                                                (tournamentId ? '/' + tournamentId : '')
                                        }
                                        className="main-btn-cncel text-center"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="main-btn text-center"
                                        onClick={createTournament}
                                    >
                                        {tournamentId ? 'Save' : 'Add a Stage'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </AppLayout>
        )

    );
};

export default CreateTournament;
