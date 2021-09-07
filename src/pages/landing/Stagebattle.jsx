import React from 'react';
import TreeView from '../tournaments/TreeView';
import ReactPlayer from 'react-player';
import img5 from '../../assets/images/app-store-copy.svg';
import img6 from '../../assets/images/android-app-store-copy.svg';
import TablePool from '../tournaments/stageComponents/TablePool';

const Stagebattle = props => {
    const {stages, active, landing} = props;
    return (
        <div className="tab-content">
            {stages
                ? stages.map((data, index) => (
                    <React.Fragment key={index}>

                        <div
                            role="tabpanel"
                            className={
                                'tab-pane text-center ' + (active === index ? 'active' : '')
                            }
                            id={'landing' + index}
                        >
                            {data.stageType === 'skill' && data.status === 1 ? (
                                <React.Fragment>
                                    {data.videoLink ? <ReactPlayer
                                        className="bnr-vid-img"
                                        url={data.videoLink}
                                        controls
                                    /> : ''}
                                    <div className="container">
                                        <h1 className="mt-5" style={{border: 'none'}}>
                                            {data.detailH1}
                                        </h1>
                                        <div
                                            style={{marginLeft: '7%'}}
                                            dangerouslySetInnerHTML={{__html: data.bodytext}}
                                        />
                                    </div>

                                    <div className="app-dwd" id="footerdown">
                                        <h1 style={{border: 'none'}}>Join the Competition</h1>
                                        <h4 style={{color: 'white'}}>
                                            Already have the WFFA app?
                                            <br/>
                                            Go to your settings and enter invite code{' '}
                                            <span> {data.invitCode} </span> or search for your
                                            country.
                                        </h4>
                                        <div className="app-dwd-btn">
                                            <a
                                                href="https://apps.apple.com/us/app/wffa-world-freestyle-football/id1476110857"
                                                target="blank"
                                            >
                                                <img src={img5} alt=""/>
                                            </a>
                                            <a
                                                href="https://play.google.com/store/apps/details?id=talentkode.topya.wsfc"
                                                target="blank"
                                            >
                                                <img src={img6} alt=""/>
                                            </a>
                                        </div>
                                        <h4 style={{color: 'white'}}>
                                            Download the WFFA app.
                                            <br/>
                                            Enter invite code <span> {data.invitCode} </span> or
                                            search for your country.
                                        </h4>
                                    </div>

                                    <div className="app-dwd-btn app-dwd-btn1">
                                        <h3>Brought to you by:</h3>

                                        <img
                                            src={landing.sponser_logo}
                                            style={{marginTop: '20px'}}
                                            alt=""
                                        />

                                    </div>
                                </React.Fragment>
                            ) : data.stageType === 'skill' && data.status === 4 ? (
                                <div className="tab-content">
                                    <div
                                        role="tabpanel"
                                        className="tab-pane active text-center"
                                        id="home"
                                    >
                                        {data.videoLink ? <ReactPlayer
                                            width="100%"
                                            className="bnr-vid-img"
                                            url={data.videoLink}
                                            controls
                                        /> : ''}
                                        <div className="container">
                                            <h1 className="mt-5" style={{border: 'none'}}>
                                                Stage {index + 1 + ' '}
                                                Competitors
                                            </h1>

                                            <div className="demo">
                                                <div role="tabpanel">
                                                    <ul className="nav nav-tabss" role="tablist">
                                                        {data.skillcompititor && data.skillcompititor.length ?
                                                            <li role="presentation" className="active">
                                                                <a
                                                                    className={data.skillcompititor && data.skillcompititor.length ? "active" : ''}
                                                                    href="#allcomp"
                                                                    aria-controls="allcomp"
                                                                    role="tab"
                                                                    data-toggle="tab"
                                                                >
                                                                    All
                                                                </a>
                                                            </li> : ''}
                                                        {data.qulified && data.qulified.length ?
                                                            <li role="presentation">
                                                                <a
                                                                    className={!data.skillcompititor || !data.skillcompititor.length ? "active" : ''}
                                                                    href="#quacomp"
                                                                    aria-controls="quacomp"
                                                                    role="tab"
                                                                    data-toggle="tab"
                                                                >
                                                                    Qualified
                                                                </a>
                                                            </li> : ''}
                                                    </ul>

                                                    <div className="tab-content">
                                                        {data.skillcompititor && data.skillcompititor.length ?
                                                            <div
                                                                role="tabpanel"
                                                                className={"tab-pane text-center " + (data.skillcompititor && data.skillcompititor.length ? "active" : '')}
                                                                id="allcomp"
                                                            >
                                                                <table
                                                                    className="table table-condensed"
                                                                    style={{
                                                                        borderCollapse: 'collapse',
                                                                        border: 'none',
                                                                    }}
                                                                >
                                                                    <thead>
                                                                    <tr>
                                                                        <th style={{textAlign: 'left'}}>
                                                                            Name
                                                                        </th>
                                                                        <th className="mdnone">Age</th>
                                                                        <th className="mdnone">Country</th>
                                                                        <th>Video</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {data.skillcompititor && data.skillcompititor.length ? data.skillcompititor.map(skill => (
                                                                        <tr>
                                                                            <td style={{textAlign: 'left'}}>
                                                                                {skill.displayName}
                                                                            </td>
                                                                            <td className="mdnone">{skill.age}</td>
                                                                            <td className="mdnone">
                                                                                {skill.country}
                                                                            </td>
                                                                            <td>
                                                                                {skill.video ? <a href={skill.video}
                                                                                                  rel="noreferrer"
                                                                                                  target="_blank">Video
                                                                                    Link</a> : "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    )) : ''}
                                                                    </tbody>
                                                                </table>
                                                                <div className="row">
                                                                    <div className="col-md-6"/>
                                                                    <div className="col-md-6 text-right">

                                                                    </div>
                                                                </div>
                                                            </div> : ''}
                                                        {data.qulified && data.qulified.length ?
                                                            <div
                                                                role="tabpanel"
                                                                className={"tab-pane text-center " + (!data.skillcompititor || !data.skillcompititor.length ? "active" : '')}
                                                                id="quacomp"
                                                            >
                                                                <table
                                                                    className="table table-condensed"
                                                                    style={{borderCollapse: 'collapse', border: 'none'}}
                                                                >
                                                                    <thead>
                                                                    <tr>
                                                                        <th className="mdnone">Seed No.</th>
                                                                        <th style={{textAlign: 'left'}}>
                                                                            Name
                                                                        </th>
                                                                        <th className="mdnone">Age</th>
                                                                        <th className="mdnone">Country</th>
                                                                        <th>Video</th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {data.qulified && data.qulified.length ? data.qulified.map(skill => (
                                                                        <tr>
                                                                            <td className="mdnone">{skill.seed}</td>
                                                                            <td style={{textAlign: 'left'}}>
                                                                                {skill.displayName}
                                                                            </td>
                                                                            <td className="mdnone">{skill.age}</td>
                                                                            <td className="mdnone">
                                                                                {skill.country}
                                                                            </td>
                                                                            <td>
                                                                                {skill.video ? <a href={skill.video}
                                                                                                  rel="noreferrer"
                                                                                                  target="_blank">Video
                                                                                    Link</a> : "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    )) : ''}
                                                                    </tbody>
                                                                </table>
                                                                <div className="row">
                                                                    <div className="col-md-6"/>
                                                                    <div className="col-md-6 text-right">

                                                                    </div>
                                                                </div>
                                                            </div> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="app-dwd-btn app-dwd-btn1">
                                            <h3>Brought to you by:</h3>

                                            <img
                                                src={landing.sponser_logo}
                                                alt=""
                                            />

                                        </div>
                                    </div>
                                    <div role="tabpanel" className="tab-pane" id="profile">
                                        Stage 2
                                    </div>
                                </div>
                            ) : data.stageType === 'battle' && data.status === 1 ? (
                                <div>
                                    <div
                                        role="tabpanel"
                                        className="tab-pane text-center"
                                        id="profile"
                                    >
                                        {data.videoLink ? <ReactPlayer
                                            width="100%"
                                            height="500px"
                                            className="bnr-vid-img"
                                            url={data.videoLink}
                                            controls
                                        /> : ''}
                                        <div className="container">
                                            <h1 className="mt-5" style={{border: 'none'}}>
                                                {data.detailH1}
                                            </h1>
                                            <div
                                                style={{marginLeft: '7%'}}
                                                dangerouslySetInnerHTML={{__html: data.bodytext}}
                                            />
                                        </div>
                                        <h1 className="mt-5" style={{border: 'none'}}>
                                            Stage {index + 1}&nbsp;Competitors
                                        </h1>
                                    </div>
                                    <div
                                        className="card card-body"
                                        style={{overflowX: 'auto'}}
                                    >
                                        <div
                                            className="brackets"
                                            id="footerdown"
                                            style={{width: 340 * data.battle.battles.length}}
                                        >
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <h3 style={{
                                                        color: "#00355B",
                                                        textAlign: "left",
                                                        marginLeft: "10px"
                                                    }}>
                                                        <strong>{data.battle.tournamentName}</strong>
                                                    </h3>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6>
                                                        <strong> Brought to you by - </strong>
                                                    </h6>
                                                    <img style={{height: '80px'}} src={data.battle.sponserLogo} alt=""/>
                                                </div>
                                            </div>
                                            <TreeView
                                                treeData={data.battle.battles}
                                                roundname={data.battle.roundnames}
                                                bracket={data.battle.bracket_logo}
                                                url={data.battle.landingpagelink}
                                                thirdbattle={data.battle.thirdbattle}
                                                secondary={data.battle.secondary}
                                                primary={data.battle.primary}
                                                enableWinner={data.enable_final}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : data.stageType === 'battle' && (data.status === 2 || data.status === 3 || data.status === 4) ? (
                                <div
                                    role="tabpanel"
                                    className="tab-pane active text-center"
                                    id="profile"
                                >
                                    {data.videoLink ? <ReactPlayer
                                        width="98%"
                                        height="500px"
                                        className="bnr-vid-img"
                                        url={data.videoLink}
                                        controls
                                    /> : ''}
                                    <div className="container"/>
                                    <h1 className="mt-5" style={{border: 'none'}}>
                                        Stage {index + 1} Competitors
                                    </h1>
                                    <div
                                        className="card card-body"
                                        style={{overflowX: 'auto'}}
                                    >
                                        <div
                                            className="brackets"
                                            style={{width: 340 * data.battle.battles.length}}
                                        >
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <h3 style={{
                                                        color: "#00355B",
                                                        textAlign: "left",
                                                        marginLeft: "10px"
                                                    }}>
                                                        <strong>{data.battle.tournamentName}</strong>
                                                    </h3>
                                                </div>
                                                <div className="col-md-4">
                                                    <h6>
                                                        <strong> Brought to you by - </strong>
                                                    </h6>
                                                    <img style={{height: '80px'}} src={data.battle.sponserLogo} alt=""/>
                                                </div>
                                            </div>
                                            <TreeView
                                                treeData={data.battle.battles}
                                                roundname={data.battle.roundnames}
                                                bracket={data.battle.bracket_logo}
                                                url={data.battle.landingpagelink}
                                                thirdbattle={data.battle.thirdbattle}
                                                secondary={data.battle.secondary}
                                                primary={data.battle.primary}
                                                enableWinner={data.enable_final}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : data.stageType === 'pool' && data.status === 1 ?
                                (
                                    <div>
                                        <div
                                            role="tabpanel"
                                            className="tab-pane text-center"
                                            id="profile"
                                        >
                                            {data.videoLink ? <ReactPlayer
                                                width="100%"
                                                height="500px"
                                                className="bnr-vid-img"
                                                url={data.videoLink}
                                                controls
                                            /> : ''}
                                            <div className="container">
                                                <h1 className="mt-5" style={{border: 'none'}}>
                                                    {data.detailH1}
                                                </h1>
                                                <div
                                                    style={{marginLeft: '7%'}}
                                                    dangerouslySetInnerHTML={{__html: data.bodytext}}
                                                />
                                            </div>
                                            <h1 className="mt-5" style={{border: 'none'}}>
                                              {data.stageName}  Competitors
                                            </h1>
                                        </div>
                                        <div
                                            className="card card-body"
                                            style={{overflowX: 'auto'}}
                                        >
                                            <div
                                                className="brackets"
                                                
                                            >
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h3 style={{
                                                            color: "#00355B",
                                                            textAlign: "left",
                                                            marginLeft: "10px"
                                                        }}>
                                                            <strong>{data && data.battle && data.battle.tournamentName ? data.battle.tournamentName : ''}</strong>
                                                        </h3>
                                                    </div>

                                                </div>
                                                {data && data.battle && data.battle.battles ? data.battle.battles.map((datas, index) =>
                                                    <TablePool ListData={datas} type={'show'} index={0}
                                                    advanceToNextRound={data.advanceToNextRound} enableWinner={data.enable_final}/>
                                                ) : ''}
                                                <div className="col-md-4">
                                                    <h6>
                                                        <strong> Brought to you by - </strong>
                                                    </h6>
                                                    <img style={{height: '80px'}} src={data.battle.sponserLogo} alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : data.stageType === 'pool' && (data.status === 2 || data.status === 3 || data.status === 4) ?
                                    <div
                                        role="tabpanel"
                                        className="tab-pane active text-center"
                                        id="profile"
                                    >
                                        {data.videoLink ? <ReactPlayer
                                            width="98%"
                                            height="500px"
                                            className="bnr-vid-img"
                                            url={data.videoLink}
                                            controls
                                        /> : ''}
                                        <div className="container"/>
                                        <h1 className="mt-5" style={{border: 'none'}}>
                                        {data.stageName}  Competitors
                                        </h1>
                                        <div
                                            className="card card-body"
                                            style={{overflowX: 'auto'}}
                                        >
                                            <div
                                                className="brackets"

                                            >
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h3 style={{
                                                            color: "#00355B",
                                                            textAlign: "left",
                                                            marginLeft: "10px"
                                                        }}>
                                                            <strong>{data && data.battle && data.battle.tournamentName ? data.battle.tournamentName : ''}</strong>
                                                        </h3>
                                                    </div>

                                                </div>

                                                {data && data.battle && data.battle.battles ? data.battle.battles.map((datas) =>
                                                <>
                                              
                                                    <TablePool ListData={datas} type={'show'} index={0}
                                                    advanceToNextRound={data.advanceToNextRound} enableWinner={data.enable_final}/>
                                                    </>
                                                ) : ''}

                                                <br/>
                                                <div>
                                                    <h6>
                                                        <strong> Brought to you by - </strong>
                                                    </h6>
                                                    <img style={{height: '80px'}} src={data.battle.sponserLogo} alt=""/>
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                    :
                                    (
                                        ""
                                    )}
                        </div>
                    </React.Fragment>
                ))
                : ''}
        </div>
    );
};
export default Stagebattle;
