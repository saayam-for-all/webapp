// import React from 'react'

const Sprinter = ({content,title,imageUrl}) => {
    return (
        <>
            <section className='sectionWraper'>
                <div className='row' id='containerTitle'>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <p>{title}</p>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-6 col-md-12 col-sm-12' id='containerText'>
                        <p>{content}</p>
                    </div>
                    <div className='col-lg-6 col-md-12 col-sm-12' id='containerImage'>
                    
                        <img src={imageUrl} alt="webImage"/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Sprinter;
