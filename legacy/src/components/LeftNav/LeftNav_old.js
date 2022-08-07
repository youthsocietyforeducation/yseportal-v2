import React from "react";
import { connect } from "react-redux";
import { Accordion, Card, ListGroup, Form, Container } from "react-bootstrap";
import { LEFT_NAV_SEARCH_INDEX } from "../../redux/search";
import {
	setOriginalState,
	updateSearchResults,
} from "../../redux/actions/navActions";
import { Loading } from "element-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { getSearchTerm } from "../../search/searchUtil";

class LeftNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			typing: false,
			typingId: -1, // for detecting whether we are typing
			menus: {},
		};
	}

	componentDidUpdate = (prevProps) => {
		const currAccount = this.props.account;
		const prevAccount = prevProps.account;

		if (currAccount != null && prevAccount == null) {
			this.props.setOriginalState();
		}
	};

	renderChildrenList = (children) => {
		return children.map((child, index) => {
			const { onClick } = child;
			return (
				<ListGroup.Item
					key={index}
					action
					onClick={() => {
						onClick && onClick();
					}}>
					{child.title || "Menu Option"}
				</ListGroup.Item>
			);
		});
	};

	renderChildren = (navItem) => {
		const { children, title } = navItem;
		return (
			<Accordion.Collapse eventKey={title}>
				<Card.Body className="p-0 pl-3">
					<ListGroup>{this.renderChildrenList(children || [])}</ListGroup>
				</Card.Body>
			</Accordion.Collapse>
		);
	};

	onNavMenuClick = (e, onClick) => {
		if (onClick) {
			onClick();
		}
	};

	renderNavMenu = (leftNav) => {
		if (leftNav) {
			return (
				<>
					{leftNav.map((navItem, index) => {
						const { title, icon, children, onClick, roles } = navItem;
						const accordionKey = `${navItem.title}-${index}`;
						return (
							<Accordion
								defaultActiveKey={title}
								onClick={onClick}
								key={accordionKey}>
								<Card>
									{/* <Card.Header> */}
									<Accordion.Toggle
										className="w-100 text-left"
										as={Card.Header}
										variant="link"
										eventKey={title}>
										<span>{icon ? <FontAwesomeIcon icon={icon} /> : null}</span>
										<span className="ml-2 mr-2">{title || "Menu Header"}</span>
										<span className="text-danger">
											{roles ? <FontAwesomeIcon icon={faUserLock} /> : null}
										</span>
										<span className="ml-2">
											{children ? <FontAwesomeIcon icon={faCaretDown} /> : null}
										</span>
									</Accordion.Toggle>
									{/* </Card.Header> */}
									{children ? this.renderChildren(navItem) : null}
								</Card>
							</Accordion>
						);
					})}
				</>
			);
		} else {
			return <Loading></Loading>;
		}
	};

	onLeftNavSearch = (e) => {
		const searchTerm = getSearchTerm(e);
		const res = LEFT_NAV_SEARCH_INDEX.search(searchTerm);
		console.log("lunr res", res);
		this.props.updateSearchResults(res);
	};

	render = () => {
		const { filteredLeftNav } = this.props;
		return (
			<div id="leftNav">
				<Container>
					<Form.Group>
						<Form.Control
							onChange={(e) => this.onLeftNavSearch(e)}
							type="text"
							placeholder="Search ..."
						/>
					</Form.Group>
				</Container>
				{this.renderNavMenu(filteredLeftNav)}
			</div>
		);
	};
}

const mapStateToProps = (state) => {
	return {
		account: state.auth.account,
		user: state.auth.user,
		filteredLeftNav: state.nav.filteredLeftNav,
	};
};
export default connect(mapStateToProps, {
	setOriginalState,
	updateSearchResults,
})(LeftNav);
