import { Text, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create( {
	textNoLine: {
		fontSize: 8,
		padding: '2 0 0 5',
	},
} );

export function renderTextNoLine( text, index, alignment = 'left' ) {
	const textStyle = [
		styles.textNoLine,
		alignment === 'right' && { textAlign: 'right' },
	];
	return (
		<Text key={ index } style={ textStyle }>
			{text}
		</Text>
	);
}
