import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import HabitsTable from '~/pdf/elements/renderHabitsTable.jsx';
import { dayPageLink, monthOverviewLink } from '~/pdf/lib/links';
import { pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class MonthOverviewPage extends React.Component {
	constructor( props ) {
		super( props );

		const stylesObject = Object.assign(
			{
				content: {
					flex: 1,
					flexGrow: 1,
				},
				header: {
					flexGrow: 0,
					flexDirection: 'row',
					borderBottom: '1 solid black',
				},
				meta: {
					flexGrow: 1,
					flexDirection: 'column',
					borderRight: '1 solid black',
					justifyContent: 'center',
				},
				title: {
					textTransform: 'uppercase',
					color: 'black',
					padding: '10 5',
					fontSize: 35,
					fontWeight: 'bold',
					marginLeft: 'auto',
				},
			},
			{ page: pageStyle( props.config ) },
		);

		if ( this.props.config.isLeftHanded ) {
			stylesObject.header.flexDirection = 'row-reverse';

			stylesObject.meta.borderLeft = '1 solid black';
			stylesObject.meta.borderRight = 'none';

			delete stylesObject.title.marginLeft;
		}

		this.styles = StyleSheet.create( stylesObject );
	}

	// TODO - move this to a month review component
	// (rules: no more then 6Ls in a month, no more then 2 in a row)

	renderDay( day ) {
		return (
			<Link
				key={ day.unix() }
				src={ '#' + dayPageLink( day, this.props.config ) }
				style={ this.styles.habitDay }
			>
				<Text style={ this.styles.habitDayDate }>{day.format( 'D' )}</Text>
				<Text style={ this.styles.habitDayOfWeek }>{day.format( 'dd' )}</Text>
			</Link>
		);
	}

	render() {
		const { date, config } = this.props;
		const itemsByPage = splitItemsByPages( config.monthItinerary );
		return (
			<>
				<Page id={ monthOverviewLink( date, config ) } size={ config.pageSize }>
					<View style={ this.styles.page }>
						<View style={ this.styles.header }>
							<View style={ this.styles.meta }>
								<Text style={ this.styles.title }>{date.format( 'MMMM' )}</Text>
							</View>
							<MiniCalendar
								date={ date }
								highlightMode={ HIGHLIGHT_NONE }
								config={ config }
							/>
						</View>
						<HabitsTable date={ date } config={ config } t={ this.props.t } range="month" />

						<View style={ this.styles.content }>
							<Itinerary items={ itemsByPage[ 0 ] } />
						</View>
					</View>
				</Page>
				{itemsByPage.slice( 1 ).map( ( items, index ) => (
					<Page key={ index } size={ config.pageSize }>
						<View style={ this.styles.page }>
							<Itinerary items={ items } />
						</View>
					</Page>
				) )}
			</>
		);
	}
}

MonthOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( MonthOverviewPage );
