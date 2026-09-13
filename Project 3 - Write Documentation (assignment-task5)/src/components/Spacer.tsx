import React from 'react';
import { View } from 'react-native';

/** Properties accepted by {@link Spacer}. */
interface SpacerProps {
    /** Size of the gap in pixels. Defaults to 8. */
    size?: number;
    /** When true the gap is horizontal (between items in a row). Defaults to vertical. */
    horizontal?: boolean;
}

/**
 * Invisible element that adds a fixed gap between other elements.
 *
 * Capabilities: vertical or horizontal spacing of any size, so screens don't need
 * one-off margins everywhere.
 *
 * @param props - See {@link SpacerProps}.
 * @returns An empty View of the requested size.
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
