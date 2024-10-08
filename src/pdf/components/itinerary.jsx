import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import {
	ITINERARY_ITEM,
	ITINERARY_LINES,
	ITINERARY_TEXT_NO_LINE,
	ITINERARY_TABLE,
} from '~/lib/itinerary-utils';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create({
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		textNoLine: {
			fontSize: 8,
			padding: '2 0 0 5',
		},
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
	});

	renderItineraryItem = ({ type, value }, index) => {
		switch (type) {
			case ITINERARY_TABLE:
				return this.renderTable(value, index);
			case ITINERARY_ITEM:
				return this.renderItem(value, index);
			case ITINERARY_TEXT_NO_LINE:
				return this.renderTextNoLine(value, index);
			case ITINERARY_LINES:
			default:
				return this.renderLines(value);
		}
	};

	renderItem(text, index) {
		return (
			<Text key={index} style={this.styles.line}>
				{text}
			</Text>
		);
	}

	renderTextNoLine(text, index) {
		return (
			<Text key={index} style={this.styles.textNoLine}>
				{text}
			</Text>
		);
	}

	renderLines(count) {
		const lines = [];
		for (let i = 0; i < count; i++) {
			lines.push(<Text key={i} style={this.styles.line}></Text>);
		}

		return lines;
	}

	renderTable({ rows, columns, titles, columnTitles }, index) {
		const tableRows = [];
		if (columnTitles) {
			tableRows.push(
				<View key={`column-titles`} style={{ flexDirection: 'row' }}>
					<Text style={this.styles.rowTitle}></Text>
					{columnTitles.map((title, colIndex) => (
						<Text key={`col-title-${colIndex}`} style={this.styles.columnHeader}>
							{title}
						</Text>
					))}
				</View>
			);
		}
		for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
			tableRows.push(
				<View key={`content-${rowIndex}`} style={this.styles.rowContainer}>
					<Text key={`title-${rowIndex}`} style={this.styles.rowTitle}>
						{titles[rowIndex]}
					</Text>
					{[...Array(columns)].map((_, colIndex) => (
						<Text key={`col-${colIndex}`} style={this.styles.tableCell}>

						</Text>
					))}
				</View>
			);
		}
		return <View key={index}>{tableRows}</View>;
	}

	render() {
		return <>{this.props.items.map(this.renderItineraryItem)}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
};

export default Itinerary;
