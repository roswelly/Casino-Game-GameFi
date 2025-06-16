import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import {EMPTY_CARD} from "./Card";

const PlayerHand = (props: { card1: string, card2: string, card3: string, card4: string, card5: string }) => (
    <Container>
        <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
                <img alt="deck" src={props.card1}/>
                <img alt="deck" src={props.card2} hidden={props.card1 === EMPTY_CARD.src}/>
                <img alt="deck" src={props.card3} hidden={props.card2 === EMPTY_CARD.src}/>
                <img alt="deck" src={props.card4} hidden={props.card3 === EMPTY_CARD.src}/>
                <img alt="deck" src={props.card5} hidden={props.card4 === EMPTY_CARD.src}/>
            </Col>
            <Col lg={2}></Col>
        </Row>
    </Container>
);

export default PlayerHand
