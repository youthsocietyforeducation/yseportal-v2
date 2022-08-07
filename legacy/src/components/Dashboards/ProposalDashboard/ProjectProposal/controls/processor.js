import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Tag, Tooltip, Badge } from 'element-react';
import { Status } from '../constants';
import * as _ from 'lodash';

export const processSubmittedDate = (stringDate) => {
  let parsedDate = new Date(Date.parse(stringDate));
  let date = parsedDate.toDateString();
  let time = parsedDate.toTimeString();
  if (date) {
    return (
      <span>
        {date}
        <small className="ml-2">{time}</small>
      </span>
    );
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case Status.NEW:
      return 'success';
    case Status.REVIEWING:
      return 'warning';
    case Status.REJECTED:
      return 'danger';
    case Status.ACCEPTED:
      return '#79d70f';
  }
};

export const getStatusBackgroundColor = (status) => {
  switch (status) {
    case Status.ACCEPTED:
      return '#b6eb7a';
  }
};

export const processStatus = (status) => {
  return status;
};

export const processTitle = (title) => {
  return title;
};

/* LIMIT CONSTANTS */
const charLimit = 85;
const authorsLimit = 2;
const filesLimit = 2;

export const processDescription = (description) => {
  if (description.length > charLimit) {
    const pDescription = `${description.substring(0, charLimit)} ...`;
    return pDescription;
  }
  return description;
};

export const processBranch = (branch) => {
  let pBranch = '';
  branch.split('_').forEach((word) => {
    pBranch = `${pBranch}${capitalize(word)} `;
  });
  return pBranch;
};

export const renderBranch = (branch) => {
  let pBranch = '';
  branch.split('_').forEach((word) => {
    pBranch = `${pBranch}${capitalize(word)} `;
  });
  return pBranch;
};

