import PropTypes from 'prop-types';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Stack from 'react-bootstrap/Stack';
import Tooltip from 'react-bootstrap/Tooltip';
import { withTranslation } from 'react-i18next';

import { getJsonAttachment } from '~/lib/attachments';
import { convertConfigToCurrentVersion } from '~/lib/config-compat';
import {
	ITINERARY_ITEM,
	ITINERARY_LINES,
	ITINERARY_NEW_PAGE,
} from '~/lib/itinerary-utils';
import PdfConfig, { CONFIG_FILE } from '~/pdf/config';

const STATUS_EMPTY = 'EMPTY';
const STATUS_LOADING = 'LOADING';
const STATUS_ERROR = 'ERROR';
const STATUS_SUCCESS = 'SUCCESS';

const TEMPLATE_BASIC = 'basic';
const TEMPLATE_ADVANCED = 'advanced';
const TEMPLATE_BLANK = 'blank';
const TEMPLATE_MINIMALISTIC = 'minimalistic';

class ConfigurationSelector extends React.Component {
	state = {
		status: STATUS_EMPTY,
	};

	componentDidMount() {
		this.handleTemplateSelect( { target: { dataset: { template: TEMPLATE_ADVANCED } } } );
	}

	getDefaultFirstDayOfWeek() {
		const config = new PdfConfig();
		return config.firstDayOfWeek;
	}

	handleTemplateSelect = ( event ) => {
		const { t } = this.props;
		const configOverrides = {};
		let dayOfWeek = this.getDefaultFirstDayOfWeek();

		switch ( event.target.dataset.template ) {
			case TEMPLATE_BASIC:
				// The default config
				break;

			case TEMPLATE_ADVANCED:
				break;

			case TEMPLATE_BLANK:
				configOverrides.specialDates = [];
				configOverrides.monthlyHabits = [];
				configOverrides.monthItinerary = [];
				configOverrides.todos = [];
				configOverrides.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
					const itinerary = {
						dayOfWeek,
						items: [],
						isEnabled: true,
					};
					dayOfWeek = ++dayOfWeek % 7;
					return itinerary;
				} );
				configOverrides.weekRetrospectiveItinerary = [];
				break;

			case TEMPLATE_MINIMALISTIC:
				configOverrides.specialDates = [];
				configOverrides.monthlyHabits = [];
				configOverrides.isMonthOverviewEnabled = false;
				configOverrides.monthItinerary = [];
				configOverrides.isWeekOverviewEnabled = true;
				configOverrides.todos = [];
				configOverrides.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
					const itinerary = {
						dayOfWeek,
						items: [],
						isEnabled: false,
					};
					dayOfWeek = ++dayOfWeek % 7;
					return itinerary;
				} );
				configOverrides.isWeekRetrospectiveEnabled = false;
				configOverrides.weekRetrospectiveItinerary = [];
				break;

			default:
				return;
		}

		const config = new PdfConfig( configOverrides );

		this.props.onConfigChange( config );
	};

	generateAdvancedDayItems( dayOfWeek ) {
		const items = [];

		items.push( { type: ITINERARY_LINES, value: 20 } );
		return items;
	}

	handleFileChange = ( event ) => {
		this.setState( {
			status: STATUS_LOADING,
		} );

		const file = event.target.files[ 0 ];
		const reader = new FileReader();
		reader.onload = this.handleFileLoad;

		reader.readAsArrayBuffer( file );
	};

	handleFileLoad = async ( event ) => {
		const attachment = await getJsonAttachment(
			event.target.result,
			CONFIG_FILE,
		);

		if ( ! attachment ) {
			this.setState( {
				status: STATUS_ERROR,
			} );
			return;
		}

		this.setState( {
			status: STATUS_SUCCESS,
		} );

		const newConfig = new PdfConfig( convertConfigToCurrentVersion( attachment ) );
		this.props.onConfigChange( newConfig );
	};

	renderStatusMessage() {
		const { t } = this.props;

		switch ( this.state.status ) {
			case STATUS_LOADING:
				return (
					<Alert variant="info" className="mt-2 mb-0">
						{t( 'configuration.selector.upload.loading' )}
					</Alert>
				);

			case STATUS_ERROR:
				return (
					<Alert variant="danger" className="mt-2 mb-0">
						{t( 'configuration.selector.upload.error' )}
					</Alert>
				);

			case STATUS_SUCCESS:
				return (
					<Alert variant="success" className="mt-2 mb-0">
						{t( 'configuration.selector.upload.success' )}
					</Alert>
				);

			case STATUS_EMPTY:
			default:
				return null;
		}
	}

	renderButton = ( { template, style } ) => {
		const { t } = this.props;
		return (
			<OverlayTrigger
				key={ template }
				placement="bottom"
				overlay={
					<Tooltip>
						{t( `configuration.selector.template.${template}.description` )}
					</Tooltip>
				}
			>
				<Button
					variant={ style }
					data-template={ template }
					onClick={ this.handleTemplateSelect }
				>
					{t( `configuration.selector.template.${template}.label` )}
				</Button>
			</OverlayTrigger>
		);
	};

	render() {
		const { t } = this.props;
		return (
			<Stack>
				<Form.Label>{t( 'configuration.selector.template.label' )}</Form.Label>
				<ButtonGroup aria-label="Config templates">
					{[
						{ template: TEMPLATE_BASIC, style: 'info' },
						{ template: TEMPLATE_ADVANCED, style: 'primary' },
						{ template: TEMPLATE_BLANK, style: 'blank' },
						{ template: TEMPLATE_MINIMALISTIC, style: 'dark' },
					].map( this.renderButton )}
				</ButtonGroup>
				<Form.Group controlId="configurationFile" className="mt-3">
					<Form.Label>{t( 'configuration.selector.upload.label' )}</Form.Label>
					<Form.Control
						type="file"
						accept=".pdf"
						onChange={ this.handleFileChange }
					/>
					{this.renderStatusMessage()}
				</Form.Group>
			</Stack>
		);
	}
}

ConfigurationSelector.propTypes = {
	onConfigChange: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( [ 'app', 'config' ] )( ConfigurationSelector );
