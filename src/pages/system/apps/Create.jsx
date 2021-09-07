import React, {useEffect, useState, useCallback} from 'react';
import AppLayout from '../../../layouts/AppLayout';
import {Link, useHistory} from 'react-router-dom';
import LoaderLayout from '../../../layouts/LoaderLayout';
import axios from 'axios';
import moment from 'moment';
import {useSnackbar} from 'notistack';
import {helpers} from '../../../helper';
import Upload from './Upload';
import {authHeader} from "../../../helper/auth-header";
import {validateSlug} from "../../../helper/validate";

const CreateApp = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [name, setName] = useState('');
    const [dateCreated, setDateCreated] = useState(moment().format('DD-MM-YYYY'));
    const [slug, setSlug] = useState('');
    const [description, setdescription] = useState('');
    const [primaryColor, setPrimaryColor] = useState('');
    const [secondaryColor, setSecondaryColor] = useState('');
    const [sponsorsecondaryColor, setSponsorsecondaryColor] = useState('');
    const [headerLogo, setHeaderLogo] = useState('');
    const [apploginlogo, setAppLoginLogo] = useState('');

    const [waterMarkLogo, setWaterMarkLogo] = useState('');
    const [waterMarkLogoleft, setWaterMarkLogoleft] = useState('');
    const [sponsorLogo, setSponsorLogo] = useState('');
    const [bracketLogo, setBracketLogo] = useState('');
    const [landingpageLogo, setLandingpageLogo] = useState('');
    const [landingpagerightLogo, setLandingpagerightLogo] = useState('');
    const [landingpageurl, setLandingpageurl] = useState('');
    const [landingpageurlright, setLandingpageurlright] = useState('');
    const [nameError, setNameError] = useState(null);
    const [slugError, setSlugError] = useState(null);
    const [primaryColorError, setPrimaryColorError] = useState(null);
    const [secondaryColorError, setSecondaryColorError] = useState(null);
    const history = useHistory();
    const handleName = e => {
        const value = e.target.value;
        if (value.length < 3) {
            const msg = 'The value should be at least 3 characters long';
            setNameError(msg);
        } else {
            setNameError(null);
        }
        setName(value);
    };
    const handleSlug = async e => {
        const value = e.target.value;
        setSlug(value);
        if (!value) {
            setSlugError("This field can't be blank.");
        } else {
            if (value.length < 3) {
                setSlugError('The value should be at least 3 characters long');
            } else {
                setSlugError(null);
                const isExsist = await checkSlug(value);
                if (isExsist) {
                    setSlugError('This slug is already used');
                }
            }
        }
    };

    const handleDate = e => {
        setDateCreated(e.target.value);
    };


    const handleDescription = e => {
        const value = e.target.value;
        setdescription(value);
    };
    const handlePrimaryColor = e => {
        const value = e.target.value;
        if (value.length < 7) {
            const msg = 'Hex code  should be atleast 6 character long';
            setPrimaryColorError(msg);
        } else if (!value.startsWith('#')) {
            setPrimaryColorError('Please provide Hex code starting with #');
        } else {
            setPrimaryColorError(null);
        }

        setPrimaryColor(value);
    };

    const handleSecondaryColor = e => {
        const value = e.target.value;
        if (value.length < 7) {
            const msg = 'Hex code  should be atleast 6 character long';
            setSecondaryColorError(msg);
        } else if (!value.startsWith('#')) {
            setSecondaryColorError('Please provide Hex code starting with #');
        } else {
            setSecondaryColorError(null);
        }

        setSecondaryColor(value);
    };
    const handleSponsorsecondaryColor = e => {
        const value = e.target.value;


        setSponsorsecondaryColor(value);
    };
    const checkSlug = async value => {
        try {
            if (!validateSlug(value)) {
                setSlugError('Slug should not have any special character');
            } else {
                setSlugError(null);
                const url = process.env.REACT_APP_API_URI + 'app/slug/' + value;
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
    const handleSave = async () => {
        setIsLoader(true);
        const url = process.env.REACT_APP_API_URI + 'app';
        let isError = true;
        const msg = "This field can't be blank.";

        if (name && name.length > 2) {
            setNameError(null);
        } else {
            setNameError(msg);
        }

        if (!slugError) {
            if (slug && slug.length > 2) {
                setSlugError(null);
            }
            else {
                setSlugError(msg);
            }
        }

        if (primaryColor && primaryColor.length === 7 && primaryColor.startsWith('#')) {
            setPrimaryColorError(null);
            isError = false;
        } else {
            setPrimaryColorError(
                'Hex code should start with # and the length should be 6 characters.'
            );
        }

        if (!isError && !nameError && !slugError && !primaryColorError) {
            let formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('primary_color', primaryColor);
            formData.append('secondary_color', secondaryColor);
            formData.append('login_logo', apploginlogo);
            formData.append('header_logo', headerLogo);
            formData.append('watermark_logo', waterMarkLogo);
            formData.append('watermark_logo_left', waterMarkLogoleft);
            formData.append('sponsor_logo', sponsorLogo);
            formData.append('bracket_logo', bracketLogo);
            formData.append('landing_page_logo_left', landingpageLogo);
            formData.append('landing_page_logo_right', landingpagerightLogo);
            formData.append('landing_page_link_right', landingpageurlright);
            formData.append('landing_page_link_left', landingpageurl);
            formData.append('sponser_secondary_color', sponsorsecondaryColor);
            const data = await helpers.formDataMultipart('POST', url, formData);

            if (data.status === 200) {
                enqueueSnackbar('Application created', {
                    variant: 'success',
                    autoHideDuration: 3000
                });
                history.push('/system-dashboard/app/');

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
            setIsLoader(false);
        } else {
            enqueueSnackbar('Please fill in the mandatory fields', {
                variant: 'error',
                autoHideDuration: 3000
            });
            setIsLoader(false);
        }
    };
    const getData = useCallback(async () => {
        setIsInitialized(true);
        setIsLoader(false);
    }, []);

    useEffect(() => {
        if (!isInitialized) {
            getData();
        }
    }, [isInitialized, getData]);

    let today = new Date(),
        day = today.getDate(),
        month = today.getMonth() + 1, //January is 0
        year = today.getFullYear();
    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    today = year + '-' + month + '-' + day;

    const deleteHeaderLogo = (e) => {
        e.preventDefault();
        setHeaderLogo('');
    };
    const deleteAppLoginLogo = (e) => {
        e.preventDefault();
        setAppLoginLogo('');
    };

    const deleteWatermarkLogo = (e) => {
        e.preventDefault();
        setWaterMarkLogo('');
    };
    const deleteWatermarkLogoleft = (e) => {
        e.preventDefault();
        setWaterMarkLogoleft('');
    };
    const deleteSponsorLogo = (e) => {
        e.preventDefault();
        setSponsorLogo('');
    };
    const deleteBracketLogo = (e) => {
        e.preventDefault();
        setBracketLogo('');
    };
    const deletLandingpageLogo = (e) => {
        e.preventDefault();
        setLandingpageLogo('');
    };
    const deletLandingpagerightLogo = (e) => {
        e.preventDefault();
        setLandingpagerightLogo('');
    };
    const handleLanding = async e => {
        setLandingpageurl(e.target.value);
    };
    const handleLandingright = async e => {
        setLandingpageurlright(e.target.value);
    };


    return (

        isLoader ? (
            <LoaderLayout/>
        ) : (
            <AppLayout>
                <div className="main-d dashboard permision sys-app-details">
                    <div className="container">
                        <h1>Create an Application</h1>
                        <form>
                            <div className="row mb-5 mt-5">
                                <div className="col-md-4">
                                    <div className="form-group has-warning">
                                        <label htmlFor="exampleFormControlInput1">
                                            Application Name
                                            <span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Application Name"
                                            value={name}
                                            onChange={handleName}
                                            required
                                            maxLength="50"
                                        />
                                        <span className="help-block error text-danger">
                                            {nameError ? nameError : ''}
                                        </span>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">Created</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="birthday"
                                            name="birthday"
                                            placeholder="Today’s Date"
                                            value={dateCreated}
                                            onChange={(e) => handleDate(e)}
                                            min={today}
                                            disabled
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">Slug Name
                                            <span style={{color: '#e63737'}}>*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="slugname.domain.com"
                                            name="slug"
                                            value={slug}
                                            maxLength='20'
                                            onChange={handleSlug}
                                            required
                                        />
                                        <span className="help-block error text-danger">
                                            {slugError ? slugError : ''}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlTextarea1">
                                            Application Description (optional)
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="exampleFormControlTextarea1"
                                            rows="5"
                                            placeholder="Application Description"
                                            value={description}
                                            onChange={handleDescription}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label>App Login Logo</label>
                                    <Upload
                                        handleUpload={setAppLoginLogo}
                                        image={apploginlogo}
                                        deleteImage={deleteAppLoginLogo}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label>App Logo (used in header)</label>
                                    <Upload
                                        handleUpload={setHeaderLogo}
                                        image={headerLogo}
                                        deleteImage={deleteHeaderLogo}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label>Video Watermark (bottom left)</label>
                                    <Upload
                                        handleUpload={setWaterMarkLogoleft}
                                        image={waterMarkLogoleft}
                                        deleteImage={deleteWatermarkLogoleft}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label>Video Watermark (bottom right)</label>
                                    <Upload
                                        handleUpload={setWaterMarkLogo}
                                        image={waterMarkLogo}
                                        deleteImage={deleteWatermarkLogo}
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
                                        onChange={(e) => handleLanding(e)}
                                        maxLength={50}
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
                                        maxLength={50}
                                        required="required"
                                    />
                                </div>

                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Application Color
                                            <span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Enter Hex code starting with #"
                                            value={primaryColor}
                                            onChange={handlePrimaryColor}
                                            required
                                        />
                                        <span className="help-block error text-danger">
                                            {primaryColorError ? primaryColorError : ''}
                                        </span>
                                    </div>

                                    <br/>


                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Sponsor Primary Color
                                            <span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Enter Hex code starting with #"
                                            value={secondaryColor}
                                            onChange={handleSecondaryColor}
                                            required
                                        />
                                        <span className="help-block error text-danger">
                                            {secondaryColorError ? secondaryColorError : ''}
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlInput1">
                                            Sponsor Secondary Color
                                            <span style={{color: '#e63737'}}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="exampleFormControlInput1"
                                            placeholder="Enter Hex code starting with #"
                                            value={sponsorsecondaryColor}
                                            onChange={handleSponsorsecondaryColor}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-md-12 text-right">
                                <Link
                                    to="/system-dashboard/app"
                                    className="main-btn-cncel text-center"
                                >
                                    Cancel
                                </Link>
                                <button className="main-btn text-center" onClick={handleSave}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        )

    );
};

export default CreateApp;
