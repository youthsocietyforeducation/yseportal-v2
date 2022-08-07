import React, {Component} from 'react'

/**
 * DO NOT EDIT WITHOUT PERMISSION
 * Author: Kaung Yang
 * Created: May 11th 2020
 * Updated: May 11th 2020
 */
export default class UploadFile extends Component{
  constructor(props) {
    super(props)
    this.state = { 
        props: props, 
        currentFiles: [], 
        previousFiles: [],
        previewImages: [], 
        displayPrevious: false, 
    }
  }

  componentDidMount = () => {
    console.log("UploadFile: ", this.props)
    const { previousFiles, displayPrevious } = this.props; 
    if(previousFiles) {
      this.setState({
        previousFiles: [...previousFiles], 
        displayPrevious: displayPrevious,
      })
    }
  }

  onChange = (e) => {
    e.preventDefault();
    const { onChange } = this.state.props
    console.log("UploadFile, onchange", e.target.files); 
    const fileArray = Array.from(e.target.files); 
    this.setState({
      currentFiles: fileArray,
      previewImages: []
    })
    for(var i = 0; i < fileArray.length; i++) {
      var reader = new FileReader(); 
      reader.onload = (r) => {
        console.log(pC, "for loop", r); 
        const result = r.target.result; 
        if(this.isAllImages(fileArray) || true) {
          this.setState( prevState => {
            return {
              previewImages: [...(prevState.previewImages || []), r.target.result], 
            }
          }); 
        }
      }
      reader.readAsDataURL(e.target.files[i]); 
    }
    onChange(e.target.files)
  }

  isFileImage = (file) => {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type'])
  }

  isAllImages = (files) => {
    console.log(pC, "isAllImages", files);
    if(files) {
      for(var i = 0; i < files.length; i ++) {
        if(!this.isFileImage(files[i])) {
          return false; 
        }
      }
      console.log(pC, "isAllImages", "returning true");
      return true; 
    } else {
      return false; 
    } 
  }

  renderPreviousFiles = (previousFiles) => {
    if(previousFiles && previousFiles.length > 0) {
      return (
        <div>
          <hr/><h5>Previous Files</h5>
          <ul> 
            { previousFiles.map((file,i) => (
                <li key={i}>
                  <a href={ file.downloadURL }
                    target="_blank"
                    rel="noopener noreferrer">{ file.fileName }</a>
                </li>
              ))
            }
          </ul>
        </div>
      )
    } else {
      return <></>; 
    }
  }

  renderImageFiles = (files) => {
    console.log(pC, "renderImageFiles", files);
    const {previewImages} = this.state; 
    console.log(pC, "renderImageFiles", previewImages);
    if(files && previewImages){
      return <>
        {files.length > 0 ? 
        files.map((file, i) => {
          return(
              <li className="mr-2" key={i}>
                <embed
                  src={previewImages[i]}
                  type={file.type}
                  frameBorder="0"
                  scrolling="auto"
                  height="150px"
                  width="150px"></embed>
              <p style={{"width":"150px", "overflowX": "auto"}}>
              <i className={this.getIcons(file)}></i>{file.name}</p>
              </li>
          ) 
        }): 
        <li></li>
        }
      </>
    } else {
      return <div>No Images to Preview</div>
    }
  }

  renderPlainFiles = (files) => {
    console.log(pC, "renderPlainFiles", files);
    if(files) {
      return files.map((file,i) => {
        console.log(pC, file);
        return <li key={i}><p className="mb-0"><i className={this.getIcons(file)}></i>{file.name}</p></li>
      }); 
    } else {
      return <>NO PLAIN FILES</>; 
    }
  }

  getIcons = (file) => {
    switch(file.type) {
      case 'image/gif':
      case 'image/jpeg':
      case 'image/png':
        return fileIconClasses.images; 
      case 'application/pdf':
        return fileIconClasses.pdfs; 
      default:
        return fileIconClasses.defaults; 
    }
  }

  renderAttachedFiles = (files) => {
    console.log(pC, "renderAttachedFiles", files);
    if(files) {
      if(this.isAllImages(files)) {
        return this.renderImageFiles(files); 
      } else {
        return this.renderImageFiles(files)
      }
    } else {
      return <></>
    }
  }

  renderDisplay = () => {
      const { currentFiles, previousFiles, displayPrevious } = this.state; 
      console.log("UploadFile: renderDisplay", previousFiles)
      return(
        <div className="uploaded-file-window">
        <h5>Files to be uploaded</h5>
          <ul className="pl-0 d-flex justify-content-start flex-wrap" 
            style={{"listStyle": "none"}}>
            { currentFiles.length > 0 ?
              this.renderAttachedFiles(currentFiles): 
              <li>No files attached yet</li>
            }
          </ul> 
          {displayPrevious ? this.renderPreviousFiles(previousFiles) : null }
        </div>
      )
  } 

  render() {
    console.log(pC, "render()", this.state);
    const { accept, multiple, tip} = this.props;
    return(
     <div>
       <input
        type='file'
        multiple={multiple || false}
        accept={accept || '.jpg, .png, .jpeg, application/doc, application/docx, application/pdf'}
        onChange={this.onChange}/>
       <p><small>{tip || "Accepts: .jpg, .png, .jpeg, .doc, .docx, .pdf"}</small></p>
       {this.renderDisplay()}
     </div>
    )
  }
}
const pC = "UploadFile "
const iconClassText = "h5 mr-2"; 
const deleteIcon ="text-danger fas fa-trash-alt"; 
const fileIconClasses = {
  images: `${iconClassText} fas fa-file-image`,
  pdfs: `${iconClassText} fas fa-file-pdf`,
  defaults: `${iconClassText} fas fa-file-alt`
} 
