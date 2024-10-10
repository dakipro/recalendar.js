import PropTypes from 'prop-types';
import React from 'react';

import {
	ITINERARY_ITEM,
	ITINERARY_LINES,
	ITINERARY_TEXT_NO_LINE,
	ITINERARY_TABLE,
} from '~/lib/itinerary-utils';
import { renderItem } from '~/pdf/elements/renderItem';
import { renderLines } from '~/pdf/elements/renderLines.jsx';
import { renderTable } from '~/pdf/elements/renderTable';
import { renderTextNoLine } from '~/pdf/elements/renderTextNoLine.jsx';

class Itinerary extends React.PureComponent {
	renderItineraryItem = ( { type, value, alignment }, index ) => {
		switch ( type ) {
			case ITINERARY_TABLE:
				return renderTable( value, index );
			case ITINERARY_ITEM:
				return renderItem( value, index );
			case ITINERARY_TEXT_NO_LINE:
				return renderTextNoLine( value, index, alignment );
			case ITINERARY_LINES:
			default:
				return renderLines( value );
		}
	};
	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
};

export default Itinerary;
