// import fb, { db } from '../../components/FirebaseAuth/config/firebase'; // fireDb,
import { db, fb } from "../../firebase";
import history from "../../history";
import {
  StageEnum,
  Status,
} from "../../components/Dashboards/ProposalDashboard/ProjectProposal/constants";
import {
  uploadFilesToFirebase,
  getUpdateMeta,
  getDefaultMetaFields,
  checkAdminPermission,
  getSubCollectionsWithPath,
  insertSubCollection,
  formatDate,
  getFullName,
  uploadFilesToFirebaseWithAsyncAwait,
} from "./util";
import { pickFields } from "../../utils";
import * as _ from "lodash";
import {
  CHANGED_VIEW,
  SUBMITTED_PROPOSAL,
  FETCHED_PROPOSAL_ADMIN_PERMISSION,
  FETCHED_PROPOSAL_ACTIVITIES,
  UNMOUNTED_PROPOSAL_DATA,
  FILTERED_PROPOSAL,
  SET_SEARCH_VAL,
  PROPOSAL,
} from "../types";
import Propsal from "../../models/Proposal";
import Proposal from "../../models/Proposal";
import {
  systemNotify,
  systemMessage,
  createNotification,
} from "./commonActions";
import {
  Stages,
  PROPOSAL_ACTIONS,
} from "../../components/Dashboards/ProposalDashboard/ProjectProposal/constants";

const PROPOSALS = "proposals";
const ACTIVITIES = "activities";
const COMMENTS = "comments";
const keyedStages = _.keyBy(Stages, "label");
// might need to pass USER ID at some point
// export const getProjectProposals = (roles, userId) => dispatch => {
//   // error handling
//   if (!Array.isArray(roles)) {
//     roles = roles || ''
//     roles = [ roles ]
//   }

//   if (roles.includes('admin')) {
//     return fire.firestore().collection("proposals").get()
//       .then(querySnapshot => {
//         let proposals = []

//         proposals = querySnapshot.docs.map(doc => {

//           let proposal = doc.data()
//           proposal['id'] = doc.id

//           return proposal
//         })

//         dispatch(loadProposals(proposals))
//         return true
//       })
//   }

//   return fire.firestore().collection("proposals")
//     .where("acl.read", "array-contains", userId).get()
//     .then(querySnapshot => {
//       let proposals = []

//       proposals = querySnapshot.docs.map(doc => {

//         let proposal = doc.data()
//         proposal['id'] = doc.id

//         return proposal
//       })

//       dispatch(loadProposals(proposals))
//       return true
//     })
// }

export const unmountForm = (reset, formName) => (dispatch) => {
  dispatch(reset(formName));
  dispatch({
    type: UNMOUNTED_PROPOSAL_DATA,
  });
};

export const loadProposals = (proposals) => {
  return {
    type: PROPOSAL.FETCHED_PROJECT_PROPOSALS,
    payload: proposals,
  };
};

export const fetchProposal = (proposalId) => (dispatch) => {
  let docRef = db.collection(PROPOSALS).doc(proposalId);
  return docRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return Promise.reject();
      }
      const proposal = doc.data();
      dispatch(
        fetchedProposal({
          proposal: { ...proposal },
        })
      );
    })
    .catch((err) => {
      systemMessage(
        "error",
        `Error in getProjectProposal ${(err && err.code) || "code"}: ${
          (err && err.message) || "message"
        }`
      );
      console.log("Error in getting a single project proposal", err);
    });
};

export const fetchedProposal = (data) => (dispatch) => {
  dispatch({
    type: PROPOSAL.FETCHED_PROJECT_PROPOSAL,
    payload: data,
  });
};

export const fetchComments = (dataObj) => (dispatch) => {
  const { proposalId } = dataObj;
  if (!proposalId) {
    systemMessage("error", "Not enough data");
    return Promise.reject();
  }

  const ref = db.collection("proposals").doc(proposalId).collection("comments");
  return ref
    .get()
    .then((snapshot) => {
      const comments = snapshot.docs.map((comment) => {
        return comment.data();
      });
      return Promise.resolve({ comments: comments || [] });
    })
    .then((res) => {
      const { comments } = res;
      const sortedComments = _.sortBy(comments, (comment) => {
        return Date.parse(comment.updated);
      }).reverse();
      dispatch({
        type: PROPOSAL.FETCHED_PROPOSAL_COMMENTS,
        payload: { comments: sortedComments },
      });
    })
    .catch((err) => {
      systemMessage("error", err.message);
      return Promise.reject();
    });
};

