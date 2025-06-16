import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import {EMPTY_CARD} from "./Card";

const DealerHand = (props: { card1: string, card2: string, card3: string, card4: string, card5: string }) => (
    <Container>
        <Row>
            <Col lg={4}></Col>
            <Col lg={2}>
                <div>
                    <img alt="deck" src={props.card1}/>
                </div>
            </Col>
            <Col lg={2}>
                <div>
                    <img alt="deck" src={props.card2}/>
                </div>
            </Col>
            <Col lg={2}>
                <div>
                    <img alt="deck" src={props.card3} hidden={props.card2 === EMPTY_CARD.src}/>
                </div>
            </Col>
            <Col lg={2}>
                <div>
                    <img alt="deck" src={props.card4} hidden={props.card3 === EMPTY_CARD.src}/>
                </div>
            </Col>
            <Col lg={2}>
                <div>
                    <img alt="deck" src={props.card5} hidden={props.card4 === EMPTY_CARD.src}/>
                </div>
            </Col>
        </Row>
    </Container>
);

export default DealerHand
