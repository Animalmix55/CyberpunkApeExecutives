import React from 'react';
import { useStyletron } from 'styletron-react';
import { Section } from 'react-scroll-section';
import Description from '../sections/Description';
import Discord from '../sections/Discord';
import Landing from '../sections/Landing';
import Roadmap from '../sections/Roadmap';
import Team from '../sections/Team';

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
            <Section id="Roadmap">
                <Roadmap />
            </Section>
            <Section id="Team">
                <Team />
            </Section>
            <Section id="Discord">
                <Discord />
            </Section>
        </div>
    );
};

export default Main;
