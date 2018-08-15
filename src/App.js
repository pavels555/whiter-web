import React, { Component } from 'react';
import logo from './logo.svg';
import { ls, config } from 'npm-remote-ls'
import JSZip from 'jszip'
import './App.css';
import { Promise } from 'bluebird'
import { saveAs } from 'file-saver/FileSaver';




class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: '',
      list: [],
      progression: ''
    }

    config({
      registry: "https://registry.npmjs.cf",
      development: true
    })
  }

  makeTgzUrl = (packageVersion) => {

    let splits = packageVersion.split(/\/|@/).reverse();
    let version = splits[0];
    let name = splits[1];
    let scope = splits[2];
    if (scope) {
      return `https://registry.npmjs.cf/@${scope}/${name}/-/${name}-${version}.tgz`
    } else {
      return `https://registry.npmjs.cf/${name}/-/${name}-${version}.tgz`
    }
  }

  handleChange = (event) => {
    this.setState({ input: event.target.value });
  }

  handleSubmit = (event) => {

    let zip = new JSZip();
    let lsPormisify = Promise.promisify(ls)
    var files = [];

    let urlToPromise = url => {
      return fetch(url)
        .then(function (r) {
          var blob = r.blob()
          return blob;
        })
    }

    let updateProgress = msg => {
      this.setState({ progression: msg });
    }

    var promise = (result) => {

      Promise.resolve()
        .then(() => {
          return result.map(this.makeTgzUrl)
        })
        .then(urls => {
          urls.forEach(url => files.push(zip.file(url.split('/').pop(), urlToPromise(url), { binary: true })))
          return files;
        })
        .then(files => Promise.all(files))
        .then(() => zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
          var msg = "progression : " + metadata.percent.toFixed(2) + " %";
          if (metadata.currentFile) {
            msg += ", current file = " + metadata.currentFile;
          }
          updateProgress(msg);
          // showMessage(msg);
          // updatePercent(metadata.percent | 0);
        }))
        .then(blob => {
          saveAs(blob, "nice.zip")
        })
        .catch(error => {
          console.log(error)
        })
    }


    ls(this.state.input, '', true, result => {
      promise(result)
    })






    // lsPormisify(this.state.input, '', true)
    //   .then(result => {
    //     return result.map(this.makeTgzUrl)
    //   })
    //   .then(urls => {
    //     return urls.forEach(url => zip.file(url.split('/').pop(), fetch(url).then(r => r.blob()), { binary: true }))
    //   })

    // zip.generateAsync({ type: "blob" }, (metadata) => {
    //   var msg = "progression : " + metadata.percent.toFixed(2) + " %";
    //   if (metadata.currentFile) {
    //     msg += ", current file = " + metadata.currentFile;
    //   }
    //   //showMessage(msg);
    //   //updatePercent(metadata.percent | 0);
    // })
    // .then(blob => {
    //   saveAs(blob, "aaa.zip")
    //   // this.setState({});
    // })



    // ls(this.state.input, '', true, result => {
    //   result = result.map(this.makeTgzUrl)

    //   zip.file(filename, urlToPromise(url), { binary: true });

    //   zip.generateAsync({ type: "blob" }, function updateCallback(metadata) {
    //     var msg = "progression : " + metadata.percent.toFixed(2) + " %";
    //     if (metadata.currentFile) {
    //       msg += ", current file = " + metadata.currentFile;
    //     }
    //     showMessage(msg);
    //     updatePercent(metadata.percent | 0);
    //   })

    //   var img = zip.folder("images");
    //   img.file("smile.gif", imgData, { base64: true });
    //   zip.generateAsync({ type: "blob" })
    //     .then(function (content) {
    //       // see FileSaver.js
    //       saveAs(content, "example.zip");
    //     });


    //   fetch(result[0], {})
    //     .then(r => r.blob())
    //     .then(blob => {
    //       var text = "dd"
    //     })

    //var updatedList = Object.assign({}, this.state.list, result);
    //   this.setState({ list: result });
    // })


  }

  createLinks = (links) => {
    return links.map(link =>
      (
        <div>
          <a href={link} download>{link}</a><br />
        </div>
      )
    )
  }

  render() {

    return (

      <div>
        <input type="text" value={this.state.input} onChange={this.handleChange} />
        <button name="enter" type="button" value="submit" onClick={this.handleSubmit}>submit</button>
        {this.createLinks(this.state.list)}
        {this.state.progression}
      </div>

    );
  }
}

export default App;
