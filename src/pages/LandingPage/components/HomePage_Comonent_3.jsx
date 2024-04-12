import { useTranslation } from 'react-i18next';

export default function HomePage_Component_3() {
    const { t } = useTranslation();
    return (
        <>
            <section className='HomePage_Comp3'>

                <div className="flex-container">

                    <div className="flex-item-left">
                        <h2>How we do?</h2>
                        <p>
                            A requestor requests for help (similar to requesting for a car), this request will be matched to a few available volunteers based on their profile(similar to available nearest car drivers), one volunteer will be picked to help this requestor (similar to one chosen car) and finally this volunteer approaches the requestor(car arrives at the location where we are). Then onwards, this volunteer works with the requestor (car is giving you the ride) and sees that this request is fulfilled (car will take you to your destination) by working with fellow local volunteers or volunteer organizations. Our success depends on number of volunteers and number of volunteer organizations that we can contact/make use of.
                        </p>
                    </div>
                    <div className="flex-item-right"><img src="images/saayam.jpeg" alt="logo" /></div>
                </div>
            </section>
        </>
    )
}