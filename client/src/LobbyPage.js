// LobbyPage.js
import React, {useEffect, useState} from 'react';

import {Link, useParams} from 'react-router-dom';


const LobbyPage = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);

    //const codeBlocks = useParams();
    // בהגדרה של סטייטים, אתה רוצה לשמור בקומפוננט מידע באופן דינאמי, הקוד בלוק יהיה הקוד עצמו, ובכל פעם שהמשתמש ירשום משהו חדש נפעיל את סט קוד בלוק. ההגדרה הראשונית של קודבלוק יהיה נאל.

    useEffect(() => {
        console.log('Fetching code block for title:', );
        fetch(`/code-block`)
            .then(response => response.json())
            .then(data => {
                console.log('Data received:', data);
                setCodeBlocks(data);
            })
            .catch(error => {
                console.error('Error fetching code block:', error);
            });
    },[] );

    return(
        <div>
            <h1>Choose code block</h1>
            <ul>
                {codeBlocks.map((block) => (
                    <li key={block._id} >
                        <Link to={`/code-block/${block._id}`}>
                            <button>{block.title}</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}






export default LobbyPage;
