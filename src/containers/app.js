import React, {Component} from 'react'
import SearchBar from './../components/search-bar'
import VideoList from './video-list'
import axios from 'axios'
import VideoDetail from './../components/video-detail'
import Video from './../components/video'

const API_END_POINT = "https://api.themoviedb.org/3/"
const POPULAR_MOVIES_URL = "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_respone=images"
const API_KEY = "api_key=c04becda6e63de8615acc5d3611ef039"
const SEARCH_URL = "search/movie?language=fr&include_adult=false"

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {movieList: {}, currentMovie: {}}
    }  

    /* Quand le composant va se charger */
    componentWillMount () {
        axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`)
        .then(response => {
            this.setState({movieList: response.data.results.slice(1,6), currentMovie: response.data.results[0]}, function () {  
                this.applyVideoToCurrentMovie ();
            })            
        });
    }

    applyVideoToCurrentMovie () {
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&include_adult=false`)
        .then(response => {
            const youtubekey = response.data.videos.results[0].key;            
            let newCurrentMovieState = this.state.currentMovie;
            newCurrentMovieState.videoID = youtubekey;
            this.setState({currentMovie: newCurrentMovieState})
            
        });
    }

    onClickListItem = movie => {
        this.setState({currentMovie: movie}, function () {
            this.applyVideoToCurrentMovie();
            this.setRecommendation();
        });
    }

    onClickSearch = searchText => {
        if(searchText){
            axios.get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${searchText}`)
            .then(response => {
                if (response.data && response.data.results[0]) {
                    if(response.data.results[0].id !== this.state.currentMovie) {
                        this.setState({currentMovie: response.data.results[0]}, () => {  
                            this.applyVideoToCurrentMovie ();
                            this.setRecommendation();
                        }) 
                    }
                }
            });
        }
    }

    setRecommendation = () => {
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr`)
            .then(response => {
                this.setState({movieList: response.data.results.slice(0,5)})
            });
    }

    render() {
        const renderVideoList = () => {            
            if (this.state.movieList.length >= 5) {
                return <VideoList movieList={this.state.movieList} callback={this.onClickListItem}/>
            }
        }
        return  (<div>
                    <div className="search_bar">
                        <SearchBar callback={this.onClickSearch} />
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <Video videoID={this.state.currentMovie.videoID}/>
                            <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview} />
                        </div>
                        <div className="col-md-4" >
                            {renderVideoList()}  
                        </div>
                    </div>
                </div>);
    }
}

export default App;