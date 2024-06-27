import React, { useEffect, useState } from 'react';

import {Link} from 'react-router-dom';
import './components/styles.css';


const LobbyPage = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);
    useEffect(() => {
        console.log('Fetching code block for title:', );
        fetch(`/code-block`)
            .then(response => response.json())
            .then(data => {
                setCodeBlocks(data);
            })
            .catch(error => {
                console.error('Error fetching code block:', error);
            });

    },[] );

    return(
        <div className="lobby">
            <h1>Choose code block</h1>
            <ul>
                {codeBlocks.map((block) => (
                    <li key={block._id} >
                        <Link to={`/code-block/${block._id}`} className="code-block-link">
                        <button className="code-block-button">{block.title}</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default LobbyPage;
