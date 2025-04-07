const TabNavigation = ({ activeTab, onTabChange, tabs }) => (
    <div className="tabs">
        {tabs.map(tab => (
            <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
            >
                {tab.icon}
                <span>{tab.label}</span>
            </button>
        ))}
    </div>
);

export default TabNavigation;