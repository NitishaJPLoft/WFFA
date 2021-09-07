import React from "react";
import CloseIcon from '@material-ui/icons/Close';

const SelectPoolPanel = ({selectCompetitors, members, index, i, data, groupCompetitors, handleRemove}) => {

    return (
        <React.Fragment>
            {groupCompetitors && groupCompetitors[index] && groupCompetitors[index].competitorData && groupCompetitors[index].competitorData[i] ?

                <table className="final-sec table" style={{marginBottom: 0, width: '60%'}}>
                    <tbody>
                    <tr className='dropArea' style={{width: '100%'}}>
                        <td style={{width: '5%'}}>{i + 1}</td>
                        <td style={{width: '5%'}}>
                            <img src={groupCompetitors && groupCompetitors[index] &&
                            groupCompetitors[index].competitorData && groupCompetitors[index].competitorData[i] ?
                                groupCompetitors[index].competitorData[i].avatarURL : ""} alt="img"/>
                        </td>

                        <td style={{width: '35%'}}>
                            {groupCompetitors && groupCompetitors[index] && groupCompetitors[index].competitorData &&
                            groupCompetitors[index].competitorData[i] ? groupCompetitors[index].competitorData[i].name : ""}
                        </td>
                        <td style={{width: '20%', textAlign: 'center'}}>
                            {groupCompetitors && groupCompetitors[index] &&
                            groupCompetitors[index].competitorData && groupCompetitors[index].competitorData[i] ?
                                groupCompetitors[index].competitorData[i].username : ""}
                        </td>
                        <td style={{width: '25%'}}>
                            {groupCompetitors && groupCompetitors[index] && groupCompetitors[index].competitorData
                            && groupCompetitors[index].competitorData[i] ? groupCompetitors[index].competitorData[i].country : ""}
                        </td>
                        <td style={{textAlign: 'end', width: '10%'}}>
                            <CloseIcon onClick={(e) => handleRemove(index, i)}/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                :
                <div className="row mb-1 abc">
                    <div style={{width: '4%', margin: '20px'}}>
                        <span>{i + 1}</span>
                    </div>

                    <div style={{width: '40%'}}>
                        <div id="custom-select">

                            <select onChange={e => selectCompetitors(e.target.value, i, index, data)}
                                    value={members || []} >
                                <option value="">Select</option>
                                {members
                                    ? members.map((memberData, index) => (
                                        <React.Fragment key={index}>
                                            <option value={memberData.id}>{memberData.name}</option>
                                        </React.Fragment>
                                    ))
                                    : ''}
                            </select>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
};

export default SelectPoolPanel;