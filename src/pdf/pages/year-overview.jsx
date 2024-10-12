import { Link, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { quarterOverviewLink, yearOverviewLink } from '~/pdf/lib/links';

class YearOverviewPage extends React.Component {
	styles = StyleSheet.create( {
		yearContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
		},
		year: {
			fontSize: 48,
			fontWeight: 'bold',
			textAlign: 'center',
		},
		quarter: {
			fontSize: 24,
			marginHorizontal: 10,
			textDecoration: 'none',
			color: 'black',
		},
		calendars: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'center',
		},
	} );

	renderCalendars() {
		const calendars = [];
		const { startDate, endDate, config } = this.props;
		let currentDate = startDate;
		while ( currentDate.isBefore( endDate ) ) {
			calendars.push(
				<MiniCalendar
					key={ currentDate.unix() }
					date={ currentDate }
					highlightMode={ HIGHLIGHT_NONE }
					config={ config }
				>
					{currentDate.format( 'MMMM YYYY' )}
				</MiniCalendar>,
			);
			currentDate = currentDate.add( 1, 'month' );
		}

		return calendars;
	}

	render() {
		const { config, startDate } = this.props;
		const quarterDate = startDate.startOf( 'year' ); // First month of quarter 1
		return (
			<Page id={ yearOverviewLink() } size={ config.pageSize }>
				<View style={ this.styles.yearContainer }>
					<Link src={ '#' + quarterOverviewLink( quarterDate ) }
						style={ this.styles.quarter }>
						Q1 »
					</Link>
					<Link src={ '#' + quarterOverviewLink( quarterDate.add( 3, 'month' ) ) }
						style={ this.styles.quarter }>
						Q2 »
					</Link>
					<Text style={ this.styles.year }>{startDate.year()}</Text>
					<Link src={ '#' + quarterOverviewLink( quarterDate.add( 6, 'month' ) ) }
						style={ this.styles.quarter }>
						Q3 »
					</Link>
					<Link src={ '#' + quarterOverviewLink( quarterDate.add( 9, 'month' ) ) }
						style={ this.styles.quarter }>
						Q4 »
					</Link>
				</View>
				<View style={ this.styles.calendars }>{this.renderCalendars()}</View>
			</Page>
		);
	}
}

YearOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	endDate: PropTypes.instanceOf( dayjs ).isRequired,
	startDate: PropTypes.instanceOf( dayjs ).isRequired,
};

export default YearOverviewPage;
