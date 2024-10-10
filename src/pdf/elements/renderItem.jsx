import { Text, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create( {
	line: {
		borderBottom: '1 solid #AAA',
		fontSize: 12,
		height: 20,
		minHeight: 20,
		padding: '2 0 0 5',
	},
} );

export function renderItem( text, index ) {
	return (
		<Text key={ index } style={ styles.line }>
			{text}
		</Text>
	);
}
