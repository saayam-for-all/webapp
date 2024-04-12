import { useTranslation } from 'react-i18next';

export default function HomePage_Component_1() {
    const { t } = useTranslation();

    return (
        <>
            <section className='HomePage_Comp2'>

                <div className="flex-container">
                    <div className="flex-item-left"><img src="images/saayam.jpeg" alt="logo" /></div>
                    <div className="flex-item-right">
                        <h2>What we do?</h2>
                        <p>Assistance to others who are facing problems in their life is the help one can provide. The idea of this assistance has led us to put together a system that can reach many individuals and families, who can find the assistance that could help overcome their problem.</p>
                    </div>
                </div>
            </section>
        </>
    )
}