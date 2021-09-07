import React, {useEffect, useState, useCallback} from 'react';
import AppLayout from '../../../layouts/AppLayout';
import {useParams, useHistory} from 'react-router-dom';
import LoaderLayout from '../../../layouts/LoaderLayout';
import axios from 'axios';
import moment from 'moment';
import {useSnackbar} from 'notistack';
import {helpers} from '../../../helper';
import {parseErrorResponse} from '../../../helper/utilis';
import Upload from './Upload';
import {authHeader} from '../../../helper/auth-header';
import {validateSlug} from '../../../helper/validate';

const EditApp = () => {
    const {appID} = useParams();
    const {enqueueSnackbar} = useSnackbar();
    const [isLoader, setIsLoader] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [name, setName] = useState(['']);
    const [dateCreated, setDateCreated] = useState(moment().format('DD-MM-YYYY'));
    const [slug, setSlug] = useState('');
    const [description, setdescription] = useState('');
    const [primaryColor, setPrimaryColor] = useState('');
    const [headerLogo, setHeaderLogo] = useState(null);
    const [apploginlogo, setAppLoginLogo] = useState(null);
    const [waterMarkLogo, setWaterMarkLogo] = useState(null);
    const [waterMarkLogoleft, setWaterMarkLogoleft] = useState(null);
    const [sponsorLogo, setSponsorLogo] = useState('');
    const [bracketLogo, setBracketLogo] = useState('');
    const [landingpageLogo, setLandingpageLogo] = useState('');
    const [landingpagerightLogo, setLandingpagerightLogo] = useState('');
    const [landingpageurl, setLandingpageurl] = useState('');
    const [landingpageurlright, setLandingpageurlright] = useState('');
    const [secondaryColor, setSecondaryColor] = useState('');
    const [sponsorsecondaryColor, setSponsorsecondaryColor] = useState('');
    const [nameError, setNameError] = useState(null);
    const [slugError, setSlugError] = useState(null);
    const [primaryColorError, setPrimaryColorError] = useState(null);
    const [secondaryColorError, setSecondaryColorError] = useState(null);
    const history = useHistory();

    const handleCancel = () => {
        history.goBack();
    };
    const handleName = e => {
        const value = e.target.value;
        if (value.length < 3) {
            const msg = 'Value should be atleast 3 character long';
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
            setSlugError('This value can not be blank');
        } else {
            if (value.length < 3) {
                setSlugError('Value should be atleast 3 character long');
            } else {
                setSlugError(null);
                const isExsist = await checkSlug(value);
                if (isExsist) {
                    setSlugError('This slug is already used');
                }
            }
        }
    };

    const checkSlug = async value => {
        try {
            if (!validateSlug(value)) {
                setSlugError('Slug should not have any special character');
            } else {
                setSlugError(null);
                const url =
                    process.env.REACT_APP_API_URI +
                    'app/slug/' +
                    value +
                    '?app_id=' +
                    appID;
                const response = await axios.get(url, {headers: authHeader()});
                if (response.data.status === 200) {
                    return response.data.data.isFound;
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
            }
        } catch (error) {
            return false;
        }
    };

    const handleDate = e => {
        setDateCreated(e.target.value);
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
    const handleHeaderLogo = e => {
        setHeaderLogo(e.target.files[0]);
    };
    const handleWaterMarkLogo = e => {
        setWaterMarkLogo(e.target.files[0]);
    };
    const handleWaterMarkLogoleft = e => {
        setWaterMarkLogoleft(e.target.files[0]);
    };
    const handleSponsorLogo = e => {
        setSponsorLogo(e.target.files[0]);
    };
    const handleBracketLogo = e => {
        setBracketLogo(e.target.files[0]);
    };

    const handleSave = async () => {
        let isError = true;
        const msg = 'Value should be atleast 3 character long';
        if (name && name.length > 2) {
            setNameError(null);
            isError = false;
        } else {
            setNameError(msg);
        }
        if (!slugError) {
            if (slug && slug.length > 2) {
                setSlugError(null);
                isError = false;
            } else {
                setSlugError(msg);
            }
        }

        if (
            primaryColor &&
            primaryColor.length > 6 &&
            primaryColor.startsWith('#')
        ) {
            setPrimaryColorError(null);
            isError = false;
        } else {
            setPrimaryColorError(
                'Hex code should starts with # and length should be 6'
            );
        }

        if (!isError && !nameError && !slugError && !primaryColorError) {
            setIsLoader(true);
            const url = process.env.REACT_APP_API_URI + 'app/' + appID;
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
            formData.append('_method', 'PUT');
            const data = await helpers.formDataMultipart('POST', url, formData);
            if (data.status === 200) {
                enqueueSnackbar('Application details saved', {
                    variant: 'success',
                    autoHideDuration: 3000,
                });
                history.push('/system-dashboard/app/');
                getData();
            }
        } else {
            enqueueSnackbar('Please fix highlighted problem', {
                variant: 'error',
                autoHideDuration: 3000,
            });
        }
        setIsLoader(false);
    };
    const getData = useCallback(async () => {
        try {
            const url = process.env.REACT_APP_API_URI + 'app/' + appID;
            const response = await axios.get(url, {headers: authHeader()});
            if (response.data.status === 200) {
                const data = response.data.data;
                setName(data.name ? data.name : '');
                const dd = moment(data.dateCreated).format('YYYY-MM-DD');
                setDateCreated(dd);
                setSlug(data.slug ? data.slug : '');
                setdescription(data.description ? data.description : '');
                setPrimaryColor(data.primary_color ? data.primary_color : '');
                setSecondaryColor(data.secondary_color ? data.secondary_color : '');
                setAppLoginLogo(data.login_logo? data.login_logo:null)
                setHeaderLogo(data.header_logo ? data.header_logo : null);
                setWaterMarkLogo(data.watermark_logo ? data.watermark_logo : null);
                setWaterMarkLogoleft(
                    data.watermark_logo_left ? data.watermark_logo_left : null
                );
                setSponsorLogo(data.sponser_logo ? data.sponser_logo : null);
                setBracketLogo(data.bracket_logo ? data.bracket_logo : null);
                setLandingpageLogo(
                    data.landing_page_logo_left ? data.landing_page_logo_left : null
                );
                setLandingpagerightLogo(
                    data.landing_page_logo_right ? data.landing_page_logo_right : null
                );
                setLandingpageurl(
                    data.landing_page_link_left ? data.landing_page_link_left : null
                );
                setLandingpageurlright(
                    data.landing_page_link_right ? data.landing_page_link_right : null
                );
                setSponsorsecondaryColor(
                    data.sponser_secondary_color ? data.sponser_secondary_color : null
                );

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
    }, [isInitialized, getData, headerLogo]);



    const deleteAppLoginLogo = (e) => {
        e.preventDefault();
        setAppLoginLogo('');
    };

    const deleteHeaderLogo = e => {
        e.preventDefault();
        setHeaderLogo('');
    };

    const deleteWatermarkLogo = e => {
        e.preventDefault();
        setWaterMarkLogo('');
    };
    const deleteWatermarkLogoleft = e => {
        e.preventDefault();
        setWaterMarkLogoleft('');
    };

    const deleteSponsorLogo = e => {
        e.preventDefault();
        setSponsorLogo('');
    };
    const deleteBracketLogo = e => {
        e.preventDefault();
        setBracketLogo('');
    };
    const deletLandingpageLogo = e => {
        e.preventDefault();
        setLandingpageLogo('');
    };
    const deletLandingpagerightLogo = e => {
        e.preventDefault();
        setLandingpagerightLogo('');
    };

    const handleSponsorsecondaryColor = e => {
        const value = e.target.value;
        setSponsorsecondaryColor(value);
    };

    const handleLanding = async e => {
        setLandingpageurl(e.target.value);
    };
    const handleLandingright = async e => {
        setLandingpageurlright(e.target.value);
    };
    return isLoader ? (
        <LoaderLayout/>
    ) : (
        <AppLayout>
            <div className="main-d dashboard permision sys-app-details">
                <div className="container">
                    <h1>Edit Application</h1>
                    <form>
                        <div className="row mb-5 mt-5">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1">
                                        Application Name
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder="Application Name"
                                        value={name}
                                        onChange={handleName}
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
                                        value={moment(dateCreated).format('DD-MM-YYYY')}
                                        onChange={handleDate}
                                        min={dateCreated}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1">Slug Name</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder="Slug Name"
                                        maxlength="20"
                                        name="slug"
                                        value={slug}
                                        onChange={handleSlug}
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
                                    handleHeaderLogo={handleHeaderLogo}
                                    handleUpload={setHeaderLogo}
                                    image={headerLogo}
                                    deleteImage={deleteHeaderLogo}
                                />
                            </div>
                            <div className="col-md-12">
                                <label>Video Watermark (bottom left)</label>
                                <Upload
                                    handleWaterMarkLogo={handleWaterMarkLogoleft}
                                    handleUpload={setWaterMarkLogoleft}
                                    image={waterMarkLogoleft}
                                    deleteImage={deleteWatermarkLogoleft}
                                />
                            </div>
                            <div className="col-md-12">
                                <label>Video Watermark (bottom right)</label>
                                <Upload
                                    handleWaterMarkLogo={handleWaterMarkLogo}
                                    handleUpload={setWaterMarkLogo}
                                    image={waterMarkLogo}
                                    deleteImage={deleteWatermarkLogo}
                                />
                            </div>

                            <div className="col-md-12">
                                <label>Sponsor Logo</label>
                                <Upload
                                    handleSponsorLogo={handleSponsorLogo}
                                    handleUpload={setSponsorLogo}
                                    image={sponsorLogo}
                                    deleteImage={deleteSponsorLogo}
                                />
                            </div>
                            <div className="col-md-12">
                                <label>Bracket Logo</label>
                                <Upload
                                    handleBracketLogo={handleBracketLogo}
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
                                    onChange={e => handleLanding(e)}
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
                                    onChange={e => handleLandingright(e)}
                                    maxLength={50}
                                    required="required"
                                />
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1">
                                        Application Color
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder="Enter Hex code starting with #"
                                        value={primaryColor}
                                        onChange={handlePrimaryColor}
                                    />
                                    <span className="help-block error text-danger">
                                        {primaryColorError ? primaryColorError : ''}
                                    </span>
                                </div>

                                <br/>

                                <div className="form-group">
                                    <label htmlFor="exampleFormControlInput1">
                                        Sponsor Primary Color
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleFormControlInput1"
                                        placeholder="Enter Hex code starting with #"
                                        value={secondaryColor}
                                        onChange={handleSecondaryColor}
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
                            <button className="main-btn-cncel text-center" onClick={handleCancel}>
                                Cancel
                            </button>

                            <button className="main-btn text-center" onClick={handleSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default EditApp;
