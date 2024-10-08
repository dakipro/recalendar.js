import { StyleSheet, Text } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES, ITINERARY_TEXT_NO_LINE } from '~/lib/itinerary-utils';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		textNoLine: {
			fontSize: 10,
			height: 16,
			minHeight: 16,
			padding: '2 0 0 5',
		},
	} );

	renderItineraryItem = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );
			case ITINERARY_TEXT_NO_LINE:
				return this.renderTextNoLine( value, index );
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

	renderTextNoLine( text, index ) {
		return (
			<Text key={ index } style={ this.styles.textNoLine }>
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
