import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';

import { H1, H2, H3, H4 } from './Heading';
import { getFramePropsStory } from '../../../utils/frameProps';
import { getTextPropsStory } from '../utils';
import { allowedTextFrameProps, allowedTextTextProps, textVariants } from '../Text/Text';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const meta: Meta = {
    title: 'Typography',
} as Meta;
export default meta;

export const Heading: StoryObj = {
    render: props => (
        <Wrapper>
            <H1 {...props}>This is heading 1</H1>
            <H2 {...props}>This is heading 2</H2>
            <H3 {...props}>This is heading 3</H3>
            <H4 {...props}>This is heading 4</H4>
        </Wrapper>
    ),
    args: {
        ...getTextPropsStory(allowedTextTextProps).args,
        ...getFramePropsStory(allowedTextFrameProps).args,
    },
    argTypes: {
        variant: {
            control: {
                type: 'select',
            },
            options: textVariants,
        },
        ...getTextPropsStory(allowedTextTextProps).argTypes,
        ...getFramePropsStory(allowedTextFrameProps).argTypes,
    },
};
