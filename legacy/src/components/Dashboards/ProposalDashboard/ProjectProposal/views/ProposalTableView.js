import React from "react";
import history from "../../../../../history";
import { Table, Tag, Space, Typography, Popover } from "antd";
import { Button } from "react-bootstrap";
import * as _ from "lodash";
import { getStatusTagColor } from "../helpers";
import { StatusCBs } from "../constants";
import { BSViewButton } from "../../../../ReusableComponents/Buttons/BSButton";
import { timeAgo } from "../../../../../utils/TimeAgo";
const { Title, Text, Paragraph, Link } = Typography;
export const ProposalTableView = ({
  data,
  keyedBranches,
  keyedDepartments,
  keyedUsers,
}) => {
  const columns = [
    {
      title: "Submitted",
      dataIndex: "created",
      key: "created",
      defaultSortOrder: "descend",
      sorter: (a, b) => {
        return Date.parse(a.created) - Date.parse(b.created);
      },
      render: (created) => {
        const dateObj = new Date(Date.parse(created));
        return (
          <Popover
            content={timeAgo.format(Date.parse(created)) || "Invalid Date"}
          >
            <span>{dateObj.toLocaleString()}</span>
          </Popover>
        );
      },
    },
    {
      title: "Updated",
      dataIndex: "updated",
      key: "updated",
      sorter: (a, b) => {
        return Date.parse(a.updated) - Date.parse(b.updated);
      },
      render: (updated) => {
        const dateObj = new Date(Date.parse(updated));
        return (
          <Popover
            content={timeAgo.format(Date.parse(updated)) || "Invalid Date"}
          >
            <span>{dateObj.toLocaleString()}</span>
          </Popover>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        ..._.map(StatusCBs, (ele) => {
          return {
            text: ele.label,
            value: ele.value,
          };
        }),
      ],
      onFilter: (value, record) => {
        console.log("onFilter status", value, record);
        const strStatus = record.status.toString().toLowerCase();
        return strStatus == value;
      },
      render: (status) => {
        const color = getStatusTagColor(status);
        return (
          <Tag color={color}>{status && status.toString().toUpperCase()}</Tag>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => {
        return (
          <Paragraph
            className="m-0"
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: "more",
            }}
          >
            {title || "No Title"}
          </Paragraph>
        );
      },
    },
    {
      title: "Branch",
      dataIndex: "branch",
      key: "branch",
      filters: [
        ..._.map(keyedBranches, (ele) => {
          return {
            text: ele.label,
            value: ele.value,
          };
        }),
      ],
      onFilter: (value, record) => record.branch.includes(value),
      render: (b) => {
        const branch =
          keyedBranches && keyedBranches[b] && keyedBranches[b].label;
        return <Tag color={"cyan"}>{branch}</Tag>;
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: [
        ..._.map(keyedDepartments, (ele) => {
          return {
            text: ele.label,
            value: ele.value,
          };
        }),
      ],
      onFilter: (value, record) => record.department.includes(value),
      render: (d) => {
        const department =
          keyedDepartments && keyedDepartments[d] && keyedDepartments[d].label;
        return <Tag color={"purple"}>{department}</Tag>;
      },
    },
    {
      title: "Primary Author",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (authorUID) => {
        const keyedUser = keyedUsers[authorUID];
        const displayName = keyedUser && keyedUser.displayName;
        const email = keyedUser && keyedUser.email;
        return (
          <Tag key={`createdBy-${authorUID}`} color={"volcano"}>
            {displayName || email || ""}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record) => {
        return (
          <Button
            onClick={() => history.push(`/proposals/${record.uid}`)}
            size={"sm"}
          >
            View
          </Button>
        );
      },
    },
  ];
  return (
    <Table
      pagination={{ showSizeChanger: true, position: ["topRight"] }}
      rowKey={(record) => record.uid}
      columns={columns}
      size="small"
      expandable={{
        expandedRowRender: (record) => (
          <p style={{ margin: 0 }}>{record.status}</p>
        ),
      }}
      dataSource={data}
    />
  );
};