export const fetchActivities = (dataObj) => (dispatch) => {
  const { proposalId } = dataObj;
  if (!proposalId) {
    systemMessage("error", "Not enough data");
    return Promise.reject({ message: "proposalId not provided" });
  }

  const ref = db
    .collection("proposals")
    .doc(proposalId)
    .collection("activities");
  return ref
    .get()
    .then((snapshot) => {
      const activities = snapshot.docs.map((activity) => {
        return activity.data();
      });
      const sortedActivities = _.sortBy(activities, (activity) => {
        return Date.parse(activity.created);
      });

      dispatch({
        type: PROPOSAL.FETCHED_PROPOSAL_ACTIVITIES,
        payload: { activities: sortedActivities },
      });
    })
    .catch((err) => {
      systemMessage("error", err.message);
      return Promise.reject();
    });
};

export const insertComment = (dataObj) => (dispatch) => {
  const { proposalId, data, proposal } = dataObj;
  console.log("proposalAction insertComment", dataObj);
  try {
    if (!proposalId || !data) {
      throw new Error("Not enough data!");
    }
    const currUserId = fb.auth().currentUser.uid;
    let path = `proposals/${proposalId}`;
    const ref = db.doc(path).collection("comments").doc();
    return ref
      .set({
        uid: ref.id,
        author: currUserId,
        ...data,
        ...getDefaultMetaFields(),
      })
      .then(() => {
        return dispatch(
          addActivities({
            proposalId,
            currUserId,
            message: data && data.comment,
            action: PROPOSAL_ACTIONS.COMMENTED,
            currentStage: (proposal && proposal.currentStage) || 0,
          })
        );
      })
      .then(() => {
        systemMessage("success", "commented!");
        dispatch(fetchComments({ proposalId }));
      })
      .catch((err) => {
        systemMessage("error", err.message);
      });
  } catch (err) {
    systemMessage("error", err.message);
    return Promise.reject();
  }
};

export const addActivities = (dataObj) => (dispatch) => {
  console.log("addActivities dataObj", dataObj);
  const { proposalId, message, currentStage, action, currUserId } = dataObj;
  if (proposalId && message && currentStage > -1 && action && currUserId) {
    return db
      .doc(`proposals/${proposalId}`)
      .collection("activities")
      .doc()
      .set({
        created: new Date().toString(),
        message: message || "No message",
        action: action || "Action",
        stage: currentStage || 0,
        createdBy: currUserId,
      })
      .then(() => {
        dispatch(fetchActivities({ proposalId }));
      });
  } else {
    return Promise.reject({ message: `addActivities failed! @${message}` });
  }
};

// export const insertComment = (configs) => (dispatch, getState) => {
// 	const { data, collection, collectionId } = configs;
// 	if (collection && collectionId && data) {
// 		let path = `${collection}/${collectionId}`;
// 		return insertSubCollection({
// 			path: path,
// 			subCollection: COMMENTS,
// 			data: { ...getUpdateMeta(), ...data },
// 		}).then(() => {
// 			dispatch(getComments({ collection, collectionId }));
// 		});
// 	}
// };

export const getComments = (configs) => (dispatch, getState) => {
  const { collection, collectionId } = configs;
  if (collection && collectionId) {
    console.log("getComments after if");
    let path = `${collection}/${collectionId}`;
    return getSubCollectionsWithPath(path, COMMENTS)
      .then((res) => {
        console.log("getComments after getSubCollectionsWithPath", res);
        const state = getState();
        const sortedRes = _.sortBy(res, (comment) => {
          return Date.parse(comment.updatedDate);
        }).reverse();
        let comments = sortedRes.map((c) => {
          const updatedDate = c.updatedDate && formatDate(c.updatedDate);
          return { ...c, updatedDate: updatedDate };
        });
        console.log("getComments after map activities", comments);
        return Promise.resolve(comments);
      })
      .then((comments) => {
        dispatch(loadComments(comments));
      })
      .catch((err) => {
        console.log("Error: actions getComments", err);
      });
  }
};

export const loadComments = (comments) => {
  return {
    type: PROPOSAL.FETCHED_PROPOSAL_COMMENTS,
    payload: comments,
  };
};

