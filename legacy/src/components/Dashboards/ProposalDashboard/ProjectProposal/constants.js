import React from "react";
import {
  fetchActivities,
  startReview,
  requestMoreInfo,
  updateCurrentStage,
} from "../../../../redux/actions";
export const Status = {
  NEW: "NEW",
  REVIEWING: "REVIEWING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export const StatusCBs = [
  { label: "New", value: "new" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Accepted", value: "accepted" },
  { label: "Rejected", value: "rejected" },
];

export const ViewTypes = {
  TABLE: "TABLE",
  LIST: "LIST",
};
export const StageEnum = {
  Submitted: "Submitted",
  Reviewing: "Reviewing",
  Approval: "Approval",
  Acceptance: "Acceptance",
};
export const Stages = [
  {
    label: "Submitted",
    step: 0,
    actions: [],
    finish: {
      btnText: "Start Review",
      func: (dataObj) => {
        console.log("Stage: Start Review");
        const { proposalId } = dataObj;
        const action = PROPOSAL_ACTIONS.REVIEW_STARTED;
        const message = "started reviewing the project proposal";
        return updateCurrentStage({
          proposalId,
          currentStage: 0,
          message: "finished reviewing the project proposal",
          action: PROPOSAL_ACTIONS.REVIEW_STARTED,
        });
      },
    },
  },
  {
    label: "Reviewing",
    step: 1,
    actions: [
      {
        label: "Request More Information",
        func: (dataObj) => {
          const { proposalId } = dataObj;
          requestMoreInfo({ proposalId });
        },
      },
      {
        label: "Toggle Edit",
        func: (dataObj) => {},
      },
    ],
    finish: {
      btnText: "Finish Reviewing",
      func: (dataObj) => {
        console.log("Stage: Finish Reviewing");
        // const { proposalId } = dataObj;
        // updateCurrentStage({
        // 	proposalId,
        // 	currentStage: 1,
        // 	message: "finished reviewing the project proposal",
        // 	action: "",
        // });
      },
    },
  },
  {
    label: "Approval",
    step: 2,
    actions: [],
    finish: {
      btnText: "Finalize",
      func: (dataObj) => {
        console.log("Stage: Finalize");
        // const { proposalId } = dataObj;
        // updateCurrentStage({
        // 	proposalId,
        // 	currentStage: 1,
        // 	message: "finished reviewing the project proposal",
        // 	action: "",
        // });
      },
    },
  },
  {
    label: "Acceptance",
    step: 3,
    actions: [],
    finish: {
      btnText: "Start Review",
      func: (dataObj) => {
        console.log("Stage: Acceptance");
        // const { proposalId } = dataObj;
        // updateCurrentStage({
        // 	proposalId,
        // 	currentStage: 1,
        // 	message: "finished reviewing the project proposal",
        // 	action: "",
        // });
      },
    },
  },
];

export const PROPOSAL_ACTIONS = {
  SUBMITTED: "Submitted",
  COMMENTED: "Commented",
  REVIEW_STARTED: "Review Started",
  FINISHED_REVIEWING: "Finished Reviewings",
};

export const PROPOSALS = "proposals";
