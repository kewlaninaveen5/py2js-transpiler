import React from "react";
import './PortfolioNetwork.css'

const Network = () => {

    // const redirects = {
    //     "SORTING ALGORITHM VISUALISER": "https://sortingalgvisualizer.netlify.app",
    //     "DIGITAL PORTFOLIO" : "https://naveen-kewlani.web.app/",
    //     // "HIMACHAL HOMESTAYS" : "https://himachal-homestays.web.app/",
    //     "PY2JS TRANSPILER" : "https://py2jstranspiler.netlify.app",
    //     // "PROFILEWALLA": "https://profilewalla.com/",
    // }

    const redirects = {
        "E-COMMERCE WEBSITE": "https://allinoneplacefrontend.netlify.app/",
        "PY TO JS CONVERTER": "https://py2jstranspiler.netlify.app/",
        "DIGITAL PORTFOLIO": "https://naveen-kewlani.web.app/",
        "HIMACHAL HOMESTAYS": "https://himachal-homestays.web.app/",
        "SORTING ALGORITHM VISUALISER": "https://sortingalgvisualizer.netlify.app",
        // "PROFILEWALLA": "https://profilewalla.com/",
    }

    const list = Object.entries(redirects).map((keyValueArray, key) => {
        const baseURL = window.location.origin
        return <div key={key} className={` ${baseURL === keyValueArray[1] ? "not-allowed" : "redirect"}`}>
            <a rel="noreferrer" className={` ${baseURL === keyValueArray[1] ? "not-allowed" : "redirect"}`} href={keyValueArray[1]} target="_blank">Visit {keyValueArray[0]}</a></div>
    })


    return (
        <div>
            <div className={"network-container"} >

                <div className='flex'>
                    <div className='left-network'>
                        <div>
                        About Me:<br />
                        <b>Naveen Kewlani</b>
                        <div className='skills'>2+ YOE of MERN,<br/> JS, Python, AI</div>
                        </div>
                        <div className="">
                            <img src={"/professiona photo.jpeg"} alt="My Profile" className="profile-image" />
                        </div>
                    </div>
                    <div style={{
                        width: '1px',
                        height: '150px',
                        backgroundColor: 'gray'
                    }} />
                    <div className="right-network">
                        My Projects: 

                        {list}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Network;



