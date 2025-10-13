import { useEffect, useState } from "react";
import Loader from "../../global/components/Loader";
import '../../../public/root/pages/docs/index.scss';
import '../../../public/root/pages/docs/page.scss';


const DocsPageDoc = () => {
    const [dir, setDir] = useState<string | null>(null);
    const [page, setPage] = useState<string | null>(null);
    const [pageContent, setPageContent] = useState<{
        id: string,
        title: string,
        vocabulary: { term: string, definition: string }[]
    } | null>(null);

    const [content, setContent] = useState<{
        title: string,
        description: string,
        content: { id: string, title: string, vocabulary: string[] }[]
    } | null>(null);

    useEffect(() => {
        const dirTab = window.location.pathname.split("/")[2];
        const pageTab = window.location.pathname.split("/")[3];
        if (dirTab) {
            setDir(dirTab);
        } else {
            setDir(null);
        }
        if (pageTab) {
            setPage(pageTab);
        } else {
            setPage(null);
        }
    }, [])

    useEffect(() => {
        if (dir) {
            fetch(`/src/pages/docs/pages/${dir}.json`).then(res => res.json()).then(data => {
                console.log(data);
                setContent(data);
                if (page) {
                    const pageData = data.content.find((p: any) => p.page === page);
                    console.log(pageData, "pageData");
                    setPageContent(pageData || null);
                }
            }).catch((error) => {
                console.log("Error fetching documentation", error);
                setContent(null);
            });
        }
    }, [dir, page])

    if (content === null) {
        return (
            <Loader loading={true} />
        )
    }

    if (content) {
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
                                window.location.href = "https://app.naflows.com";
                            }}>
                                Open NASS App
                            </button>
                        </div>
                        <div className="docs__page__title">
                            <h3><span className="category" onClick={() => {
                                window.location.href = `/docs/${dir}`;
                            }}>{content.title}</span> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg> {pageContent ? <span>{pageContent.title}</span> : <span>Select a page</span>}</h3>
                            <p>{content.description}</p>
                        </div>

                        {
                            page != null ? (
                                <>
                                    <div key={pageContent.id} className="docs__page__content">
                                        <div className="docs__page__menu">
                                            <h5>On this page</h5>
                                            <ul>
                                                <li><a href="#vocabulary">1.1. Vocabulary</a></li>
                                            </ul>
                                            {
                                                pageContent && (pageContent as any).sections && (pageContent as any).sections.map((section: any, index: number) => (
                                                    <ul key={section.id}>
                                                        <li><a href={`#${section.id}`}>
                                                            {pageContent.id}.{index + 2}. {section.title}
                                                        </a></li>
                                                    </ul>
                                                ))
                                            }
                                        </div>

                                        <div className="docs__page__vocabulary docs__page__section" id="vocabulary">
                                            <h5 className="docs__page__section__title">Vocabulary</h5>
                                            <table className="docs__page__vocabulary-table">
                                                <thead>
                                                    <tr>
                                                        <th>Term</th>
                                                        <th>Definition</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pageContent && pageContent.vocabulary && pageContent.vocabulary.map((term: { term: string, definition: string }, index: number) => (
                                                        <tr key={index}>
                                                            <td><strong>{term.term}</strong></td>
                                                            <td>{term.definition}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="docs__page__sections">
                                            {pageContent && (pageContent as any).sections && (pageContent as any).sections.map((section: any) => (
                                                <div key={section.id} className="docs__page__section" id={section.id}>
                                                    <h5 className="docs__page__section__title">
                                                        {section.id}. {section.title}
                                                    </h5>
                                                    <p className="content" dangerouslySetInnerHTML={{ __html: section.content }} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="docs__page__references docs__page__section">
                                            <h5 className="docs__page__section__title">References</h5>
                                            <div className="references__content">
                                                {pageContent && (pageContent as any).references && (pageContent as any).references.map((ref: any, index: number) => (
                                                    <div className="reference" key={index} onClick={() => {
                                                        window.open(ref.link, "_blank");
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z" /></svg>
                                                        <span>{ref.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>


                                </>
                            ) : (
                                <div className="docs__page__content">
                                    <div className="directory">
                                        {content.content.map((page: any) => (
                                            <div key={page.id} className="directory__item" onClick={() => {
                                                window.location.href = `/docs/${dir}/${page.page}`;
                                            }}>
                                                <div className="directory__item__body">
                                                    <h5 className="directory__item__title">{page.title}</h5>
                                                    <span className="directory__item__description">{page.description}</span>
                                                </div>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" /></svg>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default DocsPageDoc;