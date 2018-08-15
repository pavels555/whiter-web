import React, { Component } from 'react';

export default class SearchBar extends Component {


    render() {
        let client = RegClient({});

        remoteLs.config({
                development: true,
                optional: true,
                peer: true,  
        })

        remoteLs.ls('react', '', true, (result) => {
            console.log(result)
        })

        return (
            <div>
                <input type="text" />
            </div>
        );


    }
}
