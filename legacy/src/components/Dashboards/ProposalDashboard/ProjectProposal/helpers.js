import React from "react";
import { Tag } from "antd";
import { Status } from "./constants";

export const getStatusTagColor = (status) => {
  switch (status) {
    case Status.NEW:
      return "blue";
    case Status.REVIEWING:
      return "orange";
    case Status.ACCEPTED:
      return "green";
    case Status.REJECTED:
      return "red";
  }
};