export const getActivities = ({ collection, collectionId }) => (dispatch) => {
  return getSubCollectionsWithPath(`${collection}/${collectionId}`, ACTIVITIES)
    .then((res) => {
      console.log("getActivities res", res);
      const sortedRes = _.sortBy(res, (activity) => {
        return Date.parse(activity.updatedDate);
      }).reverse();
      console.log("getActivities sortedRes", sortedRes);

      let activities = sortedRes.map((a) => {
        console.log("getActivities a", a);
        const stringDate = a.updatedDate;
        const timezone = stringDate.substring(
          stringDate.indexOf("(") - 1,
          stringDate.indexOf(")") + 1
        );
        const newDateObj = new Date(Date.parse(a.updatedDate));
        return {
          ...a,
          updatedDate: `${newDateObj.toDateString()} ${newDateObj.toLocaleTimeString()} ${timezone}`,
        };
      });
      console.log("getActivities after map activities", activities);
      return Promise.resolve(activities);
    })
    .then((activities) => {
      dispatch(loadActivities(activities));
    })
    .catch((err) => {
      console.log("Error: actions getActivities", err);
    });
};

export const loadActivities = (activities) => {
  return {
    type: FETCHED_PROPOSAL_ACTIVITIES,
    payload: activities,
  };
};

// export const updateProposal = (proposalId, data) => dispatch => {
//   let docRef = fire.firestore().collection("proposals").doc(proposalId);

//   let files = data.files;
//   let proposal = data.proposal;
//   // don't really need submitted by

//   console.log("updateProposal, data.files", files);

//   // TODO: fix the pyramid of doom
//   return docRef.get().then(doc => {
//     if (doc.exists) {
//       console.log("proposal exists: ", doc.data(), "id: ", proposalId);

//       let old_data = doc.data();
//       let meta = old_data.meta;
//       meta.last_updated = new Date().toLocaleString();
//       console.log("pAction: old_meta", meta);

//       return uploadFiles(files, proposal, meta)
//         .then(res => {
//           console.log("updateProposal: fieldValue", fire)
//           console.log("updateProposal: fieldValue", fire.firebase_.firestore)
//           console.log("updateProposal: res", res);

//           return docRef.update({
//             files: fire.firebase_.firestore.FieldValue.arrayUnion(...res)
//           })
//         })
//         .then(() => {

//           console.log("updateProposal: files", files);
//           let dataObj = {
//             ...proposal,
//             meta
//           }

//           return fire.firestore().collection("proposals").doc(proposalId).set(dataObj, {merge: true})
//         })
//         .then(() => {
//           dispatch({ type: SUBMITTED_PROPOSAL })
//           history.push("/proposals")
//           return
//         })
//     } else {
//       console.log("Proposal not found!");
//     }
//   })
//   .catch(err => {
//     console.log("Error in getting a single project proposal", err);
//   })
// }

const isProposalManager = (state) => {
  const { auth } = state;
  console.log("isProposalManager", auth);
  const { account } = auth;
  if (account && account.private && account.private.roles) {
    const rolesNeeded = ["admin", "super_admin", "proposal_admin"];
    return account.private.roles.some((r) => {
      console.log("isProposalManager r", r);
      return rolesNeeded.includes(r);
    });
  }
  return false;
};

export const fetchProposals = () => (dispatch, getState) => {
  let ref = null;
  const currUserId = fb.auth().currentUser.uid;
  if (isProposalManager(getState())) {
    console.log("fetchProposals isProposalManager here");
    ref = db.collection("proposals");
  } else {
    console.log("fetchProposals isProposalManager there");
    ref = db
      .collection("proposals")
      .where("coAuthors", "array-contains", currUserId);
  }
  return ref
    .get()
    .then((snapshot) => {
      console.log("fetchProposals snapshot", snapshot);
      const results = snapshot.docs.map((proposal) => {
        return proposal.data();
      });
      console.log("fetchProposals", results);
      dispatch(loadProposals(results));
    })
    .catch((err) => {
      systemMessage(
        "error",
        `fetchPropoasal failed: ${err.code}: ${err.message}`
      );
      console.error("fetchProposals err", err);
    });
};

export const getProjectProposals = () => (dispatch) => {
  return fb
    .functions()
    .httpsCallable("getProjectProposals")()
    .then((res) => {
      console.log("getProjectProposals Actions: ", res);
      dispatch(loadProposals(res.data));
    })
    .catch((err) => {
      console.log("getProjectProposals", err);
    });
};

