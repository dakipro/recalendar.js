import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import {
	ITINERARY_ITEM,
	ITINERARY_LINES,
	ITINERARY_TEXT_NO_LINE,
	ITINERARY_TABLE,
} from '~/lib/itinerary-utils';
import { renderTable } from '~/pdf/elements/renderTable';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
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
	} );

	renderItineraryItem = ( { type, value, alignment }, index ) => {
		switch ( type ) {
			case ITINERARY_TABLE:
				return renderTable( value, index );
			case ITINERARY_ITEM:
				return this.renderItem( value, index );
			case ITINERARY_TEXT_NO_LINE:
				return this.renderTextNoLine( value, index, alignment );
			case ITINERARY_LINES:
			default:
				return this.renderLines( value );
		}
	};

	renderItem( text, index ) {
		return (
			<Text key={ index } style={ this.styles.line }>
				{text}
			</Text>
		);
	}
	renderTextNoLine( text, index, alignment = 'left' ) {
		const textStyle = [
			this.styles.textNoLine,
			alignment === 'right' && { textAlign: 'right' },
		];
		return (
			<Text key={ index } style={ textStyle }>
				{text}
			</Text>
		);
	}

	renderLines( count ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
};

export default Itinerary;
