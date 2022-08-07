import { db } from "../../firebase";
import { notification, message } from "antd";
import { getDefaultMetaFields } from "./util";
export const loading = (type, val) => (dispatch) => {
  dispatch({
    type: type,
    payload: val,
  });
};

export const receivedError = (type, errorObj) => (dispatch) => {
  dispatch({
    type: type,
    payload: errorObj,
  });
};

export const receivedMessage = (type, data) => (dispatch) => {
  dispatch({
    type: type,
    payload: data || { message: "" },
  });
};

export const logError = (type, errObj) => (dispatch) => {
  console.error("logError", type, errObj);
  dispatch({
    type: type,
    payload: errObj,
  });
};

export const systemNotify = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

export const systemMessage = (type, msg) => {
  switch (type) {
    case "error":
      message.error(msg);
      break;
    case "success":
      message.success(msg);
      break;
    case "info":
      message.info(msg);
      break;
    case "warning":
      message.warning(msg);
      break;
  }
};

export const resetMessage = (type, data, milliSeconds) => (dispatch) => {
  setTimeout(() => {
    dispatch(receivedMessage(type, data.message || ""));
  }, milliSeconds);
};

export const createNotification = (dataObj) => {
  const { targetedUsers, title, message, link } = dataObj;
  console.log("createNotification", dataObj);
  if (targetedUsers && targetedUsers.length > 0 && title && message && link) {
    targetedUsers.forEach(async (userId) => {
      const ref = db.collection("notifications").doc();
      console.log("createNotification userId", userId);
      await ref.set({
        targetedUser: userId,
        title,
        message,
        link,
        viewed: false,
        uid: ref.id,
        ...getDefaultMetaFields(),
      });
      return Promise.resolve();
    });
  } else {
    console.error("Failed to create a notification!", title, message, link);
    Promise.reject("Could not create a notification");
  }
};
