import { Meta, StoryObj } from '@storybook/react';

import { Paragraph as P } from './Paragraph';
import { getFramePropsStory } from '../../../utils/frameProps';
import { getTextPropsStory } from '../utils';
import { allowedTextFrameProps, allowedTextTextProps, TextProps, textVariants } from '../Text/Text';

const meta: Meta = {
    title: 'Typography',
    component: P,
} as Meta;
export default meta;

export const Paragraph: StoryObj<TextProps> = {
    args: {
        typographyStyle: 'body',
        children:
            'Quos delectus veritatis est doloribus dolor. Odit fugit omnis magni ipsam quia rem aut. Et alias sint non. Consequuntur dignissimos veritatis debitis corporis esse. Quaerat voluptatem unde aut. Iusto laborum omnis quis amet atque. Sint culpa delectus non soluta temporibus saepe. Sequi saepe corrupti aliquam ut sit assumenda aspernatur consequuntur. Ut est ullam iusto facilis voluptatibus. Sit est cum quos. Quasi deleniti non fugit iste alias consequuntur. Ullam ad ut culpa est reiciendis molestiae. Reiciendis ab veritatis a totam inventore nihil voluptatem occaecati. Quisquam atque odit quia nam. Laboriosam rem et ut. Maxime qui voluptatem voluptatem.',
        ...getFramePropsStory(allowedTextFrameProps).args,
        ...getTextPropsStory(allowedTextTextProps).args,
    },
    argTypes: {
        variant: {
            control: {
                type: 'select',
            },
            options: textVariants,
        },
        ...getFramePropsStory(allowedTextFrameProps).argTypes,
        ...getTextPropsStory(allowedTextTextProps).argTypes,
    },
};
