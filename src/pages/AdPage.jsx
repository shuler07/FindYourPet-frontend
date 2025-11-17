import "./AdPage.css";

import { useContext } from "react";
import { AppContext } from "../App";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AdPage() {
    const ad = useContext(AppContext).ad;

    return (
        <>
            <Header />
            <div id="ad-page-container" className="page-container">
                <PetPhotos />
                <PetInfo
                    status={ad.status}
                    type={ad.type}
                    breed={ad.breed}
                    color={ad.color}
                    size={ad.size}
                    distincts={ad.distincts}
                    nickname={ad.nickname}
                    danger={ad.danger}
                    location={ad.location}
                    time={ad.time}
                />
                <PetContacts
                    contactName={ad.contactName}
                    contactPhone={ad.contactPhone}
                    contactEmail={ad.contactEmail}
                    extras={ad.extras}
                />
                <PetPlace geoLocation={ad.geoLocation} />
            </div>
            <Footer />
        </>
    );
}

function PetPhotos() {
    return (
        <section id="ad-photos" className="ad-page-section">
            <img src="/images/image-not-found.png" />
        </section>
    );
}

function PetInfo({
    status,
    type,
    breed,
    color,
    size,
    distincts,
    nickname,
    danger,
    location,
    time,
}) {
    return <section className="ad-page-section"></section>;
}

function PetContacts({ contactName, contactPhone, contactEmail, extras }) {
    return <section className="ad-page-section"></section>;
}

function PetPlace({ geoLocation }) {
    return <section className="ad-page-section"></section>;
}
