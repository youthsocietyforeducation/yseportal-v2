import { fb } from "../../../firebase";
import { systemMessage } from "../commonActions";

/**
 * this function is used to upload a single file to firebase storage at the file path specified.
 * @param {the file to be uploaded to firebase storage} file
 * @param {the path where the file be stored} filePath
 *
 * @return a promise containing the file url and the file name
 */
export const uploadFileToFirebase = (file, filePath) => {
  let storage = fb.storage().ref();
  if (file && file.name && filePath) {
    return storage
      .child(`${filePath}/${file.name}`)
      .put(file)
      .then((result) => {
        return result.ref.getDownloadURL();
      })
      .then((url) => {
        const fileUrl = url;
        const fileName = file.name;
        return Promise.resolve({ fileUrl, fileName });
      })
      .catch((err) => {
        console.log(
          "Error: uploadFileToFirebase(): failed to upload a file to firebase storage!",
          err
        );
      });
  } else {
    alert("Either file or filepath is empty!");
  }
};

/**
 * this function is used to upload a group of files under a specific path
 * @param {the file to be uploaded to firebase storage} file
 * @param {the path where the file be stored} fileBasePath
 *
 * @return a promise containing the file url and the file name
 */
export const uploadFilesToFirebase = (files, fileBasePath) => {
  if (!files) {
    return Promise.resolve([]);
  }
  let storage = fb.storage().ref();
  let promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(
      storage.child(`${fileBasePath}/${files[i].name}`).put(files[i])
    );
  }
  return Promise.all(promises)
    .then((res) => {
      let downloadUrls = [];
      for (let i = 0; i < files.length; i++) {
        downloadUrls.push(res[i].ref.getDownloadURL());
      }
      return Promise.all(downloadUrls);
    })
    .then((res) => {
      let results = [];
      for (let i = 0; i < files.length; i++) {
        results.push({
          fileName: files[i].name,
          downloadURL: res[i],
        });
      }
      return Promise.resolve(results);
    })
    .catch((err) => {
      console.log("Error: uploadFilesToFirebase", err);
    });
};

export const uploadFilesToFirebaseWithAsyncAwait = async (
  files,
  fileBasePath
) => {
  try {
    if (files && files.length > 0 && fileBasePath) {
      let uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].name;
        const upload = await fb
          .storage()
          .ref()
          .child(`${fileBasePath}/${fileName}`)
          .put(files[i]);
        const url = await upload.ref.getDownloadURL();
        uploadedFiles.push({ fileName: fileName, downloadURL: url });
      }

      return uploadedFiles;
    } else {
      throw new Error("uploadFilesToFirebaseWIthAsyncAwait(): No files found!");
    }
  } catch (err) {
    systemMessage("error", `${err.code}: ${err.message}`);
  }
};
