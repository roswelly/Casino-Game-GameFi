import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import {Nav} from "react-bootstrap";

export const Navegacion = () => {
    return <Navbar>
        <Container>
            <Navbar.Brand href="#home">Blackjack</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
};