export const hasAdminPermission = (collection) => (dispatch) => {
  fb.functions()
    .httpsCallable("hasAdminPermission")({ collection })
    .then((res) => {
      console.log("actions: hasAdminPermission res", res);
      dispatch({ type: FETCHED_PROPOSAL_ADMIN_PERMISSION, payload: res.data });
    })
    .catch((err) => {
      console.log("Error: actions: hasAdminPermission", err);
    });
};

const processAuthors = (data) => {
  const { currUserId, authors } = data;
  const authorUids = pickFields(authors, ["uid"]).map((o) => o.uid);
  if (authorUids.indexOf(currUserId) == -1) {
    authorUids.push(currUserId);
  }

  return authorUids;
};

const addElementInArray = (data) => {
  const { element, arr } = data;
  if (element && arr.indexOf(element) === -1) {
    arr.push(element);
  }
  return arr;
};

const processEmailList = (data) => {
  const { currUserEmail, authors } = data;
  const authorEmails = pickFields(authors, ["email"]).map((o) => o.email);
  if (authorEmails.indexOf(currUserEmail) == -1) {
    authorEmails.push(currUserEmail);
  }

  return authorEmails;
};

const processProposalData = (data) => async (dispatch) => {
  const { title, description, branch, department, authors, files } = data;
  try {
    // authors not required but other fields are required
    if (title && description && branch && department && files) {
      const proposalRef = fb.firestore().collection(PROPOSALS).doc();

      const uid = proposalRef.id;
      const currUserId = fb.auth().currentUser.uid;
      const currUserEmail = fb.auth().currentUser.email;

      let fileUploadPromise;
      if (files && files.length > 0) {
        const fileBasePath = `proposals/${uid}`;
        fileUploadPromise = await uploadFilesToFirebase(files, fileBasePath);
      } else {
        throw new Error({
          message: "Error: File upload failed while submitting proposals",
        });
      }
      const emailList = [];
      if (authors && authors.length > 0) {
        authors = authors.map((author) => author.uid);
        emailList = authors.map((author) => author.email);
      } else {
        authors = [];
      }

      console.log("processProposal fileupload", fileUploadPromise);
      const proposalObj = {
        files: fileUploadPromise,
        ...getDefaultMetaFields(),
        status: Status.NEW,
        authors,
        emailList,
        uid,
        title,
        description,
        branch,
        department,
      };
    } else {
      throw new Error({
        message: "Error: Something went wrong with processing data",
      });
    }
  } catch (e) {
    console.error(e.message);
    // dispatch error methods here
  }
};

export const submitProposal = (dataObj) => async (dispatch) => {
  const { title, description, branch, department, coAuthors, files } = dataObj;
  if (title && description && branch && department && coAuthors && files) {
    const currUserId = fb.auth().currentUser.uid;
    const ref = db.collection("proposals").doc();
    const uid = ref.id;

    // upload the files
    const fileBasePath = `proposals/${uid}`;
    let uploadedFiles = await uploadFilesToFirebaseWithAsyncAwait(
      files,
      fileBasePath
    );

    const combinedAuthors = [...coAuthors, currUserId];
    const finalObj = {
      title,
      description,
      branch,
      department,
      coAuthors: combinedAuthors,
      files: [...uploadedFiles],
      ...getDefaultMetaFields(),
      uid: ref.id,
      status: Status.NEW,
      isComplete: false,
      isEditable: false,
      approvers: [],
      currentStage: 0,
      reviewer: "",
    };

    console.log("submitProposal finalObj", finalObj);
    return ref
      .set(finalObj, { merge: true })
      .then(() => {
        return dispatch(
          addActivities({
            proposalId: ref.id,
            currUserId,
            message: "submitted project proposal",
            action: PROPOSAL_ACTIONS.SUBMITTED,
            currentStage: 0,
          })
        );
      })
      .then(() => {
        return dispatch(
          createNotification({
            targetedUsers: combinedAuthors,
            title: "Proposal Submitted",
            message: "Your proposal will be reviewed promptly",
            link: `/proposals/${ref.id}`,
          })
        );
      })
      .then(() => {
        systemMessage("success", `Success! submitted ${title}`);
        dispatch(fetchProposals());
        return Promise.resolve();
      })
      .catch((err) => {
        systemMessage("err", err.message);
      });
  } else {
    return Promise.reject();
  }
};

