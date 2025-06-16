import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";

export const DealerDeck = () => {
    return (
        <Container>
            <Row>
                <Col lg={10}>
                </Col>
                <Col lg={2}>
                    <img alt="deck" src={"cards/back.png"}/>
                </Col>
            </Row>
        </Container>
    )
}