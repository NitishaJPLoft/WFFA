import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
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
    const {row,indexNo,enableWinner,advanceToNextRound} = props;

    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const styleVar=(enableWinner===1?(indexNo < advanceToNextRound ?"#e9e9e9":'#ffffff'):'#ffffff');
    

    return (
        <React.Fragment>
            <TableRow className={classes.root} style={{background:styleVar}}>
                <TableCell component="th" scope="row" style={{width: '30%'}}>
                    {row.playerName?
                    <>
                    <img src={row.profileImage} style={{height: '40px'}} alt="img"/>  {row.playerName}</>
                    :''}
                </TableCell>

                <TableCell component="th" scope="row" style={{width: '10%'}}>
                  
                </TableCell>
                <TableCell component="th" scope="row">
                    <embed style={{height: '40px' , width:"40px" , borderStyle: "solid"}} src={row.countryFlagUrl}  alt="flag"/>
                </TableCell>

                <TableCell align="right" style={{width: '5%'}}>{row.win}</TableCell>
                <TableCell align="right" style={{width: '5%'}}>{row.loses}</TableCell>
                <TableCell align="center" style={{width: '5%'}}>{row.votes}</TableCell>
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
                                    {row.rounds.map((roundRow) => (

                                        <TableRow key={roundRow.roundId}>

                                            <TableCell component="th" scope="row"
                                                       style={{borderBottom: "none", color: 'blue'}}>
                                                {roundRow.roundName}
                                            </TableCell>
                                            <TableCell style={{
                                                borderBottom: "none",
                                                color: 'blue'
                                            }}>{new Date(roundRow.startDate).toLocaleDateString()}</TableCell>

                                            <TableCell style={{borderBottom: "none", color: 'blue'}}
                                                       align="left">vs {roundRow.opponentPlayer}</TableCell>
                                            <TableCell style={{borderBottom: "none", color: 'blue'}}
                                                       align="right">{roundRow.winOrLose}</TableCell>
                                            <TableCell style={{borderBottom: "none", color: 'blue'}}
                                                       align="right">{roundRow.videoLink === "-"|| roundRow.videoLink=== "" ||roundRow.videoLink=== null?"-": <a href={roundRow.videoLink}  target="_blank"
                                                       rel="noreferrer">Video Link</a>
                                        }</TableCell>

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

export default function TablePool({ ListData ,treeDatas, active , index, enableWinner , advanceToNextRound}) {
   
    
    return (
        <TableContainer component={Paper} style={{marginBottom: '30px'}}>
            {ListData && ListData.groupCompetitors[index] && ListData.groupCompetitors[index].user_id === 0?'':
            <Table aria-label="collapsible table">
                <TableHead style={{backgroundColor: '#1d1c73'}}>
                    <TableRow>
                   
                        
                        <TableCell
                            style={{color: 'white'}}>{ListData && ListData.groupName ? ListData.groupName : ''}</TableCell>
                        <TableCell style={{color: 'white'}} align="right"/>
                        <TableCell style={{color: 'white'}} align="right"/>
                        <TableCell style={{color: 'white'}} align="right">W</TableCell>
                        <TableCell style={{color: 'white'}} align="right">L</TableCell>
                        <TableCell style={{color: 'white'}} align="right">Votes</TableCell>
                        <TableCell/>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {ListData && ListData.groupCompetitors ? ListData.groupCompetitors.map((row,key) => (
                        <Row key={row.name} row={row} indexNo={key} enableWinner={enableWinner} advanceToNextRound={advanceToNextRound}/>
                    )) : ''}
                </TableBody>
            </Table>
}
        </TableContainer>
    );
}

