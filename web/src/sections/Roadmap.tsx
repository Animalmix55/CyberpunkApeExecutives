import React from 'react';
import { useStyletron } from 'styletron-react';
import BG from '../assets/Urban cyberpunk.png';
import useMobile from '../hooks/useMobile';

export const Roadmap = (): JSX.Element => {
    const [css] = useStyletron();
    const isMobile = useMobile();

    return (
        <div>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundImage: `url(${BG})`,
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    boxShadow: 'inset 0 0 0 1000px rgba(0,0,0,.3)',
                    padding: isMobile ? '10px' : '20px',
                })}
            >
                <div
                    className={css({
                        color: 'white',
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, .4)',
                        borderRadius: '20px',
                    })}
                >
                    <h1>Roadmap</h1>
                    <div>
                        Lorem ipsum dolor sit amet. Ut atque voluptas sit labore
                        soluta et dignissimos deserunt. Vel suscipit error aut
                        iusto veritatis id maiores eos itaque illum vel
                        dignissimos nesciunt At rerum illum non ipsam quis. Ut
                        mollitia ullam ad fugiat voluptatem vel dolores
                        inventore. Sit accusantium dolores et tenetur itaque sit
                        optio excepturi. Ut incidunt modi a excepturi error aut
                        quisquam aperiam quo omnis itaque et excepturi natus. Ut
                        Quis blanditiis ab galisum dicta vel sint blanditiis et
                        commodi ullam. In omnis molestias et odio ullam ut quasi
                        officia non voluptatem aliquid qui omnis nemo eum rerum
                        impedit. Aut iusto dolores sit quaerat assumenda non
                        aliquam cumque est rerum neque qui rerum nulla ab
                        galisum sapiente. Sed incidunt suscipit sed excepturi
                        suscipit a porro odit qui blanditiis maxime qui esse
                        doloribus ut commodi recusandae sit accusamus velit?
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
