import { useTranslation } from 'react-i18next';
import SaayamLogo from '../../../assets/logo.svg'

export default function HomePage_Component_1() {
    const { t } = useTranslation();

    return (
        <>
            <section className='Home_content HomePage_Comp1'>

                <section className='poster_image'>
                    <center>
                        <img src={SaayamLogo} alt="logo" />
                    </center>
                    <section className="content_section">
                        <p className='MainPage_content'>
                            Saayam org is based on two very simple mottos – "Manava Sevaye Madhava Seva" (Service to mankind is Service to God) and "Sarve jana sukhino bhavantu" (May all live happily).
                        </p>
                        <p className='MainPage_content'>
                            Saayam means "help" in Telugu language. Equivalent words in other languages are - Sahaay in Sanskrit & Hindi, Banazhu in Chinese and Ayuda in Spanish. Our goal is to help the humanity
                        </p>
                        <p className='MainPage_content'>
                            When we are able to request for a car on Uber/Lyft app and order food on a Doordash app, why can't we request for help on an application? This is the main driver for this Saayam project.
                        </p>

                        <p className='MainPage_content'>
                            Anybody from anywhere in the world can make a request for help on any type of social media/communication device. Each request will be matched to a local volunteer so that this volunteer can provide help to this requestor by taking advantage of any local charity organizations or local help. Think of it like an international Lyft/Uber service or an international 911 service. Only requests related to food, clothes, housing, education, healthcare or any general advice would be honored. This charity is beyond any god, religion, country or politics. At the same time, we respect all your beliefs and we do NOT desecrate any god, religion or politics. This charity will be the mother of all charities by linking them or collaborating with them, but it does NOT compete with any other charity. Only expenses will be reimbursed. No payments/salaries to any volunteers or charity organizing/management members. This would be a purely a volunteer based organization.
                        </p>
                        <p className='MainPage_content'>
                            Saayam application will be a cloud native web and mobile application with all the latest and the greatest cloud native technologies. Entire development will be done by industry experts and volunteers. The income we get from donations, ads or other means will be put back into charity.
                        </p>
                        <p className='MainPage_content'>
                            A requestor requests for help (similar to requesting for a car), this request will be matched to a few nearest available volunteers (similar to available nearest car drivers) based on their profile like Tinder, one volunteer will be picked to help this requestor (similar to one chosen car) and finally this volunteer approaches the requestor(car arrives at the location where we are). Then onwards, this volunteer works with the requestor (car is giving you the ride) and sees that this request is fulfilled (car will take you to your destination) by working with fellow local volunteers or volunteer organizations. Our success depends on number of volunteers and number of volunteer organizations that we can contact/make use of.
                        </p>
                    </section>
                </section>

            </section>
        </>
    )
}