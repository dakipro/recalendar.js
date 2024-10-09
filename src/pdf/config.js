import dayjs from 'dayjs/esm';
import { t } from 'i18next';

import { wrapWithId } from '~/lib/id-utils';
import {
	ITINERARY_ITEM,
	ITINERARY_LINES,
	ITINERARY_NEW_PAGE,
	ITINERARY_TABLE,
	ITINERARY_TEXT_NO_LINE
} from '~/lib/itinerary-utils';
import {
	HOLIDAY_DAY_TYPE,
	EVENT_DAY_TYPE,
} from '~/lib/special-dates-utils';
import { LATO } from '~/pdf/lib/fonts';

const CONFIG_FIELDS = [
	'fontFamily',
	'year',
	'month',
	'firstDayOfWeek',
	'monthCount',
	'weekendDays',
	'isLeftHanded',
	'alwaysOnSidebar',
	'isMonthOverviewEnabled',
	'habits',
	'monthItinerary',
	'isWeekOverviewEnabled',
	'todos',
	'dayItineraries',
	'isWeekRetrospectiveEnabled',
	'weekRetrospectiveItinerary',
	'specialDates',
];

export const CONFIG_FILE = 'config.json';
export const CONFIG_VERSION_1 = 'v1';
export const CONFIG_VERSION_2 = 'v2';
export const CONFIG_VERSION_3 = 'v3';
export const CONFIG_CURRENT_VERSION = CONFIG_VERSION_3;

export function hydrateFromObject( object ) {
	return CONFIG_FIELDS.reduce(
		( fields, field ) => ( {
			...fields,
			[ field ]: object[ field ],
		} ),
		{},
	);
}

class PdfConfig {
	constructor( configOverrides = {} ) {
		this.year = dayjs().year();
		this.month = 9;
		this.firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		this.weekendDays = [ 0, 6 ];
		this.isLeftHanded = false;
		this.alwaysOnSidebar = false;
		this.monthCount = 3;
		this.fontFamily = LATO;
		this.isMonthOverviewEnabled = true;
		this.habits = [
			// t( 'habits.example1', { ns: 'config' } ),
			// t( 'habits.example2', { ns: 'config' } ),
			// t( 'habits.example3', { ns: 'config' } ),
			// t( 'habits.example4', { ns: 'config' } ),
		];
		this.monthItinerary = [
			{
				type: ITINERARY_ITEM,
				value: t( 'month.goal', { ns: 'config' } ),
			},
			{
				type: ITINERARY_LINES,
				value: 3,
			},
			{
				type: ITINERARY_ITEM,
				value: t( 'month.notes', { ns: 'config' } ),
			},
			{
				type: ITINERARY_LINES,
				value: 10,
			},
		];
		this.isWeekOverviewEnabled = true;
		this.todos = [
			// t( 'todos.example1', { ns: 'config' } ),
			// t( 'todos.example2', { ns: 'config' } ),
		];

		let dayOfWeek = this.firstDayOfWeek;

		this.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
			const items = [
				{
					type: ITINERARY_TABLE,
					value: {
						rows: 4,
						columns: 3,
						columnTitles: ['Health', 'Wealth', 'Relationships'],
						titles: ['Identity', 'Values', 'Goal', 'Proof'],
					},
				},
				{
					type: ITINERARY_TEXT_NO_LINE,
					value:
						'[ ] Visualise (excellence, procrastination, goals)        ' +
						'[ ] Excercise (Yoga, rubber, stretches)           ' +
						'[ ] Identity (dream team)',
				},
				{
					type: ITINERARY_TEXT_NO_LINE,
					value:
						'[ ] Meditate (relax, past, future, enjoy, present)        ' +
						'[ ] Affirm (So good they can\'t ignore you)     ' +
						'[ ] Read (Book, course)',
				},
				{
					type: ITINERARY_TABLE,
					value: {
						rows: 4,
						columns: 1,
						columnTitles: [],
						titles: ['Morning', 'Maker', 'Manager', 'Evening'],
					},
				},

				{ type: ITINERARY_TEXT_NO_LINE, value: '( ↓ Retrospective on the next page ↓ )                                     Was this an olympic day?       [ W ]        [ L ]     .', alignment: 'right' },

				{ type: ITINERARY_NEW_PAGE },
				{ type: ITINERARY_ITEM, value: 'Why was this olympic WIN? Or why was it LEARN?' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'Who made a difference?' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'A moment that I really appreciated today was…' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'A situation or task I handled well today was…' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'Something I realized or learned today was…' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'Something that could have helped me feel more connected to others would have been…' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'If I was my own high performance coach, I would tell myself this…' },
				{ type: ITINERARY_LINES, value: 2 },
				{ type: ITINERARY_ITEM, value: 'CLARITY  I knew my “why” and I lived intentionally today _____' },
				{ type: ITINERARY_ITEM, value: 'ENERGY  I managed my mental and physical energy well _____' },
				{ type: ITINERARY_ITEM, value: 'NECESSITY I felt it was necessary to be my best and made success a “must” _____' },
				{ type: ITINERARY_ITEM, value: 'PRODUCTIVITY I worked on things that mattered most today _____' },
				{ type: ITINERARY_ITEM, value: 'INFLUENCE I guided or treated others well today _____' },
				{ type: ITINERARY_ITEM, value: 'COURAGE I shared my real self, thoughts and feelings today _____' },
			];

			const itinerary = {
				dayOfWeek,
				items,
				isEnabled: true,
			};
			dayOfWeek = ++dayOfWeek % 7;
			return itinerary;
		} );
		this.isWeekRetrospectiveEnabled = true;
			// TODO: have a goal for the week, and month

		this.weekRetrospectiveItinerary = [
			// TODO: grade week towards goal progress
			{
				type: ITINERARY_LINES,
				value: 50,
			},
		];
		// See https://github.com/diegomura/react-pdf/issues/2006
		this.pageSize = [ 445, 592 ]; // [ '157mm', '209mm' ];
		this.specialDates = [
			
			// TODO: enter special dates, birthdays, red days in norway etc
			{
				date: '01-01',
				value: t( 'special-dates.example1', { ns: 'config' } ),
				type: HOLIDAY_DAY_TYPE,
			},
		];

		if ( Object.keys( configOverrides ).length !== 0 ) {
			Object.assign( this, configOverrides );
		}

		this.ensureUniqueIds();
	}

	ensureUniqueIds() {
		const fieldsRequiringUniqueIds = [
			'habits',
			'monthItinerary',
			'specialDates',
			'todos',
			'weekRetrospectiveItinerary',
		];

		fieldsRequiringUniqueIds.forEach( ( field ) => {
			const thisField = this[ field ];
			this[ field ] = thisField.map( wrapWithId );
		} );

		this.dayItineraries = this.dayItineraries.map( ( dayItinerary ) => {
			dayItinerary.items = dayItinerary.items.map( wrapWithId );
			return dayItinerary;
		} );
	}
}

export default PdfConfig;
