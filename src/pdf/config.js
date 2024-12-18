import dayjs from 'dayjs/esm';
import { t } from 'i18next';

import { wrapWithId } from '~/lib/id-utils';
import {
	ITINERARY_ITEM,
	ITINERARY_LINES,
	ITINERARY_NEW_PAGE,
	ITINERARY_TABLE,
	ITINERARY_TEXT_NO_LINE,
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
	'monthlyHabits',
	'weeklyHabits',
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
		this.year = dayjs().add(1, 'year').year();
		// this.year = dayjs().year();
		this.month = 0;
		this.firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		this.weekendDays = [ 0, 6 ];
		this.isLeftHanded = false;
		this.alwaysOnSidebar = false;
		this.monthCount = 12;
		this.fontFamily = LATO;
		this.isMonthOverviewEnabled = true;
		this.monthlyHabits = [
			'Wins',
			'80/20',
			'8h Sleep',
		];
		this.weeklyHabits = [
			'Wins',
			'80/20',
		];


		this.quarterItinerary = [
			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 2,
					columnTitles: [ '3 years goal', 'Yearly goals' ],
				},
			},
			{
				type: ITINERARY_ITEM,
				value: 'Goals for each month (80:20, or use prioritisation down):',
			},
			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 3,
					titles: [ '' ],
					columnTitles: [ '_______', '_______', '_______' ],
				},
			},

			{
				type: ITINERARY_ITEM,
				value: 'Obstacles, and how will I overcome them:',
			},
			{ type: ITINERARY_LINES, value: 5 },

			{
				type: ITINERARY_ITEM,
				value: 'Best way I can prepare to show up PRO this quarter:',
			},
			{ type: ITINERARY_LINES, value: 2 },

			{
				type: ITINERARY_ITEM,
				value: 'What could I learn? (schedule in calendar right now)',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_TABLE,
				value: {
					rows: 2,
					columns: 2,
					titles: [ 'Urgent', 'Non-Urgent' ],
					columnTitles: [ 'Important', 'Unimportant' ],
					cellValues: [
						[ 'Do it now', 'Schedule' ],
						[ 'Delegate', 'Delete' ],
					],
				},
			},

		];
		this.quarterReviewItinerary = [
			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 2,
					columnTitles: [ 'Yearly goal', 'Quarterly goals'],
				},
			},

			{
				type: ITINERARY_ITEM,
				value: 'How aligned was I on quarter, and year goals?',
			},
			{ type: ITINERARY_LINES, value: 3 },
			{
				type: ITINERARY_ITEM,
				value: '3 great things I made happen:',
			},
			{ type: ITINERARY_LINES, value: 3 },
			{
				type: ITINERARY_ITEM,
				value: 'Biggest struggle was:',
			},
			{ type: ITINERARY_LINES, value: 2 },
			{
				type: ITINERARY_ITEM,
				value: '... and how would I advise best friend:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: '3 things I learned about myself:',
			},
			{ type: ITINERARY_LINES, value: 2 },

			{ type: ITINERARY_TEXT_NO_LINE, value: '[ ] Plan next quarter goals' },
		];
		this.monthItinerary = [
			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 3,
					columnTitles: [ '3 years goal', 'Yearly goals', 'Quarterly goals' ],
				},
			},
			{
				type: ITINERARY_ITEM,
				value: 'Month goal:',
			},
			{ type: ITINERARY_LINES, value: 2 },
			{
				type: ITINERARY_ITEM,
				value: 'Monthly 3 BIG tasks (one 80:20):',
			},
			{ type: ITINERARY_LINES, value: 3 },

			{
				type: ITINERARY_ITEM,
				value: '3 obstacles, and how will I overcome them:',
			},
			{ type: ITINERARY_LINES, value: 3 },

			{
				type: ITINERARY_ITEM,
				value: 'Best way I can prepare to show up PRO this month:',
			},
			{ type: ITINERARY_LINES, value: 2 },

			{
				type: ITINERARY_ITEM,
				value: 'What could I learn?',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: 'Who will make a difference?',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: 'Family plans:',
			},
			{ type: ITINERARY_LINES, value: 2 },


		];
		this.monthReflectionItinerary = [
			{
				type: ITINERARY_TEXT_NO_LINE,
				value: '(No two L days in a row)',
			},

			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 3,
					columnTitles: [ 'Yearly goal', 'Quarterly goal', 'Monthly goals' ],
				},
			},

			{
				type: ITINERARY_ITEM,
				value: 'How aligned was I on goals?',
			},
			{ type: ITINERARY_LINES, value: 1 },
			{
				type: ITINERARY_ITEM,
				value: '3 great things I made happen:',
			},
			{ type: ITINERARY_LINES, value: 3 },
			{
				type: ITINERARY_ITEM,
				value: 'Biggest struggle was:',
			},
			{ type: ITINERARY_LINES, value: 1 },
			{
				type: ITINERARY_ITEM,
				value: '... and how would I advise best friend:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: '3 things I learned about myself:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: 'Someone I really connected with (describe memory):',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: 'The biggest decision I made that I will stick to:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{ type: ITINERARY_TEXT_NO_LINE, value: '[ ] Plan next month goals' },
		];


		this.isWeekOverviewEnabled = true;
		this.todos = [];
		this.weekItinerary = [
			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 3,
					columnTitles: [ 'Yearly goal', 'Quarterly goal', 'Monthly goals' ],
				},
			},
			
			{ type: ITINERARY_ITEM, value: 'Weekly goal:' },
			{ type: ITINERARY_LINES, value: 2 },
			{
				type: ITINERARY_ITEM,
				value: 'Week 3 BIG ones (one is 80:20):',
			},
			{ type: ITINERARY_LINES, value: 2 },

			{
				type: ITINERARY_ITEM,
				value: '3 obstacles, and how will I overcome them:',
			},
			{ type: ITINERARY_LINES, value: 3 },

			{
				type: ITINERARY_ITEM,
				value: 'Who will make a difference?',
			},
			{ type: ITINERARY_LINES, value: 1 },
			{
				type: ITINERARY_ITEM,
				value: 'Family & Weekend plans:',
			},
			{ type: ITINERARY_LINES, value: 2 },

			{
				type: ITINERARY_TEXT_NO_LINE,
				value: '[ ] Block calendar, [ ] Ask someone for help, [ ] do I travel?',
			},

		];

		this.isWeekRetrospectiveEnabled = true;

		this.weekRetrospectiveItinerary = [
			{
				type: ITINERARY_TEXT_NO_LINE,
				value: '(No two L days in a row)',
			},

			{
				type: ITINERARY_TABLE,
				value: {
					rows: 1,
					columns: 3,
					columnTitles: [ 'Quarterly goal', 'Monthly goals', 'Weekly goals' ],
				},
			},

			{
				type: ITINERARY_ITEM,
				value: 'How aligned was I on goals?',
			},
			{ type: ITINERARY_LINES, value: 1 },
			{
				type: ITINERARY_ITEM,
				value: '3 great things that happened:',
			},
			{ type: ITINERARY_LINES, value: 3 },
			{
				type: ITINERARY_ITEM,
				value: 'Biggest struggle was:',
			},
			{ type: ITINERARY_LINES, value: 1 },
			{
				type: ITINERARY_ITEM,
				value: '... and how would I advise best friend:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: '2 things I learned about myself:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: '2 things I learned about others:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: '1 decision I could have made:',
			},
			{ type: ITINERARY_LINES, value: 1 },

			{
				type: ITINERARY_ITEM,
				value: 'Unfinished business:',
			},
			{ type: ITINERARY_LINES, value: 1 },
			{ type: ITINERARY_TEXT_NO_LINE, value: '[ ] Plan next weeks goals' },
		];

		let dayOfWeek = this.firstDayOfWeek;

		this.dayItineraries = [ ...Array( 7 ).keys() ].map( () => {
			const items = [
				{
					type: ITINERARY_TABLE,
					value: {
						rows: 4,
						columns: 3,
						columnTitles: [ 'Health', 'Wealth', 'Relationships' ],
						titles: [ 'Identity', 'Values', 'Goal', 'Proof' ],
					},
				},
				{
					type: ITINERARY_TEXT_NO_LINE,
					value:
						'[ ] Visualise (excellence, procrastination, goals)      ' +
						'[ ] Excercise (Yoga, rubber, stretches)          ' +
						'[ ] One 80/20 (mark 1 of daily 3)',
				},
				{
					type: ITINERARY_TEXT_NO_LINE,
					value:
						'[ ] Meditate (relax, past, future, enjoy, present)      ' +
						'[ ] Affirm (So good they can\'t ignore you)   ' +
						'[ ] Read (Book, course, Reader)',
				},

				{
					type: ITINERARY_TEXT_NO_LINE,
					value: ' ',
				},

				
				{ type: ITINERARY_ITEM, value: 'Weekly goal:' },
				{ type: ITINERARY_ITEM, value: 'Daily 3:' },
				{ type: ITINERARY_LINES, value: 1 },
				
				{ type: ITINERARY_ITEM, value: 'What I feel doing:' },
				{ type: ITINERARY_ITEM, value: 'Who needs my A-game:' },
				{ type: ITINERARY_ITEM, value: 'Connect to someone:' },
				{ type: ITINERARY_ITEM, value: 'Skill to practice:' },
				{ type: ITINERARY_ITEM, value: 'Coach advice:' },

				{
					type: ITINERARY_TABLE,
					value: {
						rows: 1,
						columns: 4,
						columnTitles: ['Morning', 'Maker', 'Manager', 'Evening'],
						titles: [  ],
					},
				},


				{ type: ITINERARY_TEXT_NO_LINE, value: '( ↓ Retrospective ↓ )' +
						'                                                                   ' +
						'Was this an olympic day?  [ ] W    [ ] L  .', alignment: 'right' },

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
				{ type: ITINERARY_ITEM, value: 'Rate 1-5:' },
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

		// See https://github.com/diegomura/react-pdf/issues/2006
		this.pageSize = [ 445, 592 ]; // [ '157mm', '209mm' ];
		this.specialDates = [

			{
				date: '01-15',
				value: 'Biljana Rodjendan',
				type: EVENT_DAY_TYPE,
			},
			{
				date: '05-19',
				value: 'Anastasija (Daca) Rodjendan',
				type: EVENT_DAY_TYPE,
			},
			{
				date: '08-27',
				value: 'Filip Rodjendan',
				type: EVENT_DAY_TYPE,
			},

			{
				date: '09-19',
				value: 'Daliborka Rodjendan',
				type: EVENT_DAY_TYPE,
			},

			{
				date: '11-13',
				value: 'Dusan tata Rodjendan',
				type: EVENT_DAY_TYPE,
			},

			{
				date: '12-10',
				value: 'Dragica Rodjendan',
				type: EVENT_DAY_TYPE,
			},
			{
				date: '11-15',
				value: 'Ivica Rodjendan',
				type: EVENT_DAY_TYPE,
			},


			{
				date: '01-01',
				value: 'Nyttårsdag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '03-20',
				value: 'Palmesøndag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '03-27',
				value: 'Skjærtorsdag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '03-28',
				value: 'Langfredag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '03-30',
				value: 'Første påskedag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '03-31',
				value: 'Andre påskedag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '05-01',
				value: 'Arbeidernes dag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '05-17',
				value: 'Grunnlovsdagen',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '05-29',
				value: 'Kristi himmelfartsdag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '06-08',
				value: 'Første pinsedag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '06-09',
				value: 'Andre pinsedag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '12-24',
				value: 'Julaften',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '12-25',
				value: 'Første juledag',
				type: HOLIDAY_DAY_TYPE,
			},
			{
				date: '12-26',
				value: 'Andre juledag',
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
			'monthlyHabits',
			'weeklyHabits',
			'monthItinerary',
			'monthReflectionItinerary',
			'weekItinerary',
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
