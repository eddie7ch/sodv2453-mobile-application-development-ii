import React from 'react';
import { View } from 'react-native';

interface SpacerProps {
    size?: number;
    horizontal?: boolean; // width instead of height, for horizontal layouts
}

// plain empty View for consistent gaps in flex layouts instead of margin
// on every sibling
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
