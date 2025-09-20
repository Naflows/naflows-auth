import '../../../public/root/components/app-footer.scss';

const AppFooter = () => {



    return (
        <footer className="nass__app__footer">
            <div className="nass__naflows__informations">
                <img src='/assets/naflows-logotype.svg' alt='Nass Logotype' className='naflows__logotype' />
                <span className="naflows__description">The NASS is managed, operated, and maintained by <a href="https://naflows.com">Naflows</a>.</span>
                <span className="naflows__copyright">© {new Date().getFullYear()} Nass. All rights reserved.</span>
            </div>

            <div className="nass__app__useful__links">
                <div className="useful__links__section">
                    <h4>Policies</h4>
                    <div className="links__section__content">
                        <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                        <a href="/legal/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                        <a href="/legal/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
                    </div>
                </div>
                <div className="useful__links__section">
                    <h4>Support</h4>
                    <div className="links__section__content">
                        <a href="/support/faq" target="_blank" rel="noopener noreferrer">FAQ</a>
                        <a href="/support/contact" target="_blank" rel="noopener noreferrer">Contact Us</a>
                        <a href="/support/guides" target="_blank" rel="noopener noreferrer">Guides</a>
                    </div>
                </div>
                <div className="useful__links__section">
                    <h4>Community</h4>
                    <div className="links__section__content">
                        <a href="https://discord.gg/nass" target="_blank" rel="noopener noreferrer">Discord</a>
                        <a href="https://twitter.com/naflows" target="_blank" rel="noopener noreferrer">Twitter</a>
                    </div>
                </div>
                <div className="useful__links__section">
                    <h4>Support</h4>
                    <div className="links__section__content">
                        <a href="/support/faq" target="_blank" rel="noopener noreferrer">FAQ</a>
                        <a href="/support/contact" target="_blank" rel="noopener noreferrer">Contact Us</a>
                        <a href="/support/guides" target="_blank" rel="noopener noreferrer">Guides</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}


export default AppFooter;