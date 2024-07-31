import React, {useState} from "react";
import './Tab.css';

const Tabs = ({title , tabs = []}) => {
    const [activeTab, setActiveTab] = useState(0);
    
    const handleTabClick = (index) => {
        setActiveTab(index);
    }


    return (
        <div className="tab-container">
            { title && <h4 className="title">{title}</h4> }
            <div className="body">
                <div>
                    <div className="tabs">
                        {
                            tabs.map((tab, index) => (
                            <label key={index} className={index === activeTab ? 'active-tab' : 'tab'} onClick={() => handleTabClick(index)}> {tab.name} </label>
                            ))
                        }
                    </div>
                    <div className="content">
                        {tabs[activeTab].data()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tabs;