export const processDepartment = (department) => {
  let pDepartment = '';
  department.split('_').forEach((word) => {
    pDepartment = `${pDepartment}${capitalize(word)} `;
  });
  return pDepartment;
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const processAuthors = (authors) => {
  // let allAuthors = authors.map(obj => `${obj.firstName} ${obj.lastName}(${obj.email})`); // array with all the authors; format: Phyo Khine(pkhine@gmail.com)
  // let authorsToShow = allAuthors.slice(0, authorsLimit); // array with only authors to be shown
  // let pAuthors = '';
  // authorsToShow.forEach(str => { pAuthors = `${pAuthors}${str}, ` });

  // let numAuthorsNotShown = allAuthors.length - authorsToShow.length; // for + how many others
  // if (numAuthorsNotShown > 0) {
  //     pAuthors = `${pAuthors} ...+${numAuthorsNotShown} others`;
  // } else {
  //     pAuthors = pAuthors.slice(0, pAuthors.length - 2); // to remove the comma at the end
  // }
  // return pAuthors;

  return authors;
};

export const processFiles = (files) => {
  console.log('whattt is files', files);
  let allFiles = files.map((obj) => obj.fileName); // arry with all files
  let filesToShow = allFiles.slice(0, filesLimit); // arr with files to be shown
  let pFiles = '';
  filesToShow.forEach((str) => {
    pFiles = `${pFiles}${str}, `;
  });

  let numFilesNotShown = allFiles.length - filesToShow.length; // for + how many others
  if (numFilesNotShown > 0) {
    pFiles = `${pFiles} ...+${numFilesNotShown} others`;
  } else {
    pFiles = pFiles.slice(0, pFiles.length - 2); // to remove the comma at the end
  }
  return pFiles;
};

export const processID = (id) => {
  console.log('processID', id);
  return (
    <Link to={`/proposals/${id}`}>
      <Button type="primary" size="small">
        View
      </Button>
    </Link>
  );
};

export const process = (value, field) => {
  switch (field) {
    case dataFields.CREATED:
      return processSubmittedDate(value);
    case dataFields.STATUS:
      return processStatus(value);
    case dataFields.TITLE:
      return processTitle(value);
    case dataFields.DESCRIPTION:
      return processDescription(value);
    case dataFields.BRANCH:
      return processBranch(value);
    case dataFields.DEPARTMENT:
      return processDepartment(value);
    case dataFields.AUTHORS:
      return processAuthors(value);
    case dataFields.FILES:
      return processFiles(value);
    case dataFields.ID:
      return processID(value);
    default:
      return <span className="text-danger">Corrupted Data</span>;
  }
};

export const processProposal = (proposal) => {
  if (proposal) {
    const {
      title,
      description,
      branch,
      department,
      authors,
      files,
      status,
      id,
      created,
    } = proposal;
    const newObj = {
      description,
      files,
      id,
      branch,
      created: process(created, dataFields.CREATED),
      title: process(title, dataFields.TITLE),
      department: process(department, dataFields.DEPARTMENT),
      authors: process(authors, dataFields.AUTHORS),
      status: process(status, dataFields.STATUS),
    };
    return newObj;
  } else {
    return {};
  }
};

export const Branch = {
  YANGON: {
    label: 'Yangon',
    value: 'yangon',
  },
  DALY_CITY: {
    label: 'Daly City',
    value: 'daly_city',
  },
  LOS_ANGELES: {
    label: 'Los Angeles',
    value: 'los_angeles',
  },
  PHILADELPHIA: {
    label: 'Philadelphia',
    value: 'philadelphia',
  },
  EXECUTIVE: {
    label: 'Executive',
    value: 'executive',
  },
};

export const dataFields = {
  CREATED: 'created',
  STATUS: 'status',
  TITLE: 'title',
  DESCRIPTION: 'description',
  BRANCH: 'branch',
  DEPARTMENT: 'department',
  AUTHORS: 'authors',
  FILES: 'files',
  ID: 'id',
};

const statusFilters = [
  { text: Status.NEW, value: Status.NEW },
  { text: Status.ACCEPTED, value: Status.ACCEPTED },
  { text: Status.REJECTED, value: Status.REJECTED },
  { text: Status.REVIEWING, value: Status.REVIEWING },
];

const branchFilters = [
  { text: Branch.YANGON.label, value: Branch.YANGON.value },
  { text: Branch.DALY_CITY.label, value: Branch.DALY_CITY.value },
  { text: Branch.LOS_ANGELES.label, value: Branch.LOS_ANGELES.value },
  { text: Branch.PHILADELPHIA.label, value: Branch.PHILADELPHIA.value },
  { text: Branch.EXECUTIVE.label, value: Branch.EXECUTIVE.value },
];

export const renderAuthorTags = (
  primaryAuthorUID,
  authors,
  systemUsersBank
) => {
  const userBank = _.keyBy(systemUsersBank, 'uid');
  if (authors) {
    return authors.map((uid, index) => {
      const email = userBank[uid] && userBank[uid].email;
      const firstName = userBank[uid] && userBank[uid].firstName;
      const lastName = userBank[uid] && userBank[uid].lastName;
      console.log('primaryAuthor', primaryAuthorUID, uid);
      const isPrimary = uid === primaryAuthorUID;
      console.log('primaryAuthor', isPrimary);
      return (
        <Tooltip
          key={index}
          className="item mr-2 mb-2"
          effect="dark"
          content={email}
          placement="top-end"
        >
          <Tag type="primary">
            {isPrimary ? (
              <i className="el-icon-star-on mr-2 text-warning"></i>
            ) : (
              <></>
            )}
            <i className="fas fa-feather-alt mr-2"></i>
            {`${firstName} ${lastName}`}
          </Tag>
        </Tooltip>
      );
    });
  } else {
    return <span className="text-danger">No Authors</span>;
  }
};

export const renderPrimaryAuthorTag = (primaryAuthorUID, sysUsers) => {
  const userBank = _.keyBy(sysUsers, 'uid');
  if (primaryAuthorUID && userBank) {
    console.log('primaryAuthorUID', primaryAuthorUID);
    console.log('primaryAuthorUID keyedSysUsers', userBank);
    const author = userBank[primaryAuthorUID];
    const firstName = author && author.firstName;
    const lastName = author && author.lastName;
    return (
      <Tag type="primary">
        <i className="fas fa-feather-alt mr-2"></i>
        {`${firstName} ${lastName}`}
      </Tag>
    );
  }
};

export const renderFileIcons = (files) => {
  if (files) {
    return files.map((file, index) => {
      const { downloadURL, fileName } = file;
      console.log('renderFileIcons', file);
      return (
        <Tooltip
          key={index}
          className="item mr-2 mb-2"
          effect="dark"
          content={'text'}
          placement="top"
        >
          <a target="_blank" href={downloadURL}>
            <Tag type="gray">
              <i className="fas fa-file-alt mr-2"></i>
              {fileName}
            </Tag>
          </a>
        </Tooltip>
      );
    });
  } else {
    return <span className="text-danger">No Authors</span>;
  }
};

const processStatusFilters = (filters) => {
  return filters;
};

export const tableColumns = [
  {
    type: 'expand',
    expandPannel: function (data) {
      return (
        <div>
          <h3 className="i-element-light-black">{data.title}</h3>
          <h6 class="text-muted subtitle mb-2">{data.description}</h6>
          <div className="d-flex justify-content-start flex-wrap mb-2">
            {renderAuthorTags(data.authors)}
          </div>
          <div className="d-flex justify-content-start flex-wrap mb-2">
            {renderFileIcons(data.files)}
          </div>
          <Link to={`/proposals/${data.id}`}>
            <Button type="primary">View</Button>
          </Link>
        </div>
      );
    },
  },
  {
    label: 'Created',
    prop: 'created',
    width: 200,
    sortable: true,
  },
  {
    label: 'Status',
    prop: 'status',
    sortable: true,
    width: 120,
    align: 'center',
    filters: processStatusFilters(statusFilters),
    filterMethod(value, row) {
      console.log('filter', value, row);
      return row.status === value;
    },
    render: (data, column) => {
      return <Tag type={getStatusColor(data['status'])}>{data.status}</Tag>;
    },
  },

  {
    label: 'Title',
    width: 500,
    prop: 'title',
  },
  {
    label: 'Branch',
    prop: 'branch',
    filters: branchFilters,
    filterMethod(value, row) {
      console.log('filter', value, row);
      return row.branch === value;
    },
    render: (data, column) => {
      return <Tag type="primary">{renderBranch(data.branch)}</Tag>;
    },
  },
];
