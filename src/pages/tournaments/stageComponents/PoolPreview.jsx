import React, {useEffect, useState} from "react";
import {apiCall, BASE_URL} from '../../../helper/fetch';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row(props) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell/>

                <TableCell component="th" scope="row" style={{width: '20%'}}>
                    {row.name}
                </TableCell>
                <TableCell align="right"
                           style={{width: '5%'}}>{new Date(row.startDate).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases" style={{width: '85%'}}>
                                <TableBody>
                                    {row.battle.map((roundRow, index) => (

                                        <TableRow key={roundRow.date}>
                                            <TableCell component="th" scope="row"
                                                       style={{borderBottom: "none", color: 'blue'}}>
                                            </TableCell>
                                            <TableCell component="th" scope="row"
                                                       style={{borderBottom: "none", color: 'blue'}}>
                                            </TableCell>
                                            <TableCell component="th" scope="row"
                                                       style={{borderBottom: "none", color: 'blue'}}>
                                            </TableCell>
                                            <TableCell component="th" scope="row"
                                                       style={{borderBottom: "none", color: 'blue'}}>
                                            </TableCell>

                                            <TableCell component="th" scope="row"
                                                       style={{borderBottom: "none", color: 'blue'}}>
                                                <img src={roundRow.player1.avatarURL} style={{width: '10%'}}
                                                     alt="img"/> {roundRow.player1.displayName}
                                            </TableCell>
                                            <TableCell style={{borderBottom: "none", color: 'blue'}}
                                                       align="left"> vs</TableCell>


                                            <TableCell style={{borderBottom: "none", color: 'blue'}}
                                                       align="left"> <img src={roundRow.player1.avatarURL}
                                                                          style={{width: '10%'}}
                                                                          alt="img"/> {roundRow.player2.displayName}
                                            </TableCell>


                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

export default function PoolPreview({stageId}) {

    const [poolDetail, setPoolDetail] = useState();
    const [check, setCheck] = useState(false);

    const Pool = async () => {
        let url = BASE_URL + 'tournament/poolPreview?stageId=' + stageId;
        const response = await apiCall('GET', url);
        if (response.status === 200) {
            setPoolDetail(response.data);
            setCheck(true)
        }
    };

    useEffect(() => {
        if (!check) {
            Pool();
        }
    }, [Pool]);

    return (
        <TableContainer component={Paper} style={{marginBottom: '30px'}}>
            <h2 style={{margin: "10px"}}>
                <strong>Total Battle: {poolDetail && poolDetail.totalBattle ? poolDetail.totalBattle : ''}</strong>
            </h2>
            {poolDetail && poolDetail.groupDetail ? poolDetail.groupDetail.map((ListData,index) =>
                <React.Fragment>
                    {ListData && ListData.rounds ? ListData.rounds.map((row,i) => (
                        <React.Fragment>
                             {row.battle.length?
                            <h3 style={{marginLeft: '20px', marginTop: '20px'}}>
                               
                               
                                {ListData && ListData.groupName ? ListData.groupName : ''} - {row.name}
                            </h3>
                            :''}
                            {row.battle.map((roundRow, index) => (
                                <div style={{textAlign: 'center', width: '80%', marginTop: '10px'}}>
                                    <div className="row" style={{display: 'flex', alignItems: 'center'}}>
                                        <div className="col-md-1"/>
                                        <div className="col-md-4" style={{textAlign: 'left'}}>
                                            <img src={roundRow.player1.avatarURL} style={{width: '15%', marginRight: '5px'}} alt="img"/>
                                            {roundRow.player1.displayName}
                                        </div>
                                        <div className="col-md-2" style={{textAlign: 'left'}}>vs</div>
                                        <div className="col-md-4" style={{textAlign: 'left'}}>
                                            <img src={roundRow.player2.avatarURL} style={{width: '15%', marginRight: '5px'}} alt="img"/>
                                            {roundRow.player2.displayName}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )) : ''}
                    <hr/>
                </React.Fragment>
            ) : ''}

        </TableContainer>
    );
}

