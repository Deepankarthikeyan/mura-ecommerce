function XPlatformIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            aria-hidden="true"
            style={{ display: 'block' }}
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function FollowUs({facebook, twitter, mail, instagram, youtube}: any) {
    return <div className="social-one-wrapper">
        <span style={{ color: '#fff', fontWeight: 800, fontFamily: '"Montserrat", sans-serif' }}>Follow Us:</span>
        <ul>
            <li>
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <i className="fa-brands fa-facebook-f" />
                </a>
            </li>
            <li>
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="fa-brands fa-instagram" />
                </a>
            </li>
            <li>
                <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <i className="fa-brands fa-youtube" />
                </a>
            </li>
            <li>
                <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="X" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <XPlatformIcon />
                </a>
            </li>
        </ul>
    </div>
}
export default FollowUs