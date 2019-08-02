import * as React from 'react';

const DarkModeContext = React.createContext({
    isDark: false,
    toggleDarkMode: () => { },
});

export default DarkModeContext;