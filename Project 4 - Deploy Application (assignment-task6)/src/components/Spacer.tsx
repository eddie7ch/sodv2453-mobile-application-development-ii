import React from 'react';
import { View } from 'react-native';

/**
 * Props for {@link Spacer}.
 */
interface SpacerProps {
    /** Size in pixels of the gap this spacer creates (default 8). */
    size?: number;
    /** When true, creates a horizontal gap (fixed width, auto height) instead
     * of the default vertical gap (fixed height, auto width). */
    horizontal?: boolean;
}

/**
 * A tiny empty `View` used to add consistent spacing between elements inside
 * a flex layout, instead of hard-coding `margin` on each sibling.
 */
export default function Spacer({ size = 8, horizontal = false }: SpacerProps) {
    return (
        <View
            style={{
                width: horizontal ? size : 'auto',
                height: !horizontal ? size : 'auto',
            }}
        />
    );
}
