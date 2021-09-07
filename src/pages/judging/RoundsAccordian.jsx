import React from 'react';
import {Accordion, Card} from "react-bootstrap";
import RawVideos from './RawVideos';

const RoundsAccordian = props => {
    const {player1, player2, rawVideo1, rawVideo2, handleChangeForPlayer} = props;
    const [idx, setIdx] = React.useState([]);

    return (
        <React.Fragment>
            <Accordion key={1} defaultActiveKey={1}>
                <Card>
                    <Accordion.Toggle as={Card.Header} className="text-left" style={{cursor: 'pointer'}} eventKey={1}
                                      onClick={() => {
                                          if (idx.includes(1)) setIdx(idx.filter(i => i !== 1));
                                          else setIdx([...idx, 1]);
                                      }}>
                        <strong>Competitor Name: </strong>{player1}
                        {idx.includes(1) ? (
                                <i className="fa fa-angle-down" style={{float: 'right', fontWeight: 'bold', fontSize: '22px'}}/> ) : (
                                <i className="fa fa-angle-right" style={{float: 'right', fontWeight: 'bold', fontSize: '22px'}}/>
                            )}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={1}>
                        <Card.Body>
                            <RawVideos rawVideos={rawVideo1} handleChangeForPlayer={handleChangeForPlayer}
                                       player="1" />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <Accordion key={2} defaultActiveKey={2}>
                <Card>
                    <Accordion.Toggle as={Card.Header} className="text-left" style={{cursor: 'pointer'}} eventKey={2}
                                      onClick={() => {
                                          if (idx.includes(2)) setIdx(idx.filter(i => i !== 2));
                                          else setIdx([...idx, 2]);
                                      }}>
                        <strong>Competitor Name: </strong>{player2}
                        {idx.includes(2) ? (
                            <i className="fa fa-angle-down" style={{float: 'right', fontWeight: 'bold', fontSize: '22px'}}/> ) : (
                            <i className="fa fa-angle-right" style={{float: 'right', fontWeight: 'bold', fontSize: '22px'}}/>
                        )}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={2}>
                        <Card.Body>
                            <RawVideos rawVideos={rawVideo2} handleChangeForPlayer={handleChangeForPlayer}
                                       player="2" />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </React.Fragment>
    )
};

export default RoundsAccordian;