export const startReview = (dataObj) => (dispatch) => {
  // const { proposalId } = dataObj;
  // const keyedStages = _.keyBy(Stages, "label");
  // const currentStage = keyedStages[StageEnum.Reviewing].step;
  // const currUserId = fb.auth().currentUser.uid;
  // console.log("startReview ", currentStage);
  // return db
  // 	.doc(`proposals/${proposalId}/private/data`)
  // 	.set({ currentStage }, { merge: true })
  // 	.then(() => {
  // 		return dispatch(
  // 			addActivities({
  // 				proposalId,
  // 				currUserId,
  // 				message: "started reviewing the project proposal",
  // 				action: PROPOSAL_ACTIONS.REVIEW_STARTED,
  // 				currentStage: currentStage,
  // 			})
  // 		);
  // 	})
  // 	.then(() => {
  // 		systemMessage("success", PROPOSAL_ACTIONS.REVIEW_STARTED);
  // 		dispatch(fetchProposal(proposalId));
  // 	})
  // 	.catch((err) => {
  // 		systemMessage(
  // 			"error",
  // 			`Error starting reviewing! ${err.code}:${err.message}`
  // 		);
  // 	});
};

export const requestMoreInfo = (dataObj) => {
  console.log("requestMoreInfo", dataObj);
};

export const updateCurrentStage = (dataObj) => (dispatch) => {
  const { proposalId, message, action, currentStage } = dataObj;
  const currUserId = fb.auth().currentUser.uid;
  return db
    .doc(`proposals/${proposalId}/private/data`)
    .set({ currentStage }, { merge: true })
    .then(() => {
      return dispatch(
        addActivities({
          proposalId,
          currUserId,
          message,
          action,
          currentStage,
        })
      );
    })
    .then(() => {
      systemMessage("success", action || "Success! updateCurrentStage()");
      dispatch(fetchProposal(proposalId));
    })
    .catch((err) => {
      systemMessage(
        "error",
        action + " failed!" || "Error! updateCurrentStage()"
      );
    });
};
/**
 * sets the proposal collection in firebase.
 * the data is assumed to be clean.
 * // TODO: make sure on the server side, the data is valid.
 * @param {*} params
 */
export const setProposal = (params) => (dispatch) => {
  const { uid, data } = params;
  if (uid && data) {
    fb.firestore()
      .collection(PROPOSALS)
      .doc(uid)
      .set(data, { merge: true })
      .then(() => {
        console.log("PROPOSALS: updated");
      });
  }
};

export const updateProposal = (data) => (dispatch) => {
  const {
    initialValues,
    vals,
    vals: { uid },
  } = data;
  if (initialValues && vals) {
    const proposalRef = fb.firestore().collection(PROPOSALS).doc(uid);

    const pickFieldsArray = [
      "title",
      "description",
      "branch",
      "department",
      "authors",
    ];
    const pickedNextVals = _.pick(vals, pickFieldsArray);
    const pickedPrevVals = _.pick(initialValues, pickFieldsArray);
    const diffObj = difference(pickedNextVals, pickedPrevVals);
    console.log("ppform onsubmit diffobj", diffObj);
    const { authors } = diffObj;

    // if ( authors && authors.length > 0) {
    //   diffObj = {
    //     ...diffObj,
    //     authors: addElementInArray({
    //       element: currUserId,
    //       arr: pickFields(authors, ["uid"]).map(o => o.uid) })
    //   }
    // }

    const { files } = vals;
    if (files && files.length > 0 && files instanceof FileList) {
      const fileBasePath = `proposals/${uid}`;
      console.log("ppform onsubmit ", files instanceof FileList);
      return uploadFilesToFirebase(files, fileBasePath).then((res) => {
        return proposalRef.update({
          ...diffObj,
          files: fb.firestore.FieldValue.arrayUnion(...res),
        });
      });
    } else {
    }
    // if (preVals && nextVals)  {
    //   getChanged(prevVals, nextVals);

    // }
    // const { title, description, branch, department, authors, files, uid, initialValues } = data;
    // const proposalRef = fire.firestore().collection(PROPOSALS).doc(uid);
    // if (files) {
    //   const fileBasePath = `proposals/${uid}`;
    //   return uploadFilesToFirebase(files, fileBasePath).then(res => {
    //     const dataObj = {
    //       ...getProposalFields(),
    //       meta: { ...getMeta(), createdDate: new Date().toString(), createdBy: fire.auth().currentUser.uid },
    //       authors: pickFields(authors, ["uid", "email"]),
    //       emailList: pickFields(authors, ["email"]).map(o => o.email),
    //       uid, title, description, branch, department, files: res };
    //       console.log("dataObj", dataObj);
    //     return proposalRef.set(dataObj);
    //   })
    //   .then(() => {
    //     dispatch({ type: SUBMITTED_PROPOSAL })
    //     // decide where to return
    //     history.go();
    //     // history.push("/" + PROPOSALS);
    //     return;
    //   })
    //   .catch(err => {
    //     console.log("Error: submitting proposal failed", err);
    //   })
    // }
  }
};

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
const difference = (object, base) => {
  return _.transform(object, (result, value, key) => {
    if (!_.isEqual(value, base[key])) {
      result[key] =
        _.isObject(value) && _.isObject(base[key])
          ? difference(value, base[key])
          : value;
    }
  });
};

