import React from 'react';
import { useStyletron } from 'styletron-react';
import { Section } from 'react-scroll-section';
import Description from '../sections/Description';
import Landing from '../sections/Landing';
import { OtherCollections } from '../sections/OtherCollections';
import Team from '../sections/Team';
import FAQSection from '../sections/FAQ';

export const Main = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <div
            className={css({
                minHeight: '100vh',
                width: '100%',
            })}
        >
            <Section id="Landing">
                <Landing />
            </Section>
            <Section id="Project">
                <Description />
            </Section>
            <Section id="OtherCollections">
                <OtherCollections />
            </Section>
            <Section id="Team">
                <Team />
            </Section>
            <Section id="FAQ">
                <FAQSection />
            </Section>
        </div>
    );
};

export default Main;
