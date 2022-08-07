import React from "react";
import { connect } from "react-redux";
import lunr from "lunr-mutable-indexes";
import { Menu, Button, Input, Spin, Tag } from "antd";
import Icon, {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  SearchOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { setOriginalState, updateSearchResults } from "../../redux/actions";
import { LEFT_NAV } from "./constants";
import { getIcon } from "./constants";
import { LEFT_NAV_SEARCH_INDEX } from "../../redux/search";
import { getSearchTerm, getFilteredResults } from "../../search/searchUtil";
import * as _ from "lodash";
import history from "../../history";
/**
 * this class exposes the roles to the users but it doesn't really matter
 * since there isn't a lot of information
 */
const { SubMenu } = Menu;
class LeftNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultOpenKeys: [],
    };
  }

  componentDidUpdate = (prevProps) => {
    const currAccount = this.props.authAccount;
    const prevAccount = prevProps.authAccount;

    if (currAccount != null && prevAccount == null) {
      this.props.setOriginalState();
    }
  };

  onLeftNavSearch = (e) => {
    const searchTerm = getSearchTerm(e);
    const res = LEFT_NAV_SEARCH_INDEX.search(searchTerm);
    console.log("lunr res", res);
    this.props.updateSearchResults(res);
  };

  onMenuItemClick = (path) => {
    history.push(path);
  };

  render() {
    const { loading, defaultOpenKeys } = this.state;
    const { authAccount, filteredLeftNav } = this.props;
    return (
      <Menu
        defaultSelectedKeys={["#"]}
        defaultOpenKeys={[...defaultOpenKeys]}
        mode="inline"
        theme="light"
      >
        <div className="w-100 p-2">
          <Input
            className="w-100"
            onChange={this.onLeftNavSearch}
            allowClear
            placeholder={"Search ..."}
            prefix={<SearchOutlined />}
          />
        </div>
        {filteredLeftNav &&
          filteredLeftNav.map((navItem, index) => {
            console.log("navItem navItem.icon Search", <SearchOutlined />);
            console.log("navItem navItem.icon", navItem.icon);
            const { roles, onClick } = navItem;
            if (!navItem.children) {
              return (
                <Menu.Item
                  onClick={() => {
                    this.onMenuItemClick(navItem.path);
                  }}
                  key={navItem.title}
                  icon={navItem.icon && navItem.icon()}
                >
                  {navItem.title || "Menu Option"}
                  {roles ? (
                    <UnlockOutlined className="ml-2 text-danger" />
                  ) : null}
                </Menu.Item>
              );
            } else {
              return (
                <SubMenu
                  key={`${navItem.title}`}
                  icon={navItem.icon && navItem.icon()}
                  title={
                    <>
                      {navItem.title || "Menu Option"}
                      {roles ? (
                        <UnlockOutlined className="ml-2 text-danger" />
                      ) : null}
                    </>
                  }
                >
                  {navItem.children &&
                    navItem.children.map((childNav, childIndex) => {
                      return (
                        <Menu.Item
                          key={childNav.title}
                          onClick={() => {
                            this.onMenuItemClick(childNav.path);
                          }}
                          ey={childNav.title}
                          icon={null}
                        >
                          {childNav.title || "Child Menu Title"}
                        </Menu.Item>
                      );
                    })}
                </SubMenu>
              );
            }
          })}
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authAccount: state.auth && state.auth.account,
    filteredLeftNav: state.nav.filteredLeftNav,
  };
};

export default connect(mapStateToProps, {
  setOriginalState,
  updateSearchResults,
})(LeftNav);
