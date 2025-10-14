import '../../../public/root/pages/docs/index.scss';
import SmallPageVisual from './components/small-page-visual';


const DocsPage = () => {

    

    return (
        <div className="docs-page">
            <div className="docs-page-welcome">
                <div className="docs__page__header">
                    <div className="header__head">
                        <img
                            src="https://naflows.com/public/assets/naflows_full_logotype.png"
                            alt="Naflows Full Logotype"
                            style={{ cursor: 'pointer' }}
                            onClick={(() => { window.location.href = '/docs' })}
                        />
                        <button className='secondary-button' onClick={() => {
                            window.location.href = "/account";
                        }}>
                            Open NASS App
                        </button>
                    </div>
                    <div className="docs__page__title">
                        <h1>Documentation</h1>
                        <p>Welcome to the Naflows Authentication Secure System documentation page. Here you will find all the information you need to get started with NASS.</p>
                    </div>

                    <div className="docs__page__search">
                        <input className='inset-input' name='search' type="text" placeholder='Search documentation...' autoComplete='off' />
                    </div>
                </div>

                <div className="docs__page__features">
                    <h4>Directories</h4>
                    <div className="docs__page__features__list directories">
                        <SmallPageVisual title="User Guide" description="Comprehensive guide for users." link="/docs/user-guide" level="basic" />
                        <SmallPageVisual title="API Reference" description="Detailed API reference documentation." link="/docs/api-reference" level="advanced" />
                        <SmallPageVisual title="Tutorials" description="Step-by-step tutorials to get you started." link="/docs/tutorials" level="intermediate" />
                        <SmallPageVisual title="FAQ" description="Frequently Asked Questions." link="/docs/faq" level="basic" />
                        <SmallPageVisual title="Troubleshooting" description="Common issues and how to resolve them." link="/docs/troubleshooting" level="intermediate" />
                        <SmallPageVisual title="Release Notes" description="Latest updates and changes." link="/docs/release-notes" level="basic" />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default DocsPage;