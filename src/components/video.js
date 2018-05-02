import React from 'react'

const BASE_URL = "https://www.youtube.com/embed/"

const Video = ({videoID}) => {
    return (
        <div className="embed-responsive embed-responsive-16by9" >
            <iframe className="embed-responsive-item" src={`${BASE_URL}${videoID}`}/>
        </div>
    )
}

export default Video;