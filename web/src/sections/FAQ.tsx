import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStyletron } from 'styletron-react';
import BG from '../assets/megadigitalHQ.jpg';
import { useThemeContext } from '../contexts/ThemeContext';

interface FAQItem {
    title: string;
    contents: React.ReactNode;
}
const FAQItems: FAQItem[] = [
    {
        title: 'What is the total supply?',
        contents:
            'Cyberpunk Ape Executives are a collection of 3000 ERC-721 NFTs on the Ethereum blockchain.',
    },
    {
        title: 'How much does it cost to mint?',
        contents: '0.06 ETH + gas.',
    },
    {
        title: 'When is the launch?',
        contents: (
            <div>
                <div>
                    <b>Presale</b>: January 20th, 2022 at 6 PM PST (until 2 AM
                    PST)
                </div>
                <div>
                    <b>Public Sale</b>: January 21st, 2022 at 6 PM PST
                </div>
            </div>
        ),
    },
    {
        title: 'Where can I mint?',
        contents: 'Once available, you’ll be able to mint on our website.',
    },
    {
        title: 'How will minting work?',
        contents: (
            <div>
                <h1>Whitelist-only mint phase</h1>
                <div>
                    We are limiting one mint per wallet for each WL wallet
                    (except Genesis Holders) who get two. This is to make sure
                    that everyone from the community gets an equal chance to
                    initially mint. It also means you don&apos;t have to
                    participate in gas wars or run to the primary market to get
                    yours on mint day. The whitelist mint will run for 24 hours.
                </div>
                <h1>Public mint phase</h1>
                <div>
                    For the limited amount of Ape Executives that are not minted
                    during the whitelist mint, there will be a public mint. This
                    will also be capped at 1 per wallet, but the practical
                    reality is that it is very easy to mint from multiple burner
                    wallets.
                </div>
            </div>
        ),
    },
    {
        title: 'How do I get on the whitelist?',
        contents: (
            <div>
                <ol>
                    <li>
                        Two WL spots are guaranteed for our Genesis collection
                        holders
                    </li>
                    <li>
                        Most of the whitelist will be given out through our
                        Discord/Twitter Discord/Twitter as the launch date gets
                        closer so stay turned to our social media announcements
                        for when that happens.
                    </li>
                    <li>
                        WL will also be given to helpful community members and
                        good fan-art in our discord.
                    </li>
                </ol>
            </div>
        ),
    },
    {
        title: 'How will staking work?',
        contents: `All Cyberpunk Ape Executives (except Genesis) will be able to be staked. The token is called "College $Credit." After all, if you all are "Unpaid Interns," that's what you should be working for.`,
    },
    {
        title: `Why can't Genesis Ape Executives stake?`,
        contents: `We considered allowing for Genesis staking (for example, migrating from the OS Shared contract), but in the end every option proved to be more expensive for the whole community in transaction fees, and we'd rather give that back to you all in value. As a result, for now, Genesis holders will get many of the perks of staking but won't have to stake. Snapshots will be taken periodically and airdrops of perks will be given.`,
    },
    {
        title: 'What are the staking "economics"?',
        contents: `Staking is logarithmic. Staking awards increase over time with how long your token is staked. There is a cap. We'd like to reward people who want to support the project for the long haul. Staking isn't for everyone though, so future collections with have passive options as well. We have gas optimized claiming. Futher information will be available on our staking page once it is launched.`,
    },
    {
        title: 'What is International Megadigital?',
        contents: `We are a group of artists who work on art projects after our day jobs. Over the last 5+ years, we many ephemeral projects, a successful Kickstarter, top 500 Vine accounts. Much of it is not labeled as International Megadigital and typically, most of it is deleted when the project. Our work in NFTs has brought an interesting level of semi-permanence to our work. We have mostly worked in obscurity because making weird anti-corporate art in the evening is a bad look to day-job employers. Some of us have children now and contribute mainly in spirit. Also, making weirdo art under a shroud of anonymous mystery is kind of "sexy." We eternally appreciate everyone who has supported our NFT work so far, and promise that this is only the beginning. We have no illusions that we will appeal to everyone. But hopefully, we will appeal to a small percentage of weirdos, and you all are what actually matters.`,
    },
];

export const FAQSection = (): JSX.Element => {
    const [css] = useStyletron();
    const theme = useThemeContext();

    return (
        <div
            className={css({
                display: 'flex',
                boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.3)',
                justifyContent: 'center',
                backgroundImage: `url(${BG})`,
                backgroundSize: 'cover',
                minHeight: '100vh',
                alignItems: 'center',
                padding: '20px',
                flexDirection: 'column',
            })}
        >
            <h1
                className={css({
                    color: theme.fontColors.normal.primary.getCSSColor(1),
                    width: '100%',
                    marginTop: '30px',
                })}
            >
                FAQ
            </h1>
            {FAQItems.map((i, index) => (
                <Accordion
                    key={i.title}
                    className={css({
                        alignSelf: 'stretch',
                        backgroundColor: `${theme.backgroundColor.getCSSColor(
                            0.7
                        )} !important`,
                    })}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography
                            className={css({
                                color: theme.fontColors.normal.primary.getCSSColor(
                                    1
                                ),
                                fontFamily: `${theme.fontFamily} !important`,
                            })}
                        >
                            {index + 1}. {i.title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            className={css({
                                color: theme.fontColors.normal.primary.getCSSColor(
                                    1
                                ),
                                fontFamily: `${theme.fontFamily} !important`,
                            })}
                        >
                            {i.contents}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default FAQSection;
