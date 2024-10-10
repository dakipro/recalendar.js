// src/pdf/utils/renderTable.js
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create( {
	tableTitle: {
		fontSize: 10,
		width: 50,
		textAlign: 'center',
		writingMode: 'vertical-rl',
		transform: 'rotate(-90deg)',
		flexShrink: 0,
		borderWidth: 1,
		borderColor: '#AAA',
		minHeight: 10,
	},
	rowTitle: {
		fontSize: 8,
		width: 10,
		transform: 'rotate(-90deg)',
		flexShrink: 0,
		minHeight: 10,
	},
	tableCell: {
		fontSize: 12,
		flex: 1,
		textAlign: 'center',
		borderWidth: 1,
		borderColor: '#AAA',
		minHeight: 50,
		lineHeight: 1.5,
	},
	columnHeader: {
		fontSize: 12,
		flex: 1,
		textAlign: 'center',
		minHeight: 10,
		lineHeight: 1,
	},
	rowContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
} );

export function renderTable( { rows, columns, titles, columnTitles, cellValues = [] }, index ) {
	const tableRows = [];
	if ( columnTitles ) {
		tableRows.push(
			<View key={ 'column-titles' } style={ { flexDirection: 'row' } }>
				<Text style={ styles.rowTitle }></Text>
				{columnTitles.map( ( title, colIndex ) => (
					<Text key={ `col-title-${colIndex}` } style={ styles.columnHeader }>
						{title}
					</Text>
				) )}
			</View>,
		);
	}
	for ( let rowIndex = 0; rowIndex < rows; rowIndex++ ) {
		tableRows.push(
			<View key={ `content-${rowIndex}` } style={ styles.rowContainer }>
				<Text key={ `title-${rowIndex}` } style={ styles.rowTitle }>
					{titles[ rowIndex ]}
				</Text>
				{[ ...Array( columns ) ].map( ( _, colIndex ) => (
					<Text key={ `col-${colIndex}` } style={ styles.tableCell }>
						{cellValues[ rowIndex ] && cellValues[ rowIndex ][ colIndex ]
							? cellValues[ rowIndex ][ colIndex ] : ''}
					</Text>
				) )}
			</View>,
		);
	}
	return <View key={ index }>{tableRows}</View>;
}
