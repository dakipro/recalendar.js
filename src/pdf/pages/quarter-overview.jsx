import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { monthOverviewLink, monthRetrospectiveLink, quarterOverviewLink } from '~/pdf/lib/links';
import { pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class QuarterOverviewPage extends React.Component {
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
				subheaderBlock: {
					flexDirection: 'column',
					justifyContent: 'flex-end',
					paddingLeft: 5,
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
		const itemsByPage = splitItemsByPages( config.monthItinerary );
		return (
			<>
				<Page id={ quarterOverviewLink( 'Q' + date.format( 'Q' ) ) } size={ config.pageSize }>
					<View style={ this.styles.page }>
						<View style={ this.styles.header }>
							<View style={ this.styles.subheaderBlock }>
								<Link src={ '#' + monthRetrospectiveLink( date ) } style={ this.styles.subheaderLink }>
                                    Quarter retro »
								</Link>
							</View>

							<View style={ this.styles.meta }>
								<Text style={ this.styles.title }>Q{date.format( 'Q' )}</Text>
							</View>

							<MiniCalendar
								date={ date }
								highlightMode={ HIGHLIGHT_NONE }
								config={ config }
							/>
						</View>
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

QuarterOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( QuarterOverviewPage );
