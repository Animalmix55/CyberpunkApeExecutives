import React from 'react';
import { useStyletron } from 'styletron-react';

export const Description = (): JSX.Element => {
    const [css] = useStyletron();

    return (
        <div>
            <div
                className={css({
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                })}
            >
                <div
                    className={css({
                        margin: '40px',
                        color: 'white',
                        padding: '20px',
                        backgroundColor: 'rgba(0, 0, 0, .4)',
                        borderRadius: '20px',
                    })}
                >
                    <h1>The Project</h1>
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

export default Description;
