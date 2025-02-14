export const dashboardSteps = [
    {
        element: '.dashboard-header',
        intro: 'Welcome to LifeGuard! This is your personal health and environmental monitoring dashboard.',
        position: 'bottom',
        tooltipPosition: 'bottom'
    },
    {
        element: '.temperature-card',
        intro: 'Monitor real-time environmental data including temperature, humidity, and air quality.',
        position: 'right',
        tooltipPosition: 'right'
    },
    {
        element: '.reminders-card',
        intro: 'Keep track of important notes and reminders here.',
        position: 'left',
        tooltipPosition: 'left'
    },
    {
        element: '.alerts-section',
        intro: 'Get important alerts about your environment and health metrics.',
        position: 'top',
        tooltipPosition: 'top'
    }
];

export const sidebarSteps = [
    {
        element: '.user-info',
        intro: 'Access your profile settings and preferences here.',
        position: 'right'
    },
    {
        element: '[data-tour="dashboard"]',
        intro: 'View your health and environmental data overview.',
        position: 'right'
    },
    {
        element: '[data-tour="pollution-tracker"]',
        intro: 'Track real-time pollution levels in your area.',
        position: 'right'
    }
]; 