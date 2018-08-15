import { Component } from 'react';

export default class ResultList extends Component {
  render() {

    var results = [1,2,3];
    return (
    <div>
        for(result in results) {
            <Result></Result>
        });
    </div>
    );
  }
}
