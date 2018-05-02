import React, {Component} from 'react'

class SearchBar extends Component{
    constructor(props) {
        super(props)
        this.state = {  searchText: "",
                        placeHolder: "Tapez votre film",
                        intervakBeforeRequest: 1000,
                        lockRequest: false
                    }
    }
    
    /* permet de faire une référence à la classe */
    handleChange = event => {
        this.setState({searchText: event.target.value})
        if(!this.state.lockRequest) {
            this.setState({lockRequest: true})
            setTimeout(() => {
                this.search()},this.state.intervakBeforeRequest
            )
        }
    }

    search = event => {
        this.props.callback(this.state.searchText);
        this.setState({lockRequest: false})
    }

    render(){
        return (
            <div className="row">
                <div className="col-lg-8 input-group" >
                    <input type="text" className="form-control input-lg" onChange={this.handleChange} placeholder={this.state.placeHolder} />
                    <span className="input-group-btn">
                        <button className="btn btn-secondary" onClick={this.search}>Go</button>
                    </span>
                </div>
            </div>
        )
    }
}

export default SearchBar