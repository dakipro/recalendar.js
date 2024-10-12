import {Page, Text, View, StyleSheet, Link} from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import HabitsTable from '~/pdf/elements/renderHabitsTable.jsx';
import {monthOverviewLink, monthRetrospectiveLink} from '~/pdf/lib/links';
import { pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class MonthRetrospectivePage extends React.Component {
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
					fontSize: 25,
					fontWeight: 'bold',
					marginLeft: 'auto',
					textDecoration: 'none',
				},
				subheaderBlock: {
					flexDirection: 'column',
					justifyContent: 'flex-end',
					paddingBottom: 5,
					flex: 1,
				},
				subheaderLink: {
					textDecoration: 'none',
					color: 'black',
					fontSize: 10,
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
	render() {
		const { date, config } = this.props;
		const itemsByPage = splitItemsByPages( config.monthReflectionItinerary );
		return (
			<>
				<Page id={ monthRetrospectiveLink( date ) } size={ config.pageSize }>
					<View style={ this.styles.page }>
						<View style={ this.styles.header }>
							<View style={ this.styles.meta }>
								<Link src={ '#' + monthOverviewLink( date, config ) }
									  style={ this.styles.title }>
									{date.format( 'MMMM' ) }&gt;&gt;
								</Link>
								<Text style={ this.styles.title }>
									(Retro)
								</Text>
								<View style={ this.styles.subheaderBlock }>
									<Link src={ '#' + monthOverviewLink( date.add( 1, 'month' ), config ) }
										  style={ this.styles.subheaderLink }>
										{ date.add( 1, 'month' ).format( 'MMMM' ) } »
									</Link>
								</View>

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

MonthRetrospectivePage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( MonthRetrospectivePage );
