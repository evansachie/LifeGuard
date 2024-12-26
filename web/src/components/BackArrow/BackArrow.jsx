import * as React from "react";
import { Link } from 'react-router-dom';
import './BackArrow.css';

const BackArrow = () => {
    return (
        <Link to="/exercise" className="back-arrow-link">
            <span className="back-arrow">&#8592;</span>
        </Link>
    );
};

export default BackArrow;