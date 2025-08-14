import type { JSX } from 'react';
import '../styles/link.scss';


export function Link({
    text,
}: {
    text : string,
}) : JSX.Element {
    return (
        <a
        href="https://naflows.com"
        rel="noopener noreferrer"
        className="naflows-link"
        >
            <p>
                {text}
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M640-624 284-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l356-356H280q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h400q17 0 28.5 11.5T720-720v400q0 17-11.5 28.5T680-280q-17 0-28.5-11.5T640-320v-304Z"/></svg>
        </a>
    );
}