export const differenceTest = (newObj, oldObj) => {
  console.log("ppform onsubmit diff", difference(newObj, oldObj));
};

const getProposalFields = () => {
  return {
    isEditable: false,
    isFinalized: false,
  };
};

// export const allowProposalEdit = (propsalId) => {
//   let ref = fire.firestore().collection(PROPOSALS).doc(proposalId).get()
// }

export const update = (data) => (dispatch) => {};

// export const toggleActivitiesTouched = () => {
//   dispatch({
//     type: TOUCHED_ACTIVITIES,
//     payload:
//   })
// }

export const logActivity = (passedObj) => (dispatch) => {
  console.log("logActivity data", passedObj);
  const { collection, collectionId, data } = passedObj;
  const ref = fb
    .firestore()
    .collection(collection)
    .doc(collectionId)
    .collection(ACTIVITIES);
  const docRef = ref.doc();
  const uid = docRef.id;
  return docRef
    .set({ ...data, ...getUpdateMeta(), uid }, { merge: true })
    .then(() => {
      dispatch(getActivities({ collection, collectionId }));
    })
    .catch((err) => {
      console.log("Error: logActivity failed", err);
    });
};

export const uploadFiles = (files, proposal, meta) => {
  let storageRef = fb.storage().ref();
  // Would really change this pat
  let file_path = meta.file_path;
  let promises = [];

  for (let i = 0; i < files.length; i++) {
    promises.push(
      storageRef.child(`proposals/${file_path}/${files[i].name}`).put(files[i])
    );
  }

  return Promise.all(promises)
    .then((res) => {
      promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(res[i].ref.getDownloadURL());
      }

      return Promise.all(promises);
    })
    .then((res) => {
      let dbFilesRef = [];

      for (let i = 0; i < files.length; i++) {
        dbFilesRef.push({
          fileName: files[i].name,
          downloadURL: res[i],
        });
      }
      return dbFilesRef;
    })
    .catch((err) => {
      console.log("Error while uploading files: ", err);
    });
};

export const changeView = (view) => (dispatch) => {
  // console.log("INFO: changeView proposalAction.js:", view);
  dispatch({
    type: CHANGED_VIEW,
    payload: view,
  });
};

export const changeStatus = (status, proposalId) => (dispatch) => {
  return fb
    .firestore()
    .collection("proposals")
    .doc(proposalId)
    .update({ status: status })
    .then((doc) => {
      // console.log("Proposal status updated successfully", doc);
      dispatch(fetchProposal(proposalId));
      return true;
    })
    .catch((err) => {
      console.log("Proposal status was not updated");
    });
};

export const updateField = (data) => (dispatch) => {
  return fb
    .functions()
    .httpsCallable("updateField")(data)
    .then((res) => {
      console.log("updateField doc", res.data);
      dispatch(fetchProposal(data && data.id));
      return Promise.resolve(res.data);
    })
    .catch((err) => {
      console.log("Proposal status was not updated", err);
    });

  // fire.firestore().collection(PROPOSALS).doc(proposalId)
  //   .update({ [field]: value })
  //   .then(doc => {
  //     console.log("updateField doc", doc);
  //     dispatch(getProjectProposal(proposalId));
  //   })
  //   .catch(err => {
  //     console.log("Proposal status was not updated");
  //   })
};

export const setFilteredProposal = (filteredProposal) => (dispatch) => {
  dispatch({
    type: FILTERED_PROPOSAL,
    payload: filteredProposal,
  });
};

export const search = () => (dispatch, getState) => {
  console.log("proposalActions: search", dispatch, getState());
};

export const setSearchVal = (val) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_VAL,
    payload: val,
  });
};
