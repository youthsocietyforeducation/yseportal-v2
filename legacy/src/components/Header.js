import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../redux/actions/authActions";
import { Navbar, Nav, Image } from "react-bootstrap";
import { Menu, Avatar, List, Drawer, Alert, Tag, Badge } from "antd";
import { timeAgo } from "../utils/TimeAgo";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import history from "../history";

const { SubMenu } = Menu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotifications: false,
    };
  }

  render() {
    const { account, defaultProfileURL, notifications } = this.props;
    const displayName = account && account.displayName;
    const profileImageURL = account && account.profileImageURL;
    const uid = account && account.uid;
    // const { firstName, lastName } = account;
    console.log("Header notifications", notifications);
    const { showNotifications } = this.state;

    return (
      <div className="border-bottom px-2 pt-2 d-flex justify-content-between">
        <Link className="i-logo" to={"/"}>
          <div className="pb-1">
            <Image
              className="yselogo img-fluid"
              src="/yselogo.png"
              alt="YSE Logo"
            ></Image>
            <span className="font-weight-bold font-large theme-color">
              Yseportal
            </span>
          </div>
        </Link>

        {uid ? (
          <Menu
            subMenuCloseDelay={0.2}
            selectedKeys={["#"]}
            className="i-menu d-flex justify-content-end"
            onClick={this.handleClick}
            mode="horizontal"
          >
            <Menu.Item
              className="i-nav-menu-item"
              icon={
                <Badge
                  offset={[10, 0]}
                  count={notifications && notifications.length}
                  overflowCount={999}
                >
                  <BellOutlined />
                </Badge>
              }
              key="notifications"
              onClick={() => {
                this.setState({
                  showNotifications: true,
                });
              }}
            ></Menu.Item>
            <SubMenu
              key="SubMenu"
              title={
                <>
                  {profileImageURL ? (
                    <Avatar
                      className="mr-2"
                      src={<Image src={profileImageURL || defaultProfileURL} />}
                    />
                  ) : (
                    <Avatar
                      className="mr-2"
                      style={{
                        backgroundColor: "#87d068",
                      }}
                      icon={<UserOutlined />}
                    />
                  )}
                  <span>{displayName || "My Account"}</span>
                </>
              }
            >
              <Menu.Item
                onClick={() => {
                  history.push(`/account/profile/${uid}`);
                }}
              >
                Account Settings
              </Menu.Item>
              <Menu.Item onClick={this.onLogOutClicked}>Signout</Menu.Item>
            </SubMenu>
          </Menu>
        ) : null}
        <Drawer
          title={<h3>Notifications</h3>}
          className="i-notification-drawer"
          placement="right"
          width="350"
          closable={false}
          onClose={this.closeNotification}
          visible={showNotifications}
        >
          <List
            bordered
            dataSource={notifications || []}
            renderItem={(item) => {
              const updated =
                timeAgo.format(Date.parse(item.created)) || "Invalid Date";
              return (
                <Alert
                  description={
                    <Link
                      target="_blank"
                      to={`${item.link}`}
                      className="d-flex justify-content-between"
                    >
                      <div>
                        <span className="i-notification-title">
                          {item.title}
                        </span>
                        <div className="text-muted">{item.message}</div>
                        <span className="text-warning">{updated}</span>
                      </div>
                      <span className="i-notification-item d-flex flex-column justify-content-center">
                        {!item.viewed ? <Badge status="processing" /> : <></>}
                      </span>
                    </Link>
                  }
                  type="default"
                  closable
                  onClose={() => {}}
                />
              );
            }}
          />
        </Drawer>
      </div>
    );
  }

  closeNotification = () => {
    this.setState({
      showNotifications: false,
    });
  };

  renderAccountButton = () => {
    if (this.props.user) {
      return (
        <div className="dropdown i-dropdown">
          <button
            className="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.renderButtonText(this.props.account)}
          </button>

          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="dropdownMenuButton"
          >
            <Link to={`/account/profile/${this.props.user.uid}`}>
              <span className="dropdown-item">Account Settings</span>
            </Link>
            <span className="dropdown-item" onClick={this.onLogOutClicked}>
              Logout
            </span>
          </div>
        </div>
      );
    } else if (!this.props.user) {
      return <></>;
    } else {
      return <div> Loading ... </div>;
    }
  };

  renderButtonText = (account) => {
    const { defaultProfileURL } = this.props;
    if (
      account &&
      account.firstName &&
      account.lastName &&
      account.profileImageURL
    ) {
      return (
        <span className="d-inline-block">
          <span className="rounded-circle">
            <img
              style={{ width: "50px", height: "50px" }}
              className="mr-2 img-fluid border border-primary rounded-circle"
              src={account.profileImageURL || ""}
              alt={"Profile Picture"}
            />
          </span>
          <span className="m-0 text-uppercase font-weight-bold">{`${account.firstName} ${account.lastName}`}</span>
        </span>
      );
    } else if (
      account &&
      account.firstName &&
      account.lastName &&
      defaultProfileURL
    ) {
      return (
        <span className="d-inline-block">
          <span className="rounded-circle">
            <img
              style={{ width: "50px", height: "50px" }}
              className="mr-2 img-fluid border border-primary rounded-circle"
              src={defaultProfileURL}
              alt="Default profile pic"
            />
          </span>
          <span className="m-0 text-uppercase font-weight-bold">{`${account.firstName} ${account.lastName}`}</span>
        </span>
      );
    } else {
      return <span>My Account</span>;
    }
  };

  onLogOutClicked = () => {
    this.props.signOut();
  };
}

const mapStateToProps = (state) => {
  console.log("Header.js", state);
  return {
    user: state.auth.user,
    account: state.auth.account,
    defaultProfileURL: state.system.defaultProfileURL,
    notifications: state.auth.notifications,
  };
};

export default connect(mapStateToProps, { signOut })(Header);
