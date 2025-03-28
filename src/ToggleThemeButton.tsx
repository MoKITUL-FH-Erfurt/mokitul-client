import React, { useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ToggleThemeButton: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const root = useRef(document.documentElement);

    const handleToggleTheme = () => {
        isDarkMode ? setIsDarkMode(false) : setIsDarkMode(true);
    };

    useEffect(() => {
        if (isDarkMode) {
            root.current.classList.add('dark');
        } else {
            root.current.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <Button size="icon" variant="secondary" onClick={handleToggleTheme}>
            {isDarkMode ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
        </Button>
    );
};

export default ToggleThemeButton;